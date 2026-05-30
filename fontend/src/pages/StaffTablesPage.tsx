/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { api } from "../lib/api"
import StaffUserMenu from "../components/StaffUserMenu"

type TableStatus = "AVAILABLE" | "OCCUPIED" | "RESERVED"
type TableType = "NORMAL" | "VIP"

interface TableData {
  id: number
  tableNumber: number
  capacity: number
  type: TableType
  status: TableStatus
}

export default function StaffTablesPage() {
  const [tables, setTables] = useState<TableData[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<TableData | null>(null)
  const [navigating, setNavigating] = useState(false)
  const navigate = useNavigate()

  const handlePaymentNavigate = async (table: TableData) => {
    setNavigating(true)
    try {
      const res = await api.get(`/orders/table/${table.id}`)
      const orders: any[] = res.data.data
      const activeOrder = orders.find((o: any) => o.status === "CONFIRMED")
      if (!activeOrder) {
        alert("Không tìm thấy order đang hoạt động cho bàn này.")
        return
      }
      const orderItems = activeOrder.items.map((item: any) => ({
        emoji: "🍽️",
        name: item.menuItem?.name ?? "Món ăn",
        qty: item.quantity,
        price: item.unitPrice,
        total: item.totalPrice,
      }))
      navigate("/staff/payment", {
        state: { orderItems, orderId: activeOrder.id, tableId: table.id, tableNumber: table.tableNumber },
      })
    } catch {
      alert("Không thể lấy thông tin order. Vui lòng thử lại.")
    } finally {
      setNavigating(false)
    }
  }

  useEffect(() => {
    api.get("/tables")
      .then((res) => {
        const data: TableData[] = res.data.data
        setTables(data)
        const firstAvailable = data.find((t) => t.status === "AVAILABLE") ?? null
        setSelected(firstAvailable)
      })
      .catch((err) => console.error("Lỗi khi lấy danh sách bàn", err))
      .finally(() => setLoading(false))
  }, [])

  const handleSelect = (table: TableData) => {
    setSelected(table)
  }

  const cardClass = (table: TableData) => {
    const isSelected = selected?.id === table.id
    if (isSelected && table.status === "OCCUPIED") return "border-red-600 bg-red-50 shadow-[0_0_0_3px_rgba(220,38,38,0.15)] -translate-y-0.5 cursor-pointer"
    if (isSelected) return "border-blue-600 bg-blue-50 shadow-[0_0_0_3px_rgba(37,99,235,0.15)] -translate-y-0.5 cursor-pointer"
    if (table.status === "AVAILABLE") return "border-emerald-300 bg-emerald-50 hover:-translate-y-1 hover:shadow-lg cursor-pointer"
    if (table.status === "RESERVED") return "border-yellow-300 bg-yellow-50 hover:-translate-y-0.5 cursor-pointer"
    return "border-red-300 bg-red-50 hover:-translate-y-0.5 hover:shadow-md cursor-pointer"
  }

  const statusText = (table: TableData) => {
    if (selected?.id === table.id) return "✓ Đã chọn"
    if (table.status === "OCCUPIED") return "Đang phục vụ"
    if (table.status === "RESERVED") return "Đặt trước"
    return "Còn trống"
  }

  const statusColor = (table: TableData) => {
    if (selected?.id === table.id) return "text-blue-600"
    if (table.status === "OCCUPIED") return "text-red-800"
    if (table.status === "RESERVED") return "text-amber-800"
    return "text-emerald-800"
  }

  const displayName = (t: TableData) =>
    t.type === "VIP" ? `Bàn VIP ${t.tableNumber}` : `Bàn ${String(t.tableNumber).padStart(2, "0")}`

  const emoji = (t: TableData) => t.type === "VIP" ? "🛋️" : "🪑"

  const indoorTables = tables.filter((t) => t.type === "NORMAL")
  const vipTables = tables.filter((t) => t.type === "VIP")

  const stats = {
    available: tables.filter((t) => t.status === "AVAILABLE").length,
    occupied: tables.filter((t) => t.status === "OCCUPIED").length,
    reserved: tables.filter((t) => t.status === "RESERVED").length,
    total: tables.length,
  }

  const occupiedTables = tables.filter((t) => t.status === "OCCUPIED")
  const reservedTables = tables.filter((t) => t.status === "RESERVED")

  const selectedStatusLabel =
    selected?.status === "AVAILABLE" ? "Còn trống" : selected?.status === "RESERVED" ? "Đặt trước" : "Đang phục vụ"
  const selectedStatusColor =
    selected?.status === "AVAILABLE" ? "text-emerald-600" : selected?.status === "RESERVED" ? "text-amber-600" : "text-red-600"

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Topbar */}
      <div className="bg-gradient-to-r from-[#1E3A5F] to-blue-600 px-7 h-[60px] flex items-center justify-between">
        <span className="font-sans text-xl text-white">🍜 Việt Bếp</span>
        <div className="flex gap-1">
          <Link to="/staff/tables" className="px-4 py-1.5 rounded-lg text-sm font-medium bg-white/20 text-white">
            🗺️ Sơ đồ bàn
          </Link>
          <Link to="/staff/order" className="px-4 py-1.5 rounded-lg text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white transition-all">
            📋 Gọi món
          </Link>
        </div>
        <StaffUserMenu />
      </div>

      <div className="max-w-[1100px] mx-auto px-7 py-7">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-[22px] font-bold font-sans">Sơ đồ bàn</h1>
            <p className="text-[13px] text-gray-500 mt-0.5">
              Chọn bàn để bắt đầu nhận order · {new Date().toLocaleDateString("vi-VN")} · {new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
            </p>
          </div>
          <button
            onClick={() =>
              selected && selected.status !== "OCCUPIED" &&
              navigate("/staff/order", {
                state: { tableId: selected.id, tableNumber: selected.tableNumber, capacity: selected.capacity },
              })
            }
            disabled={!selected || selected.status === "OCCUPIED"}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-[13px] font-semibold hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            📋 Gọi món cho bàn đã chọn
          </button>
        </div>

        {/* Quick Stats */}
        <div className="flex gap-3 mb-6">
          {[
            { icon: "🟢", num: stats.available, label: "Bàn trống" },
            { icon: "🔴", num: stats.occupied, label: "Đang phục vụ" },
            { icon: "🟡", num: stats.reserved, label: "Đặt trước" },
            { icon: "🪑", num: stats.total, label: "Tổng bàn" },
          ].map((s) => (
            <div key={s.label} className="bg-white border border-gray-200 rounded-xl px-5 py-3.5 flex items-center gap-3">
              <span className="text-[22px]">{s.icon}</span>
              <div>
                <div className="text-xl font-bold">{s.num}</div>
                <div className="text-xs text-gray-500">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-4">
          {/* Floor Plan */}
          <div className="flex-1 bg-white border border-gray-200 rounded-xl p-5">
            {/* Legend */}
            <div className="flex gap-4 mb-4 flex-wrap">
              {[
                { bg: "bg-emerald-50 border-emerald-300", label: "Còn trống – Nhấn để chọn" },
                { bg: "bg-red-50 border-red-300", label: "Đang phục vụ" },
                { bg: "bg-yellow-50 border-yellow-300", label: "Đặt trước" },
                { bg: "bg-blue-50 border-blue-600", label: "Đang chọn" },
              ].map((l) => (
                <div key={l.label} className="flex items-center gap-1.5 text-xs text-gray-500">
                  <div className={`w-3 h-3 rounded-sm border-[1.5px] ${l.bg}`} />
                  {l.label}
                </div>
              ))}
            </div>

            {loading ? (
              <div className="text-center py-16 text-gray-400 text-sm">Đang tải sơ đồ bàn...</div>
            ) : (
              <>
                {/* Indoor Zone */}
                {indoorTables.length > 0 && (
                  <>
                    <div className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                      🏠 Khu vực trong
                    </div>
                    <div className="grid grid-cols-4 gap-3 mb-5">
                      {indoorTables.map((table) => (
                        <div
                          key={table.id}
                          onClick={() => handleSelect(table)}
                          className={`relative rounded-xl p-4 text-center border-2 transition-all duration-200 select-none ${cardClass(table)}`}
                        >
                          <div className="text-[26px] mb-1">{emoji(table)}</div>
                          <div className="text-sm font-bold">{displayName(table)}</div>
                          <div className="text-xs font-medium opacity-75">{table.capacity} người</div>
                          <div className={`text-[11px] font-bold mt-1.5 uppercase tracking-wide ${statusColor(table)}`}>
                            {statusText(table)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {/* VIP Zone */}
                {vipTables.length > 0 && (
                  <>
                    <div className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2 pt-3 border-t border-dashed border-gray-200">
                      🌟 Khu VIP
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {vipTables.map((table) => (
                        <div
                          key={table.id}
                          onClick={() => handleSelect(table)}
                          className={`relative rounded-xl p-4 text-center border-2 transition-all duration-200 select-none ${cardClass(table)}`}
                        >
                          <div className="text-[26px] mb-1">{emoji(table)}</div>
                          <div className="text-sm font-bold">{displayName(table)}</div>
                          <div className="text-xs font-medium opacity-75">{table.capacity} người</div>
                          <div className={`text-[11px] font-bold mt-1.5 uppercase tracking-wide ${statusColor(table)}`}>
                            {statusText(table)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </>
            )}
          </div>

          {/* Side Panel */}
          <div className="w-[280px] flex-shrink-0 flex flex-col gap-3">
            {/* Selected Table Info */}
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="text-sm font-bold mb-3 flex items-center gap-1.5">🪑 Bàn đang chọn</div>
              {selected ? (
                <>
                  {[
                    { label: "Bàn số", value: displayName(selected), valueClass: "text-blue-600" },
                    { label: "Sức chứa", value: `${selected.capacity} người` },
                    { label: "Loại bàn", value: selected.type === "VIP" ? "VIP" : "Thường" },
                    { label: "Trạng thái", value: selectedStatusLabel, valueClass: selectedStatusColor },
                  ].map((r) => (
                    <div key={r.label} className="flex justify-between text-[13px] py-1.5 border-b border-gray-100 last:border-0">
                      <span className="text-gray-500">{r.label}</span>
                      <span className={`font-semibold ${r.valueClass ?? ""}`}>{r.value}</span>
                    </div>
                  ))}
                  <div className="flex flex-col gap-2 mt-3">
                    <button
                      onClick={() =>
                        selected.status !== "OCCUPIED" &&
                        navigate("/staff/order", {
                          state: { tableId: selected.id, tableNumber: selected.tableNumber, capacity: selected.capacity },
                        })
                      }
                      disabled={selected.status === "OCCUPIED"}
                      className="w-full py-2.5 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
                    >
                      📋 Nhận order
                    </button>
                    <button
                      onClick={() => selected.status === "OCCUPIED" && handlePaymentNavigate(selected)}
                      disabled={selected.status !== "OCCUPIED" || navigating}
                      className="w-full py-2.5 bg-emerald-600 text-white rounded-lg text-sm font-bold hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
                    >
                      {navigating ? "Đang tải..." : "💳 Thanh toán"}
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center py-8 text-gray-400 text-sm">
                  {loading ? "Đang tải..." : "Chưa chọn bàn nào"}
                </div>
              )}
            </div>

            {/* Occupied Tables */}
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="text-sm font-bold mb-3">🔴 Đang phục vụ ({occupiedTables.length})</div>
              {occupiedTables.length === 0 ? (
                <div className="text-xs text-gray-400 py-2">Không có bàn nào đang phục vụ</div>
              ) : (
                occupiedTables.map((t) => (
                  <div key={t.id} className="flex justify-between text-[13px] py-1.5 border-b border-gray-100 last:border-0">
                    <span className="text-gray-500">{displayName(t)}</span>
                    <span className="text-xs font-semibold text-red-500">{t.capacity} người</span>
                  </div>
                ))
              )}
            </div>

            {/* Reserved Tables */}
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="text-sm font-bold mb-3">🟡 Đặt trước ({reservedTables.length})</div>
              {reservedTables.length === 0 ? (
                <div className="text-xs text-gray-400 py-2">Không có bàn đặt trước</div>
              ) : (
                reservedTables.map((t) => (
                  <div key={t.id} className="flex justify-between text-[13px] py-1.5 border-b border-gray-100 last:border-0">
                    <span className="text-gray-500">{displayName(t)}</span>
                    <span className="text-xs font-semibold text-amber-600">{t.capacity} người</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
