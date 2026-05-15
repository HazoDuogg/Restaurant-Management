import { useEffect, useRef, useState } from "react";
import { useAuthStore } from "../state/auth";
import { Link } from "react-router-dom";

const timeSlots = [
    { time: "10:30", available: false },
    { time: "11:00", available: false },
    { time: "11:30", available: true },
    { time: "12:00", available: true },
    { time: "12:30", available: true },
    { time: "13:00", available: false },
    { time: "13:30", available: true },
    { time: "17:00", available: true },
    { time: "18:00", available: true },
    { time: "18:30", available: true },
    { time: "19:00", available: true },
    { time: "19:30", available: true },
    { time: "20:00", available: false },
    { time: "20:30", available: true },
    { time: "21:00", available: true },
];

const tables = [
    { id: 1, capacity: 2, available: false },
    { id: 2, capacity: 2, available: false },
    { id: 3, capacity: 4, available: true },
    { id: 4, capacity: 4, available: true },
    { id: 5, capacity: 6, available: true },
    { id: 6, capacity: 6, available: false },
    { id: 7, capacity: 8, available: true, icon: "🛋️" },
    { id: 8, capacity: 10, available: true, icon: "🛋️" },
];

export default function CustomerReservationPage() {
    const [selectedTime, setSelectedTime] = useState("18:00");
    const [selectedTable, setSelectedTable] = useState(3);
    const [guestCount, setGuestCount] = useState(4);
    const [note, setNote] = useState("Sinh nhật bé gái, có thể chuẩn bị bánh nhỏ giúp không ạ?");
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const user = useAuthStore((e) => e.user);
    const logout = useAuthStore((e) => e.logout);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* TOPBAR */}
            <div className="bg-white border-b border-gray-200 px-8 h-15 flex items-center justify-between sticky top-0 z-50 shadow-sm">
                <div className="font-sans text-xl font-bold text-blue-600">🍜 Việt Bếp</div>
                <div className="flex gap-2">
                    {[
                        { label: "Trang chủ", href: "/" },
                        { label: "Đặt bàn", href: "/reservation", active: true },
                        { label: "Lịch sử đặt bàn", href: "/history" },
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
                            {user ? user.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <span className="text-sm font-medium text-gray-800">{user ? user.name : 'U'}</span>
                    </button>
                    {showDropdown && (
                        <div className="absolute right-0 top-full mt-2 w-40 bg-white border border-gray-200 rounded-xl shadow-lg py-1 z-50">
                            <button
                                onClick={() => {
                                    logout();
                                    setShowDropdown(false);
                                }}
                                className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors cursor-pointer border-none bg-transparent"
                            >
                                Đăng xuất
                            </button>

                            <Link
                                to="/customer-history"
                                onClick={() => setShowDropdown(false)}
                                className="block w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                            >
                                Lịch sử
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-6 py-10">
                <div className="mb-8">
                    <h1 className="font-serif text-3xl font-bold mb-1.5">Đặt bàn</h1>
                    <p className="text-sm text-gray-500">Điền thông tin bên dưới để đặt bàn tại Việt Bếp</p>
                </div>

                {/* STEPS */}
                <div className="flex items-center mb-10">
                    {[
                        { num: 1, label: "Chọn thời gian", state: "active" },
                        { num: 2, label: "Chọn bàn", state: "pending" },
                        { num: 3, label: "Xác nhận", state: "pending" },
                    ].map((step, i) => (
                        <div key={step.num} className="flex items-center flex-1">
                            <div className="flex items-center gap-2.5">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step.state === "active" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-400"}`}>
                                    {step.num}
                                </div>
                                <span className={`text-sm font-semibold ${step.state === "active" ? "text-blue-600" : "text-gray-400"}`}>
                                    {step.label}
                                </span>
                            </div>
                            {i < 2 && <div className="flex-1 h-0.5 bg-gray-200 mx-2" />}
                        </div>
                    ))}
                </div>

                {/* STEP 1: TIME & GUESTS */}
                <div className="bg-white border border-gray-200 rounded-xl p-7 mb-5">
                    <div className="text-base font-bold mb-5 flex items-center gap-2">📅 Thời gian & Số người</div>
                    <div className="grid grid-cols-2 gap-4 mb-5">
                        <div>
                            <label className="block text-sm font-semibold mb-1.5">Ngày đặt bàn</label>
                            <input type="date" className="w-full px-3.5 py-2.5 border-2 border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition" defaultValue="2024-12-25" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-1.5">Số người</label>
                            <div className="flex items-center border-2 border-gray-200 rounded-lg overflow-hidden w-fit">
                                <button className="w-10 h-10 bg-gray-50 hover:bg-gray-100 text-gray-500 text-xl flex items-center justify-center transition" onClick={() => setGuestCount(Math.max(1, guestCount - 1))}>−</button>
                                <span className="w-14 text-center font-bold text-base border-l-2 border-r-2 border-gray-200 py-2">{guestCount}</span>
                                <button className="w-10 h-10 bg-gray-50 hover:bg-gray-100 text-gray-500 text-xl flex items-center justify-center transition" onClick={() => setGuestCount(Math.min(20, guestCount + 1))}>+</button>
                            </div>
                            <p className="text-xs text-gray-400 mt-1.5">Tối đa 20 người. Nhóm lớn hơn liên hệ trực tiếp.</p>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold mb-3">Chọn giờ</label>
                        <div className="grid grid-cols-5 gap-2">
                            {timeSlots.map((slot) => (
                                <button
                                    key={slot.time}
                                    disabled={!slot.available}
                                    onClick={() => slot.available && setSelectedTime(slot.time)}
                                    className={`py-2.5 rounded-lg text-sm font-medium border-2 transition ${!slot.available ? "bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed" : selectedTime === slot.time ? "bg-blue-600 text-white border-blue-600" : "border-gray-200 hover:border-blue-400 hover:text-blue-600"}`}
                                >
                                    {slot.time}
                                </button>
                            ))}
                        </div>
                        <div className="flex gap-4 mt-3">
                            {[
                                { color: "bg-blue-600", label: "Đã chọn" },
                                { color: "bg-white border-2 border-gray-200", label: "Còn trống" },
                                { color: "bg-gray-100", label: "Hết chỗ" },
                            ].map((l) => (
                                <div key={l.label} className="flex items-center gap-1.5 text-xs text-gray-400">
                                    <div className={`w-2.5 h-2.5 rounded-sm ${l.color}`} />
                                    {l.label}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* STEP 2: TABLE */}
                <div className="bg-white border border-gray-200 rounded-xl p-7 mb-5">
                    <div className="text-base font-bold mb-5 flex items-center gap-2">
                        🪑 Chọn bàn
                        <span className="text-sm font-normal text-gray-400">({selectedTime} – 25/12/2024)</span>
                    </div>
                    <div className="grid grid-cols-4 gap-3">
                        {tables.map((table) => (
                            <button
                                key={table.id}
                                disabled={!table.available}
                                onClick={() => table.available && setSelectedTable(table.id)}
                                className={`border-2 rounded-xl p-4 text-center transition ${!table.available ? "bg-gray-50 opacity-60 cursor-not-allowed border-gray-100" : selectedTable === table.id ? "border-blue-600 bg-blue-50" : "border-gray-200 hover:border-blue-400"}`}
                            >
                                <div className="text-3xl mb-1.5">{table.icon || "🪑"}</div>
                                <div className="text-sm font-bold">Bàn {String(table.id).padStart(2, "0")}</div>
                                <div className="text-xs text-gray-400">{table.capacity} người</div>
                                <div className={`text-xs mt-1 font-semibold ${table.available ? "text-green-500" : "text-red-400"}`}>
                                    {table.available ? (selectedTable === table.id ? "Đã chọn ✓" : "Còn trống") : "Đã đặt"}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* NOTE */}
                <div className="bg-white border border-gray-200 rounded-xl p-7 mb-5">
                    <div className="text-base font-bold mb-5">📝 Ghi chú thêm</div>
                    <label className="block text-sm font-semibold mb-1.5">Yêu cầu đặc biệt (không bắt buộc)</label>
                    <textarea
                        className="w-full px-3.5 py-2.5 border-2 border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition resize-none"
                        rows={3}
                        placeholder="VD: Sinh nhật, ghế trẻ em, dị ứng thực phẩm..."
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                    />
                </div>

                {/* SUMMARY */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-5">
                    <div className="text-sm font-bold text-blue-800 mb-4">📋 Tóm tắt đặt bàn</div>
                    {[
                        { label: "Ngày", value: "Thứ Tư, 25/12/2024" },
                        { label: "Giờ", value: selectedTime },
                        { label: "Số người", value: `${guestCount} người` },
                        { label: "Bàn", value: `Bàn ${String(selectedTable).padStart(2, "0")} (${tables.find(t => t.id === selectedTable)?.capacity} người)` },
                        { label: "Khách hàng", value: user?.name ?? "Khách hàng" },
                    ].map((row) => (
                        <div key={row.label} className="flex justify-between items-center text-sm mb-2.5">
                            <span className="text-gray-500">{row.label}</span>
                            <span className="font-semibold">{row.value}</span>
                        </div>
                    ))}
                    <div className="mt-3 pt-3 border-t border-blue-200 text-xs text-blue-700 leading-relaxed">
                        ✉️ Xác nhận sẽ được gửi đến bạn trong vòng 5 phút.<br />
                        ⚠️ Vui lòng đến đúng giờ. Hủy miễn phí trước 2 giờ so với giờ đặt.
                    </div>
                </div>

                <button className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-base font-semibold transition">
                    ✅ Xác nhận đặt bàn
                </button>
                <p className="text-center mt-3 text-sm text-gray-400">
                    <a href="/history" className="text-blue-600 hover:underline">← Xem lịch sử đặt bàn</a>
                </p>
            </div>
        </div>
    );
}