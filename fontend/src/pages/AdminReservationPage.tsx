import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { useAuthStore } from "../state/auth";

const NAV_ITEMS = [
    { icon: "📊", label: "Dashboard", href: "/admin/dashboard", section: "Tổng quan" },
    { icon: "🍽️", label: "Quản lý món ăn", href: "/admin/menu", section: "Quản lý" },
    { icon: "🪑", label: "Quản lý bàn", href: "/admin/tables", section: null },
    { icon: "👨‍💼", label: "Quản lý nhân viên", href: "/admin/staff", section: null },
    { icon: "📅", label: "Quản lý đặt bàn", href: "/admin/reservations", section: null, active: true },
    { icon: "📈", label: "Báo cáo doanh thu", href: "/admin/report", section: "Báo cáo" },
];

type ReservationStatus = "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";

interface Reservation {
    id: number;
    reservationTime: string;
    numberOfPeople: number;
    status: ReservationStatus;
    table: { id: number; tableNumber: number; capacity: number; type: string; status: string } | null;
    customer: { id: number; name: string; phone: string | null; email: string | null } | null;
    guestName: string | null;
    guestPhone: string | null;
}


const AVATAR_COLORS = [
    "bg-blue-500", "bg-emerald-500", "bg-amber-500", "bg-violet-500",
    "bg-red-500", "bg-cyan-500", "bg-pink-500", "bg-indigo-500",
];

function getAvatarColor(id: number) {
    return AVATAR_COLORS[id % AVATAR_COLORS.length];
}

function formatDate(iso: string) {
    const d = new Date(iso);
    return d.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function formatTime(iso: string) {
    const d = new Date(iso);
    return d.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
}

function getHour(iso: string) {
    return new Date(iso).getHours();
}

function toInputDate(iso: string) {
    return new Date(iso).toISOString().slice(0, 10);
}

const TAB_STATUSES: (ReservationStatus | "ALL")[] = ["ALL", "PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"];

export default function AdminReservationsPage() {
    const navigate = useNavigate();
    const { user, logout } = useAuthStore();
    const [showLogout, setShowLogout] = useState(false);

    const handleLogout = async () => {
        try { await api.post("/auth/logout"); } catch { /* ignore */ }
        logout();
        navigate("/login");
    };

    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);

    const [activeTab, setActiveTab] = useState(0);
    const [search, setSearch] = useState("");
    const [dateFilter, setDateFilter] = useState("");
    const [timeFilter, setTimeFilter] = useState("all");

    const [page, setPage] = useState(1);
    const PAGE_SIZE = 8;

    const [refreshKey, setRefreshKey] = useState(0);
    const refresh = () => setRefreshKey((k) => k + 1);

    useEffect(() => {
        let cancelled = false;
        const load = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await api.get("/reservations");
                if (!cancelled) setReservations(res.data.data as Reservation[]);
            } catch {
                if (!cancelled) setError("Không thể tải danh sách đặt bàn");
            } finally {
                if (!cancelled) setLoading(false);
            }
        };
        load();
        return () => { cancelled = true; };
    }, [refreshKey]);

    const handleConfirm = async (id: number) => {
        setActionLoading(id);
        try {
            await api.patch(`/reservations/${id}/confirm`);
            refresh();
        } catch (e: unknown) {
            const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message;
            alert(msg || "Lỗi khi duyệt đặt bàn");
        } finally {
            setActionLoading(null);
        }
    };

    const handleCancel = async (id: number) => {
        if (!confirm("Bạn có chắc muốn từ chối đặt bàn này?")) return;
        setActionLoading(id);
        try {
            await api.patch(`/reservations/${id}/cancel`);
            refresh();
        } catch (e: unknown) {
            const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message;
            alert(msg || "Lỗi khi từ chối đặt bàn");
        } finally {
            setActionLoading(null);
        }
    };

    const filtered = reservations.filter((r) => {
        const statusMatch =
            activeTab === 0 || r.status === TAB_STATUSES[activeTab];

        const name = r.customer?.name || r.guestName || "";
        const phone = r.customer?.phone || r.guestPhone || "";
        const searchMatch =
            !search ||
            name.toLowerCase().includes(search.toLowerCase()) ||
            phone.includes(search) ||
            String(r.id).includes(search);

        const dateMatch = !dateFilter || toInputDate(r.reservationTime) === dateFilter;

        const hour = getHour(r.reservationTime);
        const timeMatch =
            timeFilter === "all" ||
            (timeFilter === "morning" && hour >= 6 && hour < 10) ||
            (timeFilter === "lunch" && hour >= 10 && hour < 14) ||
            (timeFilter === "afternoon" && hour >= 14 && hour < 17) ||
            (timeFilter === "evening" && hour >= 17 && hour <= 23);

        return statusMatch && searchMatch && dateMatch && timeMatch;
    });

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const currentPage = Math.min(page, totalPages);
    const paged = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    const countByStatus = (s: ReservationStatus) => reservations.filter((r) => r.status === s).length;
    const pendingCount = countByStatus("PENDING");

    const tabCounts = [
        reservations.length,
        pendingCount,
        countByStatus("CONFIRMED"),
        countByStatus("COMPLETED"),
        countByStatus("CANCELLED"),
    ];

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
                                {item.active && pendingCount > 0 && (
                                    <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                                        {pendingCount}
                                    </span>
                                )}
                            </Link>
                        </div>
                    ))}
                </nav>
                <div className="p-4 border-t border-gray-200 relative">
                    {showLogout && (
                        <div className="absolute bottom-full left-4 right-4 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
                            <button
                                onClick={handleLogout}
                                className="w-full px-5 py-3 text-sm text-red-600 font-medium hover:bg-red-50 transition text-left flex items-center gap-2"
                            >
                                Đăng xuất
                            </button>
                        </div>
                    )}
                    <button
                        onClick={() => setShowLogout((v) => !v)}
                        className="flex items-center gap-2.5 w-full hover:bg-gray-50 rounded-lg p-1 -m-1 transition"
                    >
                        <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                            {user?.name?.charAt(0).toUpperCase() ?? "A"}
                        </div>
                        <div className="flex-1 text-left">
                            <div className="text-sm font-semibold">{user?.name ?? "Admin"}</div>
                            <div className="text-xs text-gray-400">Quản trị viên</div>
                        </div>
                        <span className="text-gray-400 text-xs">{showLogout ? "▲" : "▼"}</span>
                    </button>
                </div>
            </aside>

            {/* MAIN */}
            <div className="ml-60 flex-1">
                {/* TOPBAR */}
                <div className="bg-white border-b border-gray-200 px-7 h-15 flex items-center justify-between sticky top-0 z-40">
                    <div className="text-base font-bold">📅 Quản lý Đặt bàn</div>
                    <button
                        onClick={refresh}
                        className="px-3 py-2 bg-blue-50 text-blue-600 text-sm font-medium rounded-lg hover:bg-blue-100 transition"
                    >
                        ↻ Làm mới
                    </button>
                </div>

                <div className="p-7">
                    {/* STATS */}
                    <div className="grid grid-cols-5 gap-3 mb-6">
                        {[
                            { num: reservations.length, label: "Tổng cộng", color: "" },
                            { num: pendingCount, label: "Chờ duyệt", color: "text-amber-500" },
                            { num: countByStatus("CONFIRMED"), label: "Đã xác nhận", color: "text-green-500" },
                            { num: countByStatus("COMPLETED"), label: "Hoàn thành", color: "text-blue-600" },
                            { num: countByStatus("CANCELLED"), label: "Đã hủy", color: "text-red-500" },
                        ].map((s) => (
                            <div key={s.label} className="bg-white border border-gray-200 rounded-xl p-4">
                                {loading ? (
                                    <div className="h-8 w-12 bg-gray-100 rounded animate-pulse mb-1" />
                                ) : (
                                    <div className={`text-2xl font-bold mb-0.5 ${s.color}`}>{s.num}</div>
                                )}
                                <div className="text-xs text-gray-400">{s.label}</div>
                            </div>
                        ))}
                    </div>

                    {/* URGENT BANNER */}
                    {pendingCount > 0 && !loading && (
                        <div className="bg-amber-50 border border-amber-300 rounded-xl p-3 flex items-center gap-2.5 mb-4 text-sm text-amber-800">
                            ⚡ <span><strong>{pendingCount} đặt bàn mới</strong> đang chờ duyệt — Vui lòng xử lý sớm để khách hàng nhận được xác nhận.</span>
                        </div>
                    )}

                    {/* TOOLBAR */}
                    <div className="flex items-center gap-2.5 mb-4 flex-wrap">
                        <input
                            type="text"
                            placeholder="🔍 Tìm tên, SĐT, mã đặt bàn..."
                            className="flex-1 min-w-[200px] max-w-[280px] px-3.5 py-2.5 border-2 border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                        />
                        <input
                            type="date"
                            className="px-3.5 py-2.5 border-2 border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-blue-500"
                            value={dateFilter}
                            onChange={(e) => { setDateFilter(e.target.value); setPage(1); }}
                        />
                        {dateFilter && (
                            <button
                                onClick={() => { setDateFilter(""); setPage(1); }}
                                className="px-3 py-2.5 text-sm text-gray-500 hover:text-red-500 border-2 border-gray-200 rounded-lg transition"
                            >
                                ✕ Xóa ngày
                            </button>
                        )}
                        <select
                            className="px-3.5 py-2.5 border-2 border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-blue-500"
                            value={timeFilter}
                            onChange={(e) => { setTimeFilter(e.target.value); setPage(1); }}
                        >
                            <option value="all">Tất cả giờ</option>
                            <option value="morning">Buổi sáng (6:00–10:00)</option>
                            <option value="lunch">Buổi trưa (10:00–14:00)</option>
                            <option value="afternoon">Buổi chiều (14:00–17:00)</option>
                            <option value="evening">Buổi tối (17:00–23:00)</option>
                        </select>
                    </div>

                    {/* STATUS TABS */}
                    <div className="flex border-b-2 border-gray-200 mb-5">
                        {["Tất cả", "Chờ duyệt", "Đã xác nhận", "Hoàn thành", "Đã hủy"].map((label, i) => (
                            <button
                                key={label}
                                onClick={() => { setActiveTab(i); setPage(1); }}
                                className={`px-5 py-2.5 text-sm font-medium border-b-2 -mb-0.5 transition flex items-center gap-1.5 ${activeTab === i ? "text-blue-600 border-blue-600 font-bold" : "text-gray-400 border-transparent hover:text-gray-700"}`}
                            >
                                {label}
                                <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${activeTab === i ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-500"}`}>
                                    {tabCounts[i]}
                                </span>
                                {i === 1 && tabCounts[1] > 0 && <span className="text-red-500 text-xs">🔴</span>}
                            </button>
                        ))}
                    </div>

                    {/* TABLE */}
                    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                        {error && (
                            <div className="p-6 text-center text-red-500 text-sm">{error}</div>
                        )}

                        {loading && !error && (
                            <div className="p-10 text-center text-gray-400 text-sm">Đang tải dữ liệu...</div>
                        )}

                        {!loading && !error && (
                            <>
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50 border-b border-gray-200">
                                            {["Mã", "Khách hàng", "Ngày / Giờ", "Số người", "Bàn", "Trạng thái", "Thao tác"].map((h) => (
                                                <th key={h} className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wide">
                                                    {h}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {paged.length === 0 && (
                                            <tr>
                                                <td colSpan={7} className="px-4 py-10 text-center text-gray-400 text-sm">
                                                    Không có đặt bàn nào
                                                </td>
                                            </tr>
                                        )}
                                        {paged.map((r) => {
                                            const name = r.customer?.name || r.guestName || "—";
                                            const phone = r.customer?.phone || r.guestPhone || "—";
                                            const initial = name.trim().charAt(0);
                                            const isLoading = actionLoading === r.id;

                                            return (
                                                <tr
                                                    key={r.id}
                                                    className={`border-b border-gray-100 hover:bg-gray-50 transition ${r.status === "PENDING" ? "bg-amber-50/50" : ""}`}
                                                >
                                                    <td className="px-4 py-3">
                                                        <div className="font-bold text-sm">#{r.id}</div>
                                                        {r.status === "PENDING" && (
                                                            <div className="text-[11px] text-amber-600 font-bold">⏳ MỚI</div>
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <div className="flex items-center gap-2.5">
                                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm text-white flex-shrink-0 ${getAvatarColor(r.id)}`}>
                                                                {initial}
                                                            </div>
                                                            <div>
                                                                <div className="font-semibold text-sm">{name}</div>
                                                                <div className="text-xs text-gray-400">{phone}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <div className="font-bold text-sm">{formatDate(r.reservationTime)}</div>
                                                        <div className="text-xs text-gray-400">{formatTime(r.reservationTime)}</div>
                                                    </td>
                                                    <td className="px-4 py-3 text-sm">{r.numberOfPeople} người</td>
                                                    <td className="px-4 py-3 text-sm font-medium">
                                                        {r.table ? `Bàn ${r.table.tableNumber}` : "—"}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        {r.status === "PENDING" && (
                                                            <span className="inline-flex items-center px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-bold rounded-full">
                                                                ⏳ Chờ duyệt
                                                            </span>
                                                        )}
                                                        {r.status === "CONFIRMED" && (
                                                            <span className="inline-flex items-center px-2 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                                                                ✅ Đã duyệt
                                                            </span>
                                                        )}
                                                        {r.status === "COMPLETED" && (
                                                            <span className="inline-flex items-center px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">
                                                                ✓ Hoàn thành
                                                            </span>
                                                        )}
                                                        {r.status === "CANCELLED" && (
                                                            <span className="inline-flex items-center px-2 py-0.5 bg-red-100 text-red-600 text-xs font-bold rounded-full">
                                                                ✕ Đã hủy
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        {r.status === "PENDING" ? (
                                                            <div className="flex gap-1.5">
                                                                <button
                                                                    disabled={isLoading}
                                                                    onClick={() => handleConfirm(r.id)}
                                                                    className="px-3 py-1.5 bg-green-100 text-green-800 text-xs font-bold rounded-lg hover:bg-green-200 transition disabled:opacity-50"
                                                                >
                                                                    {isLoading ? "..." : "✓ Duyệt"}
                                                                </button>
                                                                <button
                                                                    disabled={isLoading}
                                                                    onClick={() => handleCancel(r.id)}
                                                                    className="px-3 py-1.5 bg-red-100 text-red-700 text-xs font-bold rounded-lg hover:bg-red-200 transition disabled:opacity-50"
                                                                >
                                                                    {isLoading ? "..." : "✕ Từ chối"}
                                                                </button>
                                                            </div>
                                                        ) : r.status === "CONFIRMED" ? (
                                                            <button
                                                                disabled={isLoading}
                                                                onClick={() => handleCancel(r.id)}
                                                                className="px-3 py-1.5 bg-red-50 text-red-600 text-xs font-bold rounded-lg hover:bg-red-100 transition disabled:opacity-50"
                                                            >
                                                                {isLoading ? "..." : "✕ Hủy"}
                                                            </button>
                                                        ) : (
                                                            <span className="text-xs text-gray-300">—</span>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>

                                {/* PAGINATION */}
                                <div className="flex items-center justify-between px-5 py-3.5 border-t border-gray-200">
                                    <div className="text-sm text-gray-400">
                                        Hiển thị {filtered.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, filtered.length)} / {filtered.length} đặt bàn
                                    </div>
                                    <div className="flex gap-1">
                                        <button
                                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                                            disabled={currentPage === 1}
                                            className="w-8 h-8 border-2 rounded-lg text-sm font-medium flex items-center justify-center transition bg-white border-gray-200 hover:border-blue-400 hover:text-blue-600 disabled:opacity-40"
                                        >
                                            ‹
                                        </button>
                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                                            <button
                                                key={p}
                                                onClick={() => setPage(p)}
                                                className={`w-8 h-8 border-2 rounded-lg text-sm font-medium flex items-center justify-center transition ${p === currentPage ? "bg-blue-600 text-white border-blue-600" : "bg-white border-gray-200 hover:border-blue-400 hover:text-blue-600"}`}
                                            >
                                                {p}
                                            </button>
                                        ))}
                                        <button
                                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                            disabled={currentPage === totalPages}
                                            className="w-8 h-8 border-2 rounded-lg text-sm font-medium flex items-center justify-center transition bg-white border-gray-200 hover:border-blue-400 hover:text-blue-600 disabled:opacity-40"
                                        >
                                            ›
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
