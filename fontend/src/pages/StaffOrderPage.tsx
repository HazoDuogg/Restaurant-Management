import { useState, useEffect } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { api } from "../lib/api"
import { useAuthStore } from "../state/auth"
import StaffUserMenu from "../components/StaffUserMenu"

interface MenuItem {
  id: number
  name: string
  price: number
  description: string | null
  category: { id: number; name: string } | null
}

interface CartItem {
  id: number
  name: string
  price: number
  qty: number
}

const CATEGORY_EMOJI: Record<string, string> = {
  "Khai vị": "🥗",
  "Súp & Bún": "🍜",
  "Món chính": "🍽️",
  "Lẩu": "🫕",
  "Tráng miệng": "🍮",
  "Đồ uống": "🥤",
}

const getCategoryEmoji = (categoryName: string | undefined) =>
  categoryName ? (CATEGORY_EMOJI[categoryName] ?? "🍴") : "🍴"

export default function StaffOrderPage() {
  const [activeCategory, setActiveCategory] = useState("Tất cả")
  const [search, setSearch] = useState("")
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const user = useAuthStore((s) => s.user)
  const tableId: number | undefined = location.state?.tableId
  const tableNumber: number | undefined = location.state?.tableNumber
  const tableCapacity: number | undefined = location.state?.capacity
  const existingOrderId: number | undefined = location.state?.orderId
  const [cart, setCart] = useState<CartItem[]>(location.state?.cart ?? [])
  const [note, setNote] = useState(location.state?.note ?? "")

  useEffect(() => {
    api.get("/menu-items/available")
      .then((res) => setMenuItems(res.data.data))
      .catch((err) => console.error("Lỗi khi lấy thực đơn", err))
      .finally(() => setLoading(false))
  }, [])

  const categories = ["Tất cả", ...Array.from(new Set(menuItems.map((i) => i.category?.name ?? "Khác")))]

  const addToCart = (item: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.id === item.id)
      if (existing) return prev.map((c) => c.id === item.id ? { ...c, qty: c.qty + 1 } : c)
      return [...prev, { id: item.id, name: item.name, price: item.price, qty: 1 }]
    })
  }

  const updateQty = (id: number, delta: number) => {
    setCart((prev) =>
      prev.flatMap((c) => {
        if (c.id !== id) return [c]
        const newQty = c.qty + delta
        return newQty <= 0 ? [] : [{ ...c, qty: newQty }]
      })
    )
  }

  const filteredItems = menuItems.filter((item) => {
    const matchCat = activeCategory === "Tất cả" || item.category?.name === activeCategory
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  const shownCategories = [...new Set(filteredItems.map((i) => i.category?.name ?? "Khác"))]
  const subtotal = cart.reduce((sum, c) => sum + c.price * c.qty, 0)
  const vat = Math.round(subtotal * 0.1)
  const total = subtotal + vat
  const cartCount = cart.reduce((sum, c) => sum + c.qty, 0)
  const getQty = (id: number) => cart.find((c) => c.id === id)?.qty ?? 0
  const getItemEmoji = (id: number) => getCategoryEmoji(menuItems.find((m) => m.id === id)?.category?.name)

  const handleSubmitOrder = async () => {
    if (cart.length === 0) return
    if (existingOrderId) {
      navigate("/staff/order/detail", { state: { cart, note, tableNumber, tableCapacity, orderId: existingOrderId, tableId } })
      return
    }
    if (!tableId || !user) return
    setSubmitting(true)
    try {
      const res = await api.post("/orders", { staffId: user.id, tableId })
      const orderId: number = res.data.data.orderId
      for (const item of cart) {
        await api.post(`/orders/${orderId}/items`, { menuItemId: item.id, quantity: item.qty })
      }
      await api.patch(`/orders/${orderId}/confirm`)
      navigate("/staff/order/detail", { state: { cart, note, tableNumber, tableCapacity, orderId, tableId } })
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Gửi order thất bại"
      alert((err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? msg)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Topbar */}
      <div className="bg-gradient-to-r from-[#1E3A5F] to-blue-600 px-6 h-14 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-4">
          <Link to="/staff/tables" className="text-white/80 text-[13px] hover:text-white flex items-center gap-1 transition-colors">
            ← Sơ đồ bàn
          </Link>
          <span className="font-serif text-lg text-white">📋 Gọi món</span>
          {tableNumber && (
            <span className="bg-white/20 text-white px-3 py-1 rounded-full text-[13px] font-bold">
              🪑 Bàn {String(tableNumber).padStart(2, "0")}{tableCapacity ? ` · ${tableCapacity} người` : ""}
            </span>
          )}
        </div>
        <StaffUserMenu />
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Menu Panel */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Search + Categories */}
          <div className="bg-white border-b border-gray-200 px-5 py-3 flex items-center gap-2.5 flex-shrink-0">
            <input
              className="flex-1 max-w-[280px] px-3.5 py-2 border-[1.5px] border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500"
              type="text"
              placeholder="🔍 Tìm món ăn..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div className="flex gap-1.5 overflow-x-auto pb-0.5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-[13px] font-medium border-[1.5px] whitespace-nowrap flex-shrink-0 cursor-pointer transition-all ${
                    activeCategory === cat
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-500 border-gray-200 hover:border-blue-400"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Menu Grid */}
          <div className="flex-1 overflow-y-auto px-5 py-4">
            {loading ? (
              <div className="text-center py-16 text-gray-400 text-sm">Đang tải thực đơn...</div>
            ) : shownCategories.length === 0 ? (
              <div className="text-center py-16 text-gray-400 text-sm">Không tìm thấy món ăn</div>
            ) : (
              shownCategories.map((cat) => (
                <div key={cat}>
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 mt-5 first:mt-0">{cat}</div>
                  <div className="grid grid-cols-3 gap-2.5">
                    {filteredItems.filter((i) => (i.category?.name ?? "Khác") === cat).map((item) => {
                      const qty = getQty(item.id)
                      const inCart = qty > 0
                      return (
                        <div
                          key={item.id}
                          onClick={() => addToCart(item)}
                          className={`relative bg-white border-[1.5px] rounded-xl p-3 cursor-pointer transition-all hover:-translate-y-px ${
                            inCart ? "border-emerald-400 bg-emerald-50" : "border-gray-200 hover:border-blue-400"
                          }`}
                        >
                          {inCart && (
                            <div className="absolute top-2 right-2 w-5 h-5 bg-emerald-500 text-white rounded-full text-[11px] font-bold flex items-center justify-center">
                              {qty}
                            </div>
                          )}
                          <div className="text-[28px] mb-1.5">{getCategoryEmoji(item.category?.name)}</div>
                          <div className="text-[10px] text-gray-400 mb-1">{item.category?.name ?? "Khác"}</div>
                          <div className="text-[13px] font-bold leading-snug mb-0.5">{item.name}</div>
                          <div className="text-[13px] font-bold text-blue-600">
                            {item.price.toLocaleString("vi-VN")}đ
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Cart Panel */}
        <div className="w-80 flex-shrink-0 bg-white border-l border-gray-200 flex flex-col">
          <div className="px-4 py-4 border-b border-gray-200">
            <div className="text-[15px] font-bold flex items-center justify-between">
              📋 Order
              <span className="bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">{cartCount}</span>
            </div>
            <div className="text-xs text-gray-400 mt-1">
              {tableNumber ? `Bàn ${String(tableNumber).padStart(2, "0")}` : "–"}
              {tableCapacity ? ` · ${tableCapacity} người` : ""}
              {" · "}{new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-3">
            {cart.length === 0 ? (
              <div className="text-center py-10 text-gray-400 text-sm">
                <div className="text-4xl mb-2">🛒</div>
                Chưa có món nào
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="flex items-center gap-2.5 py-2.5 border-b border-gray-100 last:border-0">
                  <div className="text-xl flex-shrink-0">{getItemEmoji(item.id)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-semibold leading-snug truncate">{item.name}</div>
                    <div className="text-xs text-gray-400">{item.price.toLocaleString("vi-VN")}đ × {item.qty}</div>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={() => updateQty(item.id, -1)}
                      className="w-6 h-6 border-[1.5px] border-gray-200 rounded-md bg-gray-50 flex items-center justify-center text-sm hover:border-blue-400 hover:text-blue-600 transition-colors"
                    >
                      −
                    </button>
                    <span className="text-[13px] font-bold w-5 text-center">{item.qty}</span>
                    <button
                      onClick={() => updateQty(item.id, 1)}
                      className="w-6 h-6 border-[1.5px] border-gray-200 rounded-md bg-gray-50 flex items-center justify-center text-sm hover:border-blue-400 hover:text-blue-600 transition-colors"
                    >
                      +
                    </button>
                  </div>
                  <div className="text-[13px] font-bold text-blue-600 min-w-[56px] text-right">
                    {(item.price * item.qty).toLocaleString("vi-VN")}đ
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Note */}
          <div className="px-4 py-3 border-t border-gray-200">
            <textarea
              className="w-full px-3 py-2 border-[1.5px] border-gray-200 rounded-lg text-[13px] outline-none focus:border-blue-500 resize-none"
              rows={2}
              placeholder="📝 Ghi chú cho bếp (dị ứng, không cay, ít muối...)"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>

          {/* Footer */}
          <div className="px-4 py-4 border-t-2 border-gray-200">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-500">Tạm tính ({cart.length} món)</span>
              <span className="font-bold">{subtotal.toLocaleString("vi-VN")}đ</span>
            </div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-500">VAT 10%</span>
              <span>{vat.toLocaleString("vi-VN")}đ</span>
            </div>
            <div className="flex justify-between items-baseline pt-2.5 border-t-2 border-gray-200 mt-2">
              <span className="text-[17px] font-bold">Tổng cộng</span>
              <div className="text-right">
                <div className="text-[17px] font-bold">{total.toLocaleString("vi-VN")}đ</div>
                <div className="text-xs text-gray-400">Đã bao gồm VAT</div>
              </div>
            </div>
            <button
              onClick={handleSubmitOrder}
              disabled={cart.length === 0 || submitting}
              className="w-full mt-3 py-3.5 bg-blue-600 text-white rounded-lg text-[15px] font-bold hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              {submitting ? "Đang gửi..." : "✓ Gửi order lên bếp"}
            </button>
            <button
              onClick={() => setCart([])}
              className="w-full mt-1.5 py-2 bg-gray-100 text-gray-500 border-[1.5px] border-gray-200 rounded-lg text-[13px] font-medium hover:bg-gray-200 transition"
            >
              🗑️ Xóa tất cả
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
