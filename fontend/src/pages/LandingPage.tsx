import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../state/auth";

const NAV_LINKS = [
    { label: "Trang chủ", href: '#trangchu' },
    { label: "Thực đơn", href: "#menu" },
    { label: "Đặt bàn", href: "#dat-ban" },
    { label: "Giới thiệu", href: "#gioithieu" },
    { label: "Liên hệ", href: "#lienhe" },
];

const FEATURED_MENU = [
    { icon: "🍜", name: "Phở Bò Đặc Biệt", sub: "Soup · Bestseller", price: "95k" },
    { icon: "🥘", name: "Bún Bò Huế", sub: "Soup · Cay vừa", price: "85k" },
    { icon: "🍗", name: "Gà Nướng Mắc Khén", sub: "Món chính · Tây Bắc", price: "145k" },
    { icon: "🥗", name: "Gỏi Cuốn Tôm Thịt", sub: "Khai vị · Healthy", price: "65k" },
];

const FEATURES = [
    { icon: "📅", title: "Đặt bàn dễ dàng", desc: "Đặt bàn trực tuyến 24/7, xác nhận ngay lập tức. Không cần gọi điện, không cần chờ đợi." },
    { icon: "🍽️", title: "Thực đơn phong phú", desc: "Hơn 85 món ăn Việt Nam từ Bắc vào Nam, được cập nhật theo mùa với nguyên liệu tươi ngon nhất." },
    { icon: "👨‍🍳", title: "Đầu bếp chuyên nghiệp", desc: "Đội ngũ đầu bếp 15+ năm kinh nghiệm, được đào tạo bài bản về ẩm thực truyền thống Việt Nam." },
    { icon: "🌿", title: "Nguyên liệu sạch", desc: "100% nguyên liệu tươi, có nguồn gốc rõ ràng. Không chất bảo quản, không phẩm màu nhân tạo." },
    { icon: "💳", title: "Thanh toán linh hoạt", desc: "Chấp nhận tiền mặt, thẻ ngân hàng, ví điện tử. Hóa đơn điện tử gửi qua email ngay sau khi dùng bữa." },
    { icon: "🎁", title: "Ưu đãi thành viên", desc: "Tích điểm mỗi lần ăn, đổi quà hấp dẫn. Khách VIP nhận ưu đãi đặc biệt vào dịp sinh nhật." },
];

const MENU_TABS = ["Tất cả", "Khai vị", "Món chính", "Súp & Bún", "Tráng miệng", "Đồ uống"];

const MENU_CARDS = [
    { icon: "🍜", name: "Phở Bò Đặc Biệt", desc: "Nước dùng hầm 12 tiếng, thịt bò tái chín, giò heo", price: "95.000đ", badge: "🔥 Bestseller" },
    { icon: "🥘", name: "Bún Bò Huế", desc: "Nước lèo đậm đà, chả cua, giò heo, ớt sa tế", price: "85.000đ", badge: "🌶️ Cay vừa" },
    { icon: "🍗", name: "Gà Nướng Mắc Khén", desc: "Gà ta nướng than hoa, ướp mắc khén Tây Bắc", price: "145.000đ", badge: "⭐ Đặc sản" },
    { icon: "🥗", name: "Gỏi Cuốn Tôm Thịt", desc: "Tôm tươi, thịt heo, rau sống, bún, nước chấm đặc biệt", price: "65.000đ", badge: "🌿 Healthy" },
];

const TESTIMONIALS = [
    { stars: 5, text: "Phở ở đây ngon nhất mình từng ăn! Nước dùng đậm đà, thịt mềm. Không gian thoáng mát, nhân viên thân thiện. Chắc chắn sẽ quay lại.", name: "Nguyễn Thị Lan", role: "Khách hàng thân thiết", initial: "N", color: "bg-blue-500" },
    { stars: 5, text: "Đặt bàn qua app rất tiện, nhận xác nhận ngay. Gà nướng mắc khén đặc biệt lắm, lần đầu ăn mà ghiền liền. Giá cả hợp lý.", name: "Trần Văn Minh", role: "Đã đặt bàn 8 lần", initial: "T", color: "bg-emerald-500" },
    { stars: 4, text: "Không gian nhà hàng rất đẹp, phù hợp cho buổi họp gia đình. Thực đơn đa dạng, phục vụ nhanh. Sẽ giới thiệu cho bạn bè.", name: "Phạm Quỳnh Anh", role: "Khách hàng mới", initial: "P", color: "bg-amber-500" },
];

export default function LandingPage() {
    const [activeTab, setActiveTab] = useState("Tất cả");
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const isLogin = useAuthStore((e) => e.accessToken);
    const user = useAuthStore((e) => e.user);
    const logout = useAuthStore((e) => e.logout);
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
    const [time, setTime] = useState("18:00");
    const [people, setPeople] = useState("2 người");

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const scrollTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        e.preventDefault();
        document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen bg-white font-sans">

            {/* NAV */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 flex items-center justify-between px-16 h-16">
                <div className="font-sans text-xl font-bold text-blue-600 flex items-center gap-2">
                    🍜 Việt Bếp
                </div>
                <ul className="flex gap-8 list-none">
                    {NAV_LINKS.map(l => (
                        <li key={l.label}>
                            {l.href.startsWith("#") ? (
                                <a
                                    href={l.href}
                                    onClick={(e) => scrollTo(e, l.href)}
                                    className="text-gray-500 text-[15px] font-medium hover:text-blue-600 transition-colors no-underline cursor-pointer"
                                >
                                    {l.label}
                                </a>
                            ) : (
                                <Link
                                    to={l.href}
                                    className="text-gray-500 text-[15px] font-medium hover:text-blue-600 transition-colors no-underline"
                                >
                                    {l.label}
                                </Link>
                            )}
                        </li>
                    ))}
                </ul>
                <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1.5 rounded-full text-xs font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
                        Đang mở cửa
                    </span>
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
                                        onClick={() => {
                                            logout();
                                            setShowDropdown(false);
                                        }}
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

                                    {user.role === "ADMIN" && (
                                        <Link
                                            to="/admin"
                                            onClick={() => setShowDropdown(false)}
                                            className="block w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                                        >
                                            Dashboard
                                        </Link>
                                    )}

                                    {user.role === "STAFF" && (
                                        <Link
                                            to="/staff/tables"
                                            onClick={() => setShowDropdown(false)}
                                            className="block w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                                        >
                                            Quản lý bàn
                                        </Link>
                                    )}
                                </div>
                            )}
                        </div>
                    ) : (
                        <>
                            <Link to={'/login'} className="px-4 py-2 rounded-lg border border-gray-200 text-gray-800 text-sm font-semibold hover:border-blue-500 hover:text-blue-600 transition-colors bg-transparent cursor-pointer">
                                Đăng nhập
                            </Link>
                            <Link to={'/register'} className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors border-none cursor-pointer">
                                Đăng ký
                            </Link>
                        </>
                    )}
                </div>

            </nav>

            {/* HERO */}
            <section
                className="mt-16 flex items-center px-16 gap-16 relative overflow-hidden"
                style={{
                    minHeight: 580,
                    background: "linear-gradient(135deg, #1E3A5F 0%, #2563EB 55%, #3B82F6 100%)",
                    paddingTop: 72,
                    paddingBottom: 72,
                }}
                id="trangchu"
            >
                <div className="absolute -top-20 -right-20 w-[480px] h-[480px] rounded-full pointer-events-none" style={{ background: "rgba(255,255,255,0.04)" }} />
                <div className="absolute -bottom-28 right-56 w-72 h-72 rounded-full pointer-events-none" style={{ background: "rgba(245,158,11,0.13)" }} />

                {/* LEFT */}
                <div className="max-w-[540px] relative z-10">
                    <div className="inline-flex items-center gap-1.5 text-amber-300 border border-amber-300/30 px-3.5 py-1.5 rounded-full text-[13px] font-semibold mb-6" style={{ background: "rgba(255,255,255,0.13)" }}>
                        ⭐ Đánh giá 4.9/5 từ 1,200+ khách hàng
                    </div>
                    <h1 className="font-sans text-[52px] font-bold text-white leading-[1.15] mb-5">
                        Hương vị Việt<br />Chính thống &amp; Tinh tế
                    </h1>
                    <p className="text-[17px] leading-[1.7] mb-9" style={{ color: "rgba(255,255,255,0.8)" }}>
                        Trải nghiệm ẩm thực Việt Nam đích thực với những món ăn được chế biến từ nguyên liệu tươi ngon, công thức gia truyền qua nhiều thế hệ.
                    </p>
                    <div className="flex gap-3.5">
                        <a
                            href="#dat-ban"
                            onClick={(e) => scrollTo(e, "#dat-ban")}
                            className="px-8 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-white font-bold text-base border-none cursor-pointer transition-colors no-underline"
                        >
                            Đặt bàn ngay
                        </a>
                        <a
                            href="#menu"
                            onClick={(e) => scrollTo(e, "#menu")}
                            className="px-8 py-3.5 rounded-xl text-white font-semibold text-base cursor-pointer transition-colors border no-underline"
                            style={{ background: "rgba(255,255,255,0.13)", borderColor: "rgba(255,255,255,0.28)" }}
                        >
                            Xem thực đơn
                        </a>
                    </div>
                    <div className="flex gap-10 mt-12 pt-8 border-t" style={{ borderColor: "rgba(255,255,255,0.15)" }}>
                        {[["1,200+", "Khách hàng thân thiết"], ["85+", "Món ăn đặc sắc"], ["12", "Năm kinh nghiệm"]].map(([n, l]) => (
                            <div key={l}>
                                <div className="font-sans text-[28px] font-bold text-white">{n}</div>
                                <div className="text-[13px] mt-0.5" style={{ color: "rgba(255,255,255,0.6)" }}>{l}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* RIGHT */}
                <div className="flex-1 flex justify-center items-center relative z-10">
                    <div className="rounded-2xl p-7 w-[290px] text-white" style={{ background: "rgba(255,255,255,0.1)", backdropFilter: "blur(14px)", border: "1px solid rgba(255,255,255,0.2)" }}>
                        <div className="text-[11px] font-bold uppercase tracking-widest mb-4" style={{ opacity: 0.65 }}>
                            🔥 Món nổi bật hôm nay
                        </div>
                        {FEATURED_MENU.map((item, i) => (
                            <div key={i} className="flex items-center gap-3 py-2.5" style={{ borderBottom: i < FEATURED_MENU.length - 1 ? "1px solid rgba(255,255,255,0.1)" : "none" }}>
                                <div className="w-9 h-9 rounded-lg flex items-center justify-center text-lg flex-shrink-0" style={{ background: "rgba(245,158,11,0.2)" }}>
                                    {item.icon}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="text-sm font-medium truncate">{item.name}</div>
                                    <div className="text-xs" style={{ opacity: 0.65 }}>{item.sub}</div>
                                </div>
                                <div className="text-sm font-bold text-amber-300 flex-shrink-0">{item.price}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FEATURES */}
            <section className="bg-gray-50 px-16 py-20" id="gioithieu">
                <div className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-3">Tại sao chọn chúng tôi</div>
                <div className="font-sans text-4xl font-bold text-gray-900 mb-4">Trải nghiệm ẩm thực trọn vẹn</div>
                <p className="text-base text-gray-500 leading-[1.7] max-w-[520px]">Từ đặt bàn đến thanh toán, chúng tôi đảm bảo mỗi lần đến là một kỷ niệm đáng nhớ.</p>
                <div className="grid grid-cols-3 gap-6 mt-12">
                    {FEATURES.map(f => (
                        <div key={f.title} className="bg-white border border-gray-200 rounded-xl p-7 hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-2xl mb-4">{f.icon}</div>
                            <div className="text-base font-bold mb-2">{f.title}</div>
                            <div className="text-sm text-gray-500 leading-[1.6]">{f.desc}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* MENU */}
            <section className="bg-white px-16 py-20 scroll-mt-16" id="menu">
                <div className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-3">Thực đơn</div>
                <div className="flex items-end justify-between">
                    <div className="font-sans text-4xl font-bold text-gray-900">Món ăn nổi bật</div>
                    <a href="#" className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-semibold text-gray-700 no-underline hover:border-blue-500 hover:text-blue-600 transition-colors">Xem tất cả →</a>
                </div>
                <div className="flex gap-2 mt-8 mb-8 flex-wrap">
                    {MENU_TABS.map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-5 py-2 rounded-full text-sm font-medium border transition-all cursor-pointer ${activeTab === tab ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-500 border-gray-200 hover:border-blue-400 hover:text-blue-600"}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
                <div className="grid grid-cols-4 gap-5">
                    {MENU_CARDS.map(card => (
                        <div key={card.name} className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                            <div className="h-40 bg-gradient-to-br from-amber-50 to-amber-100 flex items-center justify-center text-6xl">
                                {card.icon}
                            </div>
                            <div className="p-4">
                                <div className="text-[15px] font-bold mb-1">{card.name}</div>
                                <div className="text-[13px] text-gray-500 leading-[1.5] mb-3">{card.desc}</div>
                                <div className="flex items-center justify-between">
                                    <div className="text-base font-bold text-blue-600">{card.price}</div>
                                    <div className="text-[11px] bg-amber-50 text-amber-800 px-2 py-1 rounded-full font-semibold">{card.badge}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* RESERVATION CTA */}
            <section className="px-16 py-20 text-center scroll-mt-16" id="dat-ban" style={{ background: "linear-gradient(135deg, #1E3A5F, #2563EB)" }}>
                <div className="text-xs font-bold uppercase tracking-widest mb-3 text-amber-300">Đặt bàn</div>
                <div className="font-sans text-4xl font-bold text-white mb-4">Đặt bàn ngay hôm nay</div>
                <p className="text-base leading-[1.7] max-w-[480px] mx-auto mb-10" style={{ color: "rgba(255,255,255,0.75)" }}>
                    Chọn thời gian phù hợp, chúng tôi sẽ chuẩn bị sẵn sàng đón tiếp bạn.
                </p>
                <div className="max-w-2xl mx-auto rounded-2xl p-5" style={{ background: "rgba(255,255,255,0.1)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.2)" }}>
                    {isLogin ? (
                        <div className="flex gap-3">
                            <div className="flex-1">
                                <div className="text-[11px] font-semibold uppercase tracking-wide mb-1.5" style={{ color: "rgba(255,255,255,0.6)" }}>📅 Ngày</div>
                                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full rounded-lg px-3 py-2.5 text-sm text-white border" style={{ background: "rgba(255,255,255,0.15)", borderColor: "rgba(255,255,255,0.2)" }} />
                            </div>
                            <div className="flex-1">
                                <div className="text-[11px] font-semibold uppercase tracking-wide mb-1.5" style={{ color: "rgba(255,255,255,0.6)" }}>🕐 Giờ</div>
                                <select value={time} onChange={(e) => setTime(e.target.value)} className="w-full rounded-lg px-3 py-2.5 text-sm text-white border" style={{ background: "rgba(255,255,255,0.15)", borderColor: "rgba(255,255,255,0.2)" }}>
                                    {["11:00", "12:00", "18:00", "19:00", "20:00"].map(o => <option key={o} style={{ color: "#111", background: "#fff" }}>{o}</option>)}
                                </select>
                            </div>
                            <div className="flex-1">
                                <div className="text-[11px] font-semibold uppercase tracking-wide mb-1.5" style={{ color: "rgba(255,255,255,0.6)" }}>👥 Số người</div>
                                <select value={people} onChange={(e) => setPeople(e.target.value)} className="w-full rounded-lg px-3 py-2.5 text-sm text-white border" style={{ background: "rgba(255,255,255,0.15)", borderColor: "rgba(255,255,255,0.2)" }}>
                                    {["1 người", "2 người", "4 người", "6 người", "8+ người"].map(o => <option key={o} style={{ color: "#111", background: "#fff" }}>{o}</option>)}
                                </select>
                            </div>
                            <div className="flex items-end">
                                <Link to="/reservation" state={{ name: user?.name, date, time, people }} className="px-7 py-3 rounded-xl bg-amber-400 hover:bg-amber-500 text-white font-bold text-base border-none cursor-pointer transition-colors whitespace-nowrap no-underline">
                                    Đặt bàn →
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-3">
                            <div className="flex gap-3">
                                <div className="flex-1">
                                    <div className="text-[11px] font-semibold uppercase tracking-wide mb-1.5" style={{ color: "rgba(255,255,255,0.6)" }}>👤 Họ tên</div>
                                    <input
                                        type="text"
                                        placeholder="Nhập họ và tên"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full rounded-lg px-3 py-2.5 text-sm text-white border placeholder:text-white/50"
                                        style={{ background: "rgba(255,255,255,0.15)", borderColor: "rgba(255,255,255,0.2)" }}
                                    />
                                </div>
                                <div className="flex-1">
                                    <div className="text-[11px] font-semibold uppercase tracking-wide mb-1.5" style={{ color: "rgba(255,255,255,0.6)" }}>📱 Số điện thoại</div>
                                    <input
                                        type="tel"
                                        placeholder="Nhập số điện thoại"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="w-full rounded-lg px-3 py-2.5 text-sm text-white border placeholder:text-white/50"
                                        style={{ background: "rgba(255,255,255,0.15)", borderColor: "rgba(255,255,255,0.2)" }}
                                    />
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <div className="flex-1">
                                    <div className="text-[11px] font-semibold uppercase tracking-wide mb-1.5" style={{ color: "rgba(255,255,255,0.6)" }}>📅 Ngày</div>
                                    <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full rounded-lg px-3 py-2.5 text-sm text-white border" style={{ background: "rgba(255,255,255,0.15)", borderColor: "rgba(255,255,255,0.2)" }} />
                                </div>
                                <div className="flex-1">
                                    <div className="text-[11px] font-semibold uppercase tracking-wide mb-1.5" style={{ color: "rgba(255,255,255,0.6)" }}>🕐 Giờ</div>
                                    <select value={time} onChange={(e) => setTime(e.target.value)} className="w-full rounded-lg px-3 py-2.5 text-sm text-white border" style={{ background: "rgba(255,255,255,0.15)", borderColor: "rgba(255,255,255,0.2)" }}>
                                        {["11:00", "12:00", "18:00", "19:00", "20:00"].map(o => <option key={o} style={{ color: "#111", background: "#fff" }}>{o}</option>)}
                                    </select>
                                </div>
                                <div className="flex-1">
                                    <div className="text-[11px] font-semibold uppercase tracking-wide mb-1.5" style={{ color: "rgba(255,255,255,0.6)" }}>👥 Số người</div>
                                    <select value={people} onChange={(e) => setPeople(e.target.value)} className="w-full rounded-lg px-3 py-2.5 text-sm text-white border" style={{ background: "rgba(255,255,255,0.15)", borderColor: "rgba(255,255,255,0.2)" }}>
                                        {["1 người", "2 người", "4 người", "6 người", "8+ người"].map(o => <option key={o} style={{ color: "#111", background: "#fff" }}>{o}</option>)}
                                    </select>
                                </div>
                                <div className="flex items-end">
                                    <Link
                                        to="/reservation"
                                        state={{ name, phone, date, time, people }}
                                        className={`px-7 py-3 rounded-xl text-white font-bold text-base whitespace-nowrap no-underline transition-colors bg-amber-400 hover:bg-amber-500`}
                                    >
                                        Đặt bàn →
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <p className="mt-4 text-[13px]" style={{ color: "rgba(255,255,255,0.45)" }}>
                    Xác nhận qua email trong vòng 5 phút · Hủy miễn phí trước 2 giờ
                </p>
            </section>

            {/* TESTIMONIALS */}
            <section className="bg-gray-50 px-16 py-20">
                <div className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-3">Đánh giá</div>
                <div className="font-sans text-4xl font-bold text-gray-900 mb-12">Khách hàng nói gì về chúng tôi</div>
                <div className="grid grid-cols-3 gap-6">
                    {TESTIMONIALS.map(t => (
                        <div key={t.name} className="bg-white border border-gray-200 rounded-xl p-6">
                            <div className="text-amber-400 text-base mb-3">{"★".repeat(t.stars)}{"☆".repeat(5 - t.stars)}</div>
                            <p className="text-sm text-gray-500 leading-[1.7] mb-4 italic">"{t.text}"</p>
                            <div className="flex items-center gap-2.5">
                                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white ${t.color}`}>{t.initial}</div>
                                <div>
                                    <div className="text-sm font-semibold">{t.name}</div>
                                    <div className="text-xs text-gray-500">{t.role}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* FOOTER */}
            <footer className="bg-gray-900 px-16 py-12" id="lienhe">
                <div className="grid gap-12" style={{ gridTemplateColumns: "2fr 1fr 1fr 1fr" }}>
                    <div>
                        <div className="font-sans text-xl text-white mb-3">🍜 Việt Bếp</div>
                        <p className="text-sm leading-[1.7] text-gray-400 mb-4">Nhà hàng ẩm thực Việt Nam với hơn 12 năm phục vụ. Chúng tôi tự hào mang đến hương vị Việt chính thống đến từng bàn ăn.</p>
                        <div className="text-sm text-gray-500 leading-[1.9]">
                            📍 123 Nguyễn Huệ, Q.1, TP.HCM<br />
                            📞 (028) 3822 1234<br />
                            ✉️ info@vietbep.vn
                        </div>
                    </div>
                    {[
                        { title: "Dịch vụ", links: ["Đặt bàn online", "Thực đơn", "Tiệc theo yêu cầu", "Giao hàng"] },
                        { title: "Hỗ trợ", links: ["Câu hỏi thường gặp", "Chính sách đặt bàn", "Liên hệ", "Khiếu nại"] },
                    ].map(col => (
                        <div key={col.title}>
                            <div className="text-xs font-bold text-white uppercase tracking-widest mb-4">{col.title}</div>
                            <ul className="list-none flex flex-col gap-2.5">
                                {col.links.map(l => <li key={l}><a href="#" className="text-sm text-gray-400 no-underline hover:text-white transition-colors">{l}</a></li>)}
                            </ul>
                        </div>
                    ))}
                    <div>
                        <div className="text-xs font-bold text-white uppercase tracking-widest mb-4">Giờ mở cửa</div>
                        <div className="text-sm text-gray-400 leading-[1.9]">
                            Thứ 2 – Thứ 6<br /><span className="text-white font-semibold">10:30 – 22:00</span><br />
                            Thứ 7 – Chủ nhật<br /><span className="text-white font-semibold">09:00 – 23:00</span>
                        </div>
                    </div>
                </div>
                <div className="mt-10 pt-6 border-t border-white/10 text-center text-xs text-gray-600">
                    © 2024 Việt Bếp Restaurant. All rights reserved.
                </div>
            </footer>
        </div>
    );
}