import { useState } from "react";

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("admin@vietbep.vn");
    const [password, setPassword] = useState("password123");
    const [remember, setRemember] = useState(true);

    const fillDemo = (demoEmail: string) => {
        setEmail(demoEmail);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-10">
            <div className="flex w-full max-w-4xl bg-white rounded-2xl overflow-hidden shadow-2xl">

                {/* LEFT PANEL */}
                <div
                    className="w-96 flex-shrink-0 flex flex-col justify-between p-14 relative overflow-hidden"
                    style={{ background: "linear-gradient(160deg, #1E3A5F 0%, #2563EB 100%)" }}
                >
                    {/* decorative circles */}
                    <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white opacity-5" />
                    <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full" style={{ background: "rgba(245,158,11,0.12)" }} />

                    <div className="relative z-10 font-sans text-2xl text-white">🍜 Việt Bếp</div>

                    <div className="relative z-10">
                        <h2 className="font-serif text-4xl text-white leading-tight mb-4">
                            Chào mừng<br />trở lại!
                        </h2>
                        <p className="text-sm text-white/70 leading-relaxed mb-9">
                            Đăng nhập để tiếp tục sử dụng hệ thống quản lý nhà hàng Việt Bếp.
                        </p>
                        <div className="flex flex-col gap-3">
                            {[
                                { icon: "👤", bg: "rgba(16,185,129,0.25)", name: "Khách hàng", desc: "Đặt bàn, xem lịch sử" },
                                { icon: "👨‍💼", bg: "rgba(245,158,11,0.25)", name: "Quản trị viên", desc: "Dashboard, quản lý toàn hệ thống" },
                                { icon: "👨‍🍳", bg: "rgba(139,92,246,0.25)", name: "Nhân viên", desc: "Order, thanh toán" },
                            ].map((role) => (
                                <div key={role.name} className="flex items-center gap-3 rounded-xl p-3 border border-white/15" style={{ background: "rgba(255,255,255,0.1)" }}>
                                    <div className="w-9 h-9 rounded-lg flex items-center justify-center text-base flex-shrink-0" style={{ background: role.bg }}>
                                        {role.icon}
                                    </div>
                                    <div>
                                        <div className="text-sm font-semibold text-white">{role.name}</div>
                                        <div className="text-xs text-white/60">{role.desc}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="relative z-10 text-xs text-white/40">© 2024 Việt Bếp Restaurant</div>
                </div>

                {/* RIGHT PANEL */}
                <div className="flex-1 p-14 flex flex-col justify-center">
                    <div className="mb-9">
                        <h1 className="font-serif text-3xl font-bold mb-2">Đăng nhập</h1>
                        <p className="text-sm text-gray-500">
                            Chưa có tài khoản?{" "}
                            <a href="/register" className="text-blue-600 font-medium hover:underline">Đăng ký miễn phí</a>
                        </p>
                    </div>

                    {/* Alert */}
                    <div className="bg-amber-50 border border-amber-300 rounded-lg p-3 text-sm text-amber-800 flex gap-2 mb-6">
                        <span>💡</span>
                        <span>Hệ thống tự động chuyển hướng theo vai trò sau khi đăng nhập thành công.</span>
                    </div>

                    {/* Email */}
                    <div className="mb-5">
                        <label className="block text-sm font-semibold mb-1.5">Email hoặc số điện thoại</label>
                        <input
                            type="text"
                            className="w-full px-3.5 py-2.5 border-2 border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                            placeholder="Nhập email hoặc SĐT"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    {/* Password */}
                    <div className="mb-5">
                        <label className="block text-sm font-semibold mb-1.5">Mật khẩu</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                className="w-full px-3.5 py-2.5 border-2 border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                                placeholder="Nhập mật khẩu"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? "🙈" : "👁"}
                            </button>
                        </div>
                    </div>

                    {/* Remember & Forgot */}
                    <div className="flex items-center justify-between mb-6">
                        <label className="flex items-center gap-2 text-sm text-gray-500 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={remember}
                                onChange={(e) => setRemember(e.target.checked)}
                                className="accent-blue-600"
                            />
                            Ghi nhớ đăng nhập
                        </label>
                        <a href="#" className="text-sm text-blue-600 font-medium hover:underline">Quên mật khẩu?</a>
                    </div>

                    {/* Submit */}
                    <button className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-base font-semibold transition">
                        Đăng nhập
                    </button>

                    {/* Demo accounts */}
                    <div className="mt-8">
                        <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">🧪 Tài khoản demo</div>
                        <div className="grid grid-cols-3 gap-2">
                            {[
                                { icon: "👤", role: "Khách hàng", email: "customer@vietbep.vn" },
                                { icon: "👨‍💼", role: "Admin", email: "admin@vietbep.vn" },
                                { icon: "👨‍🍳", role: "Nhân viên", email: "staff@vietbep.vn" },
                            ].map((demo) => (
                                <button
                                    key={demo.role}
                                    onClick={() => fillDemo(demo.email)}
                                    className="p-2.5 border-2 border-gray-200 rounded-lg text-center hover:border-blue-500 hover:bg-blue-50 transition"
                                >
                                    <div className="text-xl mb-1">{demo.icon}</div>
                                    <div className="text-xs font-bold text-gray-700">{demo.role}</div>
                                    <div className="text-xs text-gray-400 truncate">{demo.email.split("@")[0]}@...</div>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mt-7 text-center text-sm text-gray-500">
                        Khách hàng mới?{" "}
                        <a href="/register" className="text-blue-600 font-semibold hover:underline">Tạo tài khoản ngay →</a>
                    </div>
                </div>
            </div>
        </div>
    );
}