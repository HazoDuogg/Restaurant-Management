import { useState, useEffect } from "react"
import AdminLayout from "../components/AdminLayout"
import { api } from "../lib/api"

// ─── Types ────────────────────────────────────────────────────────────────────

type Kpis = {
  totalRevenue: number; prevTotalRevenue: number; revenuePct: number | null
  totalOrders: number; prevTotalOrders: number; ordersPct: number | null
  avgOrderValue: number; prevAvgOrderValue: number; avgPct: number | null
  totalCustomers: number; prevTotalCustomers: number; customersPct: number | null
}

type DayRevenue = { day: number; revenue: number }

type CategoryRevenue = { name: string; revenue: number; pct: number; color: string }

type TopDish = {
  rank: number; name: string; price: number; categoryName: string
  quantity: number; revenue: number; pct: number
}

type ShiftData = { revenue: number; pct: number }

type MonthRow = {
  month: string; revenue: number; orders: number
  growth: number | null; up: boolean; highlight: boolean
}

type Stats = {
  kpis: Kpis
  revenueByDay: DayRevenue[]
  revenueByCategory: CategoryRevenue[]
  topDishes: TopDish[]
  revenueByShift: { morning: ShiftData; afternoon: ShiftData; evening: ShiftData }
  monthlyComparison: MonthRow[]
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt(n: number) {
  return new Intl.NumberFormat("vi-VN").format(Math.round(n)) + "đ"
}

function fmtShort(n: number) {
  if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(1) + "tỷ"
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "tr"
  if (n >= 1_000) return (n / 1_000).toFixed(0) + "k"
  return String(n)
}

function pctLabel(pct: number | null) {
  if (pct === null) return { text: "—", up: true }
  const up = pct >= 0
  return { text: (up ? "▲ " : "▼ ") + Math.abs(pct).toFixed(1) + "%", up }
}

function getDateRange(period: string): { from: Date; to: Date } {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  switch (period) {
    case "Hôm nay":
      return { from: today, to: today }
    case "7 ngày": {
      const f = new Date(today); f.setDate(f.getDate() - 6)
      return { from: f, to: today }
    }
    case "Tháng này":
      return { from: new Date(now.getFullYear(), now.getMonth(), 1), to: today }
    case "Quý này": {
      const q = Math.floor(now.getMonth() / 3)
      return { from: new Date(now.getFullYear(), q * 3, 1), to: today }
    }
    case "Năm nay":
      return { from: new Date(now.getFullYear(), 0, 1), to: today }
    default:
      return { from: new Date(now.getFullYear(), now.getMonth(), 1), to: today }
  }
}

function toISO(d: Date) {
  return d.toISOString().split("T")[0]
}

const periods = ["Hôm nay", "7 ngày", "Tháng này", "Quý này", "Năm nay"]

const DISH_COLORS = ["bg-blue-600", "bg-emerald-500", "bg-amber-400", "bg-red-500", "bg-blue-400"]

// ─── Component ────────────────────────────────────────────────────────────────

export default function AdminReportPage() {
  const [activePeriod, setActivePeriod] = useState("Tháng này")
  const init = getDateRange("Tháng này")
  const [fromDate, setFromDate] = useState(toISO(init.from))
  const [toDate, setToDate] = useState(toISO(init.to))
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  // queryKey drives the fetch — changing it triggers the effect
  const [queryKey, setQueryKey] = useState({ from: toISO(init.from), to: toISO(init.to) })

  useEffect(() => {
    let active = true
    async function run() {
      try {
        const res = await api.get("/reports/stats", {
          params: { fromDate: queryKey.from, toDate: queryKey.to }
        })
        if (active) { setStats(res.data.data); setError(null) }
      } catch {
        if (active) setError("Không thể tải dữ liệu báo cáo.")
      } finally {
        if (active) setLoading(false)
      }
    }
    run()
    return () => { active = false }
  }, [queryKey])

  function triggerFetch(from: string, to: string) {
    setLoading(true)
    setError(null)
    setQueryKey({ from, to })
  }

  function handlePeriodClick(p: string) {
    setActivePeriod(p)
    const { from, to } = getDateRange(p)
    const f = toISO(from), t = toISO(to)
    setFromDate(f); setToDate(t)
    triggerFetch(f, t)
  }

  function handleApply() {
    setActivePeriod("")
    triggerFetch(fromDate, toDate)
  }

  const kpi = stats?.kpis
  const maxDayRevenue = Math.max(...(stats?.revenueByDay.map(d => d.revenue) ?? [1]), 1)

  const kpiCards = kpi
    ? [
        {
          icon: "💰", label: "Doanh thu", value: fmt(kpi.totalRevenue),
          compare: `Kỳ trước: ${fmt(kpi.prevTotalRevenue)}`,
          ...pctLabel(kpi.revenuePct)
        },
        {
          icon: "📦", label: "Tổng số đơn", value: kpi.totalOrders.toLocaleString("vi-VN"),
          compare: `Kỳ trước: ${kpi.prevTotalOrders.toLocaleString("vi-VN")} đơn`,
          ...pctLabel(kpi.ordersPct)
        },
        {
          icon: "🧾", label: "Giá trị TB / đơn", value: fmt(kpi.avgOrderValue),
          compare: `Kỳ trước: ${fmt(kpi.prevAvgOrderValue)}`,
          ...pctLabel(kpi.avgPct)
        },
        {
          icon: "👥", label: "Lượt khách phục vụ", value: kpi.totalCustomers.toLocaleString("vi-VN"),
          compare: `Kỳ trước: ${kpi.prevTotalCustomers.toLocaleString("vi-VN")} lượt`,
          ...pctLabel(kpi.customersPct)
        },
      ]
    : []

  return (
    <AdminLayout title="📊 Báo cáo Doanh thu">
      <div className="p-7">

        {/* Filter Bar */}
        <div className="bg-white border border-gray-200 rounded-xl px-5 py-4 flex items-center gap-3 mb-6 flex-wrap">
          <span className="text-[13px] font-bold text-gray-500">Kỳ báo cáo:</span>
          <input
            type="date" value={fromDate}
            onChange={e => setFromDate(e.target.value)}
            className="px-3 py-2 border-[1.5px] border-gray-200 rounded-lg text-[13px] outline-none focus:border-blue-500"
          />
          <span className="text-gray-400">→</span>
          <input
            type="date" value={toDate}
            onChange={e => setToDate(e.target.value)}
            className="px-3 py-2 border-[1.5px] border-gray-200 rounded-lg text-[13px] outline-none focus:border-blue-500"
          />
          <button
            onClick={handleApply}
            className="px-4 py-2 border-[1.5px] border-gray-200 rounded-lg text-[13px] font-semibold bg-white hover:bg-gray-50"
          >
            Áp dụng
          </button>
          <div className="flex gap-1 ml-auto">
            {periods.map(p => (
              <button
                key={p} onClick={() => handlePeriodClick(p)}
                className={`px-3.5 py-1.5 border-[1.5px] rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                  activePeriod === p
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-500 border-gray-200 hover:border-blue-400"
                }`}
              >{p}</button>
            ))}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-5 py-4 mb-6 text-red-700 text-sm">{error}</div>
        )}

        {/* Loading skeleton */}
        {loading && (
          <div className="grid grid-cols-4 gap-4 mb-6">
            {[1,2,3,4].map(i => (
              <div key={i} className="bg-white border border-gray-200 rounded-xl p-5 animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-3 w-1/2" />
                <div className="h-7 bg-gray-200 rounded mb-2 w-3/4" />
                <div className="h-3 bg-gray-100 rounded w-2/3" />
              </div>
            ))}
          </div>
        )}

        {!loading && stats && (
          <>
            {/* KPI Cards */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              {kpiCards.map(c => (
                <div key={c.label} className="bg-white border border-gray-200 rounded-xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[22px]">{c.icon}</span>
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${c.up ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"}`}>
                      {c.text}
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
                    <div className="text-[15px] font-bold">Doanh thu theo ngày</div>
                    <div className="text-xs text-gray-400 mt-0.5">{fromDate} → {toDate}</div>
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
                {stats.revenueByDay.length === 0 ? (
                  <div className="flex items-center justify-center h-44 text-gray-400 text-sm">Không có dữ liệu</div>
                ) : (
                  <div>
                    <div className="flex items-end gap-[3px] border-b-2 border-l border-gray-200 px-1" style={{ height: 180 }}>
                      {stats.revenueByDay.map(d => {
                        const date = new Date(fromDate.split("-")[0] + "-" + fromDate.split("-")[1] + "-" + String(d.day).padStart(2, "0"))
                        const isWeekend = date.getDay() === 0 || date.getDay() === 6
                        const heightPct = maxDayRevenue > 0 ? (d.revenue / maxDayRevenue) * 100 : 0
                        return (
                          <div key={d.day} className="flex flex-col items-center gap-1 flex-1 group relative">
                            <div
                              title={fmt(d.revenue)}
                              className="w-full rounded-t cursor-pointer transition-opacity hover:opacity-75"
                              style={{
                                height: `${Math.max(heightPct, d.revenue > 0 ? 3 : 0)}%`,
                                background: isWeekend ? "#F59E0B" : "#2563EB",
                                opacity: isWeekend ? 1 : 0.8,
                                minHeight: d.revenue > 0 ? 3 : 0
                              }}
                            />
                            <span className="text-[9px] text-gray-400">{d.day}</span>
                          </div>
                        )
                      })}
                    </div>
                    <div className="flex justify-between mt-1 text-[10px] text-gray-400 px-1">
                      <span>0</span>
                      <span>{fmtShort(maxDayRevenue)}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Donut Chart */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="text-[15px] font-bold mb-5">Cơ cấu theo danh mục</div>
                {stats.revenueByCategory.length === 0 ? (
                  <div className="flex items-center justify-center h-32 text-gray-400 text-sm">Không có dữ liệu</div>
                ) : (
                  <div className="flex items-center gap-5">
                    <DonutChart segments={stats.revenueByCategory} />
                    <div className="flex flex-col gap-2.5">
                      {stats.revenueByCategory.map(item => (
                        <div key={item.name} className="flex items-center gap-2 text-[13px]">
                          <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: item.color }} />
                          <span className="flex-1">{item.name}</span>
                          <span className="font-bold ml-2" style={{ color: item.color }}>{item.pct}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Top Dishes */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-4">
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
                <div className="text-[15px] font-bold">🍜 Top 5 món ăn bán chạy</div>
              </div>
              {stats.topDishes.length === 0 ? (
                <div className="flex items-center justify-center py-10 text-gray-400 text-sm">Không có dữ liệu</div>
              ) : (
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      {["#", "Món Ăn", "Danh mục", "Số lượng bán", "Doanh thu", "% tổng DT"].map(h => (
                        <th key={h} className="px-4 py-2.5 text-left text-xs font-bold text-gray-400 uppercase tracking-wide border-b border-gray-200">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {stats.topDishes.map((dish, i) => (
                      <tr key={dish.rank} className="hover:bg-gray-50">
                        <td className="px-4 py-3 border-b border-gray-100">
                          <div className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 text-xs font-bold flex items-center justify-center">{dish.rank}</div>
                        </td>
                        <td className="px-4 py-3 border-b border-gray-100">
                          <div className="font-semibold text-sm">{dish.name}</div>
                          <div className="text-xs text-gray-400">{fmt(dish.price)} / phần</div>
                        </td>
                        <td className="px-4 py-3 text-sm border-b border-gray-100">{dish.categoryName}</td>
                        <td className="px-4 py-3 text-sm border-b border-gray-100">{dish.quantity} phần</td>
                        <td className="px-4 py-3 border-b border-gray-100 font-bold text-blue-600 text-sm">{fmt(dish.revenue)}</td>
                        <td className="px-4 py-3 border-b border-gray-100">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                              <div className={`h-full rounded-full ${DISH_COLORS[i]}`} style={{ width: `${Math.min(dish.pct * 5, 100)}%` }} />
                            </div>
                            <span className="text-xs text-gray-500 w-10">{dish.pct}%</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-2 gap-4">
              {/* Revenue by Shift */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="text-[15px] font-bold mb-4">Doanh thu theo ca làm việc</div>
                {[
                  { label: "🌅 Ca sáng (10:00–14:00)", key: "morning" as const },
                  { label: "☀️ Ca chiều (14:00–17:00)", key: "afternoon" as const },
                  { label: "🌙 Ca tối (17:00 trở đi)", key: "evening" as const },
                ].map(({ label, key }, i, arr) => (
                  <div key={key} className={`flex justify-between text-[13px] py-2.5 ${i < arr.length - 1 ? "border-b border-gray-100" : ""}`}>
                    <span className="text-gray-500">{label}</span>
                    <span className={`font-bold ${key === "evening" ? "text-blue-600" : ""}`}>
                      {fmt(stats.revenueByShift[key].revenue)}{" "}
                      <span className="text-xs text-gray-400">({stats.revenueByShift[key].pct}%)</span>
                    </span>
                  </div>
                ))}
                <div className="mt-4">
                  <div className="text-xs text-gray-400 mb-1.5">Phân bổ doanh thu theo ca</div>
                  <div className="flex h-3 rounded-full overflow-hidden">
                    <div style={{ width: `${stats.revenueByShift.morning.pct}%` }} className="bg-blue-400" />
                    <div style={{ width: `${stats.revenueByShift.afternoon.pct}%` }} className="bg-blue-300" />
                    <div style={{ width: `${stats.revenueByShift.evening.pct}%` }} className="bg-blue-700" />
                  </div>
                  <div className="flex gap-4 mt-1.5">
                    <span className="text-[11px] text-gray-400">■ Sáng {stats.revenueByShift.morning.pct}%</span>
                    <span className="text-[11px] text-gray-400">■ Chiều {stats.revenueByShift.afternoon.pct}%</span>
                    <span className="text-[11px] text-gray-400">■ Tối {stats.revenueByShift.evening.pct}%</span>
                  </div>
                </div>
              </div>

              {/* Monthly Comparison */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="text-[15px] font-bold mb-4">So sánh 3 tháng gần nhất</div>
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      {["Tháng", "Doanh thu", "Số đơn", "Tăng trưởng"].map(h => (
                        <th key={h} className="pb-2 text-[11px] font-bold text-gray-400 text-left px-2.5">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {stats.monthlyComparison.map(row => (
                      <tr key={row.month} className={row.highlight ? "bg-blue-50" : ""}>
                        <td className={`py-2.5 px-2.5 text-sm ${row.highlight ? "font-bold" : ""}`}>{row.month}</td>
                        <td className={`py-2.5 px-2.5 text-sm text-right ${row.highlight ? "font-bold" : "font-semibold"}`}>{fmtShort(row.revenue)}</td>
                        <td className="py-2.5 px-2.5 text-sm text-right">{row.orders.toLocaleString("vi-VN")}</td>
                        <td className={`py-2.5 px-2.5 text-sm text-right font-bold ${row.up ? "text-emerald-600" : "text-red-500"}`}>
                          {row.growth === null ? "—" : (row.up ? "▲ " : "▼ ") + Math.abs(row.growth).toFixed(1) + "%"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  )
}

// ─── Donut SVG ────────────────────────────────────────────────────────────────

function DonutChart({ segments }: { segments: CategoryRevenue[] }) {
  const r = 50, cx = 60, cy = 60, circumference = 2 * Math.PI * r

  // Pre-compute offsets outside JSX to avoid mutating variables during render
  const items = segments.map((seg, i) => {
    const prevDash = segments
      .slice(0, i)
      .reduce((sum, s) => sum + (s.pct / 100) * circumference, 0)
    return { seg, dash: (seg.pct / 100) * circumference, offset: prevDash }
  })

  return (
    <svg width="120" height="120" viewBox="0 0 120 120" className="flex-shrink-0">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#E5E7EB" strokeWidth="20" />
      {items.map(({ seg, dash, offset }) => (
        <circle
          key={seg.name}
          cx={cx} cy={cy} r={r}
          fill="none"
          stroke={seg.color}
          strokeWidth="20"
          strokeDasharray={`${dash} ${circumference}`}
          strokeDashoffset={-offset}
          transform={`rotate(-90 ${cx} ${cy})`}
        />
      ))}
      <text x={cx} y={cy - 5} textAnchor="middle" fontSize="10" fontWeight="700" fill="#111827">Tổng</text>
      <text x={cx} y={cy + 9} textAnchor="middle" fontSize="10" fontWeight="700" fill="#111827">DT</text>
    </svg>
  )
}
