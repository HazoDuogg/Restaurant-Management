import { useState } from "react";

const reservations = [
    {
        id: "RES-2024-0089",
        date: "Thứ Tư, 25/12/2024",
        time: "18:00",
        guests: 4,
        table: "Bàn 03",
        bookedAt: "20/12 – 14:32",
        status: "pending",
        note: "Sinh nhật bé gái, có thể chuẩn bị bánh nhỏ giúp không ạ?",
    },
    {
        id: "RES-2024-0087",
        date: "Thứ Sáu, 27/12/2024",
        time: "19:30",
        guests: 6,
        table: "Bàn 05",
        bookedAt: "18/12 – 09:15",
        status: "confirmed",
    },
    {
        id: "RES-2024-0072",
        date: "Thứ Bảy, 07/12/2024",
        time: "12:00",
        guests: 2,
        table: "Bàn 01",
        bookedAt: "05/12 – 20:45",
        status: "completed",
    },
    {
        id: "RES-2024-0061",
        date: "Chủ Nhật, 24/11/2024",
        time: "18:30",
        guests: 4,
        table: "Bàn 04",
        bookedAt: "22/11 – 16:20",
        status: "completed",
    },
    {
        id: "RES-2024-0055",
        date: "Thứ Tư, 13/11/2024",
        time: "20:00",
        guests: 3,
        table: "Bàn 02",
        bookedAt: "—",
        cancelReason: "Khách hàng hủy",
        status: "cancelled",
    },
];

const statusConfig = {
    pending: { label: "⏳ Chờ xác nhận", bg: "bg-amber-100", text: "text-amber-800" },
    confirmed: { label: "✅ Đã xác nhận", bg: "bg-green-100", text: "text-green-800" },
    completed: { label: "✓ Hoàn thành", bg: "bg-gray-100", text: "text-gray-700" },
    cancelled: { label: "✕ Đã hủy", bg: "bg-red-100", text: "text-red-700" },
};

const filters = [
    { key: "all", label: "Tất cả (8)" },
    { key: "pending", label: "Chờ xác nhận (2)" },
    { key: "confirmed", label: "Đã xác nhận (1)" },
    { key: "completed", label: "Hoàn thành (5)" },
    { key: "cancelled", label: "Đã hủy (1)" },
];

export default function CustomerHistoryPage() {
    const [activeFilter, setActiveFilter] = useState("all");

    const filtered = activeFilter === "all"
        ? reservations
        : reservations.filter((r) => r.status === activeFilter);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* TOPBAR */}
            <div className="bg-white border-b border-gray-200 px-8 h-15 flex items-center justify-between sticky top-0 z-50 shadow-sm">
                <div className="customer-history text-xl font-bold text-blue-600">🍜 Việt Bếp</div>
                <div className="flex gap-2">
                    {[
                        { label: "Trang chủ", href: "/" },
                        { label: "Đặt bàn", href: "/reservation" },
                        { label: "Lịch sử đặt bàn", href: "/history", active: true },
                    ].map((nav) => (
                        <a key={nav.label} href={nav.href} className={`px-4 py-2 rounded-lg text-sm font-medium transition ${nav.active ? "bg-blue-50 text-blue-600" : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"}`}>
                            {nav.label}
                        </a>
                    ))}
                </div>
                <div className="flex items-center gap-2.5 text-sm font-medium">
                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">L</div>
                    <span>Nguyễn Thị Lan</span>
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
                        { num: "8", label: "Tổng lần đặt bàn", color: "text-gray-800" },
                        { num: "5", label: "Đã hoàn thành", color: "text-green-500" },
                        { num: "2", label: "Chờ xác nhận", color: "text-amber-500" },
                        { num: "1", label: "Đã hủy", color: "text-red-500" },
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
                <div className="flex flex-col gap-3.5">
                    {filtered.map((r) => {
                        const sc = statusConfig[r.status as keyof typeof statusConfig];
                        const isCancelled = r.status === "cancelled";
                        return (
                            <div key={r.id} className={`bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition ${isCancelled ? "opacity-70" : ""}`}>
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <div className="text-xs font-bold text-gray-400 uppercase tracking-wide">#{r.id}</div>
                                        <div className="text-base font-bold mt-0.5">{r.date}</div>
                                    </div>
                                    <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold ${sc.bg} ${sc.text}`}>
                                        {sc.label}
                                    </span>
                                </div>

                                <div className="grid grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg mb-3.5">
                                    <div>
                                        <div className="text-xs text-gray-400 mb-0.5">Giờ đặt bàn</div>
                                        <div className="text-sm font-semibold">{r.time}</div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-400 mb-0.5">Số người</div>
                                        <div className="text-sm font-semibold">{r.guests} người</div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-400 mb-0.5">Bàn số</div>
                                        <div className="text-sm font-semibold">{r.table}</div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-400 mb-0.5">{isCancelled ? "Lý do hủy" : "Đặt lúc"}</div>
                                        <div className={`text-sm font-semibold ${isCancelled ? "text-red-500" : ""}`}>
                                            {isCancelled ? r.cancelReason : r.bookedAt}
                                        </div>
                                    </div>
                                </div>

                                {r.note && (
                                    <div className="text-sm text-gray-400 mt-2 pt-2 border-t border-gray-100 flex items-start gap-1.5">
                                        <span>📝</span>
                                        <span>{r.note}</span>
                                    </div>
                                )}

                                <div className="flex gap-2 mt-3.5">
                                    {r.status === "pending" && (
                                        <>
                                            <button className="px-4 py-1.5 text-sm font-semibold border-2 border-red-300 text-red-500 rounded-lg hover:bg-red-50 transition">✕ Hủy đặt bàn</button>
                                            <button className="px-4 py-1.5 text-sm font-semibold border-2 border-gray-200 rounded-lg hover:border-blue-400 hover:text-blue-600 transition">✏️ Chỉnh sửa</button>
                                        </>
                                    )}
                                    {r.status === "confirmed" && (
                                        <button className="px-4 py-1.5 text-sm font-semibold border-2 border-red-300 text-red-500 rounded-lg hover:bg-red-50 transition">✕ Hủy đặt bàn</button>
                                    )}
                                    {r.status === "completed" && (
                                        <>
                                            <button className="px-4 py-1.5 text-sm font-semibold border-2 border-gray-200 rounded-lg hover:border-blue-400 hover:text-blue-600 transition">⭐ Đánh giá</button>
                                            <button className="px-4 py-1.5 text-sm font-semibold border-2 border-gray-200 rounded-lg hover:border-blue-400 hover:text-blue-600 transition">🔄 Đặt lại</button>
                                        </>
                                    )}
                                    {r.status === "cancelled" && (
                                        <button className="px-4 py-1.5 text-sm font-semibold border-2 border-gray-200 rounded-lg hover:border-blue-400 hover:text-blue-600 transition">🔄 Đặt lại</button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}