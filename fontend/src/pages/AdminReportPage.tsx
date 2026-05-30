import { useState } from "react"
import AdminLayout from "../components/AdminLayout"

const kpiCards = [
  { icon: "💰", trend: "▲ 18.4%", trendUp: true, value: "248,500,000đ", label: "Doanh thu tháng 12", compare: "Tháng trước: 209,800,000đ" },
  { icon: "📦", trend: "▲ 12.1%", trendUp: true, value: "1,248", label: "Tổng số đơn", compare: "Tháng trước: 1,113 đơn" },
  { icon: "🧾", trend: "▲ 5.7%", trendUp: true, value: "199,100đ", label: "Giá trị trung bình / đơn", compare: "Tháng trước: 188,500đ" },
  { icon: "👥", trend: "▲ 9.2%", trendUp: true, value: "847", label: "Lượt khách phục vụ", compare: "Tháng trước: 776 lượt" },
]

const barData = [
  { day: "1", pct: 45, weekend: false }, { day: "2", pct: 80, weekend: true },
  { day: "3", pct: 75, weekend: true }, { day: "4", pct: 50, weekend: false },
  { day: "5", pct: 55, weekend: false }, { day: "6", pct: 60, weekend: false },
  { day: "7", pct: 90, weekend: true }, { day: "8", pct: 85, weekend: true },
  { day: "9", pct: 48, weekend: false }, { day: "10", pct: 52, weekend: false },
  { day: "11", pct: 58, weekend: false }, { day: "12", pct: 95, weekend: true },
  { day: "13", pct: 88, weekend: true }, { day: "14", pct: 55, weekend: false },
  { day: "15", pct: 60, weekend: false }, { day: "...", pct: 100, weekend: true },
]

const donutLegend = [
  { color: "#2563EB", label: "Món chính", pct: "44%" },
  { color: "#10B981", label: "Súp & Bún", pct: "24%" },
  { color: "#F59E0B", label: "Khai vị", pct: "17%" },
  { color: "#EF4444", label: "Đồ uống", pct: "15%" },
]

const topDishes = [
  { rank: 1, name: "Phở Bò Đặc Biệt", price: "95,000đ", category: "Súp & Bún", qty: 348, revenue: "33,060,000đ", pct: 88, pctLabel: "13.3%", barColor: "bg-blue-600" },
  { rank: 2, name: "Gà Nướng Mắc Khén", price: "145,000đ", category: "Món chính", qty: 215, revenue: "31,175,000đ", pct: 82, pctLabel: "12.5%", barColor: "bg-emerald-500" },
  { rank: 3, name: "Bún Bò Huế", price: "85,000đ", category: "Súp & Bún", qty: 248, revenue: "21,080,000đ", pct: 64, pctLabel: "8.5%", barColor: "bg-amber-400" },
  { rank: 4, name: "Bò Lúc Lắc", price: "175,000đ", category: "Món chính", qty: 112, revenue: "19,600,000đ", pct: 57, pctLabel: "7.9%", barColor: "bg-red-500" },
  { rank: 5, name: "Gỏi Cuốn Tôm Thịt", price: "65,000đ", category: "Khai vị", qty: 287, revenue: "18,655,000đ", pct: 52, pctLabel: "7.5%", barColor: "bg-blue-400" },
]

const periods = ["Hôm nay", "7 ngày", "Tháng này", "Quý này", "Năm nay"]

const monthComparison = [
  { month: "Tháng 12", revenue: "248.5tr", orders: "1,248", growth: "▲ 18.4%", up: true, highlight: true },
  { month: "Tháng 11", revenue: "209.8tr", orders: "1,113", growth: "▲ 8.2%", up: true, highlight: false },
  { month: "Tháng 10", revenue: "193.9tr", orders: "1,028", growth: "▼ 2.1%", up: false, highlight: false },
]

export default function AdminReportPage() {
  const [activePeriod, setActivePeriod] = useState("Tháng này")

  return (
    <AdminLayout
      title="📊 Báo cáo Doanh thu"
      topbarRight={
        <>
          <button className="px-4 py-2 border-[1.5px] border-gray-200 rounded-lg text-[13px] font-semibold bg-white hover:bg-gray-50">
            🖨️ In báo cáo
          </button>
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[13px] font-semibold transition">
            📥 Xuất Excel
          </button>
        </>
      }
    >
      <div className="p-7">
        {/* Filter Bar */}
        <div className="bg-white border border-gray-200 rounded-xl px-5 py-4 flex items-center gap-3 mb-6 flex-wrap">
          <span className="text-[13px] font-bold text-gray-500">Kỳ báo cáo:</span>
          <input
            type="date"
            defaultValue="2024-12-01"
            className="px-3 py-2 border-[1.5px] border-gray-200 rounded-lg text-[13px] outline-none focus:border-blue-500"
          />
          <span className="text-gray-400">→</span>
          <input
            type="date"
            defaultValue="2024-12-31"
            className="px-3 py-2 border-[1.5px] border-gray-200 rounded-lg text-[13px] outline-none focus:border-blue-500"
          />
          <button className="px-4 py-2 border-[1.5px] border-gray-200 rounded-lg text-[13px] font-semibold bg-white hover:bg-gray-50">
            Áp dụng
          </button>
          <div className="flex gap-1 ml-auto">
            {periods.map((p) => (
              <button
                key={p}
                onClick={() => setActivePeriod(p)}
                className={`px-3.5 py-1.5 border-[1.5px] rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                  activePeriod === p
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-500 border-gray-200 hover:border-blue-400"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {kpiCards.map((c) => (
            <div key={c.label} className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[22px]">{c.icon}</span>
                <span
                  className={`text-xs font-bold px-2 py-1 rounded-full ${
                    c.trendUp ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"
                  }`}
                >
                  {c.trend}
                </span>
              </div>
              <div className="text-2xl font-bold mb-1">{c.value}</div>
              <div className="text-xs text-gray-500">{c.label}</div>
              <div className="text-xs text-gray-400 mt-1.5">{c.compare}</div>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid gap-4 mb-4" style={{ gridTemplateColumns: "2fr 1fr" }}>
          {/* Bar Chart */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex items-start justify-between mb-5">
              <div>
                <div className="text-[15px] font-bold">Doanh thu theo ngày – Tháng 12/2024</div>
                <div className="text-xs text-gray-400 mt-0.5">Đơn vị: triệu đồng</div>
              </div>
              <div className="flex gap-3">
                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                  <div className="w-2.5 h-2.5 rounded-sm bg-blue-600" /> Ngày thường
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                  <div className="w-2.5 h-2.5 rounded-sm bg-amber-400" /> Cuối tuần
                </div>
              </div>
            </div>
            <div
              className="flex items-end gap-1 border-b-2 border-l border-gray-200 px-2"
              style={{ height: 180 }}
            >
              {barData.map((d) => (
                <div key={d.day} className="flex flex-col items-center gap-1 flex-1">
                  <div
                    className="w-full rounded-t cursor-pointer transition-opacity hover:opacity-75"
                    style={{
                      height: `${d.pct}%`,
                      background: d.weekend ? "#F59E0B" : "#2563EB",
                      opacity: d.weekend ? 1 : 0.75,
                    }}
                  />
                  <span className="text-[9px] text-gray-400">{d.day}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Donut Chart */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="text-[15px] font-bold mb-5">Cơ cấu theo danh mục</div>
            <div className="flex items-center gap-5">
              <svg width="120" height="120" viewBox="0 0 120 120" className="flex-shrink-0">
                <circle cx="60" cy="60" r="50" fill="none" stroke="#E5E7EB" strokeWidth="20" />
                <circle cx="60" cy="60" r="50" fill="none" stroke="#2563EB" strokeWidth="20" strokeDasharray="138 176" strokeDashoffset="0" transform="rotate(-90 60 60)" />
                <circle cx="60" cy="60" r="50" fill="none" stroke="#10B981" strokeWidth="20" strokeDasharray="75 239" strokeDashoffset="-138" transform="rotate(-90 60 60)" />
                <circle cx="60" cy="60" r="50" fill="none" stroke="#F59E0B" strokeWidth="20" strokeDasharray="55 259" strokeDashoffset="-213" transform="rotate(-90 60 60)" />
                <circle cx="60" cy="60" r="50" fill="none" stroke="#EF4444" strokeWidth="20" strokeDasharray="46 268" strokeDashoffset="-268" transform="rotate(-90 60 60)" />
                <text x="60" y="55" textAnchor="middle" fontSize="11" fontWeight="700" fill="#111827">Tháng</text>
                <text x="60" y="70" textAnchor="middle" fontSize="11" fontWeight="700" fill="#111827">12/2024</text>
              </svg>
              <div className="flex flex-col gap-2.5">
                {donutLegend.map((item) => (
                  <div key={item.label} className="flex items-center gap-2 text-[13px]">
                    <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: item.color }} />
                    <span className="flex-1">{item.label}</span>
                    <span className="font-bold ml-2" style={{ color: item.color }}>{item.pct}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Top Dishes Table */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-4">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
            <div className="text-[15px] font-bold">🍜 Top 5 món ăn bán chạy – Tháng 12/2024</div>
            <a href="#" className="text-[13px] text-blue-600 font-medium hover:underline">Xem tất cả →</a>
          </div>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50">
                {["#", "Món Ăn", "Danh mục", "Số lượng bán", "Doanh thu", "% tổng DT"].map((h) => (
                  <th key={h} className="px-4 py-2.5 text-left text-xs font-bold text-gray-400 uppercase tracking-wide border-b border-gray-200">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {topDishes.map((dish) => (
                <tr key={dish.rank} className="hover:bg-gray-50">
                  <td className="px-4 py-3 border-b border-gray-100">
                    <div className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 text-xs font-bold flex items-center justify-center">
                      {dish.rank}
                    </div>
                  </td>
                  <td className="px-4 py-3 border-b border-gray-100">
                    <div className="font-semibold text-sm">{dish.name}</div>
                    <div className="text-xs text-gray-400">{dish.price} / phần</div>
                  </td>
                  <td className="px-4 py-3 text-sm border-b border-gray-100">{dish.category}</td>
                  <td className="px-4 py-3 text-sm border-b border-gray-100">{dish.qty} phần</td>
                  <td className="px-4 py-3 border-b border-gray-100 font-bold text-blue-600 text-sm">{dish.revenue}</td>
                  <td className="px-4 py-3 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${dish.barColor}`} style={{ width: `${dish.pct}%` }} />
                      </div>
                      <span className="text-xs text-gray-500 w-8">{dish.pctLabel}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-2 gap-4">
          {/* Revenue by Shift */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="text-[15px] font-bold mb-4">Doanh thu theo ca làm việc</div>
            <div className="flex justify-between text-[13px] py-2.5 border-b border-gray-100">
              <span className="text-gray-500">🌅 Ca sáng (10:00–14:00)</span>
              <span className="font-bold">62,125,000đ <span className="text-xs text-gray-400">(25%)</span></span>
            </div>
            <div className="flex justify-between text-[13px] py-2.5 border-b border-gray-100">
              <span className="text-gray-500">☀️ Ca chiều (14:00–17:00)</span>
              <span className="font-bold">37,275,000đ <span className="text-xs text-gray-400">(15%)</span></span>
            </div>
            <div className="flex justify-between text-[13px] py-2.5">
              <span className="text-gray-500">🌙 Ca tối (17:00–22:00)</span>
              <span className="font-bold text-blue-600">149,100,000đ <span className="text-xs text-gray-400">(60%)</span></span>
            </div>
            <div className="mt-4">
              <div className="text-xs text-gray-400 mb-1.5">Phân bổ doanh thu theo ca</div>
              <div className="flex h-3 rounded-full overflow-hidden">
                <div className="w-[25%] bg-blue-400" />
                <div className="w-[15%] bg-blue-300" />
                <div className="w-[60%] bg-blue-700" />
              </div>
              <div className="flex gap-4 mt-1.5">
                <span className="text-[11px] text-gray-400">■ Sáng 25%</span>
                <span className="text-[11px] text-gray-400">■ Chiều 15%</span>
                <span className="text-[11px] text-gray-400">■ Tối 60%</span>
              </div>
            </div>
          </div>

          {/* 3-Month Comparison */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="text-[15px] font-bold mb-4">So sánh 3 tháng gần nhất</div>
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  {["Tháng", "Doanh thu", "Số đơn", "Tăng trưởng"].map((h) => (
                    <th key={h} className="pb-2 text-[11px] font-bold text-gray-400 text-left px-2.5">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {monthComparison.map((row) => (
                  <tr key={row.month} className={row.highlight ? "bg-blue-50" : ""}>
                    <td className={`py-2.5 px-2.5 text-sm ${row.highlight ? "font-bold" : ""}`}>{row.month}</td>
                    <td className={`py-2.5 px-2.5 text-sm text-right ${row.highlight ? "font-bold" : "font-semibold"}`}>{row.revenue}</td>
                    <td className="py-2.5 px-2.5 text-sm text-right">{row.orders}</td>
                    <td className={`py-2.5 px-2.5 text-sm text-right font-bold ${row.up ? "text-emerald-600" : "text-red-500"}`}>
                      {row.growth}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
