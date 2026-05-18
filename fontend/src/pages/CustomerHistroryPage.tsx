import { useEffect, useRef, useState } from "react";
import { useAuthStore } from "../state/auth";
import { api } from "../lib/api";

type ReservationStatus = "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";

type ReservationData = {
    id: number;
    reservationTime: string;
    numberOfPeople: number;
    status: ReservationStatus;
    table: { id: number; tableNumber: number; capacity: number } | null;
    guestName: string | null;
    guestPhone: string | null;
};

type EditForm = {
    date: string;
    time: string;
    numberOfPeople: string;
};

const statusConfig: Record<ReservationStatus, { label: string; bg: string; text: string }> = {
    PENDING: { label: "⏳ Chờ xác nhận", bg: "bg-amber-100", text: "text-amber-800" },
    CONFIRMED: { label: "✅ Đã xác nhận", bg: "bg-green-100", text: "text-green-800" },
    COMPLETED: { label: "✓ Hoàn thành", bg: "bg-gray-100", text: "text-gray-700" },
    CANCELLED: { label: "✕ Đã hủy", bg: "bg-red-100", text: "text-red-700" },
};

const WEEKDAYS = ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"];

function formatDate(iso: string) {
    const d = new Date(iso);
    return `${WEEKDAYS[d.getDay()]}, ${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
}

function formatTime(iso: string) {
    const d = new Date(iso);
    return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

function toLocalDateString(iso: string) {
    const d = new Date(iso);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export default function CustomerHistoryPage() {
    const [reservations, setReservations] = useState<ReservationData[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState<"all" | ReservationStatus>("all");
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const [editingItem, setEditingItem] = useState<ReservationData | null>(null);
    const [editForm, setEditForm] = useState<EditForm>({ date: "", time: "", numberOfPeople: "" });
    const [editError, setEditError] = useState<string | null>(null);
    const [editLoading, setEditLoading] = useState(false);

    const user = useAuthStore((e) => e.user);
    const logout = useAuthStore((e) => e.logout);

    function isCancelDisable(reservationTime: string) {
        const currentTime = new Date();
        const bookingTime = new Date(reservationTime);
        const hours = currentTime.getTime() - bookingTime.getTime();
        const diffHours = hours / (1000 * 60 * 60);
        return diffHours < 1;
    }

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    useEffect(() => {
        if (!user) return;
        api.get(`/reservations/customer/${user.id}`)
            .then((res) => setReservations(res.data.data ?? []))
            .finally(() => setLoading(false));
    }, [user]);

    function handleOpenEdit(r: ReservationData) {
        setEditingItem(r);
        setEditForm({
            date: toLocalDateString(r.reservationTime),
            time: formatTime(r.reservationTime),
            numberOfPeople: String(r.numberOfPeople),
        });
        setEditError(null);
    }

    async function handleEditSubmit() {
        if (!editingItem) return;
        const reservationTime = `${editForm.date}T${editForm.time}:00`;
        const numberOfPeople = Number(editForm.numberOfPeople);
        if (!editForm.date || !editForm.time || !numberOfPeople) {
            setEditError("Vui lòng nhập đầy đủ thông tin.");
            return;
        }
        setEditLoading(true);
        setEditError(null);
        try {
            await api.patch(`/reservations/${editingItem.id}`, { reservationTime, numberOfPeople });
            setReservations((prev) =>
                prev.map((r) =>
                    r.id === editingItem.id
                        ? { ...r, reservationTime, numberOfPeople }
                        : r
                )
            );
            setEditingItem(null);
        } catch (err) {
            const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
            setEditError(msg ?? "Cập nhật thất bại. Vui lòng thử lại.");
        } finally {
            setEditLoading(false);
        }
    }

    async function handleCancel(id: number) {
        if (!confirm("Bạn có chắc muốn hủy đặt bàn này không?")) return;
        try {
            await api.patch(`/reservations/${id}/cancel`);
            setReservations((prev) =>
                prev.map((r) => r.id === id ? { ...r, status: "CANCELLED" } : r)
            );
        } catch {
            alert("Hủy đặt bàn thất bại. Vui lòng thử lại.");
        }
    }

    const counts = {
        all: reservations.length,
        PENDING: reservations.filter((r) => r.status === "PENDING").length,
        CONFIRMED: reservations.filter((r) => r.status === "CONFIRMED").length,
        COMPLETED: reservations.filter((r) => r.status === "COMPLETED").length,
        CANCELLED: reservations.filter((r) => r.status === "CANCELLED").length,
    };

    const filters: { key: "all" | ReservationStatus; label: string }[] = [
        { key: "all", label: `Tất cả (${counts.all})` },
        { key: "PENDING", label: `Chờ xác nhận (${counts.PENDING})` },
        { key: "CONFIRMED", label: `Đã xác nhận (${counts.CONFIRMED})` },
        { key: "COMPLETED", label: `Hoàn thành (${counts.COMPLETED})` },
        { key: "CANCELLED", label: `Đã hủy (${counts.CANCELLED})` },
    ];

    const filtered = activeFilter === "all"
        ? reservations
        : reservations.filter((r) => r.status === activeFilter);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* TOPBAR */}
            <div className="bg-white border-b border-gray-200 px-8 h-15 flex items-center justify-between sticky top-0 z-50 shadow-sm">
                <div className="text-xl font-bold text-blue-600">🍜 Việt Bếp</div>
                <div className="flex gap-2">
                    {[
                        { label: "Trang chủ", href: "/" },
                        { label: "Đặt bàn", href: "/reservation" },
                        { label: "Lịch sử đặt bàn", href: "/customer-history", active: true },
                    ].map((nav) => (
                        <a key={nav.label} href={nav.href} className={`px-4 py-2 rounded-lg text-sm font-medium transition ${nav.active ? "bg-blue-50 text-blue-600" : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"}`}>
                            {nav.label}
                        </a>
                    ))}
                </div>
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setShowDropdown(v => !v)}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-gray-100 transition-colors cursor-pointer border-none bg-transparent"
                    >
                        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                            {user?.name?.[0]?.toUpperCase() ?? "U"}
                        </div>
                        <span className="text-sm font-medium text-gray-800">{user?.name ?? "Khách hàng"}</span>
                    </button>
                    {showDropdown && (
                        <div className="absolute right-0 top-full mt-2 w-40 bg-white border border-gray-200 rounded-xl shadow-lg py-1 z-50">
                            <button
                                onClick={() => { logout(); setShowDropdown(false); }}
                                className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors cursor-pointer border-none bg-transparent"
                            >
                                Đăng xuất
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-6 py-10">
                {/* Header */}
                <div className="flex items-center justify-between mb-7">
                    <div>
                        <h1 className="font-serif text-2xl font-bold">Lịch sử đặt bàn</h1>
                        <p className="text-sm text-gray-400 mt-1">Xem và quản lý các lần đặt bàn của bạn</p>
                    </div>
                    <a href="/reservation" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition">
                        + Đặt bàn mới
                    </a>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-4 gap-3.5 mb-7">
                    {[
                        { num: counts.all, label: "Tổng lần đặt bàn", color: "text-gray-800" },
                        { num: counts.COMPLETED, label: "Đã hoàn thành", color: "text-green-500" },
                        { num: counts.PENDING, label: "Chờ xác nhận", color: "text-amber-500" },
                        { num: counts.CANCELLED, label: "Đã hủy", color: "text-red-500" },
                    ].map((stat) => (
                        <div key={stat.label} className="bg-white border border-gray-200 rounded-xl p-5">
                            <div className={`text-2xl font-bold mb-0.5 ${stat.color}`}>{stat.num}</div>
                            <div className="text-xs text-gray-400">{stat.label}</div>
                        </div>
                    ))}
                </div>

                {/* Filters */}
                <div className="flex gap-2 mb-5 flex-wrap">
                    {filters.map((f) => (
                        <button
                            key={f.key}
                            onClick={() => setActiveFilter(f.key)}
                            className={`px-4 py-1.5 rounded-full text-sm font-medium border-2 transition ${activeFilter === f.key ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-400 border-gray-200 hover:border-gray-300"}`}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>

                {/* Cards */}
                {loading ? (
                    <div className="text-center py-16 text-gray-400">Đang tải...</div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-16 text-gray-400">Không có đặt bàn nào</div>
                ) : (
                    <div className="flex flex-col gap-3.5">
                        {filtered.map((r) => {
                            const sc = statusConfig[r.status];
                            const isCancelled = r.status === "CANCELLED";
                            return (
                                <div key={r.id} className={`bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition ${isCancelled ? "opacity-70" : ""}`}>
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <div className="text-xs font-bold text-gray-400 uppercase tracking-wide">#{String(r.id).padStart(4, "0")}</div>
                                            <div className="text-base font-bold mt-0.5">{formatDate(r.reservationTime)}</div>
                                        </div>
                                        <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold ${sc.bg} ${sc.text}`}>
                                            {sc.label}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg mb-3.5">
                                        <div>
                                            <div className="text-xs text-gray-400 mb-0.5">Giờ đặt bàn</div>
                                            <div className="text-sm font-semibold">{formatTime(r.reservationTime)}</div>
                                        </div>
                                        <div>
                                            <div className="text-xs text-gray-400 mb-0.5">Số người</div>
                                            <div className="text-sm font-semibold">{r.numberOfPeople} người</div>
                                        </div>
                                        <div>
                                            <div className="text-xs text-gray-400 mb-0.5">Bàn số</div>
                                            <div className="text-sm font-semibold">
                                                {r.table ? `Bàn ${String(r.table.tableNumber).padStart(2, "0")}` : "—"}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-2 mt-3.5">
                                        {(r.status === "PENDING" || r.status === "CONFIRMED") && (
                                            <button
                                                onClick={() => handleCancel(r.id)}
                                                disabled={isCancelDisable(r.reservationTime)}
                                                className="px-4 py-1.5 text-sm font-semibold border-2 border-red-300 text-red-500 rounded-lg hover:bg-red-50 transition"
                                            >
                                                ✕ Hủy đặt bàn
                                            </button>
                                        )}
                                        {r.status === "PENDING" && (
                                            <button
                                                disabled={r.status !== "PENDING"}
                                                onClick={() => handleOpenEdit(r)}
                                                className="px-4 py-1.5 text-sm font-semibold border-2 border-gray-200 rounded-lg hover:border-blue-400 hover:text-blue-600 transition"
                                            >
                                                ✏️ Chỉnh sửa
                                            </button>
                                        )}
                                        {(r.status === "COMPLETED" || r.status === "CANCELLED") && (
                                            <a href="/reservation" className="px-4 py-1.5 text-sm font-semibold border-2 border-gray-200 rounded-lg hover:border-blue-400 hover:text-blue-600 transition">
                                                🔄 Đặt lại
                                            </a>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Edit Modal */}
            {editingItem && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-7">
                        <h2 className="text-lg font-bold mb-1">Chỉnh sửa đặt bàn</h2>
                        <p className="text-sm text-gray-400 mb-5">#{String(editingItem.id).padStart(4, "0")}</p>

                        <div className="flex flex-col gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Ngày đặt bàn</label>
                                <input
                                    type="date"
                                    value={editForm.date}
                                    onChange={(e) => setEditForm((f) => ({ ...f, date: e.target.value }))}
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Giờ đặt bàn</label>
                                <input
                                    type="time"
                                    value={editForm.time}
                                    onChange={(e) => setEditForm((f) => ({ ...f, time: e.target.value }))}
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Số người</label>
                                <input
                                    type="number"
                                    min={1}
                                    value={editForm.numberOfPeople}
                                    onChange={(e) => setEditForm((f) => ({ ...f, numberOfPeople: e.target.value }))}
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {editingItem.table && (
                                    <p className="text-xs text-gray-400 mt-1">Sức chứa tối đa: {editingItem.table.capacity} người</p>
                                )}
                            </div>
                        </div>

                        {editError && (
                            <p className="mt-3 text-sm text-red-500">{editError}</p>
                        )}

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => setEditingItem(null)}
                                className="flex-1 px-4 py-2 text-sm font-semibold border-2 border-gray-200 rounded-lg hover:bg-gray-50 transition"
                                disabled={editLoading}
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleEditSubmit}
                                disabled={editLoading}
                                className="flex-1 px-4 py-2 text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition disabled:opacity-60"
                            >
                                {editLoading ? "Đang lưu..." : "Lưu thay đổi"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
