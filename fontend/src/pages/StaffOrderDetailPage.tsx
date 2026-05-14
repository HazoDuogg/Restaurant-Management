import { Link, useNavigate } from "react-router-dom"

const steps = [
  { label: "Ghi order", status: "done" },
  { label: "Gửi bếp", status: "done" },
  { label: "Đang chế biến", status: "active" },
  { label: "Phục vụ", status: "pending" },
  { label: "Thanh toán", status: "pending" },
] as const

const orderMeta = [
  { label: "Mã order", value: "#ORD-20241225-042" },
  { label: "Bàn số", value: "Bàn 07 (4 người)" },
  { label: "Bắt đầu lúc", value: "18:07" },
  { label: "Nhân viên", value: "Nguyễn Thị Hoa" },
]

const orderItems = [
  { emoji: "🥗", name: "Gỏi Cuốn Tôm Thịt", category: "Khai vị", qty: 2, price: 65000, total: 130000, status: "done" },
  { emoji: "🍜", name: "Phở Bò Đặc Biệt", category: "Súp & Bún", qty: 1, price: 95000, total: 95000, status: "cooking" },
  { emoji: "🍗", name: "Gà Nướng Mắc Khén", category: "Món chính · Đặc sản", qty: 1, price: 145000, total: 145000, status: "cooking" },
]

const kitchenStatus = [
  { emoji: "🥗", name: "Gỏi Cuốn × 2", note: "Đã lên ✓ 18:09", done: true },
  { emoji: "🍜", name: "Phở Bò Đặc Biệt × 1", note: "Đang chế biến · ~5 phút", done: false },
  { emoji: "🍗", name: "Gà Nướng Mắc Khén × 1", note: "Đang nướng · ~12 phút", done: false },
]

const SUBTOTAL = 370000
const VAT = 37000
const TOTAL = 407000

export default function StaffOrderDetailPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Topbar */}
      <div className="bg-gradient-to-r from-[#1E3A5F] to-blue-600 px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/staff/order" className="text-white/80 text-[13px] hover:text-white transition-colors">
            ← Gọi món
          </Link>
          <span className="font-serif text-lg text-white">📄 Chi tiết Order</span>
          <span className="bg-white/20 text-white px-3 py-1 rounded-full text-[13px] font-bold">🪑 Bàn 07</span>
          <span className="bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full text-xs font-bold">
            ✓ Đã gửi bếp
          </span>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="text-white/70 text-[13px]">Thời gian phục vụ</span>
          <span className="bg-white/15 text-white px-3 py-1 rounded-full text-[13px] font-bold font-mono">
            ⏱ 00:23:45
          </span>
        </div>
      </div>

      <div className="max-w-[900px] mx-auto px-6 py-6">
        {/* Status Steps */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 mb-5">
          <div className="flex items-center">
            {steps.map((step, idx) => (
              <div key={step.label} className="flex items-center flex-1 last:flex-none">
                <div className="flex items-center gap-1.5 shrink-0">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-bold ${step.status === "done"
                        ? "bg-emerald-500 text-white"
                        : step.status === "active"
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200 text-gray-500"
                      }`}
                  >
                    {step.status === "done" ? "✓" : idx + 1}
                  </div>
                  <span
                    className={`text-xs font-semibold ${step.status === "active"
                        ? "text-blue-600"
                        : step.status === "pending"
                          ? "text-gray-400"
                          : ""
                      }`}
                  >
                    {step.label}
                  </span>
                </div>
                {idx < steps.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-2 ${step.status === "done" ? "bg-emerald-500" : "bg-gray-200"}`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-5" style={{ gridTemplateColumns: "1fr 340px" }}>
          {/* Left */}
          <div>
            {/* Order Info + Items */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 mb-4">
              {/* Meta */}
              <div className="grid grid-cols-2 gap-2 mb-5">
                {orderMeta.map((m) => (
                  <div key={m.label} className="bg-gray-50 rounded-lg px-3 py-2.5">
                    <div className="text-[11px] text-gray-400 mb-0.5">{m.label}</div>
                    <div className="text-sm font-bold">{m.value}</div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between text-[15px] font-bold mb-4">
                <span>🍽️ Danh sách món</span>
                <button
                  onClick={() => navigate("/staff/order")}
                  className="px-3 py-1.5 border-[1.5px] border-gray-200 rounded-lg text-xs font-semibold bg-white hover:bg-gray-50"
                >
                  + Thêm món
                </button>
              </div>

              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-3 py-2.5 text-[11px] font-bold text-gray-400 uppercase tracking-wide border-b border-gray-200 text-left">Món Ăn</th>
                    <th className="px-3 py-2.5 text-[11px] font-bold text-gray-400 uppercase tracking-wide border-b border-gray-200 text-center">SL</th>
                    <th className="px-3 py-2.5 text-[11px] font-bold text-gray-400 uppercase tracking-wide border-b border-gray-200 text-right">Đơn giá</th>
                    <th className="px-3 py-2.5 text-[11px] font-bold text-gray-400 uppercase tracking-wide border-b border-gray-200 text-right">Thành tiền</th>
                    <th className="px-3 py-2.5 text-[11px] font-bold text-gray-400 uppercase tracking-wide border-b border-gray-200 text-left">Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {orderItems.map((item) => (
                    <tr key={item.name} className="hover:bg-gray-50">
                      <td className="px-3 py-3 border-b border-gray-100">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{item.emoji}</span>
                          <div>
                            <div className="text-sm font-semibold">{item.name}</div>
                            <div className="text-xs text-gray-400">{item.category}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-center font-bold border-b border-gray-100">× {item.qty}</td>
                      <td className="px-3 py-3 text-right text-sm border-b border-gray-100">
                        {item.price.toLocaleString("vi-VN")}đ
                      </td>
                      <td className="px-3 py-3 text-right font-bold border-b border-gray-100">
                        {item.total.toLocaleString("vi-VN")}đ
                      </td>
                      <td className="px-3 py-3 border-b border-gray-100">
                        {item.status === "done" ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                            ✓ Đã lên
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800">
                            ⏳ Đang làm
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Customer Note */}
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="text-[15px] font-bold mb-3">📝 Ghi chú từ khách</div>
              <div className="bg-amber-50 border border-yellow-300 rounded-lg px-4 py-3 text-[13px] text-amber-800">
                Sinh nhật bé gái – khách nhờ chuẩn bị nến nhỏ nếu có thể
              </div>
            </div>
          </div>

          {/* Right */}
          <div>
            {/* Summary */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 mb-4">
              <div className="text-[15px] font-bold mb-4">💰 Tổng kết</div>
              <div className="mb-3">
                {orderItems.map((item) => (
                  <div key={item.name} className="flex justify-between text-[13px] py-2 border-b border-gray-100">
                    <span className="text-gray-500">{item.name} × {item.qty}</span>
                    <span className="font-semibold">{item.total.toLocaleString("vi-VN")}đ</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-[13px] py-2 border-b border-gray-100">
                <span className="text-gray-500">Tạm tính</span>
                <span className="font-semibold">{SUBTOTAL.toLocaleString("vi-VN")}đ</span>
              </div>
              <div className="flex justify-between text-[13px] py-2 border-b border-gray-100">
                <span className="text-gray-500">Giảm giá</span>
                <span className="font-semibold text-emerald-600">- 0đ</span>
              </div>
              <div className="flex justify-between text-[13px] py-2 border-b border-gray-100">
                <span className="text-gray-500">VAT (10%)</span>
                <span className="font-semibold">{VAT.toLocaleString("vi-VN")}đ</span>
              </div>
              <div className="flex justify-between items-baseline pt-3 mt-1 border-t-2 border-gray-200">
                <span className="text-[15px] font-bold">Tổng cộng</span>
                <span className="text-xl font-bold text-blue-600">{TOTAL.toLocaleString("vi-VN")}đ</span>
              </div>
              <button
                onClick={() => navigate("/staff/payment")}
                className="w-full mt-3.5 py-3.5 bg-emerald-500 text-white rounded-lg text-[15px] font-bold hover:bg-emerald-600 transition"
              >
                💳 Thanh toán ngay
              </button>
              <button
                onClick={() => navigate("/staff/order")}
                className="w-full mt-1.5 py-2.5 bg-blue-50 text-blue-600 border-[1.5px] border-blue-200 rounded-lg text-sm font-semibold hover:bg-blue-100 transition"
              >
                + Thêm món
              </button>
            </div>

            {/* Kitchen Status */}
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="text-[15px] font-bold mb-4">👨‍🍳 Trạng thái bếp</div>
              <div className="flex flex-col gap-2.5">
                {kitchenStatus.map((k) => (
                  <div
                    key={k.name}
                    className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg ${k.done ? "bg-emerald-50" : "bg-amber-50"}`}
                  >
                    <span className="text-lg">{k.emoji}</span>
                    <div className="flex-1">
                      <div className="text-[13px] font-semibold">{k.name}</div>
                      <div className={`text-[11px] ${k.done ? "text-emerald-700" : "text-amber-700"}`}>{k.note}</div>
                    </div>
                    <span className="text-lg">{k.done ? "✅" : "⏳"}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
