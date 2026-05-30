import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"

interface MenuItem {
  name: string
  price: number
  emoji: string
  category: string
  tag?: string
}

interface CartItem {
  name: string
  price: number
  emoji: string
  qty: number
}

const menuItems: MenuItem[] = [
  { name: "Gỏi Cuốn Tôm Thịt", price: 65000, emoji: "🥗", category: "Khai vị", tag: "Healthy" },
  { name: "Chả Giò Chiên", price: 55000, emoji: "🥘", category: "Khai vị" },
  { name: "Bánh Xèo Miền Nam", price: 75000, emoji: "🫓", category: "Khai vị", tag: "Đặc sản" },
  { name: "Phở Bò Đặc Biệt", price: 95000, emoji: "🍜", category: "Súp & Bún", tag: "Bestseller" },
  { name: "Bún Bò Huế", price: 85000, emoji: "🥣", category: "Súp & Bún", tag: "Cay vừa" },
  { name: "Bún Riêu Cua", price: 80000, emoji: "🦀", category: "Súp & Bún" },
  { name: "Gà Nướng Mắc Khén", price: 145000, emoji: "🍗", category: "Món chính", tag: "Đặc sản" },
  { name: "Bò Lúc Lắc", price: 175000, emoji: "🥩", category: "Món chính" },
  { name: "Cá Kho Tộ", price: 125000, emoji: "🐟", category: "Món chính", tag: "Truyền thống" },
  { name: "Heo Quay Da Giòn", price: 185000, emoji: "🐷", category: "Món chính" },
  { name: "Rau Muống Xào Tỏi", price: 45000, emoji: "🥬", category: "Món chính", tag: "Ăn kèm" },
  { name: "Cơm Trắng", price: 15000, emoji: "🍚", category: "Món chính", tag: "Ăn kèm" },
  { name: "Nước Lọc (chai)", price: 15000, emoji: "🧊", category: "Đồ uống" },
  { name: "Bia Tiger (lon)", price: 35000, emoji: "🍺", category: "Đồ uống", tag: "Bia" },
  { name: "Nước Cam Ép", price: 45000, emoji: "🍊", category: "Đồ uống", tag: "Tươi" },
]

const categories = ["Tất cả", "Khai vị", "Món chính", "Súp & Bún", "Lẩu", "Tráng miệng", "Đồ uống"]

const initialCart: CartItem[] = [
  { name: "Gỏi Cuốn Tôm Thịt", price: 65000, emoji: "🥗", qty: 2 },
  { name: "Phở Bò Đặc Biệt", price: 95000, emoji: "🍜", qty: 1 },
  { name: "Gà Nướng Mắc Khén", price: 145000, emoji: "🍗", qty: 1 },
]

export default function StaffOrderPage() {
  const [activeCategory, setActiveCategory] = useState("Tất cả")
  const [search, setSearch] = useState("")
  const [cart, setCart] = useState<CartItem[]>(initialCart)
  const [note, setNote] = useState("")
  const navigate = useNavigate()

  const addToCart = (item: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.name === item.name)
      if (existing) return prev.map((c) => c.name === item.name ? { ...c, qty: c.qty + 1 } : c)
      return [...prev, { name: item.name, price: item.price, emoji: item.emoji, qty: 1 }]
    })
  }

  const updateQty = (name: string, delta: number) => {
    setCart((prev) =>
      prev.flatMap((c) => {
        if (c.name !== name) return [c]
        const newQty = c.qty + delta
        return newQty <= 0 ? [] : [{ ...c, qty: newQty }]
      })
    )
  }

  const filteredItems = menuItems.filter((item) => {
    const matchCat = activeCategory === "Tất cả" || item.category === activeCategory
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  const shownCategories = [...new Set(filteredItems.map((i) => i.category))]
  const subtotal = cart.reduce((sum, c) => sum + c.price * c.qty, 0)
  const vat = Math.round(subtotal * 0.1)
  const total = subtotal + vat
  const cartCount = cart.reduce((sum, c) => sum + c.qty, 0)
  const getQty = (name: string) => cart.find((c) => c.name === name)?.qty ?? 0

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Topbar */}
      <div className="bg-gradient-to-r from-[#1E3A5F] to-blue-600 px-6 h-14 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-4">
          <Link to="/staff/tables" className="text-white/80 text-[13px] hover:text-white flex items-center gap-1 transition-colors">
            ← Sơ đồ bàn
          </Link>
          <span className="font-serif text-lg text-white">📋 Gọi món</span>
          <span className="bg-white/20 text-white px-3 py-1 rounded-full text-[13px] font-bold">🪑 Bàn 07 · 4 người</span>
        </div>
        <div className="flex items-center gap-2 text-white text-[13px]">
          <div className="w-7 h-7 rounded-full bg-white/25 flex items-center justify-center font-bold text-xs">H</div>
          Nguyễn Thị Hoa · Phục vụ
        </div>
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
            {shownCategories.length === 0 && (
              <div className="text-center py-16 text-gray-400 text-sm">Không tìm thấy món ăn</div>
            )}
            {shownCategories.map((cat) => (
              <div key={cat}>
                <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 mt-5 first:mt-0">{cat}</div>
                <div className="grid grid-cols-3 gap-2.5">
                  {filteredItems.filter((i) => i.category === cat).map((item) => {
                    const qty = getQty(item.name)
                    const inCart = qty > 0
                    return (
                      <div
                        key={item.name}
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
                        <div className="text-[28px] mb-1.5">{item.emoji}</div>
                        <div className="text-[10px] text-gray-400 mb-1">
                          {item.category}{item.tag ? ` · ${item.tag}` : ""}
                        </div>
                        <div className="text-[13px] font-bold leading-snug mb-0.5">{item.name}</div>
                        <div className="text-[13px] font-bold text-blue-600">
                          {item.price.toLocaleString("vi-VN")}đ
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cart Panel */}
        <div className="w-80 flex-shrink-0 bg-white border-l border-gray-200 flex flex-col">
          <div className="px-4 py-4 border-b border-gray-200">
            <div className="text-[15px] font-bold flex items-center justify-between">
              📋 Order
              <span className="bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">{cartCount}</span>
            </div>
            <div className="text-xs text-gray-400 mt-1">Bàn 07 · 4 người · 18:30</div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-3">
            {cart.length === 0 ? (
              <div className="text-center py-10 text-gray-400 text-sm">
                <div className="text-4xl mb-2">🛒</div>
                Chưa có món nào
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.name} className="flex items-center gap-2.5 py-2.5 border-b border-gray-100 last:border-0">
                  <div className="text-xl flex-shrink-0">{item.emoji}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-semibold leading-snug truncate">{item.name}</div>
                    <div className="text-xs text-gray-400">{item.price.toLocaleString("vi-VN")}đ × {item.qty}</div>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={() => updateQty(item.name, -1)}
                      className="w-6 h-6 border-[1.5px] border-gray-200 rounded-md bg-gray-50 flex items-center justify-center text-sm hover:border-blue-400 hover:text-blue-600 transition-colors"
                    >
                      −
                    </button>
                    <span className="text-[13px] font-bold w-5 text-center">{item.qty}</span>
                    <button
                      onClick={() => updateQty(item.name, 1)}
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
              onClick={() => navigate("/staff/order/detail")}
              disabled={cart.length === 0}
              className="w-full mt-3 py-3.5 bg-blue-600 text-white rounded-lg text-[15px] font-bold hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              ✓ Gửi order lên bếp
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
