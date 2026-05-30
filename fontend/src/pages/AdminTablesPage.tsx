import { useState } from "react"
import AdminLayout from "../components/AdminLayout"

type TableStatus = "available" | "occupied" | "reserved"

interface TableData {
  id: string
  name: string
  capacity: string
  status: TableStatus
  statusLabel: string
  emoji: string
  vip: boolean
}

const tables: TableData[] = [
  { id: "01", name: "Bàn 01", capacity: "2 người", status: "available", statusLabel: "Còn trống", emoji: "🪑", vip: false },
  { id: "02", name: "Bàn 02", capacity: "2 người", status: "occupied", statusLabel: "Phục vụ", emoji: "🪑", vip: false },
  { id: "03", name: "Bàn 03", capacity: "4 người", status: "reserved", statusLabel: "Đặt trước", emoji: "🪑", vip: false },
  { id: "04", name: "Bàn 04", capacity: "4 người", status: "available", statusLabel: "Còn trống", emoji: "🪑", vip: false },
  { id: "05", name: "Bàn 05", capacity: "6 người", status: "occupied", statusLabel: "Phục vụ", emoji: "🪑", vip: false },
  { id: "06", name: "Bàn 06", capacity: "6 người", status: "occupied", statusLabel: "Phục vụ", emoji: "🪑", vip: false },
  { id: "07", name: "Bàn 07", capacity: "4 người", status: "available", statusLabel: "Còn trống", emoji: "🪑", vip: false },
  { id: "08", name: "Bàn 08", capacity: "6 người", status: "reserved", statusLabel: "Đặt trước", emoji: "🪑", vip: false },
  { id: "09", name: "Bàn 09", capacity: "4 người", status: "occupied", statusLabel: "Phục vụ", emoji: "🪑", vip: false },
  { id: "10", name: "Bàn 10", capacity: "4 người", status: "available", statusLabel: "Còn trống", emoji: "🪑", vip: false },
  { id: "11", name: "Bàn VIP 11", capacity: "10 người", status: "reserved", statusLabel: "Đặt trước", emoji: "🛋️", vip: true },
  { id: "12", name: "Bàn VIP 12", capacity: "12 người", status: "available", statusLabel: "Còn trống", emoji: "🛋️", vip: true },
]

const tableCardStyles: Record<TableStatus, string> = {
  available: "bg-emerald-100 border-emerald-300 hover:-translate-y-0.5 hover:shadow-md",
  occupied: "bg-red-100 border-red-300",
  reserved: "bg-amber-100 border-amber-300",
}

const tableTextStyles: Record<TableStatus, string> = {
  available: "text-emerald-800",
  occupied: "text-red-800",
  reserved: "text-amber-800",
}

const badgeStyles: Record<TableStatus, string> = {
  available: "bg-emerald-100 text-emerald-800",
  occupied: "bg-red-100 text-red-800",
  reserved: "bg-amber-100 text-amber-800",
}

export default function AdminTablesPage() {
  const [showModal, setShowModal] = useState(false)
  const [selected, setSelected] = useState<TableData | null>(null)

  const regularTables = tables.filter((t) => !t.vip)
  const vipTables = tables.filter((t) => t.vip)

  return (
    <AdminLayout
      title="🪑 Quản lý Bàn"
      topbarRight={
        <>
          <div className="flex border-[1.5px] border-gray-200 rounded-lg overflow-hidden">
            <button className="px-4 py-2 text-[13px] font-medium bg-blue-600 text-white">🗺️ Sơ Đồ</button>
            <button className="px-4 py-2 text-[13px] font-medium bg-white text-gray-500 hover:bg-gray-50 transition">
              📋 Danh sách
            </button>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[13px] font-semibold transition"
          >
            + Thêm bàn
          </button>
        </>
      }
    >
      <div className="p-7">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-3.5 mb-6">
          {[
            { num: "12", label: "Tổng số bàn", color: "" },
            { num: "5", label: "Còn trống", color: "text-emerald-500" },
            { num: "4", label: "Đang phục vụ", color: "text-red-500" },
            { num: "3", label: "Đã đặt trước", color: "text-amber-500" },
          ].map((s) => (
            <div key={s.label} className="bg-white border border-gray-200 rounded-xl px-4 py-4">
              <div className={`text-2xl font-bold ${s.color}`}>{s.num}</div>
              <div className="text-[13px] text-gray-400">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Floor plan */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="text-[15px] font-bold">Sơ đồ mặt bằng nhà hàng</div>
            <div className="flex gap-4">
              {[
                { bg: "bg-emerald-100 border border-emerald-300", label: "Còn trống" },
                { bg: "bg-red-100 border border-red-300", label: "Đang phục vụ" },
                { bg: "bg-amber-100 border border-amber-300", label: "Đã đặt trước" },
              ].map((l) => (
                <div key={l.label} className="flex items-center gap-1.5 text-xs text-gray-500">
                  <div className={`w-3.5 h-3.5 rounded-sm ${l.bg}`} />
                  {l.label}
                </div>
              ))}
            </div>
          </div>

          {/* Zone labels */}
          <div className="flex gap-2 mb-2.5">
            <div className="flex-1 text-center text-[11px] font-bold text-gray-400 uppercase tracking-widest">
              Khu vực trong
            </div>
            <div className="w-px bg-gray-200" />
            <div style={{ width: "38%" }} className="text-center text-[11px] font-bold text-gray-400 uppercase tracking-widest">
              Khu VIP
            </div>
          </div>

          <div className="flex gap-3.5">
            {/* Regular tables - 5 columns */}
            <div className="flex-1 grid grid-cols-5 gap-3 p-4 bg-gray-50 rounded-xl">
              {regularTables.map((table) => (
                <div
                  key={table.id}
                  onClick={() => setSelected(table)}
                  className={`rounded-xl p-3 text-center cursor-pointer transition-all border-2 ${tableCardStyles[table.status]} ${
                    selected?.id === table.id ? "!border-blue-500 ring-2 ring-blue-100" : ""
                  }`}
                >
                  <div className="text-[28px] mb-1">{table.emoji}</div>
                  <div className="text-[13px] font-bold">{table.name}</div>
                  <div className="text-[11px] opacity-60 mt-0.5">{table.capacity}</div>
                  <div className={`text-[10px] font-bold mt-1 uppercase tracking-wide ${tableTextStyles[table.status]}`}>
                    {table.statusLabel}
                  </div>
                </div>
              ))}
            </div>

            <div className="w-px bg-gray-200 flex-shrink-0" />

            {/* VIP tables */}
            <div style={{ width: "38%" }} className="flex flex-col gap-3 p-4 bg-gray-50 rounded-xl">
              {vipTables.map((table) => (
                <div
                  key={table.id}
                  onClick={() => setSelected(table)}
                  className={`rounded-xl p-3 text-center cursor-pointer transition-all border-2 ${tableCardStyles[table.status]} ${
                    selected?.id === table.id ? "!border-blue-500 ring-2 ring-blue-100" : ""
                  }`}
                >
                  <div className="text-[28px] mb-1">{table.emoji}</div>
                  <div className="text-[13px] font-bold">{table.name}</div>
                  <div className="text-[11px] opacity-60 mt-0.5">{table.capacity}</div>
                  <div className={`text-[10px] font-bold mt-1 uppercase tracking-wide ${tableTextStyles[table.status]}`}>
                    {table.statusLabel}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Info panel */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 mt-4">
          <div className="text-sm font-bold mb-3.5">
            🪑 Thông tin bàn —{" "}
            <span className={selected ? "text-gray-800" : "text-gray-400"}>
              {selected ? selected.name : "Chọn bàn để xem chi tiết"}
            </span>
          </div>
          {selected ? (
            <>
              <div className="grid grid-cols-2 gap-x-6">
                {[
                  { label: "Số bàn", value: selected.name },
                  { label: "Sức chứa", value: selected.capacity },
                  {
                    label: "Trạng thái",
                    value: (
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-[11px] font-bold ${badgeStyles[selected.status]}`}>
                        {selected.statusLabel}
                      </span>
                    ),
                  },
                  { label: "Cập nhật lúc", value: "18:30 hôm nay" },
                ].map((row, i) => (
                  <div key={i} className="flex items-center justify-between text-[13px] py-2 border-b border-gray-100">
                    <span className="text-gray-400">{row.label}</span>
                    <span className="font-semibold">{row.value}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 mt-4">
                <button className="px-3.5 py-1.5 text-xs font-semibold border-[1.5px] border-gray-200 bg-white rounded-lg hover:bg-gray-50 transition">
                  ✏️ Chỉnh sửa bàn
                </button>
                <button className="px-3.5 py-1.5 text-xs font-semibold bg-amber-50 text-amber-800 border-[1.5px] border-amber-300 rounded-lg hover:bg-amber-100 transition">
                  🔄 Đổi trạng thái
                </button>
              </div>
            </>
          ) : (
            <p className="text-[13px] text-gray-400">
              Nhấn vào bàn bất kỳ trên sơ đồ để xem thông tin chi tiết.
            </p>
          )}
        </div>
      </div>

      {/* Add Table Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-[200] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-[420px] shadow-2xl">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
              <div className="text-base font-bold">+ Thêm bàn mới</div>
              <button onClick={() => setShowModal(false)} className="text-gray-400 text-xl hover:text-gray-600">×</button>
            </div>
            <div className="p-6">
              {[
                { label: "Số bàn *", type: "text", placeholder: "VD: Bàn 13" },
                { label: "Sức chứa (số người) *", type: "number", placeholder: "VD: 4" },
              ].map((f) => (
                <div key={f.label} className="mb-4">
                  <label className="block text-[13px] font-semibold mb-1.5">{f.label}</label>
                  <input
                    type={f.type}
                    placeholder={f.placeholder}
                    className="w-full px-3.5 py-2.5 border-[1.5px] border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500 transition"
                  />
                </div>
              ))}
              <div className="mb-4">
                <label className="block text-[13px] font-semibold mb-1.5">Khu vực</label>
                <select className="w-full px-3.5 py-2.5 border-[1.5px] border-gray-200 rounded-lg text-sm bg-white outline-none focus:border-blue-500">
                  {["Khu trong", "Khu ngoài", "Khu VIP"].map((o) => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[13px] font-semibold mb-1.5">Trạng thái ban đầu</label>
                <select className="w-full px-3.5 py-2.5 border-[1.5px] border-gray-200 rounded-lg text-sm bg-white outline-none focus:border-blue-500">
                  <option>Còn trống</option>
                  <option>Đang bảo trì</option>
                </select>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-gray-200">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border-[1.5px] border-gray-200 rounded-lg text-[13px] font-semibold bg-white hover:bg-gray-50 transition"
              >
                Hủy
              </button>
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[13px] font-semibold transition">
                Thêm bàn
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
