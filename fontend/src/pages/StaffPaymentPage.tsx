import { useState } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { useAuthStore } from "../state/auth"
import { api } from "../lib/api"
import StaffUserMenu from "../components/StaffUserMenu"

type OrderItem = {
  emoji: string
  name: string
  qty: number
  price: number
  total: number
}

const paymentMethods = [
  { icon: "💵", name: "Tiền mặt", desc: "Cash payment" },
  { icon: "💳", name: "Thẻ ngân hàng", desc: "Visa / Mastercard" },
  { icon: "📱", name: "Ví điện tử", desc: "MoMo / ZaloPay" },
  { icon: "📲", name: "Chuyển khoản", desc: "QR code" },
]

const quickAmounts = ["100,000", "200,000", "500,000", "1,000,000"]

const fmt = (n: number) => n.toLocaleString("vi-VN")
const parseCash = (v: string) => parseInt(v.replace(/[^0-9]/g, ""), 10) || 0

export default function StaffPaymentPage() {
  const [selectedMethod, setSelectedMethod] = useState(0)
  const [cashGiven, setCashGiven] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const user = useAuthStore((s) => s.user)
  const [showSuccess, setShowSuccess] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const orderItems: OrderItem[] = location.state?.orderItems ?? []
  const orderId: number | undefined = location.state?.orderId
  const tableId: number | undefined = location.state?.tableId

  const methodToEnum = ["CASH", "CREDIT_CARD", "BANK_TRANSFER", "BANK_TRANSFER"]

  async function submitPayment() {
    setError("")

    if (selectedMethod === 0) {
      const given = parseCash(cashGiven)
      if (!cashGiven || given < TOTAL) {
        setError("Số tiền khách đưa không đủ. Vui lòng nhập lại.")
        return
      }
    }

    if (!orderId) {
      setError("Không tìm thấy mã đơn hàng. Vui lòng quay lại và thử lại.")
      return
    }

    setLoading(true)
    try {
      await api.patch(`/orders/${orderId}/complete`)
      const invoiceRes = await api.post("/invoices/generate", { orderId, taxRate: 0.1, discount: 0 })
      const invoiceId: number = invoiceRes.data.data.invoiceId
      await api.post("/payments", { invoiceId, paymentMethod: methodToEnum[selectedMethod] })
      if (tableId) {
        await api.patch(`/tables/${tableId}/status`, { status: "AVAILABLE" })
      }
      setShowSuccess(true)
    } catch (err) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      setError(msg ?? "Thanh toán thất bại. Vui lòng thử lại.")
    } finally {
      setLoading(false)
    }
  }

  if (orderItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-10 text-center max-w-sm w-full mx-4 shadow-md border border-gray-200">
          <div className="text-5xl mb-4">🛒</div>
          <div className="text-lg font-bold mb-2">Chưa có món nào</div>
          <div className="text-sm text-gray-400 mb-6">Vui lòng chọn món trước khi thanh toán.</div>
          <button
            onClick={() => navigate("/staff/order")}
            className="w-full py-3 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition"
          >
            ← Quay lại gọi món
          </button>
        </div>
      </div>
    )
  }

  const now = new Date()
  const invoiceDate = now.toLocaleDateString("vi-VN") + " · " + now.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })
  const invoiceId = "#INV-" + now.getFullYear() + String(now.getMonth() + 1).padStart(2, "0") + String(now.getDate()).padStart(2, "0") + "-" + String(now.getTime()).slice(-3)
  const tableNumber: number | undefined = location.state?.tableNumber
  const tableCapacity: number | undefined = location.state?.tableCapacity
  const tableInfo = tableNumber
    ? `Bàn ${String(tableNumber).padStart(2, "0")}${tableCapacity ? ` (${tableCapacity} người)` : ""}`
    : "–"
  const invoiceMeta = [
    { k: "Số HĐ:", v: invoiceId },
    { k: "Ngày:", v: invoiceDate },
    { k: "Bàn:", v: tableInfo },
    { k: "Thu ngân:", v: user?.name ?? "–" },
  ]

  const SUBTOTAL = orderItems.reduce((sum, item) => sum + item.total, 0)
  const VAT = Math.round(SUBTOTAL * 0.1)
  const TOTAL = SUBTOTAL + VAT
  const exactStr = fmt(TOTAL)

  const change = parseCash(cashGiven) - TOTAL

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Topbar */}
      <div className="bg-gradient-to-r from-[#1E3A5F] to-blue-600 px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/staff/order/detail" className="text-white/80 text-[13px] hover:text-white transition-colors">
            ← Chi tiết order
          </Link>
          <span className="font-serif text-lg text-white">💳 Thanh toán</span>
          {tableNumber && (
            <span className="bg-white/20 text-white px-3 py-1 rounded-full text-[13px] font-bold">
              🪑 Bàn {String(tableNumber).padStart(2, "0")}
            </span>
          )}
        </div>
        <StaffUserMenu />
      </div>

      <div className="max-w-[1000px] mx-auto px-6 py-6">
        <div className="grid gap-5" style={{ gridTemplateColumns: "1fr 360px" }}>
          {/* Left: Invoice Preview */}
          <div className="bg-white border border-gray-200 rounded-xl p-7">
            {/* Header */}
            <div className="text-center pb-5 mb-5 border-b-2 border-gray-200">
              <div className="font-sans text-xl text-blue-600 mb-1">🍜 Việt Bếp</div>
              <div className="text-xs text-gray-400 leading-relaxed">
                123 Nguyễn Huệ, Q.1, TP.HCM · (028) 3822 1234
              </div>
              <div className="text-lg font-bold mt-3">HÓA ĐƠN THANH TOÁN</div>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-5">
              {invoiceMeta.map((m) => (
                <div key={m.k} className="text-[13px]">
                  <span className="text-gray-400">{m.k} </span>
                  <span className="font-semibold">{m.v}</span>
                </div>
              ))}
            </div>

            <hr className="border-dashed border-gray-200 my-4" />

            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="py-2 text-left text-[11px] font-bold text-gray-400 uppercase border-b border-gray-200 w-[40%]">Món Ăn</th>
                  <th className="py-2 text-center text-[11px] font-bold text-gray-400 uppercase border-b border-gray-200 w-[10%]">SL</th>
                  <th className="py-2 text-right text-[11px] font-bold text-gray-400 uppercase border-b border-gray-200 w-[22%]">Đơn giá</th>
                  <th className="py-2 text-right text-[11px] font-bold text-gray-400 uppercase border-b border-gray-200 w-[28%]">Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                {orderItems.map((item) => (
                  <tr key={item.name}>
                    <td className="py-2.5 text-[13px] border-b border-gray-50">{item.emoji} {item.name}</td>
                    <td className="py-2.5 text-center text-[13px] border-b border-gray-50">{item.qty}</td>
                    <td className="py-2.5 text-right text-[13px] border-b border-gray-50">{fmt(item.price)}</td>
                    <td className="py-2.5 text-right text-[13px] font-bold border-b border-gray-50">{fmt(item.total)}đ</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-4 pt-3 border-t border-gray-200">
              <div className="flex justify-between text-[13px] py-1">
                <span>Tổng cộng ({orderItems.length} món)</span>
                <span className="font-semibold">{fmt(SUBTOTAL)}đ</span>
              </div>
              <div className="flex justify-between text-[13px] py-1">
                <span>Giảm giá / Voucher</span>
                <span className="text-emerald-600 font-semibold">- 0đ</span>
              </div>
              <div className="flex justify-between text-[13px] py-1">
                <span>VAT (10%)</span>
                <span>{fmt(VAT)}đ</span>
              </div>
              <div className="flex justify-between items-baseline pt-3 mt-2 border-t-2 border-gray-200">
                <span className="text-base font-bold">TỔNG THANH TOÁN</span>
                <span className="text-lg font-bold text-blue-600">{fmt(TOTAL)}đ</span>
              </div>
            </div>

            <div className="text-center mt-5 text-xs text-gray-400 leading-relaxed">
              ✨ Cảm ơn quý khách đã dùng bữa tại Việt Bếp!<br />
              Hóa đơn điện tử gửi qua email khi yêu cầu.<br />
              Mọi thắc mắc: (028) 3822 1234
            </div>
          </div>

          {/* Right: Payment Actions */}
          <div>
            {/* Payment Method */}
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="text-[15px] font-bold mb-3">💳 Phương thức thanh toán</div>
              <div className="grid grid-cols-2 gap-2.5 mb-4">
                {paymentMethods.map((pm, idx) => (
                  <div
                    key={pm.name}
                    onClick={() => setSelectedMethod(idx)}
                    className={`border-2 rounded-xl px-4 py-3.5 text-center cursor-pointer transition-all ${selectedMethod === idx
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-200 hover:border-blue-400"
                      }`}
                  >
                    <div className="text-2xl mb-1.5">{pm.icon}</div>
                    <div className="text-[13px] font-bold">{pm.name}</div>
                    <div className="text-[11px] text-gray-400 mt-0.5">{pm.desc}</div>
                  </div>
                ))}
              </div>

              {/* Cash Calculator – only for Tiền mặt */}
              {selectedMethod === 0 && (
                <div className="bg-gray-50 rounded-xl p-4 mb-4">
                  <div className="text-[13px] font-bold mb-3">💡 Tính tiền thối</div>
                  <div className="flex justify-between text-[13px] mb-2">
                    <span className="text-gray-500">Số tiền cần thanh toán</span>
                    <span className="font-bold text-blue-600">{fmt(TOTAL)}đ</span>
                  </div>
                  <div className="flex justify-between items-center text-[13px] mb-3">
                    <span className="text-gray-500">Khách đưa</span>
                    <input
                      className="px-3 py-2 border-[1.5px] border-gray-200 rounded-lg text-sm font-bold text-right w-36 outline-none focus:border-blue-500"
                      value={cashGiven}
                      onChange={(e) => setCashGiven(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <div className="text-[11px] text-gray-400 mb-2">Chọn nhanh:</div>
                    <div className="flex flex-wrap gap-1.5">
                      {[...quickAmounts, exactStr].map((amt) => (
                        <button
                          key={amt}
                          onClick={() => setCashGiven(amt)}
                          className="px-3 py-1.5 border-[1.5px] border-gray-200 rounded-lg text-xs font-semibold bg-white hover:border-blue-400 hover:text-blue-600 transition-colors"
                        >
                          {amt === exactStr ? "Vừa đủ" : amt.replace(",000,000", "tr").replace(",000", "k")}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                    <span className="text-[13px] font-bold">Tiền thối lại</span>
                    <span className={`text-lg font-bold ${change >= 0 ? "text-emerald-600" : "text-red-500"}`}>
                      {change >= 0 ? `${fmt(change)}đ` : "–"}
                    </span>
                  </div>
                </div>
              )}

              {error && (
                <div className="mb-3 px-4 py-2.5 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600 font-semibold">
                  ⚠️ {error}
                </div>
              )}
              <button
                onClick={submitPayment}
                disabled={loading}
                className="w-full py-3.5 bg-emerald-500 text-white rounded-lg text-base font-bold hover:bg-emerald-600 transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Đang xử lý..." : `✓ Xác nhận thanh toán ${fmt(TOTAL)}đ`}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/50 z-[300] flex items-center justify-center">
          <div className="bg-white rounded-2xl p-10 text-center max-w-sm w-full mx-4 shadow-2xl">
            <div className="text-5xl mb-4">✅</div>
            <div className="font-serif text-xl font-bold mb-2">Thanh toán thành công!</div>
            <div className="text-sm text-gray-500 mb-1.5">{tableInfo} · Tổng: {fmt(TOTAL)}đ</div>
            <div className="text-[13px] text-emerald-600 font-semibold mb-6">
              Tiền thối: {change >= 0 ? `${fmt(change)}đ` : "–"}
            </div>
            <div className="flex gap-2.5">
              <button
                onClick={() => navigate("/staff/tables")}
                className="w-full py-3 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition"
              >
                → Về sơ đồ bàn
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
