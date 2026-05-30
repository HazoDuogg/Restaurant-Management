import { useState, useEffect, type FormEvent } from "react"
import AdminLayout from "../components/AdminLayout"
import { api } from "../lib/api"

type OrderItem = {
  quantity: number
  unitPrice: number
  subtotal: number
  menuItem: { id: number; name: string; price: number } | null
}

type Order = {
  id: number
  orderTime: string
  status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED"
  totalAmount: number
  table: { id: number; tableNumber: number } | null
  items: OrderItem[]
}

type Invoice = {
  id: number
  createdTime: string
  finalAmount: number
  status: "PENDING" | "PAID" | "CANCELLED"
}

type Reservation = {
  id: number
  reservationTime: string
  numberOfPeople: number
  status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED"
  table: { id: number; tableNumber: number } | null
  customer: { id: number; name: string; phone: string | null } | null
  guestName: string | null
  guestPhone: string | null
}

type Table = {
  id: number
  tableNumber: number
  capacity: number
  status: "AVAILABLE" | "OCCUPIED" | "RESERVED"
}

function isSameDay(dateStr: string, target: Date): boolean {
  const d = new Date(dateStr)
  return (
    d.getFullYear() === target.getFullYear() &&
    d.getMonth() === target.getMonth() &&
    d.getDate() === target.getDate()
  )
}

function formatMoney(amount: number): string {
  return new Intl.NumberFormat("vi-VN").format(Math.round(amount)) + "đ"
}

function formatChartLabel(amount: number): string {
  if (amount >= 1_000_000) return (amount / 1_000_000).toFixed(0) + "tr"
  if (amount >= 1_000) return (amount / 1_000).toFixed(0) + "k"
  return amount.toFixed(0)
}

const VI_DAYS = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"]
const MAX_BAR_PX = 150

const now = new Date()
const todayISO = now.toISOString().slice(0, 10)
const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10)

export default function AdminDashboardPage() {
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ from_date: firstOfMonth, to_date: todayISO })
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  const [orders, setOrders] = useState<Order[]>([])
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [tables, setTables] = useState<Table[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get("/orders"),
      api.get("/invoices"),
      api.get("/reservations"),
      api.get("/tables"),
    ]).then(([ordersRes, invoicesRes, reservationsRes, tablesRes]) => {
      setOrders(ordersRes.data.data ?? [])
      setInvoices(invoicesRes.data.data ?? [])
      setReservations(reservationsRes.data.data ?? [])
      setTables(tablesRes.data.data ?? [])
    }).catch(err => {
      console.error("Lỗi khi lấy dữ liệu dashboard", err)
    }).finally(() => setLoading(false))
  }, [])

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitting(true)
    try {
      await api.post("/reports/generate", { fromDate: form.from_date, toDate: form.to_date })
      setSuccess(true)
      setTimeout(() => {
        setShowModal(false)
        setSuccess(false)
        setForm({ from_date: firstOfMonth, to_date: todayISO })
      }, 1200)
    } finally {
      setSubmitting(false)
    }
  }

  async function handleConfirmReservation(id: number) {
    try {
      await api.patch(`/reservations/${id}/confirm`)
      setReservations(prev => prev.map(r => r.id === id ? { ...r, status: "CONFIRMED" as const } : r))
    } catch (err) {
      console.error("Lỗi xác nhận đặt bàn", err)
    }
  }

  async function handleCancelReservation(id: number) {
    try {
      await api.patch(`/reservations/${id}/cancel`)
      setReservations(prev => prev.map(r => r.id === id ? { ...r, status: "CANCELLED" as const } : r))
    } catch (err) {
      console.error("Lỗi hủy đặt bàn", err)
    }
  }

  // === Tính toán số liệu ===
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(today.getDate() - 1)

  const paidToday = invoices.filter(inv => inv.status === "PAID" && isSameDay(inv.createdTime, today))
  const paidYesterday = invoices.filter(inv => inv.status === "PAID" && isSameDay(inv.createdTime, yesterday))
  const todayRevenue = paidToday.reduce((s, inv) => s + inv.finalAmount, 0)
  const yesterdayRevenue = paidYesterday.reduce((s, inv) => s + inv.finalAmount, 0)

  const todayOrders = orders.filter(o => isSameDay(o.orderTime, today))
  const yesterdayOrders = orders.filter(o => isSameDay(o.orderTime, yesterday))

  const todayReservations = reservations.filter(r => isSameDay(r.reservationTime, today))
  const yesterdayReservations = reservations.filter(r => isSameDay(r.reservationTime, yesterday))

  const occupiedTables = tables.filter(t => t.status === "OCCUPIED").length
  const totalTables = tables.length

  const revenueChangePct = yesterdayRevenue === 0
    ? (todayRevenue > 0 ? 100 : 0)
    : Math.round((todayRevenue - yesterdayRevenue) / yesterdayRevenue * 100)
  const orderChange = todayOrders.length - yesterdayOrders.length
  const reservationChange = todayReservations.length - yesterdayReservations.length

  // Biểu đồ 7 ngày gần đây
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today)
    d.setDate(today.getDate() - (6 - i))
    return d
  })
  const weekRevenues = last7Days.map(day =>
    invoices.filter(inv => inv.status === "PAID" && isSameDay(inv.createdTime, day))
      .reduce((s, inv) => s + inv.finalAmount, 0)
  )
  const maxWeekRevenue = Math.max(1, ...weekRevenues)
  const chartBars = last7Days.map((day, i) => ({
    day: VI_DAYS[day.getDay()],
    revenue: weekRevenues[i],
    pct: Math.round((weekRevenues[i] / maxWeekRevenue) * 100),
    weekend: day.getDay() === 0 || day.getDay() === 6,
  }))
  const yLabels = [
    formatChartLabel(maxWeekRevenue),
    formatChartLabel(maxWeekRevenue * 0.75),
    formatChartLabel(maxWeekRevenue * 0.5),
    formatChartLabel(maxWeekRevenue * 0.25),
    "0",
  ]

  // Đơn hàng gần đây
  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.orderTime).getTime() - new Date(a.orderTime).getTime())
    .slice(0, 5)

  // Top món ăn hôm nay
  const itemMap = new Map<number, { name: string; count: number; revenue: number }>()
  todayOrders.forEach(order => {
    (order.items ?? []).forEach(item => {
      if (!item.menuItem) return
      const ex = itemMap.get(item.menuItem.id)
      if (ex) {
        ex.count += item.quantity
        ex.revenue += item.subtotal
      } else {
        itemMap.set(item.menuItem.id, { name: item.menuItem.name, count: item.quantity, revenue: item.subtotal })
      }
    })
  })
  const topMenu = [...itemMap.values()].sort((a, b) => b.count - a.count).slice(0, 4)
  const maxTopCount = Math.max(1, ...topMenu.map(i => i.count))

  // Đặt bàn chờ duyệt
  const pendingReservations = reservations.filter(r => r.status === "PENDING")

  // Chuỗi ngày hiện tại
  const todayStr = today.toLocaleDateString("vi-VN", { weekday: "long", day: "2-digit", month: "2-digit", year: "numeric" })
  const monthYearStr = today.toLocaleDateString("vi-VN", { month: "long", year: "numeric" })

  return (
    <>
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-7">
            <div className="flex items-center justify-between mb-5">
              <div className="text-[17px] font-bold">Tạo báo cáo mới</div>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-700 text-xl leading-none">✕</button>
            </div>
            {success ? (
              <div className="flex flex-col items-center py-6 gap-3">
                <div className="text-4xl">✅</div>
                <div className="text-[15px] font-semibold text-emerald-600">Tạo báo cáo thành công!</div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="block text-[13px] font-semibold text-gray-600 mb-1.5">
                    Từ ngày <span className="text-red-500">*</span>
                  </label>
                  <input type="date" name="from_date" value={form.from_date} onChange={handleChange} required
                    className="w-full px-3 py-2.5 border-[1.5px] border-gray-200 rounded-lg text-[13px] outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-[13px] font-semibold text-gray-600 mb-1.5">
                    Đến ngày <span className="text-red-500">*</span>
                  </label>
                  <input type="date" name="to_date" value={form.to_date} onChange={handleChange} required min={form.from_date}
                    className="w-full px-3 py-2.5 border-[1.5px] border-gray-200 rounded-lg text-[13px] outline-none focus:border-blue-500" />
                </div>
                <div className="flex gap-2 pt-1">
                  <button type="button" onClick={() => setShowModal(false)}
                    className="flex-1 py-2.5 border-[1.5px] border-gray-200 rounded-lg text-[13px] font-semibold text-gray-600 hover:bg-gray-50">
                    Hủy
                  </button>
                  <button type="submit" disabled={submitting}
                    className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white rounded-lg text-[13px] font-semibold transition">
                    {submitting ? "Đang tạo..." : "Tạo báo cáo"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      <AdminLayout
        title="🏠 Dashboard"
        topbarRight={
          <>
            <span className="text-sm text-gray-500">Hôm nay: {todayStr}</span>
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[13px] font-semibold transition"
            >
              + Tạo báo cáo
            </button>
          </>
        }
      >
        <div className="p-7">
          {loading ? (
            <div className="flex items-center justify-center h-64 text-gray-400 text-sm">Đang tải dữ liệu...</div>
          ) : (
            <>
              {/* Stat cards */}
              <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="bg-white border border-gray-200 rounded-xl px-5 py-5">
                  <div className="text-[22px] mb-3">💰</div>
                  <div className="text-[13px] text-gray-500 mb-1">Doanh thu hôm nay</div>
                  <div className="text-[22px] font-bold leading-tight">{formatMoney(todayRevenue)}</div>
                  <div className={`text-xs mt-1.5 ${revenueChangePct >= 0 ? "text-emerald-500" : "text-red-500"}`}>
                    {revenueChangePct >= 0 ? "▲" : "▼"} {Math.abs(revenueChangePct)}% so với hôm qua
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl px-5 py-5">
                  <div className="text-[22px] mb-3">📦</div>
                  <div className="text-[13px] text-gray-500 mb-1">Đơn hàng hôm nay</div>
                  <div className="text-[26px] font-bold">{todayOrders.length}</div>
                  <div className={`text-xs mt-1.5 ${orderChange >= 0 ? "text-emerald-500" : "text-red-500"}`}>
                    {orderChange >= 0 ? "▲" : "▼"} {Math.abs(orderChange)} đơn so với hôm qua
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl px-5 py-5">
                  <div className="text-[22px] mb-3">📋</div>
                  <div className="text-[13px] text-gray-500 mb-1">Đặt bàn hôm nay</div>
                  <div className="text-[26px] font-bold">{todayReservations.length}</div>
                  <div className={`text-xs mt-1.5 ${reservationChange >= 0 ? "text-emerald-500" : "text-red-500"}`}>
                    {reservationChange >= 0 ? "▲" : "▼"} {Math.abs(reservationChange)} so với hôm qua
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl px-5 py-5">
                  <div className="text-[22px] mb-3">🪑</div>
                  <div className="text-[13px] text-gray-500 mb-1">Bàn đang phục vụ</div>
                  <div className="text-[26px] font-bold">{occupiedTables}/{totalTables}</div>
                  <div className="text-xs mt-1.5 text-gray-400">
                    {totalTables > 0 ? Math.round(occupiedTables / totalTables * 100) : 0}% công suất
                  </div>
                </div>
              </div>

              {/* Chart doanh thu 7 ngày */}
              <div className="bg-white border border-gray-200 rounded-xl p-6 mb-4">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <div className="text-[15px] font-bold">Doanh thu 7 ngày gần đây</div>
                    <div className="text-xs text-gray-400 mt-0.5">{monthYearStr}</div>
                  </div>
                </div>

                <div className="flex gap-3" style={{ height: 200 }}>
                  <div className="flex flex-col justify-between flex-shrink-0 pb-5">
                    {yLabels.map((l, i) => (
                      <span key={i} className="text-[10px] text-gray-400">{l}</span>
                    ))}
                  </div>
                  <div className="flex-1 flex items-end gap-2 border-l border-b border-gray-200 px-2" style={{ height: 180 }}>
                    {chartBars.map((d, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        <div
                          className="w-full rounded-t cursor-pointer hover:opacity-80 transition-opacity"
                          style={{
                            height: Math.max(2, Math.round((d.pct / 100) * MAX_BAR_PX)),
                            background: d.weekend ? "#F59E0B" : "#2563EB",
                          }}
                          title={formatMoney(d.revenue)}
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

              {/* 2 cột: đơn hàng gần đây + top món ăn */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                  <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
                    <div className="text-[15px] font-bold">Đơn hàng gần đây</div>
                    <a href="/staff/tables" className="text-[13px] text-blue-600 font-medium hover:underline">Xem tất cả →</a>
                  </div>
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-50">
                        {["Bàn", "Tổng tiền", "Trạng thái"].map((h) => (
                          <th key={h} className="px-4 py-2.5 text-left text-xs font-bold text-gray-400 uppercase tracking-wide border-b border-gray-200">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.length === 0 ? (
                        <tr><td colSpan={3} className="px-4 py-6 text-center text-sm text-gray-400">Chưa có đơn hàng</td></tr>
                      ) : recentOrders.map((o) => (
                        <tr key={o.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 border-b border-gray-100">
                            <div className="text-sm font-semibold">Bàn {o.table?.tableNumber ?? "?"}</div>
                            <div className="text-xs text-gray-400">
                              {(o.items?.length ?? 0)} món · {new Date(o.orderTime).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm font-bold border-b border-gray-100">{formatMoney(o.totalAmount)}</td>
                          <td className="px-4 py-3 border-b border-gray-100">
                            {o.status === "COMPLETED" ? (
                              <span className="inline-flex px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">Đã thanh toán</span>
                            ) : o.status === "CANCELLED" ? (
                              <span className="inline-flex px-2.5 py-1 rounded-full text-[11px] font-bold bg-gray-100 text-gray-500">Đã hủy</span>
                            ) : (
                              <span className="inline-flex px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800">Đang phục vụ</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                  <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
                    <div className="text-[15px] font-bold">Top món ăn hôm nay</div>
                    <a href="/admin/report" className="text-[13px] text-blue-600 font-medium hover:underline">Chi tiết →</a>
                  </div>
                  {topMenu.length === 0 ? (
                    <div className="px-5 py-6 text-center text-sm text-gray-400">Chưa có đơn hàng hôm nay</div>
                  ) : topMenu.map((item, idx) => (
                    <div key={item.name} className="flex items-center px-5 py-3 border-b border-gray-100 last:border-0">
                      <div className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 text-xs font-bold flex items-center justify-center flex-shrink-0">
                        {idx + 1}
                      </div>
                      <div className="flex-1 mx-3">
                        <div className="text-sm font-semibold">{item.name}</div>
                        <div className="text-xs text-gray-400">{item.count} phần đã bán</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-blue-600">{formatMoney(item.revenue)}</div>
                        <div className="w-20 h-1.5 bg-gray-200 rounded-full overflow-hidden mt-1">
                          <div className="h-full bg-blue-600 rounded-full" style={{ width: `${Math.round(item.count / maxTopCount * 100)}%` }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Đặt bàn chờ duyệt */}
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
                  <div className="flex items-center gap-2 text-[15px] font-bold">
                    Đặt bàn chờ duyệt
                    {pendingReservations.length > 0 && (
                      <span className="bg-red-100 text-red-800 text-[11px] font-bold px-2 py-0.5 rounded-full ml-2">
                        {pendingReservations.length} mới
                      </span>
                    )}
                  </div>
                  <a href="/admin/reservations" className="text-[13px] text-blue-600 font-medium hover:underline">Xem tất cả →</a>
                </div>
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      {["Khách hàng", "Ngày/Giờ", "Số người", "Bàn", "Thao tác"].map((h) => (
                        <th key={h} className="px-4 py-2.5 text-left text-xs font-bold text-gray-400 uppercase tracking-wide border-b border-gray-200">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {pendingReservations.length === 0 ? (
                      <tr><td colSpan={5} className="px-4 py-6 text-center text-sm text-gray-400">Không có đặt bàn chờ duyệt</td></tr>
                    ) : pendingReservations.map((r) => {
                      const name = r.customer?.name ?? r.guestName ?? "Khách"
                      const phone = r.customer?.phone ?? r.guestPhone ?? "—"
                      const dt = new Date(r.reservationTime)
                      const dateStr = dt.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" })
                      const timeStr = dt.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })
                      return (
                        <tr key={r.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 border-b border-gray-100">
                            <div className="text-sm font-semibold">{name}</div>
                            <div className="text-xs text-gray-400">{phone}</div>
                          </td>
                          <td className="px-4 py-3 text-sm border-b border-gray-100">{dateStr} · {timeStr}</td>
                          <td className="px-4 py-3 text-sm border-b border-gray-100">{r.numberOfPeople} người</td>
                          <td className="px-4 py-3 text-sm border-b border-gray-100">
                            {r.table ? `Bàn ${r.table.tableNumber}` : "—"}
                          </td>
                          <td className="px-4 py-3 border-b border-gray-100">
                            <div className="flex gap-1.5">
                              <button
                                onClick={() => handleConfirmReservation(r.id)}
                                className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-md cursor-pointer border-none hover:bg-emerald-200"
                              >
                                ✓ Duyệt
                              </button>
                              <button
                                onClick={() => handleCancelReservation(r.id)}
                                className="px-3 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded-md cursor-pointer border-none hover:bg-red-200"
                              >
                                ✕ Từ chối
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </AdminLayout>
    </>
  )
}
