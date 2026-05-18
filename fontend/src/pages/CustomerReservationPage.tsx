import { useEffect, useRef, useState } from "react";
import { useAuthStore } from "../state/auth";
import { Link, useLocation } from "react-router-dom";
import { api } from "../lib/api";

const timeSlots = [
    "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30",
    "17:00", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00",
];

type TableData = {
    id: number;
    tableNumber: number;
    capacity: number;
    type: "NORMAL" | "VIP";
    status: "AVAILABLE" | "RESERVED" | "OCCUPIED";
};

export default function CustomerReservationPage() {
    const location = useLocation();
    const fromLanding = location.state as { name?: string; phone?: string; date?: string; time?: string; people?: string } | null;

    const [selectedTime, setSelectedTime] = useState(fromLanding?.time ?? "18:00");
    const [selectedTable, setSelectedTable] = useState<number | null>(null);
    const [guestCount, setGuestCount] = useState(parseInt(fromLanding?.people ?? "4") || 4);
    const [reservationDate, setReservationDate] = useState(fromLanding?.date ?? new Date().toISOString().split("T")[0]);
    const [note, setNote] = useState("");
    const [guestNameInput, setGuestNameInput] = useState(fromLanding?.name ?? "");
    const [guestPhoneInput, setGuestPhoneInput] = useState(fromLanding?.phone ?? "");
    const [showDropdown, setShowDropdown] = useState(false);
    const [tables, setTables] = useState<TableData[]>([]);
    const [loadingTables, setLoadingTables] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [submitMsg, setSubmitMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const user = useAuthStore((e) => e.user);
    const logout = useAuthStore((e) => e.logout);
    const isLogin = useAuthStore((e) => e.accessToken);

    const displayName = isLogin ? (user?.name ?? "Khách hàng") : (guestNameInput || "Khách vãng lai");
    const displayPhone = isLogin ? "" : guestPhoneInput;

    useEffect(() => {
        api.get("/tables")
            .then((res) => {
                const data: TableData[] = res.data.data ?? [];
                setTables(data);
                const first = data.find((t) => t.status === "AVAILABLE");
                console.log(res.data.data);
                if (first) {
                    setSelectedTable(first.id);
                }

            })
            .catch(() => setTables([]))
            .finally(() => setLoadingTables(false));
    }, []);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const handleSubmit = async () => {
        if (!selectedTable) {
            setSubmitMsg({ type: "error", text: "Vui lòng chọn bàn trước khi xác nhận." });
            return;
        }
        if (!isLogin && (!guestNameInput.trim() || !guestPhoneInput.trim())) {
            setSubmitMsg({ type: "error", text: "Vui lòng nhập họ tên và số điện thoại." });
            return;
        }
        setSubmitting(true);
        setSubmitMsg(null);
        try {
            const reservationTime = new Date(`${reservationDate}T${selectedTime}:00`).toISOString();
            const body = isLogin
                ? { customerId: user!.id, tableId: selectedTable, reservationTime, numberOfPeople: guestCount }
                : { tableId: selectedTable, reservationTime, numberOfPeople: guestCount, guestName: guestNameInput.trim(), guestPhone: guestPhoneInput.trim() };
            await api.post("/reservations", body);
            setTables((prev) =>
                prev.map((t) => (t.id === selectedTable ? { ...t, status: "RESERVED" } : t))
            );
            setSelectedTable(null);
            setSubmitMsg({ type: "success", text: "Đặt bàn thành công! Chúng tôi sẽ xác nhận trong vòng 5 phút." });
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Đặt bàn thất bại, vui lòng thử lại.";
            setSubmitMsg({ type: "error", text: (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? errorMessage });
        } finally {
            setSubmitting(false);
        }
    };

    const selectedTableData = tables.find((t) => t.id === selectedTable);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* TOPBAR */}
            <div className="bg-white border-b border-gray-200 px-8 h-15 flex items-center justify-between sticky top-0 z-50 shadow-sm">
                <div className="font-sans text-xl font-bold text-blue-600">🍜 Việt Bếp</div>
                <div className="flex gap-2">
                    {[
                        { label: "Trang chủ", href: "/" },
                        { label: "Đặt bàn", href: "/reservation", active: true },
                        { label: "Lịch sử đặt bàn", href: "/customer-history" },
                    ].map((nav) => (
                        <a key={nav.label} href={nav.href} className={`px-4 py-2 rounded-lg text-sm font-medium transition ${nav.active ? "bg-blue-50 text-blue-600" : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"}`}>
                            {nav.label}
                        </a>
                    ))}
                </div>
                {isLogin && user ? (
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setShowDropdown(v => !v)}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-gray-100 transition-colors cursor-pointer border-none bg-transparent"
                        >
                            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                            <span className="text-sm font-medium text-gray-800">{user.name}</span>
                        </button>
                        {showDropdown && (
                            <div className="absolute right-0 top-full mt-2 w-40 bg-white border border-gray-200 rounded-xl shadow-lg py-1 z-50">
                                <button
                                    onClick={() => { logout(); setShowDropdown(false); }}
                                    className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors cursor-pointer border-none bg-transparent"
                                >
                                    Đăng xuất
                                </button>
                                {user.role === "CUSTOMER" && (
                                    <Link
                                        to="/customer-history"
                                        onClick={() => setShowDropdown(false)}
                                        className="block w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                                    >
                                        Lịch sử
                                    </Link>
                                )}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flex gap-2">
                        <Link to={'/login'} className="px-4 py-2 rounded-lg border border-gray-200 text-gray-800 text-sm font-semibold hover:border-blue-500 hover:text-blue-600 transition-colors bg-transparent cursor-pointer">
                            Đăng nhập
                        </Link>
                        <Link to={'/register'} className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors border-none cursor-pointer">
                            Đăng ký
                        </Link>
                    </div>
                )}
            </div>

            <div className="max-w-3xl mx-auto px-6 py-10">
                <div className="mb-8">
                    <h1 className="font-serif text-3xl font-bold mb-1.5">Đặt bàn</h1>
                    <p className="text-sm text-gray-500">Điền thông tin bên dưới để đặt bàn tại Việt Bếp</p>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-7 mb-5">
                    <div className="text-base font-bold mb-5 flex items-center gap-2">📅 Thời gian & Số người</div>
                    <div className="grid grid-cols-2 gap-4 mb-5">
                        <div>
                            <label className="block text-sm font-semibold mb-1.5">Ngày đặt bàn</label>
                            <input type="date" value={reservationDate} onChange={(e) => setReservationDate(e.target.value)} className="w-full px-3.5 py-2.5 border-2 border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition" />
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
                            {timeSlots.map((time) => (
                                <button
                                    key={time}
                                    onClick={() => setSelectedTime(time)}
                                    className={`py-2.5 rounded-lg text-sm font-medium border-2 transition ${selectedTime === time ? "bg-blue-600 text-white border-blue-600" : "border-gray-200 hover:border-blue-400 hover:text-blue-600"}`}
                                >
                                    {time}
                                </button>
                            ))}
                        </div>
                        <div className="flex gap-4 mt-3">
                            {[
                                { color: "bg-blue-600", label: "Đã chọn" },
                                { color: "bg-white border-2 border-gray-200", label: "Còn trống" },
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
                        <span className="text-sm font-normal text-gray-400">({selectedTime} – {reservationDate})</span>
                    </div>
                    {loadingTables ? (
                        <div className="text-center py-8 text-sm text-gray-400">Đang tải danh sách bàn...</div>
                    ) : tables.length === 0 ? (
                        <div className="text-center py-8 text-sm text-gray-400">Không thể tải danh sách bàn.</div>
                    ) : (
                        <div className="grid grid-cols-4 gap-3">
                            {tables.map((table) => {
                                const available = table.status === "AVAILABLE";
                                const isVip = table.type === "VIP";
                                return (
                                    <button
                                        key={table.id}
                                        disabled={!available}
                                        onClick={() => available && setSelectedTable(table.id)}
                                        className={`border-2 rounded-xl p-4 text-center transition ${!available ? "bg-gray-50 opacity-60 cursor-not-allowed border-gray-100" : selectedTable === table.id ? "border-blue-600 bg-blue-50" : "border-gray-200 hover:border-blue-400"}`}
                                    >
                                        <div className="text-3xl mb-1.5">{table.capacity >= 8 ? "🛋️" : "🪑"}</div>
                                        <div className="text-sm font-bold">
                                            {isVip
                                                ? `Bàn VIP ${String(table.tableNumber).padStart(2, "0")}`
                                                : `Bàn ${String(table.tableNumber).padStart(2, "0")}`}
                                        </div>
                                        <div className="text-xs text-gray-400">{table.capacity} người</div>
                                        <div className={`text-xs mt-1 font-semibold ${available ? "text-green-500" : "text-red-400"}`}>
                                            {!available
                                                ? (table.status === "OCCUPIED" ? "Đang có khách" : "Đã đặt")
                                                : selectedTable === table.id ? "Đã chọn ✓" : "Còn trống"
                                            }
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                    <div className="flex gap-4 mt-4">
                        {[
                            { color: "border-blue-600 bg-blue-50", label: "Đang chọn" },
                            { color: "border-gray-200 bg-white", label: "Còn trống" },
                            { color: "bg-gray-50 border-gray-100 opacity-60", label: "Đã đặt / Có khách" },
                        ].map((l) => (
                            <div key={l.label} className="flex items-center gap-1.5 text-xs text-gray-400">
                                <div className={`w-4 h-4 rounded border-2 ${l.color}`} />
                                {l.label}
                            </div>
                        ))}
                    </div>
                </div>

                {/* GUEST INFO (chỉ hiện khi chưa đăng nhập) */}
                {!isLogin && (
                    <div className="bg-white border border-gray-200 rounded-xl p-7 mb-5">
                        <div className="text-base font-bold mb-5">👤 Thông tin liên hệ</div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold mb-1.5">Họ và tên <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    value={guestNameInput}
                                    onChange={(e) => setGuestNameInput(e.target.value)}
                                    placeholder="Nguyễn Văn A"
                                    className="w-full px-3.5 py-2.5 border-2 border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold mb-1.5">Số điện thoại <span className="text-red-500">*</span></label>
                                <input
                                    type="tel"
                                    value={guestPhoneInput}
                                    onChange={(e) => setGuestPhoneInput(e.target.value)}
                                    placeholder="0901234567"
                                    className="w-full px-3.5 py-2.5 border-2 border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition"
                                />
                            </div>
                        </div>
                        <p className="text-xs text-gray-400 mt-2">
                            Hoặc <Link to="/login" className="text-blue-600 hover:underline">đăng nhập</Link> để không cần nhập lại thông tin mỗi lần.
                        </p>
                    </div>
                )}

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
                        { label: "Ngày", value: reservationDate },
                        { label: "Giờ", value: selectedTime },
                        { label: "Số người", value: `${guestCount} người` },
                        { label: "Bàn", value: selectedTableData ? `Bàn ${String(selectedTableData.tableNumber).padStart(2, "0")} (${selectedTableData.capacity} người)` : "Chưa chọn" },
                        { label: "Khách hàng", value: displayName },
                        ...(displayPhone ? [{ label: "Số điện thoại", value: displayPhone }] : []),
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

                {submitMsg && (
                    <div className={`mb-4 px-4 py-3 rounded-lg text-sm font-medium ${submitMsg.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-600 border border-red-200"}`}>
                        {submitMsg.text}
                    </div>
                )}

                <button
                    onClick={handleSubmit}
                    disabled={!isLogin ? (submitting || !selectedTable || !guestNameInput.trim() || !guestPhoneInput.trim()) : (submitting || !selectedTable)}
                    className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg text-base font-semibold transition"
                >
                    {submitting ? "Đang xử lý..." : "✅ Xác nhận đặt bàn"}
                </button>

                {isLogin && (
                    <p className="text-center mt-3 text-sm text-gray-400">
                        <Link to="/customer-history" className="text-blue-600 hover:underline">← Xem lịch sử đặt bàn</Link>
                    </p>
                )}
            </div>
        </div >
    );
}
