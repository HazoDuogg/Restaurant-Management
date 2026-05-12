import { Link, useLocation } from "react-router-dom"
import type { ReactNode } from "react"

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

        <div className="px-4 py-4 border-t border-gray-200">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
              A
            </div>
            <div>
              <div className="text-sm font-semibold">Admin Chính</div>
              <div className="text-[11px] text-gray-400">Quản trị viên</div>
            </div>
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
