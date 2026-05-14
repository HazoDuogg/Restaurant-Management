import { Link, useLocation } from "react-router-dom"
import { useEffect, useRef, useState, type ReactNode } from "react"
import { useAuthStore } from "../state/auth"

const navSections = [
  {
    title: "Tổng quan",
    items: [{ icon: "🏠", label: "Dashboard", href: "/admin" }],
  },
  {
    title: "Quản lý",
    items: [
      { icon: "🍽️", label: "Quản lý món ăn", href: "/admin/menu" },
      { icon: "🪑", label: "Quản lý bàn", href: "/admin/tables" },
      { icon: "👨‍💼", label: "Quản lý nhân viên", href: "/admin/staff" },
      { icon: "📋", label: "Quản lý đặt bàn", href: "/admin/reservations", badge: 3 },
    ],
  },
  {
    title: "Báo cáo",
    items: [{ icon: "📊", label: "Báo cáo doanh thu", href: "/admin/report" }],
  },
]

interface AdminLayoutProps {
  children: ReactNode
  title: string
  topbarRight?: ReactNode
}

export default function AdminLayout({ children, title, topbarRight }: AdminLayoutProps) {
  const location = useLocation()
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const logout = useAuthStore((e) => e.logout);
  const user = useAuthStore((e) => e.user);

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
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-60 bg-white border-r border-gray-200 fixed top-0 left-0 bottom-0 flex flex-col z-50">
        <div className="px-5 pt-5 pb-4 border-b border-gray-200">
          <div className="font-sans text-xl font-bold text-blue-600">🍜 Việt Bếp</div>
          <div className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Admin Panel</div>
        </div>

        <nav className="flex-1 py-3 overflow-y-auto">
          {navSections.map((section) => (
            <div key={section.title}>
              <div className="px-4 pt-4 pb-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                {section.title}
              </div>
              {section.items.map((item) => {
                const isActive = location.pathname === item.href
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={`flex items-center gap-2.5 py-2.5 px-4 mx-2 rounded-lg text-sm font-medium transition-all my-px ${isActive
                      ? "bg-blue-50 text-blue-600 font-semibold"
                      : "text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                      }`}
                  >
                    <span className="w-[18px] text-center text-base">{item.icon}</span>
                    <span className="flex-1">{item.label}</span>
                    {"badge" in item && (item as { badge?: number }).badge ? (
                      <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                        {(item as { badge?: number }).badge}
                      </span>
                    ) : null}
                  </Link>
                )
              })}
            </div>
          ))}
        </nav>

        <div className="px-3 py-3 border-t border-gray-200">
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowDropdown(v => !v)}
              className="w-full flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer border-none bg-transparent"
            >
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                {user?.name?.[0]?.toUpperCase() ?? "A"}
              </div>
              <div className="flex-1 text-left min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate">{user?.name ?? "Admin"}</p>
                <p className="text-xs text-gray-400 capitalize">{user?.role ?? "admin"}</p>
              </div>
              <svg
                className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform ${showDropdown ? "rotate-180" : ""}`}
                fill="none" viewBox="0 0 24 24" stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {showDropdown && (
              <div className="absolute bottom-full left-0 right-0 mb-2 bg-white border border-gray-200 rounded-xl shadow-lg py-1 z-50">
                <button
                  onClick={() => {
                    logout();
                    setShowDropdown(false);
                  }}
                  className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors cursor-pointer border-none bg-transparent"
                >
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="ml-60 flex-1 flex flex-col min-h-screen">
        <div className="bg-white border-b border-gray-200 px-7 h-[60px] flex items-center justify-between sticky top-0 z-40">
          <div className="text-base font-bold">{title}</div>
          {topbarRight && <div className="flex items-center gap-3">{topbarRight}</div>}
        </div>
        <div className="flex-1">{children}</div>
      </div>
    </div>
  )
}
