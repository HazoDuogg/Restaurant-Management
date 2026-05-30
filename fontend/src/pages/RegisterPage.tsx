import { useState } from "react";
import { z } from "zod";
import { api } from "../lib/api";
import { useAuthStore } from "../state/auth";
import { useNavigate, Link } from "react-router-dom";

const signInSchema = z.object({
    email: z.email("Chưa nhập email hoặc số điện thoại"),
    password: z.string().min(6, "Mật khẩu ít nhất 6 ký tự.")
});

export default function RegisterPage() {

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const register = useAuthStore((s) => s.login);
    const navigation = useNavigate();
    const fullName = `${firstName} ${lastName}`.trim();
    const [checked, setChecked] = useState({
        terms: true
    });

    const getStrength = (pwd: string) => {
        if (pwd.length < 6) return 1;
        if (pwd.length < 8) return 2;
        if (/[A-Z]/.test(pwd) && /[0-9]/.test(pwd)) return 4;
        return 3;
    };

    const strength = getStrength(password);
    const strengthLabels = ["", "Yếu", "Trung bình", "Tốt", "Mạnh"];
    const strengthColors = ["", "bg-red-400", "bg-yellow-400", "bg-green-400", "bg-green-500"];

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError(null);
        if (password !== confirmPassword) {
            setError("Mật khẩu xác nhận không khớp.");
            setLoading(false);
            return;
        }
        if (!checked.terms) {
            setError("Bạn phải đồng ý với Điều khoản sử dụng để tiếp tục.");
            setLoading(false);
            return;
        }
        const result = signInSchema.safeParse({ email, password });
        if (!result.success) {
            setError(result.error.issues[0].message);
            setLoading(false);
            return;
        }
        try {
            const res = await api.post('/auth/register', { name: fullName, password, phone, email });
            const data = res.data;
            register(data);
            navigation('/');
        } catch (error: unknown) {
            if (
                typeof error === 'object' &&
                error !== null &&
                'response' in error &&
                typeof (error as { response?: { data?: { message?: unknown } } }).response?.data?.message === 'string'
            ) {
                setError((error as { response: { data: { message: string } } }).response.data.message);
            } else {
                setError('Đăng ký thất bại. Vui lòng thử lại sau.');
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex">
            {/* LEFT PANEL */}
            <div
                className="w-[420px] min-h-screen flex-shrink-0 flex flex-col justify-between p-12 relative overflow-hidden"
                style={{ background: "linear-gradient(160deg, #1E3A5F 0%, #2563EB 100%)" }}
            >
                <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-white opacity-5" />
                <div className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full" style={{ background: "rgba(245,158,11,0.1)" }} />

                <div className="relative z-10 font-sans text-2xl text-white">🍜 Việt Bếp</div>

                <div className="relative z-10">
                    <h2 className="font-sans text-4xl text-white leading-tight mb-4">
                        Tham gia cùng<br />cộng đồng<br />Việt Bếp
                    </h2>
                    <p className="text-sm text-white/70 leading-relaxed">
                        Tạo tài khoản để đặt bàn, xem lịch sử và nhận ưu đãi độc quyền.
                    </p>
                    <div className="mt-9 flex flex-col gap-4">
                        {[
                            { icon: "📅", title: "Đặt bàn online 24/7", desc: "Không cần gọi điện, xác nhận ngay lập tức" },
                            { icon: "📋", title: "Quản lý đặt bàn", desc: "Xem, chỉnh sửa hoặc hủy lịch đặt dễ dàng" },
                            { icon: "🎁", title: "Ưu đãi thành viên", desc: "Nhận voucher và khuyến mãi riêng cho thành viên" },
                        ].map((b) => (
                            <div key={b.title} className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0 mt-0.5" style={{ background: "rgba(255,255,255,0.15)" }}>
                                    {b.icon}
                                </div>
                                <div>
                                    <div className="text-sm font-semibold text-white">{b.title}</div>
                                    <div className="text-xs text-white/70 leading-relaxed">{b.desc}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="relative z-10 text-xs text-white/40">© 2024 Việt Bếp Restaurant</div>
            </div>

            {/* RIGHT PANEL */}
            <div className="flex-1 flex items-center justify-center p-12 overflow-y-auto bg-gray-50">
                <div className="w-full max-w-lg">
                    <div className="mb-8">
                        <h1 className="font-serif text-3xl font-bold mb-2">Tạo tài khoản mới</h1>
                        <p className="text-sm text-gray-500">
                            Đã có tài khoản?{" "}
                            <Link to="/login" className="text-blue-600 font-medium hover:underline">Đăng nhập ngay</Link>
                        </p>
                    </div>

                    {/* Info box */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex gap-2.5 mb-6">
                        <span className="text-base">ℹ️</span>
                        <p className="text-sm text-blue-800 leading-relaxed">
                            Trang này dành cho khách hàng đăng ký tài khoản. Tài khoản nhân viên và quản trị viên được tạo bởi Admin.
                        </p>
                    </div>

                    {/* Personal info */}
                    <div className="mb-6">
                        <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 pb-2 border-b border-gray-200">
                            Thông tin cá nhân
                        </div>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-semibold mb-1.5">Họ <span className="text-red-500">*</span></label>
                                <input onChange={(e) => setFirstName(e.target.value)} type="text" className="w-full px-3.5 py-2.5 border-2 border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition" placeholder="Nguyễn" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold mb-1.5">Tên <span className="text-red-500">*</span></label>
                                <input onChange={(e) => setLastName(e.target.value)} type="text" className="w-full px-3.5 py-2.5 border-2 border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition" placeholder="Văn A" />
                            </div>
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-semibold mb-1.5">Số điện thoại <span className="text-red-500">*</span></label>
                            <input onChange={(e) => setPhone(e.target.value)} type="tel" className="w-full px-3.5 py-2.5 border-2 border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition" placeholder="0901 234 567" defaultValue="0901 234 567" />
                            <p className="text-xs text-gray-400 mt-1.5">Dùng để xác nhận đặt bàn qua SMS</p>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-1.5">Email <span className="text-red-500">*</span></label>
                            <input onChange={(e) => setEmail(e.target.value)} type="email" className="w-full px-3.5 py-2.5 border-2 border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition" placeholder="example@email.com" defaultValue="lan.nguyen@email.com" />
                        </div>
                    </div>

                    {/* Security */}
                    <div className="mb-6">
                        <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 pb-2 border-b border-gray-200">
                            Bảo mật tài khoản
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-semibold mb-1.5">Mật khẩu <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className="w-full px-3.5 py-2.5 border-2 border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition"
                                    placeholder="Tối thiểu 8 ký tự"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? "🙈" : "👁"}
                                </button>
                            </div>
                            <div className="flex gap-1 mt-2">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className={`h-1 flex-1 rounded-sm ${i <= strength ? strengthColors[strength] : "bg-gray-200"}`} />
                                ))}
                            </div>
                            <p className="text-xs text-gray-400 mt-1">Độ bảo mật: {strengthLabels[strength]}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-1.5">Xác nhận mật khẩu <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <input
                                    type={showConfirm ? "text" : "password"}
                                    className="w-full px-3.5 py-2.5 border-2 border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition"
                                    placeholder="Nhập lại mật khẩu"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                                <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" onClick={() => setShowConfirm(!showConfirm)}>
                                    {showConfirm ? "🙈" : "👁"}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Checkboxes */}
                    <div className="mb-4">
                        <label className="flex items-start gap-2.5 cursor-pointer">
                            <input type="checkbox" defaultChecked className="mt-0.5 accent-blue-600 flex-shrink-0" onChange={(e) => setChecked({ terms: e.target.checked })} />
                            <span className="text-sm text-gray-500 leading-relaxed">
                                Tôi đồng ý với <a href="#" className="text-blue-600 hover:underline">Điều khoản sử dụng</a> và{" "}
                                <a href="#" className="text-blue-600 hover:underline">Chính sách bảo mật</a> của Việt Bếp
                            </span>
                        </label>
                    </div>
                    <div className="mb-6">
                        <label className="flex items-start gap-2.5 cursor-pointer">
                            <input type="checkbox" defaultChecked className="mt-0.5 accent-blue-600 flex-shrink-0" />
                            <span className="text-sm text-gray-500 leading-relaxed">
                                Nhận thông báo ưu đãi và tin tức mới từ Việt Bếp qua email
                            </span>
                        </label>
                    </div>

                    {error && (
                        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-300 rounded-lg text-sm text-red-700">
                            {error}
                        </div>
                    )}

                    <button className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-base font-semibold transition"
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? "Đang tạo..." : "Tạo tài khoản"}
                    </button>

                    <p className="text-center mt-5 text-xs text-gray-400">
                        Bằng cách đăng ký, bạn xác nhận đã đọc và đồng ý với các điều khoản của chúng tôi.
                    </p>
                </div>
            </div>
        </div>
    );
}