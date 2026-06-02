/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuthStore } from "../state/auth"
import { api } from "../lib/api"

export default function StaffUserMenu() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const navigate = useNavigate()

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (error: any) {
      console.error(error)
    } finally {
      logout();
      navigate("/login");
    }
  }

  return (
    <div ref={ref} className="relative flex items-center">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 text-white text-sm font-medium hover:bg-white/10 px-2 py-1 rounded-lg transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-white/25 flex items-center justify-center font-bold text-[13px]">
          {user?.name?.[0]?.toUpperCase() ?? "S"}
        </div>
        <span>{user?.name ?? "Staff"}</span>
        <span className="bg-white/15 px-2.5 py-0.5 rounded-full text-xs">Phục vụ</span>
        <svg className={`w-3.5 h-3.5 opacity-70 transition-transform ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
          <Link to="/reservations"
            className="block w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
            Xác nhận đặt bàn
          </Link>
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2.5 text-[13px] text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Đăng xuất
          </button>
        </div>
      )}
    </div>
  )
}
