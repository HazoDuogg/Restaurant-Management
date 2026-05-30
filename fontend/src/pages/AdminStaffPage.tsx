import { useState } from "react"
import AdminLayout from "../components/AdminLayout"

const staffList = [
  {
    id: "NV001", name: "Trần Minh Tuấn", email: "tuant@vietbep.vn",
    role: "Quản lý ca", phone: "0901 111 222", joinDate: "15/03/2022",
    accountStatus: "active", workStatus: "working",
    avatarBg: "bg-blue-500", initial: "T",
  },
  {
    id: "NV002", name: "Nguyễn Thị Hoa", email: "hoan@vietbep.vn",
    role: "Phục vụ", phone: "0912 222 333", joinDate: "01/06/2023",
    accountStatus: "active", workStatus: "working",
    avatarBg: "bg-emerald-500", initial: "N",
  },
  {
    id: "NV003", name: "Lê Văn Khoa", email: "khoalv@vietbep.vn",
    role: "Thu ngân", phone: "0923 333 444", joinDate: "10/08/2023",
    accountStatus: "active", workStatus: "leave",
    avatarBg: "bg-amber-500", initial: "L",
  },
  {
    id: "NV004", name: "Phạm Thị Mai", email: "maip@vietbep.vn",
    role: "Phục vụ", phone: "0934 444 555", joinDate: "20/01/2024",
    accountStatus: "active", workStatus: "working",
    avatarBg: "bg-violet-500", initial: "P",
  },
  {
    id: "NV005", name: "Hoàng Văn Đức", email: "duch@vietbep.vn",
    role: "Bếp trưởng", phone: "0945 555 666", joinDate: "05/11/2021",
    accountStatus: "locked", workStatus: "resigned",
    avatarBg: "bg-red-500", initial: "H",
  },
]

export default function AdminStaffPage() {
  const [showModal, setShowModal] = useState(false)

  return (
    <AdminLayout
      title="👨‍💼 Quản lý Nhân viên"
      topbarRight={
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[13px] font-semibold transition"
        >
          + Tạo tài khoản nhân viên
        </button>
      }
    >
      <div className="p-7">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-3.5 mb-6">
          {[
            { num: "14", label: "Tổng nhân viên", color: "" },
            { num: "11", label: "Đang hoạt động", color: "text-emerald-500" },
            { num: "2", label: "Đang nghỉ phép", color: "text-amber-500" },
            { num: "1", label: "Đã nghỉ việc", color: "text-gray-400" },
          ].map((s) => (
            <div key={s.label} className="bg-white border border-gray-200 rounded-xl px-4 py-4">
              <div className={`text-2xl font-bold ${s.color}`}>{s.num}</div>
              <div className="text-[13px] text-gray-400">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-3 mb-5 flex-wrap">
          <input
            type="text"
            placeholder="🔍 Tìm tên, mã NV, SĐT..."
            className="flex-1 min-w-[200px] max-w-[300px] px-3.5 py-2.5 border-[1.5px] border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500"
          />
          <select className="px-3.5 py-2.5 border-[1.5px] border-gray-200 rounded-lg text-sm bg-white outline-none">
            <option>Tất cả chức vụ</option>
            {["Phục vụ", "Thu ngân", "Bếp trưởng", "Quản lý ca"].map((o) => <option key={o}>{o}</option>)}
          </select>
          <select className="px-3.5 py-2.5 border-[1.5px] border-gray-200 rounded-lg text-sm bg-white outline-none">
            <option>Tất cả trạng thái</option>
            {["Đang hoạt động", "Nghỉ phép", "Nghỉ việc"].map((o) => <option key={o}>{o}</option>)}
          </select>
        </div>

        {/* Table */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50">
                {["Nhân viên", "Chức vụ", "SĐT", "Ngày vào làm", "Trạng thái TK", "Trạng thái NV", "Thao tác"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wide border-b border-gray-200">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {staffList.map((staff) => (
                <tr key={staff.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3.5 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-full ${staff.avatarBg} text-white flex items-center justify-center font-bold text-sm flex-shrink-0`}>
                        {staff.initial}
                      </div>
                      <div>
                        <div className="text-sm font-semibold">{staff.name}</div>
                        <div className="text-xs text-gray-400">{staff.id} · {staff.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-sm border-b border-gray-100">{staff.role}</td>
                  <td className="px-4 py-3.5 text-sm border-b border-gray-100">{staff.phone}</td>
                  <td className="px-4 py-3.5 text-sm border-b border-gray-100">{staff.joinDate}</td>
                  <td className="px-4 py-3.5 border-b border-gray-100">
                    {staff.accountStatus === "active" ? (
                      <span className="inline-flex px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                        Hoạt động
                      </span>
                    ) : (
                      <span className="inline-flex px-2.5 py-1 rounded-full text-[11px] font-bold bg-gray-100 text-gray-700">
                        Đã khóa
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3.5 border-b border-gray-100">
                    {staff.workStatus === "working" && (
                      <span className="inline-flex px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">Đang làm</span>
                    )}
                    {staff.workStatus === "leave" && (
                      <span className="inline-flex px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800">Nghỉ phép</span>
                    )}
                    {staff.workStatus === "resigned" && (
                      <span className="inline-flex px-2.5 py-1 rounded-full text-[11px] font-bold bg-red-100 text-red-800">Nghỉ việc</span>
                    )}
                  </td>
                  <td className="px-4 py-3.5 border-b border-gray-100">
                    <div className="flex gap-1.5">
                      <button className="px-3.5 py-1.5 text-xs font-semibold border-[1.5px] border-gray-200 bg-white rounded-md hover:bg-gray-50 transition">
                        ✏️ Sửa
                      </button>
                      {staff.accountStatus === "active" ? (
                        <button className="px-3.5 py-1.5 text-xs font-semibold bg-red-50 text-red-500 border-[1.5px] border-red-200 rounded-md hover:bg-red-100 transition">
                          🔒 Khóa
                        </button>
                      ) : (
                        <button className="px-3.5 py-1.5 text-xs font-semibold bg-emerald-50 text-emerald-700 border-[1.5px] border-emerald-200 rounded-md hover:bg-emerald-100 transition">
                          🔓 Mở khóa
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex items-center justify-between px-5 py-3.5 border-t border-gray-200">
            <div className="text-[13px] text-gray-400">Hiển thị 1–5 / 14 nhân viên</div>
            <div className="flex gap-1">
              {["‹", "1", "2", "3", "›"].map((p, i) => (
                <button
                  key={i}
                  className={`w-8 h-8 border-[1.5px] rounded-md text-[13px] font-medium flex items-center justify-center ${
                    p === "1"
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Create Staff Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-[200] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-[500px] max-h-[85vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
              <div className="text-base font-bold">+ Tạo tài khoản nhân viên</div>
              <button onClick={() => setShowModal(false)} className="text-gray-400 text-xl hover:text-gray-600">×</button>
            </div>
            <div className="p-6">
              <div className="bg-amber-50 border border-amber-300 rounded-lg px-3.5 py-2.5 text-[13px] text-amber-800 mb-5">
                ⚠️ Tài khoản nhân viên chỉ có thể được tạo bởi Admin. Mật khẩu tạm thời sẽ gửi qua email.
              </div>

              <div className="text-[12px] font-bold text-gray-400 uppercase tracking-widest mb-3 pb-1.5 border-b border-gray-200">
                Thông tin cá nhân
              </div>
              <div className="grid grid-cols-2 gap-3.5 mb-0">
                <div className="mb-3.5">
                  <label className="block text-[13px] font-semibold mb-1.5">Họ và tên *</label>
                  <input type="text" placeholder="Nguyễn Văn A" className="w-full px-3.5 py-2.5 border-[1.5px] border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500 transition" />
                </div>
                <div className="mb-3.5">
                  <label className="block text-[13px] font-semibold mb-1.5">Mã nhân viên *</label>
                  <input type="text" defaultValue="NV015" className="w-full px-3.5 py-2.5 border-[1.5px] border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500 transition" />
                </div>
                <div className="mb-3.5">
                  <label className="block text-[13px] font-semibold mb-1.5">Số điện thoại *</label>
                  <input type="tel" placeholder="0901 234 567" className="w-full px-3.5 py-2.5 border-[1.5px] border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500 transition" />
                </div>
                <div className="mb-3.5">
                  <label className="block text-[13px] font-semibold mb-1.5">Chức vụ *</label>
                  <select className="w-full px-3.5 py-2.5 border-[1.5px] border-gray-200 rounded-lg text-sm bg-white outline-none focus:border-blue-500">
                    {["Phục vụ", "Thu ngân", "Bếp trưởng", "Quản lý ca"].map((o) => <option key={o}>{o}</option>)}
                  </select>
                </div>
              </div>
              <div className="mb-5">
                <label className="block text-[13px] font-semibold mb-1.5">Ngày vào làm *</label>
                <input type="date" defaultValue="2024-12-25" className="w-full px-3.5 py-2.5 border-[1.5px] border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500 transition" />
              </div>

              <div className="text-[12px] font-bold text-gray-400 uppercase tracking-widest mb-3 pb-1.5 border-b border-gray-200">
                Thông tin tài khoản
              </div>
              <div className="mb-3.5">
                <label className="block text-[13px] font-semibold mb-1.5">Email đăng nhập *</label>
                <input type="email" placeholder="nhanvien@vietbep.vn" className="w-full px-3.5 py-2.5 border-[1.5px] border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500 transition" />
              </div>
              <div>
                <label className="block text-[13px] font-semibold mb-1.5">Mật khẩu tạm thời *</label>
                <input type="text" defaultValue="VietBep@2024" className="w-full px-3.5 py-2.5 border-[1.5px] border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500 transition" />
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-gray-200">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border-[1.5px] border-gray-200 rounded-lg text-[13px] font-semibold bg-white hover:bg-gray-50 transition"
              >
                Hủy
              </button>
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[13px] font-semibold transition">
                Tạo tài khoản & Gửi email
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
