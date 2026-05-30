import { useState, useEffect } from "react"
import AdminLayout from "../components/AdminLayout"
import { api } from "../lib/api"

type TableData = {
  id: number;
  tableNumber: number;
  capacity: number;
  type: "NORMAL" | "VIP";
  status: "AVAILABLE" | "RESERVED" | "OCCUPIED";
};

type NewTableForm = {
  tableNumber: string;
  capacity: string;
  type: "NORMAL" | "VIP";
};

const statusCard: Record<TableData["status"], string> = {
  AVAILABLE: "bg-emerald-100 border-emerald-300 hover:-translate-y-0.5 hover:shadow-md cursor-pointer",
  OCCUPIED: "bg-red-100 border-red-300 cursor-default",
  RESERVED: "bg-amber-100 border-amber-300 cursor-pointer",
}
const statusText: Record<TableData["status"], string> = {
  AVAILABLE: "text-emerald-800",
  OCCUPIED: "text-red-800",
  RESERVED: "text-amber-800",
}
const statusBadge: Record<TableData["status"], string> = {
  AVAILABLE: "bg-emerald-100 text-emerald-800",
  OCCUPIED: "bg-red-100 text-red-800",
  RESERVED: "bg-amber-100 text-amber-800",
}
const statusLabel: Record<TableData["status"], string> = {
  AVAILABLE: "Còn trống",
  OCCUPIED: "Đang phục vụ",
  RESERVED: "Đã đặt trước",
}

const emptyForm: NewTableForm = { tableNumber: "", capacity: "", type: "NORMAL" };

export default function AdminTablesPage() {
  const [tables, setTables] = useState<TableData[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [selected, setSelected] = useState<TableData | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<NewTableForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({ tableNumber: "", capacity: "" });
  const [editError, setEditError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    api.get("/tables")
      .then(res => { if (!cancelled) setTables(res.data.data ?? []); })
      .catch(() => { if (!cancelled) setTables([]); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [refreshKey]);

  const refreshTables = () => {
    setLoading(true);
    setRefreshKey(k => k + 1);
  };

  const normalTables = tables.filter(t => t.type === "NORMAL");
  const vipTables = tables.filter(t => t.type === "VIP");
  const total = tables.length;
  const available = tables.filter(t => t.status === "AVAILABLE").length;
  const occupied = tables.filter(t => t.status === "OCCUPIED").length;
  const reserved = tables.filter(t => t.status === "RESERVED").length;

  async function handleAddTable() {
    setFormError(null);
    if (!form.tableNumber || !form.capacity) {
      setFormError("Vui lòng điền đầy đủ thông tin.");
      return;
    }
    setSaving(true);
    try {
      await api.post("/tables", {
        tableNumber: Number(form.tableNumber),
        capacity: Number(form.capacity),
        type: form.type,
      });
      setShowModal(false);
      setForm(emptyForm);
      refreshTables();
    } catch (err) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      setFormError(axiosErr?.response?.data?.message ?? "Thêm bàn thất bại.");
    } finally {
      setSaving(false);
    }
  };

  async function handleChangeStatus(newStatus: TableData["status"]) {
    if (!selected) return;
    try {
      await api.patch(`/tables/${selected.id}/status`, { status: newStatus });
      setShowStatusModal(false);
      refreshTables();
      setSelected(null);
    } catch (err) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      setFormError(axiosErr?.response?.data?.message ?? "Thay đổi thất bại.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteTable() {
    if (!selected) return;
    setDeleting(true);
    try {
      await api.delete(`/tables/${selected.id}`);
      setShowDeleteModal(false);
      setSelected(null);
      refreshTables();
    } catch (err) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      setFormError(axiosErr?.response?.data?.message ?? "Xóa bàn thất bại.");
      setShowDeleteModal(false);
    } finally {
      setDeleting(false);
    }
  }

  async function handleEditTable() {
    setEditError(null);
    if (!editForm.tableNumber || !editForm.capacity) {
      setEditError("Vui lòng điền đầy đủ thông tin.");
      return;
    }
    if (!selected) return;
    setSaving(true);
    try {
      await api.put(`/tables/${selected.id}`, {
        tableNumber: Number(editForm.tableNumber),
        capacity: Number(editForm.capacity),
      });
      setShowEditModal(false);
      refreshTables();
    } catch (err) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      setEditError(axiosErr?.response?.data?.message ?? "Cập nhật bàn thất bại.");
    } finally {
      setSaving(false);
    }
  }

  const renderTable = (table: TableData) => (
    <div
      key={table.id}
      onClick={() => setSelected(table)}
      className={`rounded-xl p-3 text-center transition-all border-2 ${statusCard[table.status]} ${selected?.id === table.id ? "!border-blue-500 ring-2 ring-blue-100" : ""}`}
    >
      <div className="text-[28px] mb-1">{table.capacity >= 8 ? "🛋️" : "🪑"}</div>
      <div className="text-[13px] font-bold">Bàn {String(table.tableNumber).padStart(2, "0")}</div>
      <div className="text-[11px] opacity-60 mt-0.5">{table.capacity} người</div>
      <div className={`text-[10px] font-bold mt-1 uppercase tracking-wide ${statusText[table.status]}`}>
        {statusLabel[table.status]}
      </div>
    </div>
  );

  return (
    <AdminLayout
      title="🪑 Quản lý Bàn"
      topbarRight={
        <>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[13px] font-semibold transition"
          >
            + Thêm bàn
          </button>
        </>
      }
    >
      <div className="p-7">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-3.5 mb-6">
          {[
            { num: total, label: "Tổng số bàn", color: "" },
            { num: available, label: "Còn trống", color: "text-emerald-500" },
            { num: occupied, label: "Đang phục vụ", color: "text-red-500" },
            { num: reserved, label: "Đã đặt trước", color: "text-amber-500" },
          ].map((s) => (
            <div key={s.label} className="bg-white border border-gray-200 rounded-xl px-4 py-4">
              <div className={`text-2xl font-bold ${s.color}`}>{s.num}</div>
              <div className="text-[13px] text-gray-400">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Floor plan */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="text-[15px] font-bold">Sơ đồ mặt bằng nhà hàng</div>
            <div className="flex gap-4">
              {[
                { bg: "bg-emerald-100 border border-emerald-300", label: "Còn trống" },
                { bg: "bg-red-100 border border-red-300", label: "Đang phục vụ" },
                { bg: "bg-amber-100 border border-amber-300", label: "Đã đặt trước" },
              ].map((l) => (
                <div key={l.label} className="flex items-center gap-1.5 text-xs text-gray-500">
                  <div className={`w-3.5 h-3.5 rounded-sm ${l.bg}`} />
                  {l.label}
                </div>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12 text-sm text-gray-400">Đang tải danh sách bàn...</div>
          ) : tables.length === 0 ? (
            <div className="text-center py-12 text-sm text-gray-400">Chưa có bàn nào. Hãy thêm bàn mới.</div>
          ) : (
            <div className="flex gap-3.5">
              {/* Normal tables */}
              <div className="flex-1">
                <div className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2.5">
                  Khu vực thường
                </div>
                <div className="grid grid-cols-5 gap-3 p-4 bg-gray-50 rounded-xl">
                  {normalTables.map(renderTable)}
                </div>
              </div>

              {vipTables.length > 0 && (
                <>
                  <div className="w-px bg-gray-200 flex-shrink-0" />
                  <div style={{ width: "38%" }}>
                    <div className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2.5">
                      Khu VIP
                    </div>
                    <div className="flex flex-col gap-3 p-4 bg-gray-50 rounded-xl">
                      {vipTables.map(renderTable)}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Info panel */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 mt-4">
          <div className="text-sm font-bold mb-3.5">
            🪑 Thông tin bàn —{" "}
            <span className={selected ? "text-gray-800" : "text-gray-400"}>
              {selected ? `Bàn ${String(selected.tableNumber).padStart(2, "0")}` : "Chọn bàn để xem chi tiết"}
            </span>
          </div>
          {selected ? (
            <>
              <div className="grid grid-cols-2 gap-x-6">
                {[
                  { label: "Số bàn", value: `Bàn ${String(selected.tableNumber).padStart(2, "0")}` },
                  { label: "Sức chứa", value: `${selected.capacity} người` },
                  { label: "Khu vực", value: selected.type === "VIP" ? "Khu VIP" : "Khu trong" },
                  {
                    label: "Trạng thái",
                    value: (
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-[11px] font-bold ${statusBadge[selected.status]}`}>
                        {statusLabel[selected.status]}
                      </span>
                    ),
                  },
                ].map((row, i) => (
                  <div key={i} className="flex items-center justify-between text-[13px] py-2 border-b border-gray-100">
                    <span className="text-gray-400">{row.label}</span>
                    <span className="font-semibold">{row.value}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => {
                    setEditForm({ tableNumber: String(selected.tableNumber), capacity: String(selected.capacity) });
                    setEditError(null);
                    setShowEditModal(true);
                  }}
                  className="px-3.5 py-1.5 text-xs font-semibold border-[1.5px] border-gray-200 bg-white rounded-lg hover:bg-gray-50 transition"
                >
                  ✏️ Chỉnh sửa bàn
                </button>
                <button
                  onClick={() => setShowStatusModal(true)}
                  className="px-3.5 py-1.5 text-xs font-semibold bg-amber-50 text-amber-800 border-[1.5px] border-amber-300 rounded-lg hover:bg-amber-100 transition"
                >
                  🔄 Đổi trạng thái
                </button>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="px-3.5 py-1.5 text-xs font-semibold bg-red-50 text-red-700 border-[1.5px] border-red-200 rounded-lg hover:bg-red-100 transition ml-auto"
                >
                  🗑️ Xóa bàn
                </button>
              </div>
            </>
          ) : (
            <p className="text-[13px] text-gray-400">
              Nhấn vào bàn bất kỳ trên sơ đồ để xem thông tin chi tiết.
            </p>
          )}
        </div>
      </div>

      {/* Delete Confirm Modal */}
      {showDeleteModal && selected && (
        <div className="fixed inset-0 bg-black/40 z-[200] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-[380px] shadow-2xl">
            <div className="px-6 py-5 border-b border-gray-200">
              <div className="text-base font-bold text-red-600">🗑️ Xóa bàn</div>
            </div>
            <div className="p-6">
              <p className="text-[13px] text-gray-600">
                Bạn có chắc muốn xóa{" "}
                <span className="font-semibold text-gray-900">Bàn {String(selected.tableNumber).padStart(2, "0")}</span>{" "}
                ({selected.capacity} người) không? Hành động này không thể hoàn tác.
              </p>
            </div>
            <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-gray-200">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border-[1.5px] border-gray-200 rounded-lg text-[13px] font-semibold bg-white hover:bg-gray-50 transition"
              >
                Hủy
              </button>
              <button
                onClick={handleDeleteTable}
                disabled={deleting}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-lg text-[13px] font-semibold transition"
              >
                {deleting ? "Đang xóa..." : "Xóa bàn"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Change Status Modal */}
      {showStatusModal && selected && (
        <div className="fixed inset-0 bg-black/40 z-[200] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-[360px] shadow-2xl">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
              <div className="text-base font-bold">🔄 Đổi trạng thái bàn</div>
              <button onClick={() => setShowStatusModal(false)} className="text-gray-400 text-xl hover:text-gray-600">×</button>
            </div>
            <div className="p-6">
              <p className="text-[13px] text-gray-500 mb-4">
                Chọn trạng thái mới cho <span className="font-semibold text-gray-800">Bàn {String(selected.tableNumber).padStart(2, "0")}</span>
              </p>
              <div className="flex flex-col gap-2">
                {(["AVAILABLE", "OCCUPIED", "RESERVED"] as TableData["status"][]).map((s) => (
                  <button
                    key={s}
                    disabled={selected.status === s}
                    onClick={() => handleChangeStatus(s)}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl border-[1.5px] text-[13px] font-semibold transition
                      ${selected.status === s
                        ? "opacity-40 cursor-not-allowed border-gray-200 bg-gray-50"
                        : `${statusCard[s]} hover:opacity-90`}`}
                  >
                    <span className={statusText[s]}>{statusLabel[s]}</span>
                    {selected.status === s && <span className="text-[11px] text-gray-400">Hiện tại</span>}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Table Modal */}
      {showEditModal && selected && (
        <div className="fixed inset-0 bg-black/40 z-[200] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-[420px] shadow-2xl">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
              <div className="text-base font-bold">✏️ Chỉnh sửa bàn {String(selected.tableNumber).padStart(2, "0")}</div>
              <button onClick={() => setShowEditModal(false)} className="text-gray-400 text-xl hover:text-gray-600">×</button>
            </div>
            <div className="p-6">
              {editError && (
                <div className="mb-4 px-3 py-2 rounded-lg bg-red-50 text-red-600 text-[13px]">{editError}</div>
              )}
              <div className="mb-4">
                <label className="block text-[13px] font-semibold mb-1.5">Số bàn *</label>
                <input
                  type="number"
                  value={editForm.tableNumber}
                  onChange={e => setEditForm(f => ({ ...f, tableNumber: e.target.value }))}
                  className="w-full px-3.5 py-2.5 border-[1.5px] border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500 transition"
                />
              </div>
              <div className="mb-4">
                <label className="block text-[13px] font-semibold mb-1.5">Sức chứa (số người) *</label>
                <input
                  type="number"
                  value={editForm.capacity}
                  onChange={e => setEditForm(f => ({ ...f, capacity: e.target.value }))}
                  className="w-full px-3.5 py-2.5 border-[1.5px] border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500 transition"
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-gray-200">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 border-[1.5px] border-gray-200 rounded-lg text-[13px] font-semibold bg-white hover:bg-gray-50 transition"
              >
                Hủy
              </button>
              <button
                onClick={handleEditTable}
                disabled={saving}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg text-[13px] font-semibold transition"
              >
                {saving ? "Đang lưu..." : "Lưu thay đổi"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Table Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-[200] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-[420px] shadow-2xl">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
              <div className="text-base font-bold">+ Thêm bàn mới</div>
              <button onClick={() => { setShowModal(false); setForm(emptyForm); setFormError(null); }} className="text-gray-400 text-xl hover:text-gray-600">×</button>
            </div>
            <div className="p-6">
              {formError && (
                <div className="mb-4 px-3 py-2 rounded-lg bg-red-50 text-red-600 text-[13px]">{formError}</div>
              )}
              <div className="mb-4">
                <label className="block text-[13px] font-semibold mb-1.5">Số bàn *</label>
                <input
                  type="number"
                  placeholder="VD: 13"
                  value={form.tableNumber}
                  onChange={e => setForm(f => ({ ...f, tableNumber: e.target.value }))}
                  className="w-full px-3.5 py-2.5 border-[1.5px] border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500 transition"
                />
              </div>
              <div className="mb-4">
                <label className="block text-[13px] font-semibold mb-1.5">Sức chứa (số người) *</label>
                <input
                  type="number"
                  placeholder="VD: 4"
                  value={form.capacity}
                  onChange={e => setForm(f => ({ ...f, capacity: e.target.value }))}
                  className="w-full px-3.5 py-2.5 border-[1.5px] border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500 transition"
                />
              </div>
              <div className="mb-4">
                <label className="block text-[13px] font-semibold mb-1.5">Khu vực</label>
                <select
                  value={form.type}
                  onChange={e => setForm(f => ({ ...f, type: e.target.value as "NORMAL" | "VIP" }))}
                  className="w-full px-3.5 py-2.5 border-[1.5px] border-gray-200 rounded-lg text-sm bg-white outline-none focus:border-blue-500"
                >
                  <option value="NORMAL">Khu trong</option>
                  <option value="VIP">Khu VIP</option>
                </select>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-gray-200">
              <button
                onClick={() => { setShowModal(false); setForm(emptyForm); setFormError(null); }}
                className="px-4 py-2 border-[1.5px] border-gray-200 rounded-lg text-[13px] font-semibold bg-white hover:bg-gray-50 transition"
              >
                Hủy
              </button>
              <button
                onClick={handleAddTable}
                disabled={saving}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg text-[13px] font-semibold transition"
              >
                {saving ? "Đang thêm..." : "Thêm bàn"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
