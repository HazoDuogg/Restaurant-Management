import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"

type TableStatus = "available" | "occupied" | "reserved"

interface TableData {
  num: number
  display: string
  cap: string
  status: TableStatus
  time?: string
  emoji: string
  zone: "indoor" | "vip"
  reservation?: string
}

const tables: TableData[] = [
  { num: 1, display: "Bàn 01", cap: "2 người", status: "occupied", time: "45ph", emoji: "🪑", zone: "indoor" },
  { num: 2, display: "Bàn 02", cap: "2 người", status: "occupied", time: "12ph", emoji: "🪑", zone: "indoor" },
  { num: 3, display: "Bàn 03", cap: "4 người", status: "reserved", emoji: "🪑", zone: "indoor", reservation: "Nguyễn Thị Lan · 18:00 · 4 người" },
  { num: 4, display: "Bàn 04", cap: "4 người", status: "available", emoji: "🪑", zone: "indoor" },
  { num: 5, display: "Bàn 05", cap: "6 người", status: "occupied", time: "28ph", emoji: "🪑", zone: "indoor" },
  { num: 6, display: "Bàn 06", cap: "6 người", status: "occupied", time: "67ph", emoji: "🪑", zone: "indoor" },
  { num: 7, display: "Bàn 07", cap: "4 người", status: "available", emoji: "🪑", zone: "indoor" },
  { num: 8, display: "Bàn 08", cap: "6 người", status: "reserved", emoji: "🪑", zone: "indoor", reservation: "Trần Văn Minh · 19:30 · 6 người" },
  { num: 9, display: "Bàn 09", cap: "4 người", status: "available", emoji: "🪑", zone: "indoor" },
  { num: 10, display: "Bàn 10", cap: "4 người", status: "available", emoji: "🪑", zone: "indoor" },
  { num: 11, display: "Bàn VIP 11", cap: "10 người", status: "reserved", emoji: "🛋️", zone: "vip", reservation: "Lê Quốc Bảo · 20:00 · 10 người" },
  { num: 12, display: "Bàn VIP 12", cap: "12 người", status: "available", emoji: "🛋️", zone: "vip" },
]

const quickStats = [
  { icon: "🟢", num: 5, label: "Bàn trống" },
  { icon: "🔴", num: 4, label: "Đang phục vụ" },
  { icon: "🟡", num: 3, label: "Đặt trước" },
  { icon: "🪑", num: 12, label: "Tổng bàn" },
]

const occupiedList = [
  { label: "Bàn 01", info: "45 phút · 3 món", color: "text-red-500" },
  { label: "Bàn 02", info: "12 phút · 2 món", color: "text-emerald-500" },
  { label: "Bàn 05", info: "28 phút · 5 món", color: "text-amber-500" },
  { label: "Bàn 06", info: "67 phút · 7 món", color: "text-red-500" },
]

const upcomingReservations = [
  { time: "18:00 · Bàn 03", guests: "4 người" },
  { time: "19:30 · Bàn 08", guests: "6 người" },
  { time: "20:00 · Bàn 11", guests: "10 người" },
]

export default function StaffTablesPage() {
  const [selected, setSelected] = useState<TableData | null>(tables[6])
  const navigate = useNavigate()

  const handleSelect = (table: TableData) => {
    if (table.status === "occupied") return
    setSelected(table)
  }

  const cardClass = (table: TableData) => {
    const isSelected = selected?.num === table.num
    if (isSelected) return "border-blue-600 bg-blue-50 shadow-[0_0_0_3px_rgba(37,99,235,0.15)] -translate-y-0.5 cursor-pointer"
    if (table.status === "available") return "border-emerald-300 bg-emerald-50 hover:-translate-y-1 hover:shadow-lg cursor-pointer"
    if (table.status === "reserved") return "border-yellow-300 bg-yellow-50 hover:-translate-y-0.5 cursor-pointer"
    return "border-red-300 bg-red-50 cursor-default opacity-80"
  }

  const statusText = (table: TableData) => {
    if (selected?.num === table.num) return "✓ Đã chọn"
    if (table.status === "occupied") return "Đang phục vụ"
    if (table.status === "reserved") {
      const time = table.reservation?.split("·")[1]?.trim() ?? ""
      return `Đặt trước ${time}`
    }
    return "Còn trống"
  }

  const statusColor = (table: TableData) => {
    if (selected?.num === table.num) return "text-blue-600"
    if (table.status === "occupied") return "text-red-800"
    if (table.status === "reserved") return "text-amber-800"
    return "text-emerald-800"
  }

  const indoorTables = tables.filter((t) => t.zone === "indoor")
  const vipTables = tables.filter((t) => t.zone === "vip")

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Topbar */}
      <div className="bg-gradient-to-r from-[#1E3A5F] to-blue-600 px-7 h-[60px] flex items-center justify-between">
        <span className="font-serif text-xl text-white">🍜 Việt Bếp</span>
        <div className="flex gap-1">
          <Link to="/staff/tables" className="px-4 py-1.5 rounded-lg text-sm font-medium bg-white/20 text-white">
            🗺️ Sơ đồ bàn
          </Link>
          <Link to="/staff/order" className="px-4 py-1.5 rounded-lg text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white transition-all">
            📋 Gọi món
          </Link>
        </div>
        <div className="flex items-center gap-2.5 text-white text-sm font-medium">
          <div className="w-8 h-8 rounded-full bg-white/25 flex items-center justify-center font-bold text-[13px]">H</div>
          <span>Nguyễn Thị Hoa</span>
          <span className="bg-white/15 px-2.5 py-0.5 rounded-full text-xs">Phục vụ</span>
        </div>
      </div>

      <div className="max-w-[1100px] mx-auto px-7 py-7">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-[22px] font-bold font-serif">Sơ đồ bàn</h1>
            <p className="text-[13px] text-gray-500 mt-0.5">
              Chọn bàn để bắt đầu nhận order · 25/12/2024 · 18:30
            </p>
          </div>
          <button
            onClick={() => selected && navigate("/staff/order")}
            disabled={!selected}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-[13px] font-semibold hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            📋 Gọi món cho bàn đã chọn
          </button>
        </div>

        {/* Quick Stats */}
        <div className="flex gap-3 mb-6">
          {quickStats.map((s) => (
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

            {/* Indoor Zone */}
            <div className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">
              🏠 Khu vực trong
            </div>
            <div className="grid grid-cols-4 gap-3 mb-5">
              {indoorTables.map((table) => (
                <div
                  key={table.num}
                  onClick={() => handleSelect(table)}
                  className={`relative rounded-xl p-4 text-center border-2 transition-all duration-200 select-none ${cardClass(table)}`}
                >
                  {table.time && (
                    <div className="absolute top-1.5 right-1.5 bg-black/15 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md">
                      {table.time}
                    </div>
                  )}
                  <div className="text-[26px] mb-1">{table.emoji}</div>
                  <div className="text-sm font-bold">{table.display}</div>
                  <div className="text-xs font-medium opacity-75">{table.cap}</div>
                  <div className={`text-[11px] font-bold mt-1.5 uppercase tracking-wide ${statusColor(table)}`}>
                    {statusText(table)}
                  </div>
                </div>
              ))}
            </div>

            {/* VIP Zone */}
            <div className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2 pt-3 border-t border-dashed border-gray-200">
              🌟 Khu VIP
            </div>
            <div className="grid grid-cols-2 gap-3">
              {vipTables.map((table) => (
                <div
                  key={table.num}
                  onClick={() => handleSelect(table)}
                  className={`relative rounded-xl p-4 text-center border-2 transition-all duration-200 select-none ${cardClass(table)}`}
                >
                  <div className="text-[26px] mb-1">{table.emoji}</div>
                  <div className="text-sm font-bold">{table.display}</div>
                  <div className="text-xs font-medium opacity-75">{table.cap}</div>
                  <div className={`text-[11px] font-bold mt-1.5 uppercase tracking-wide ${statusColor(table)}`}>
                    {statusText(table)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Side Panel */}
          <div className="w-[280px] flex-shrink-0 flex flex-col gap-3">
            {/* Selected Table Info */}
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="text-sm font-bold mb-3 flex items-center gap-1.5">🪑 Bàn đang chọn</div>
              {selected ? (
                <>
                  {[
                    { label: "Bàn số", value: selected.display, valueClass: "text-blue-600" },
                    { label: "Sức chứa", value: selected.cap },
                    {
                      label: "Trạng thái",
                      value: selected.status === "available" ? "Còn trống" : "Đặt trước",
                      valueClass: selected.status === "available" ? "text-emerald-600" : "text-amber-600",
                    },
                    { label: "Đặt trước", value: selected.reservation ?? "–", valueClass: "text-xs" },
                  ].map((r) => (
                    <div key={r.label} className="flex justify-between text-[13px] py-1.5 border-b border-gray-100 last:border-0">
                      <span className="text-gray-500">{r.label}</span>
                      <span className={`font-semibold ${r.valueClass ?? ""}`}>{r.value}</span>
                    </div>
                  ))}
                  <button
                    onClick={() => navigate("/staff/order")}
                    className="w-full mt-3 py-3 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition"
                  >
                    📋 Nhận order cho bàn này →
                  </button>
                </>
              ) : (
                <div className="text-center py-8 text-gray-400 text-sm">Chưa chọn bàn nào</div>
              )}
            </div>

            {/* Occupied Tables */}
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="text-sm font-bold mb-3">🔴 Đang phục vụ</div>
              {occupiedList.map((t) => (
                <div key={t.label} className="flex justify-between text-[13px] py-1.5 border-b border-gray-100 last:border-0">
                  <span className="text-gray-500">{t.label}</span>
                  <span className={`text-xs font-semibold ${t.color}`}>{t.info}</span>
                </div>
              ))}
            </div>

            {/* Upcoming Reservations */}
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="text-sm font-bold mb-3">🟡 Đặt trước sắp tới</div>
              {upcomingReservations.map((r) => (
                <div key={r.time} className="flex justify-between text-[13px] py-1.5 border-b border-gray-100 last:border-0">
                  <span className="text-gray-500">{r.time}</span>
                  <span className="text-xs font-semibold">{r.guests}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
