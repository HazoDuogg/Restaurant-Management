import { useState } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import StaffUserMenu from "../components/StaffUserMenu"

type CartItem = {
  id: number
  name: string
  price: number
  qty: number
}

type OrderItem = {
  name: string
  qty: number
  price: number
  total: number
  status: "done" | "cooking"
}

export default function StaffOrderDetailPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [kitchenDone, setKitchenDone] = useState(false)
  const [served, setServed] = useState(false)

  const cartFromState = location.state?.cart as CartItem[] | undefined
  const noteFromState = location.state?.note as string | undefined
  const tableNumber: number | undefined = location.state?.tableNumber
  const tableCapacity: number | undefined = location.state?.tableCapacity

  const orderItems: OrderItem[] = cartFromState
    ? cartFromState.map((item) => ({
      name: item.name,
      qty: item.qty,
      price: item.price,
      total: item.price * item.qty,
      status: "cooking" as const,
    }))
    : []

  const kitchenStatus = orderItems.map((item) => ({
    name: `${item.name} × ${item.qty}`,
    note: kitchenDone ? "Đã lên ✓" : item.status === "done" ? "Đã lên ✓" : "Đang chế biến",
    done: kitchenDone || item.status === "done",
  }))

  const computedSteps = [
    { label: "Ghi order", status: "done" as const },
    { label: "Gửi bếp", status: "done" as const },
    { label: "Đang chế biến", status: kitchenDone ? "done" as const : "active" as const },
    { label: "Phục vụ", status: served ? "done" as const : kitchenDone ? "active" as const : "pending" as const },
    { label: "Thanh toán", status: "pending" as const },
  ]

  const SUBTOTAL = orderItems.reduce((sum, item) => sum + item.total, 0)
  const VAT = Math.round(SUBTOTAL * 0.1)
  const TOTAL = SUBTOTAL + VAT

  const tableLabel = tableNumber
    ? `Bàn ${String(tableNumber).padStart(2, "0")}${tableCapacity ? ` (${tableCapacity} người)` : ""}`
    : "–"

  const now = new Date()
  const orderMeta = [
    { label: "Mã order", value: "#ORD-" + now.getFullYear() + String(now.getMonth() + 1).padStart(2, "0") + String(now.getDate()).padStart(2, "0") + "-" + String(now.getTime()).slice(-3) },
    { label: "Bàn số", value: tableLabel },
    { label: "Bắt đầu lúc", value: now.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }) },
    { label: "Số món", value: `${orderItems.length} món` },
  ]

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Topbar */}
      <div className="bg-gradient-to-r from-[#1E3A5F] to-blue-600 px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            to="/staff/order"
            state={{ cart: cartFromState, note: noteFromState, tableNumber, tableCapacity }}
            className="text-white/80 text-[13px] hover:text-white transition-colors"
          >
            ← Gọi món
          </Link>
          <span className="font-sans text-lg text-white">📄 Chi tiết Order</span>
          {tableNumber && (
            <span className="bg-white/20 text-white px-3 py-1 rounded-full text-[13px] font-bold">
              🪑 Bàn {String(tableNumber).padStart(2, "0")}
            </span>
          )}
          <span className="bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full text-xs font-bold">
            ✓ Đã gửi bếp
          </span>
        </div>
        <StaffUserMenu />
      </div>

      <div className="max-w-[900px] mx-auto px-6 py-6">
        {/* Status Steps */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 mb-5">
          <div className="flex items-center">
            {computedSteps.map((step, idx) => (
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
                {idx < computedSteps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-2 ${step.status === "done" ? "bg-emerald-500" : "bg-gray-200"}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-5" style={{ gridTemplateColumns: "1fr 340px" }}>
          {/* Left */}
          <div>
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
                  onClick={() => navigate("/staff/order", { state: { cart: cartFromState, note: noteFromState, tableNumber, tableCapacity } })}
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
                  {orderItems.map((item, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-3 py-3 border-b border-gray-100">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">🍽️</span>
                          <div className="text-sm font-semibold">{item.name}</div>
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
                        {kitchenDone || item.status === "done" ? (
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
              {noteFromState ? (
                <div className="bg-amber-50 border border-yellow-300 rounded-lg px-4 py-3 text-[13px] text-amber-800">
                  {noteFromState}
                </div>
              ) : (
                <div className="text-[13px] text-gray-400">Không có ghi chú</div>
              )}
            </div>
          </div>

          {/* Right */}
          <div>
            {/* Summary */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 mb-4">
              <div className="text-[15px] font-bold mb-4">💰 Tổng kết</div>
              <div className="mb-3">
                {orderItems.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-[13px] py-2 border-b border-gray-100">
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
                onClick={() => navigate("/staff/payment", { state: { orderItems, tableNumber, tableCapacity, orderId: location.state?.orderId, tableId: location.state?.tableId } })}
                className="w-full mt-3.5 py-3.5 bg-emerald-500 text-white rounded-lg text-[15px] font-bold hover:bg-emerald-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!kitchenDone || !served}
              >
                💳 Thanh toán ngay
              </button>
              <button
                onClick={() => navigate("/staff/order", { state: { cart: cartFromState, note: noteFromState, tableNumber, tableCapacity } })}
                className="w-full mt-1.5 py-2.5 bg-blue-50 text-blue-600 border-[1.5px] border-blue-200 rounded-lg text-sm font-semibold hover:bg-blue-100 transition"
              >
                + Thêm món
              </button>
            </div>

            {/* Kitchen Status */}
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="text-[15px] font-bold mb-4">👨‍🍳 Trạng thái bếp</div>
              <div className="flex flex-col gap-2.5">
                {kitchenStatus.map((k, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg ${k.done ? "bg-emerald-50" : "bg-amber-50"}`}
                  >
                    <span className="text-lg">🍽️</span>
                    <div className="flex-1">
                      <div className="text-[13px] font-semibold">{k.name}</div>
                      <div className={`text-[11px] ${k.done ? "text-emerald-700" : "text-amber-700"}`}>{k.note}</div>
                    </div>
                    <span className="text-lg">{k.done ? "✅" : "⏳"}</span>
                  </div>
                ))}
              </div>

              {!kitchenDone && (
                <button
                  onClick={() => setKitchenDone(true)}
                  className="w-full mt-4 py-2.5 bg-amber-500 text-white rounded-lg text-sm font-bold hover:bg-amber-600 transition"
                >
                  ✓ Bếp hoàn thành – Bắt đầu phục vụ
                </button>
              )}

              {kitchenDone && !served && (
                <button
                  onClick={() => setServed(true)}
                  className="w-full mt-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition"
                >
                  🍽️ Xác nhận đã phục vụ xong
                </button>
              )}

              {served && (
                <div className="mt-4 px-3 py-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-[13px] text-emerald-700 font-semibold text-center">
                  ✅ Đã phục vụ – Sẵn sàng thanh toán
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
