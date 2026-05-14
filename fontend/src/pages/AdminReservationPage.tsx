import { useState } from "react";
import { Link } from "react-router-dom";

const NAV_ITEMS = [
    { icon: "📊", label: "Dashboard", href: "/admin/dashboard", section: "Tổng quan" },
    { icon: "🍽️", label: "Quản lý món ăn", href: "/admin/menu", section: "Quản lý" },
    { icon: "🪑", label: "Quản lý bàn", href: "/admin/tables", section: null },
    { icon: "👨‍💼", label: "Quản lý nhân viên", href: "/admin/staff", section: null },
    { icon: "📅", label: "Quản lý đặt bàn", href: "/admin/reservations", section: null, badge: 3, active: true },
    { icon: "📈", label: "Báo cáo doanh thu", href: "/admin/report", section: "Báo cáo" },
];

const STATS = [
    { num: 24, label: "Tổng hôm nay", color: "" },
    { num: 3, label: "Chờ duyệt", color: "text-amber-500" },
    { num: 15, label: "Đã xác nhận", color: "text-green-500" },
    { num: 5, label: "Hoàn thành", color: "text-blue-600" },
    { num: 1, label: "Đã hủy", color: "text-red-500" },
];

const STATUS_TABS = [
    { label: "Tất cả", count: 24 },
    { label: "Chờ duyệt", count: 3, urgent: true },
    { label: "Đã xác nhận", count: 15 },
    { label: "Hoàn thành", count: 5 },
    { label: "Đã hủy", count: 1 },
];

const RESERVATIONS = [
    { id: "RES-0089", name: "Nguyễn Thị Lan", phone: "0901 234 567", avatarBg: "bg-blue-500", initial: "N", date: "25/12/2024", time: "18:00", guests: 4, table: "Bàn 03", note: "Sinh nhật bé gái", bookedAt: "20/12 · 14:32", status: "pending" },
    { id: "RES-0090", name: "Trần Văn Minh", phone: "0912 345 678", avatarBg: "bg-emerald-500", initial: "T", date: "25/12/2024", time: "19:30", guests: 2, table: "Bàn 01", note: "—", bookedAt: "21/12 · 09:15", status: "pending" },
    { id: "RES-0091", name: "Lê Quốc Bảo", phone: "0923 456 789", avatarBg: "bg-amber-500", initial: "L", date: "26/12/2024", time: "12:00", guests: 6, table: "Bàn 05", note: "Họp gia đình", bookedAt: "22/12 · 20:40", status: "pending" },
    { id: "RES-0085", name: "Phạm Quỳnh Anh", phone: "0934 567 890", avatarBg: "bg-violet-500", initial: "P", date: "25/12/2024", time: "12:00", guests: 4, table: "Bàn 04", note: "—", bookedAt: "18/12 · 16:30", status: "confirmed" },
    { id: "RES-0082", name: "Hoàng Thị Thu", phone: "0945 678 901", avatarBg: "bg-red-500", initial: "H", date: "24/12/2024", time: "19:00", guests: 3, table: "Bàn 02", note: "—", bookedAt: "15/12 · 11:20", status: "completed" },
];

export default function AdminReservationsPage() {
    const [activeTab, setActiveTab] = useState(1);
    const [search, setSearch] = useState("");

    return (
        <div className="flex min-h-screen bg-gray-100 font-sans">
            {/* SIDEBAR */}
            <aside className="w-60 bg-white border-r border-gray-200 fixed top-0 left-0 bottom-0 flex flex-col z-50">
                <div className="px-5 py-5 border-b border-gray-200">
                    <div className="font-sans text-xl font-bold text-blue-600">🍜 Việt Bếp</div>
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-0.5">Admin Panel</div>
                </div>
                <nav className="flex-1 py-3 overflow-y-auto">
                    {NAV_ITEMS.map((item) => (
                        <div key={item.href}>
                            {item.section && (
                                <div className="px-4 pt-4 pb-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                    {item.section}
                                </div>
                            )}
                            <Link
                                to={item.href}
                                className={`flex items-center gap-2.5 px-4 py-2.5 mx-2 rounded-lg text-sm font-medium transition ${item.active ? "bg-blue-50 text-blue-600 font-semibold" : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"}`}
                            >
                                <span>{item.icon}</span>
                                <span className="flex-1">{item.label}</span>
                                {item.badge && (
                                    <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                                        {item.badge}
                                    </span>
                                )}
                            </Link>
                        </div>
                    ))}
                </nav>
                <div className="p-4 border-t border-gray-200">
                    <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">A</div>
                        <div>
                            <div className="text-sm font-semibold">Admin Chính</div>
                            <div className="text-xs text-gray-400">Quản trị viên</div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* MAIN */}
            <div className="ml-60 flex-1">
                {/* TOPBAR */}
                <div className="bg-white border-b border-gray-200 px-7 h-15 flex items-center justify-between sticky top-0 z-40">
                    <div className="text-base font-bold">📅 Quản lý Đặt bàn</div>
                    <div className="flex gap-2">
                        <input type="date" defaultValue="2024-12-25" className="px-3 py-2 border-2 border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500" />
                        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition">
                            📥 Xuất Excel
                        </button>
                    </div>
                </div>

                <div className="p-7">
                    {/* STATS */}
                    <div className="grid grid-cols-5 gap-3 mb-6">
                        {STATS.map((s) => (
                            <div key={s.label} className="bg-white border border-gray-200 rounded-xl p-4">
                                <div className={`text-2xl font-bold mb-0.5 ${s.color}`}>{s.num}</div>
                                <div className="text-xs text-gray-400">{s.label}</div>
                            </div>
                        ))}
                    </div>

                    {/* URGENT BANNER */}
                    <div className="bg-amber-50 border border-amber-300 rounded-xl p-3 flex items-center gap-2.5 mb-4 text-sm text-amber-800">
                        ⚡ <span><strong>3 đặt bàn mới</strong> đang chờ duyệt — Vui lòng xử lý sớm để khách hàng nhận được xác nhận.</span>
                    </div>

                    {/* TOOLBAR */}
                    <div className="flex items-center gap-2.5 mb-4 flex-wrap">
                        <input
                            type="text"
                            placeholder="🔍 Tìm tên, SĐT, mã đặt bàn..."
                            className="flex-1 min-w-[200px] max-w-[280px] px-3.5 py-2.5 border-2 border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <select className="px-3.5 py-2.5 border-2 border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-blue-500">
                            <option>Hôm nay (25/12)</option>
                            <option>Ngày mai</option>
                            <option>Tuần này</option>
                            <option>Tháng này</option>
                        </select>
                        <select className="px-3.5 py-2.5 border-2 border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-blue-500">
                            <option>Tất cả giờ</option>
                            <option>Buổi trưa (10:00–14:00)</option>
                            <option>Buổi chiều (14:00–17:00)</option>
                            <option>Buổi tối (17:00–22:00)</option>
                        </select>
                    </div>

                    {/* STATUS TABS */}
                    <div className="flex border-b-2 border-gray-200 mb-5">
                        {STATUS_TABS.map((tab, i) => (
                            <button
                                key={tab.label}
                                onClick={() => setActiveTab(i)}
                                className={`px-5 py-2.5 text-sm font-medium border-b-2 -mb-0.5 transition ${activeTab === i ? "text-blue-600 border-blue-600 font-bold" : "text-gray-400 border-transparent hover:text-gray-700"}`}
                            >
                                {tab.label} ({tab.count}){tab.urgent ? " 🔴" : ""}
                            </button>
                        ))}
                    </div>

                    {/* TABLE */}
                    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200">
                                    {["Mã đặt bàn", "Khách hàng", "Ngày / Giờ", "Số người", "Bàn", "Ghi chú", "Đặt lúc", "Thao tác"].map((h) => (
                                        <th key={h} className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wide">
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {RESERVATIONS.map((r) => (
                                    <tr key={r.id} className={`border-b border-gray-100 hover:bg-gray-50 transition ${r.status === "pending" ? "bg-amber-50/50" : ""}`}>
                                        <td className="px-4 py-3">
                                            <div className="font-bold text-sm">#{r.id}</div>
                                            {r.status === "pending" && (
                                                <div className="text-[11px] text-amber-600 font-bold">⏳ MỚI</div>
                                            )}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2.5">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm text-white flex-shrink-0 ${r.avatarBg}`}>
                                                    {r.initial}
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-sm">{r.name}</div>
                                                    <div className="text-xs text-gray-400">{r.phone}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="font-bold text-sm">{r.date}</div>
                                            <div className="text-xs text-gray-400">{r.time}</div>
                                        </td>
                                        <td className="px-4 py-3 text-sm">{r.guests} người</td>
                                        <td className="px-4 py-3 text-sm font-medium">{r.table}</td>
                                        <td className="px-4 py-3 text-xs text-gray-400 max-w-[140px]">{r.note}</td>
                                        <td className="px-4 py-3 text-xs text-gray-400">{r.bookedAt}</td>
                                        <td className="px-4 py-3">
                                            {r.status === "pending" ? (
                                                <div className="flex gap-1.5">
                                                    <button className="px-3 py-1.5 bg-green-100 text-green-800 text-xs font-bold rounded-lg hover:bg-green-200 transition">
                                                        ✓ Duyệt
                                                    </button>
                                                    <button className="px-3 py-1.5 bg-red-100 text-red-700 text-xs font-bold rounded-lg hover:bg-red-200 transition">
                                                        ✕ Từ chối
                                                    </button>
                                                </div>
                                            ) : r.status === "confirmed" ? (
                                                <span className="inline-flex items-center px-2.5 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-full">
                                                    ✅ Đã duyệt
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2.5 py-1 bg-gray-100 text-gray-700 text-xs font-bold rounded-full">
                                                    ✓ Hoàn thành
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* PAGINATION */}
                        <div className="flex items-center justify-between px-5 py-3.5 border-t border-gray-200">
                            <div className="text-sm text-gray-400">Hiển thị 1–5 / 24 đặt bàn</div>
                            <div className="flex gap-1">
                                {["‹", "1", "2", "3", "›"].map((p, i) => (
                                    <button
                                        key={i}
                                        className={`w-8 h-8 border-2 rounded-lg text-sm font-medium flex items-center justify-center transition ${p === "1" ? "bg-blue-600 text-white border-blue-600" : "bg-white border-gray-200 hover:border-blue-400 hover:text-blue-600"}`}
                                    >
                                        {p}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}