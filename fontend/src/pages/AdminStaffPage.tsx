import { useState, useEffect } from "react"
import AdminLayout from "../components/AdminLayout"
import { api } from "../lib/api";

type StaffItem = {
  id: number,
  name: string,
  email: string | null,
  role: { id: number, roleName: string } | null,
  phone: string | null,
  startDate: string | null,
  status: "ACTIVE" | "LOOKED",
  statusWork: "ACTIVE" | "ONLEAVE",
  staffId: string,
  position: string,
}

type NewStaffForm = {
  name: string,
  phone: string,
  position: string,
  joinDate: string,
  email: string,
  password: string,
}

const emptyForm: NewStaffForm = {
  name: "",
  phone: "",
  position: "",
  joinDate: "",
  email: "",
  password: "",
}

export default function AdminStaffPage() {
  const [showModal, setShowModal] = useState(false)
  const [staffList, setStaffList] = useState<StaffItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingStaff, setEditingStaff] = useState<StaffItem | null>(null);
  const [deletingStaff, setDeletingStaff] = useState<StaffItem | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<NewStaffForm>(emptyForm);
  const [refreshKey, setRefreshKey] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVE" | "ONLEAVE">("ALL");
  const [positionFilter, setPositionFilter] = useState<"ALL" | "Phục vụ" | "Thu ngân" | "Bếp trưởng" | "Quản lý ca">("ALL");

  const total = staffList.length;
  const active = staffList.filter(s => s.statusWork === "ACTIVE").length;
  const onLeave = staffList.filter(s => s.statusWork === "ONLEAVE").length;

  const filterStaff = staffList
    .filter(item => {
      const q = searchQuery.toLowerCase();
      const matchSearch = !q || item.name.toLowerCase().includes(q) || item.staffId.toLowerCase().includes(q) || (item.phone ?? "").includes(q);
      const matchPosition = positionFilter === "ALL" || item.position === positionFilter;
      const matchStatus = statusFilter === "ALL" || item.statusWork === statusFilter;
      return matchSearch && matchPosition && matchStatus;
    })

  useEffect(() => {
    let cancelled = false;
    api.get("/staff")
      .then(res => { if (!cancelled) setStaffList(res.data.data ?? []); })
      .catch(() => { if (!cancelled) setStaffList([]); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [refreshKey]);

  const refreshStaffList = () => {
    setLoading(true);
    setRefreshKey(k => k + 1);
  };

  async function handleAddStaff() {
    setError(null);
    if (!form.name || !form.phone || !form.position || !form.joinDate || !form.email || !form.password) {
      setError("Vui lòng điền đầy đủ thông tin.");
      return;
    }
    setSaving(true);
    try {
      await api.post("/staff", {
        name: form.name,
        phone: form.phone,
        position: form.position,
        startDate: form.joinDate,
        email: form.email,
        password: form.password,
      });
      setShowModal(false);
      setForm(emptyForm);
      refreshStaffList();
    } catch (error) {
      const axiosErr = error as { response?: { data?: { message?: string } } };
      setError(axiosErr?.response?.data?.message ?? "Thêm nhân viên thất bại. Vui lòng thử lại.");
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdateStaff() {
    if (!editingStaff) return;
    setError(null);
    if (!form.name || !form.phone || !form.position || !form.joinDate) {
      setError("Vui lòng điền đầy đủ thông tin.");
      return;
    }
    setSaving(true);
    try {
      await api.put(`/staff/${editingStaff.id}`, {
        name: form.name,
        phone: form.phone,
        position: form.position,
        startDate: form.joinDate,
      });
      setEditingStaff(null);
      setForm(emptyForm);
      refreshStaffList();
    } catch (error) {
      const axiosErr = error as { response?: { data?: { message?: string } } };
      setError(axiosErr?.response?.data?.message ?? "Cập nhật nhân viên thất bại. Vui lòng thử lại.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteStaff() {
    if (!deletingStaff) return;
    setError(null);
    setSaving(true);
    try {
      await api.delete(`/staff/${deletingStaff.id}`);
      setDeletingStaff(null);
      refreshStaffList();
    } catch (error) {
      const axiosErr = error as { response?: { data?: { message?: string } } };
      setError(axiosErr?.response?.data?.message ?? "Xóa nhân viên thất bại. Vui lòng thử lại.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminLayout
      title="👨‍💼 Quản lý Nhân viên"
      topbarRight={
        <button
          onClick={() => { setForm(emptyForm); setShowModal(true); }}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[13px] font-semibold transition"
        >
          + Tạo tài khoản nhân viên
        </button>
      }
    >
      <div className="p-7">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3.5 mb-6">
          {[
            { num: total, label: "Tổng nhân viên", color: "" },
            { num: active, label: "Đang hoạt động", color: "text-emerald-500" },
            { num: onLeave, label: "Đang nghỉ phép", color: "text-amber-500" },
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
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="flex-1 min-w-[200px] max-w-[300px] px-3.5 py-2.5 border-[1.5px] border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500"
          />
          <select
            value={positionFilter}
            onChange={e => setPositionFilter(e.target.value as typeof positionFilter)}
            className="px-3.5 py-2.5 border-[1.5px] border-gray-200 rounded-lg text-sm bg-white outline-none"
          >
            <option value="ALL">Tất cả chức vụ</option>
            {["Phục vụ", "Thu ngân", "Bếp trưởng", "Quản lý ca"].map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as typeof statusFilter)}
            className="px-3.5 py-2.5 border-[1.5px] border-gray-200 rounded-lg text-sm bg-white outline-none"
          >
            <option value="ALL">Tất cả trạng thái</option>
            <option value="ACTIVE">Đang hoạt động</option>
            <option value="ONLEAVE">Nghỉ phép</option>
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
              {loading ? (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-sm text-gray-400">Đang tải...</td></tr>
              ) : filterStaff.length === 0 ? (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-sm text-gray-400">Không tìm thấy nhân viên phù hợp.</td></tr>
              ) : filterStaff.map((staff) => (
                <tr key={staff.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3.5 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                        {staff.name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-sm font-semibold">{staff.name}</div>
                        <div className="text-xs text-gray-400">{staff.staffId} · {staff.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-sm border-b border-gray-100">{staff.position}</td>
                  <td className="px-4 py-3.5 text-sm border-b border-gray-100">{staff.phone ?? "—"}</td>
                  <td className="px-4 py-3.5 text-sm border-b border-gray-100">
                    {staff.startDate ? new Date(staff.startDate).toLocaleDateString("vi-VN") : "—"}
                  </td>
                  <td className="px-4 py-3.5 border-b border-gray-100">
                    {staff.status === "ACTIVE" ? (
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
                    {staff.statusWork === "ACTIVE" && (
                      <span className="inline-flex px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">Đang làm</span>
                    )}
                    {staff.statusWork === "ONLEAVE" && (
                      <span className="inline-flex px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800">Nghỉ phép</span>
                    )}
                  </td>
                  <td className="px-4 py-3.5 border-b border-gray-100">
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => {
                          setEditingStaff(staff);
                          setForm({
                            name: staff.name,
                            phone: staff.phone ?? "",
                            position: staff.position,
                            joinDate: staff.startDate ? staff.startDate.slice(0, 10) : "",
                            email: staff.email ?? "",
                            password: "",
                          });
                          setError(null);
                        }}
                        className="px-3.5 py-1.5 text-xs font-semibold border-[1.5px] border-gray-200 bg-white rounded-md hover:bg-gray-50 transition"
                      >
                        ✏️ Sửa
                      </button>
                      <button
                        onClick={() => setDeletingStaff(staff)}
                        className="px-3.5 py-1.5 text-xs font-semibold bg-red-50 text-red-500 border-[1.5px] border-red-200 rounded-md hover:bg-red-100 transition"
                      >
                        🗑️ Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex items-center justify-between px-5 py-3.5 border-t border-gray-200">
            <div className="text-[13px] text-gray-400">Hiển thị {filterStaff.length} / {total} nhân viên</div>
            <div className="flex gap-1">
              {["‹", "1", "2", "3", "›"].map((p, i) => (
                <button
                  key={i}
                  className={`w-8 h-8 border-[1.5px] rounded-md text-[13px] font-medium flex items-center justify-center ${p === "1"
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
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg px-3.5 py-2.5 text-[13px] text-red-700 mb-4">{error}</div>
              )}

              <div className="text-[12px] font-bold text-gray-400 uppercase tracking-widest mb-3 pb-1.5 border-b border-gray-200">
                Thông tin cá nhân
              </div>
              <div className="grid grid-cols-2 gap-3.5 mb-0">
                <div className="mb-3.5">
                  <label className="block text-[13px] font-semibold mb-1.5">Họ và tên *</label>
                  <input
                    type="text"
                    placeholder="Nguyễn Văn A"
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    className="w-full px-3.5 py-2.5 border-[1.5px] border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500 transition"
                  />
                </div>
                <div className="mb-3.5">
                  <label className="block text-[13px] font-semibold mb-1.5">Số điện thoại *</label>
                  <input
                    type="tel"
                    placeholder="0901 234 567"
                    value={form.phone}
                    onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    className="w-full px-3.5 py-2.5 border-[1.5px] border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500 transition"
                  />
                </div>
                <div className="mb-3.5">
                  <label className="block text-[13px] font-semibold mb-1.5">Chức vụ *</label>
                  <select
                    value={form.position}
                    onChange={e => setForm(f => ({ ...f, position: e.target.value }))}
                    className="w-full px-3.5 py-2.5 border-[1.5px] border-gray-200 rounded-lg text-sm bg-white outline-none focus:border-blue-500"
                  >
                    <option value="">-- Chọn chức vụ --</option>
                    {["Phục vụ", "Thu ngân", "Bếp trưởng", "Quản lý ca"].map((o) => <option key={o}>{o}</option>)}
                  </select>
                </div>
                <div className="mb-3.5">
                  <label className="block text-[13px] font-semibold mb-1.5">Ngày vào làm *</label>
                  <input
                    type="date"
                    value={form.joinDate}
                    onChange={e => setForm(f => ({ ...f, joinDate: e.target.value }))}
                    className="w-full px-3.5 py-2.5 border-[1.5px] border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500 transition"
                  />
                </div>
              </div>

              <div className="text-[12px] font-bold text-gray-400 uppercase tracking-widest mb-3 pb-1.5 border-b border-gray-200">
                Thông tin tài khoản
              </div>
              <div className="mb-3.5">
                <label className="block text-[13px] font-semibold mb-1.5">Email đăng nhập *</label>
                <input
                  type="email"
                  placeholder="nhanvien@vietbep.vn"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  className="w-full px-3.5 py-2.5 border-[1.5px] border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500 transition"
                />
              </div>
              <div>
                <label className="block text-[13px] font-semibold mb-1.5">Mật khẩu tạm thời *</label>
                <input
                  type="text"
                  placeholder="Ít nhất 6 ký tự"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  className="w-full px-3.5 py-2.5 border-[1.5px] border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500 transition"
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-gray-200">
              <button
                onClick={() => { setShowModal(false); setError(null); }}
                className="px-4 py-2 border-[1.5px] border-gray-200 rounded-lg text-[13px] font-semibold bg-white hover:bg-gray-50 transition"
              >
                Hủy
              </button>
              <button
                onClick={handleAddStaff}
                disabled={saving}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white rounded-lg text-[13px] font-semibold transition"
              >
                {saving ? "Đang tạo..." : "Tạo tài khoản"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Staff Modal */}
      {editingStaff && (
        <div className="fixed inset-0 bg-black/40 z-[200] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-[500px] max-h-[85vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
              <div className="text-base font-bold">✏️ Cập nhật nhân viên</div>
              <button onClick={() => { setEditingStaff(null); setError(null); }} className="text-gray-400 text-xl hover:text-gray-600">×</button>
            </div>
            <div className="p-6">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg px-3.5 py-2.5 text-[13px] text-red-700 mb-4">{error}</div>
              )}
              <div className="grid grid-cols-2 gap-3.5">
                <div className="mb-3.5">
                  <label className="block text-[13px] font-semibold mb-1.5">Họ và tên *</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    className="w-full px-3.5 py-2.5 border-[1.5px] border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500 transition"
                  />
                </div>
                <div className="mb-3.5">
                  <label className="block text-[13px] font-semibold mb-1.5">Số điện thoại *</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    className="w-full px-3.5 py-2.5 border-[1.5px] border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500 transition"
                  />
                </div>
                <div className="mb-3.5">
                  <label className="block text-[13px] font-semibold mb-1.5">Chức vụ *</label>
                  <select
                    value={form.position}
                    onChange={e => setForm(f => ({ ...f, position: e.target.value }))}
                    className="w-full px-3.5 py-2.5 border-[1.5px] border-gray-200 rounded-lg text-sm bg-white outline-none focus:border-blue-500"
                  >
                    {["Phục vụ", "Thu ngân", "Bếp trưởng", "Quản lý ca"].map((o) => <option key={o}>{o}</option>)}
                  </select>
                </div>
                <div className="mb-3.5">
                  <label className="block text-[13px] font-semibold mb-1.5">Ngày vào làm *</label>
                  <input
                    type="date"
                    value={form.joinDate}
                    onChange={e => setForm(f => ({ ...f, joinDate: e.target.value }))}
                    className="w-full px-3.5 py-2.5 border-[1.5px] border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500 transition"
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-gray-200">
              <button
                onClick={() => { setEditingStaff(null); setError(null); }}
                className="px-4 py-2 border-[1.5px] border-gray-200 rounded-lg text-[13px] font-semibold bg-white hover:bg-gray-50 transition"
              >
                Hủy
              </button>
              <button
                onClick={handleUpdateStaff}
                disabled={saving}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white rounded-lg text-[13px] font-semibold transition"
              >
                {saving ? "Đang lưu..." : "Lưu thay đổi"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingStaff && (
        <div className="fixed inset-0 bg-black/40 z-[200] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-[400px] shadow-2xl p-6">
            <div className="text-base font-bold mb-2">Xác nhận xóa nhân viên</div>
            <p className="text-sm text-gray-500 mb-5">
              Bạn có chắc muốn xóa nhân viên <span className="font-semibold text-gray-800">{deletingStaff.name}</span>? Hành động này không thể hoàn tác.
            </p>
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg px-3.5 py-2.5 text-[13px] text-red-700 mb-4">{error}</div>
            )}
            <div className="flex justify-end gap-2">
              <button
                onClick={() => { setDeletingStaff(null); setError(null); }}
                className="px-4 py-2 border-[1.5px] border-gray-200 rounded-lg text-[13px] font-semibold bg-white hover:bg-gray-50 transition"
              >
                Hủy
              </button>
              <button
                onClick={handleDeleteStaff}
                disabled={saving}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white rounded-lg text-[13px] font-semibold transition"
              >
                {saving ? "Đang xóa..." : "Xóa nhân viên"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
