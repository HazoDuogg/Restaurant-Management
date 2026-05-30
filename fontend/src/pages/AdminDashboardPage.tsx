import AdminLayout from "../components/AdminLayout"

const statCards = [
  { icon: "💰", label: "Doanh thu hôm nay", value: "8,450,000đ", change: "▲ 12.5% so với hôm qua", up: true },
  { icon: "📦", label: "Đơn hàng hôm nay", value: "42", change: "▲ 8 đơn so với hôm qua", up: true },
  { icon: "📋", label: "Đặt bàn hôm nay", value: "18", change: "▲ 3 so với hôm qua", up: true },
  { icon: "🪑", label: "Bàn đang phục vụ", value: "7/12", change: "58% công suất", up: null },
]

const chartBars = [
  { day: "T2", pct: 55, weekend: false },
  { day: "T3", pct: 70, weekend: false },
  { day: "T4", pct: 48, weekend: false },
  { day: "T5", pct: 82, weekend: false },
  { day: "T6", pct: 95, weekend: false },
  { day: "T7", pct: 100, weekend: true },
  { day: "CN", pct: 88, weekend: true },
]

const recentOrders = [
  { table: "Bàn 03", detail: "4 món · 18:24", total: "285,000đ", status: "serving" },
  { table: "Bàn 07", detail: "6 món · 17:55", total: "520,000đ", status: "paid" },
  { table: "Bàn 01", detail: "2 món · 17:30", total: "145,000đ", status: "paid" },
  { table: "Bàn 05", detail: "8 món · 16:50", total: "780,000đ", status: "paid" },
]

const topMenu = [
  { rank: 1, name: "Phở Bò Đặc Biệt", count: 28, revenue: "2,660,000đ", pct: 88 },
  { rank: 2, name: "Gà Nướng Mắc Khén", count: 19, revenue: "2,755,000đ", pct: 65 },
  { rank: 3, name: "Bún Bò Huế", count: 17, revenue: "1,445,000đ", pct: 55 },
  { rank: 4, name: "Gỏi Cuốn Tôm Thịt", count: 14, revenue: "910,000đ", pct: 42 },
]

const pendingReservations = [
  { name: "Nguyễn Thị Lan", phone: "0901 234 567", datetime: "25/12 · 18:00", guests: "4 người", table: "Bàn 03" },
  { name: "Trần Văn Minh", phone: "0912 345 678", datetime: "25/12 · 19:30", guests: "2 người", table: "Bàn 01" },
  { name: "Lê Quốc Bảo", phone: "0923 456 789", datetime: "26/12 · 12:00", guests: "6 người", table: "Bàn 05" },
]

const MAX_BAR_PX = 150

export default function AdminDashboardPage() {
  return (
    <AdminLayout
      title="🏠 Dashboard"
      topbarRight={
        <>
          <span className="text-sm text-gray-500">Hôm nay: Thứ Tư, 25/12/2024</span>
          <button className="relative w-9 h-9 border-[1.5px] border-gray-200 rounded-lg bg-white flex items-center justify-center text-base">
            🔔
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full" />
          </button>
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[13px] font-semibold transition">
            + Tạo báo cáo
          </button>
        </>
      }
    >
      <div className="p-7">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {statCards.map((card) => (
            <div key={card.label} className="bg-white border border-gray-200 rounded-xl px-5 py-5">
              <div className="text-[22px] mb-3">{card.icon}</div>
              <div className="text-[13px] text-gray-500 mb-1">{card.label}</div>
              <div className="text-[26px] font-bold">{card.value}</div>
              <div
                className={`text-xs mt-1.5 ${
                  card.up === true ? "text-emerald-500" : card.up === false ? "text-red-500" : "text-gray-400"
                }`}
              >
                {card.change}
              </div>
            </div>
          ))}
        </div>

        {/* Chart */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-4">
          <div className="flex items-center justify-between mb-5">
            <div>
              <div className="text-[15px] font-bold">Doanh thu theo tuần</div>
              <div className="text-xs text-gray-400 mt-0.5">Tháng 12 năm 2024</div>
            </div>
            <div className="flex gap-1">
              {["Ngày", "Tuần", "Tháng"].map((tab) => (
                <button
                  key={tab}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold border-[1.5px] ${
                    tab === "Tuần"
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-500 border-gray-200"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3" style={{ height: 200 }}>
            {/* Y-axis labels */}
            <div className="flex flex-col justify-between flex-shrink-0 pb-5">
              {["12tr", "9tr", "6tr", "3tr", "0"].map((l) => (
                <span key={l} className="text-[10px] text-gray-400">{l}</span>
              ))}
            </div>
            {/* Bars */}
            <div
              className="flex-1 flex items-end gap-2 border-l border-b border-gray-200 px-2"
              style={{ height: 180 }}
            >
              {chartBars.map((d) => (
                <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full rounded-t cursor-pointer hover:opacity-80 transition-opacity"
                    style={{
                      height: Math.round((d.pct / 100) * MAX_BAR_PX),
                      background: d.weekend ? "#F59E0B" : "#2563EB",
                    }}
                  />
                  <span className="text-[11px] text-gray-400">{d.day}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-4 mt-2">
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <div className="w-3 h-3 rounded-sm bg-blue-600" /> Ngày thường
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <div className="w-3 h-3 rounded-sm bg-amber-400" /> Cuối tuần
            </div>
          </div>
        </div>

        {/* Two columns */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          {/* Recent orders */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
              <div className="text-[15px] font-bold">Đơn hàng gần đây</div>
              <a href="#" className="text-[13px] text-blue-600 font-medium hover:underline">Xem tất cả →</a>
            </div>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  {["Bàn", "Tổng tiền", "Trạng thái"].map((h) => (
                    <th key={h} className="px-4 py-2.5 text-left text-xs font-bold text-gray-400 uppercase tracking-wide border-b border-gray-200">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((o, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-4 py-3 border-b border-gray-100">
                      <div className="text-sm font-semibold">{o.table}</div>
                      <div className="text-xs text-gray-400">{o.detail}</div>
                    </td>
                    <td className="px-4 py-3 text-sm font-bold border-b border-gray-100">{o.total}</td>
                    <td className="px-4 py-3 border-b border-gray-100">
                      {o.status === "serving" ? (
                        <span className="inline-flex px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800">
                          Đang phục vụ
                        </span>
                      ) : (
                        <span className="inline-flex px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                          Đã thanh toán
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Top menu */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
              <div className="text-[15px] font-bold">Top món ăn hôm nay</div>
              <a href="/admin/report" className="text-[13px] text-blue-600 font-medium hover:underline">Chi tiết →</a>
            </div>
            {topMenu.map((item) => (
              <div key={item.rank} className="flex items-center px-5 py-3 border-b border-gray-100 last:border-0">
                <div className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 text-xs font-bold flex items-center justify-center flex-shrink-0">
                  {item.rank}
                </div>
                <div className="flex-1 mx-3">
                  <div className="text-sm font-semibold">{item.name}</div>
                  <div className="text-xs text-gray-400">{item.count} phần đã bán</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-blue-600">{item.revenue}</div>
                  <div className="w-20 h-1.5 bg-gray-200 rounded-full overflow-hidden mt-1">
                    <div className="h-full bg-blue-600 rounded-full" style={{ width: `${item.pct}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending reservations */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
            <div className="flex items-center gap-2 text-[15px] font-bold">
              Đặt bàn chờ duyệt
              <span className="bg-red-100 text-red-800 text-[11px] font-bold px-2 py-0.5 rounded-full ml-2">3 mới</span>
            </div>
            <a href="/admin/reservations" className="text-[13px] text-blue-600 font-medium hover:underline">Xem tất cả →</a>
          </div>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50">
                {["Khách hàng", "Ngày/Giờ", "Số người", "Bàn", "Thao tác"].map((h) => (
                  <th key={h} className="px-4 py-2.5 text-left text-xs font-bold text-gray-400 uppercase tracking-wide border-b border-gray-200">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pendingReservations.map((r, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-4 py-3 border-b border-gray-100">
                    <div className="text-sm font-semibold">{r.name}</div>
                    <div className="text-xs text-gray-400">{r.phone}</div>
                  </td>
                  <td className="px-4 py-3 text-sm border-b border-gray-100">{r.datetime}</td>
                  <td className="px-4 py-3 text-sm border-b border-gray-100">{r.guests}</td>
                  <td className="px-4 py-3 text-sm border-b border-gray-100">{r.table}</td>
                  <td className="px-4 py-3 border-b border-gray-100">
                    <div className="flex gap-1.5">
                      <button className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-md cursor-pointer border-none">
                        ✓ Duyệt
                      </button>
                      <button className="px-3 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded-md cursor-pointer border-none">
                        ✕ Từ chối
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  )
}
