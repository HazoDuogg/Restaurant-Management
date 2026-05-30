import { useState, useEffect } from "react"
import AdminLayout from "../components/AdminLayout"
import { api } from "../lib/api";

type MenuItem = {
  id: number;
  name: string;
  price: number;
  description: string | null;
  status: "AVAILABLE" | "UNAVAILABLE";
  category: { id: number; name: string } | null;
}

type Category = {
  id: number;
  name: string;
}

type NewItemForm = {
  name: string;
  price: string;
  description: string;
  categoryId: string;
  status: "AVAILABLE" | "UNAVAILABLE";
}

const emptyForm: NewItemForm = { name: "", price: "", description: "", categoryId: "", status: "AVAILABLE" };

export default function AdminMenuPage() {
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<MenuItem | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [newItem, setNewItem] = useState<NewItemForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "AVAILABLE" | "UNAVAILABLE">("ALL");
  const [categoryFilter, setCategoryFilter] = useState("");

  useEffect(() => {
    api.get("/menu-items").then(res => {
      setMenuItems(res.data.data);
    }).catch(err => {
      console.error("Lỗi khi lấy món ăn", err);
    });
    api.get("/categories").then(res => {
      setCategories(res.data.data);
    }).catch(err => {
      console.error("Lỗi khi lấy danh mục", err);
    });
  }, []);

  function handleOpenEdit(item: MenuItem) {
    setEditingItem(item);
    setNewItem({
      name: item.name,
      price: String(item.price),
      description: item.description ?? "",
      categoryId: item.category ? String(item.category.id) : "",
      status: item.status,
    });
    setFormError(null);
    setShowModal(true);
  }

  function handleCloseModal() {
    setNewItem(emptyForm)
    setEditingItem(null)
    setFormError(null)
    setShowModal(false)
  }

  async function handleAddItem() {
    if (!newItem.name.trim()) { setFormError("Vui lòng nhập tên món ăn."); return; }
    if (!newItem.price || Number(newItem.price) <= 0) { setFormError("Vui lòng nhập giá hợp lệ."); return; }
    setSaving(true);
    setFormError(null);
    try {
      await api.post("/menu-items", {
        name: newItem.name.trim(),
        price: Number(newItem.price),
        description: newItem.description.trim() || null,
        categoryId: newItem.categoryId ? Number(newItem.categoryId) : null,
      });
      const res = await api.get("/menu-items");
      setMenuItems(res.data.data);
      handleCloseModal();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setFormError(msg ?? "Có lỗi xảy ra, vui lòng thử lại.");
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdateItem() {
    if (!editingItem) return;
    if (!newItem.name.trim()) { setFormError("Vui lòng nhập tên món ăn."); return; }
    if (!newItem.price || Number(newItem.price) <= 0) { setFormError("Vui lòng nhập giá hợp lệ."); return; }
    setSaving(true);
    setFormError(null);
    try {
      await api.put(`/menu-items/${editingItem.id}`, {
        name: newItem.name.trim(),
        price: Number(newItem.price),
        description: newItem.description.trim() || null,
        categoryId: newItem.categoryId ? Number(newItem.categoryId) : null,
        status: newItem.status,
      });
      const res = await api.get("/menu-items");
      setMenuItems(res.data.data);
      handleCloseModal();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setFormError(msg ?? "Có lỗi xảy ra, vui lòng thử lại.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteItem() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.delete(`/menu-items/${deleteTarget.id}`);
      const res = await api.get("/menu-items");
      setMenuItems(res.data.data);
      setDeleteTarget(null);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      alert(msg ?? "Xóa thất bại, vui lòng thử lại.");
    } finally {
      setDeleting(false);
    }
  }

  const filteredItems = menuItems
    .filter(item => activeCategoryId === null || item.category?.id === activeCategoryId)
    .filter(item => !searchQuery.trim() || item.name.toLowerCase().includes(searchQuery.trim().toLowerCase()))
    .filter(item => statusFilter === "ALL" || item.status === statusFilter)
    .filter(item => !categoryFilter || item.category?.name === categoryFilter);

  const totalActive = menuItems.filter(i => i.status === "AVAILABLE").length;
  const totalInactive = menuItems.filter(i => i.status === "UNAVAILABLE").length;

  return (
    <AdminLayout
      title="🍽️ Quản lý Món Ăn"
      topbarRight={
        <>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[13px] font-semibold transition"
          >
            + Thêm món mới
          </button>
        </>
      }
    >
      <div className="p-7">
        {/* Mini stats */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          {[
            { num: menuItems.length, label: "Tổng số món", color: "" },
            { num: totalActive, label: "Đang bán", color: "text-emerald-500" },
            { num: totalInactive, label: "Tạm ẩn", color: "text-gray-400" },
          ].map((s) => (
            <div key={s.label} className="bg-white border border-gray-200 rounded-xl px-4 py-3.5">
              <div className={`text-xl font-bold ${s.color}`}>{s.num}</div>
              <div className="text-xs text-gray-400 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-3 mb-5 flex-wrap">
          <input
            type="text"
            placeholder="🔍 Tìm kiếm món ăn..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="flex-1 min-w-[200px] max-w-[300px] px-3.5 py-2.5 border-[1.5px] border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500"
          />
          <select className="px-3.5 py-2.5 border-[1.5px] border-gray-200 rounded-lg text-sm bg-white outline-none"
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
          >
            <option value="">Tất cả danh mục</option>
            {categories.map((cat) => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
          </select>
          <select className="px-3.5 py-2.5 border-[1.5px] border-gray-200 rounded-lg text-sm bg-white outline-none"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as "ALL" | "AVAILABLE" | "UNAVAILABLE")}
          >
            <option value="ALL">Tất cả trạng thái</option>
            <option value="AVAILABLE">Đang bán</option>
            <option value="UNAVAILABLE">Tạm ẩn</option>
          </select>
        </div>

        {/* Category tabs */}
        <div className="flex gap-1.5 flex-wrap mb-5">
          <button
            onClick={() => setActiveCategoryId(null)}
            className={`px-4 py-1.5 rounded-full text-[13px] font-medium border-[1.5px] transition ${activeCategoryId === null
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"
              }`}
          >
            Tất cả
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategoryId(cat.id)}
              className={`px-4 py-1.5 rounded-full text-[13px] font-medium border-[1.5px] transition ${activeCategoryId === cat.id
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"
                }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 w-8 border-b border-gray-200">
                  <input type="checkbox" className="rounded" />
                </th>
                {["Món Ăn", "Danh mục", "Giá bán", "Trạng thái", "Thao tác"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wide border-b border-gray-200">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-sm text-gray-400">
                    Không có món ăn nào
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 border-b border-gray-100">
                      <input type="checkbox" className="rounded" />
                    </td>
                    <td className="px-4 py-3 border-b border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-lg flex items-center justify-center text-[22px] flex-shrink-0 bg-gray-100">
                          🍽️
                        </div>
                        <div>
                          <div className="text-sm font-semibold">{item.name}</div>
                          <div className="text-xs text-gray-400">ID: #{item.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm border-b border-gray-100">{item.category?.name ?? "—"}</td>
                    <td className="px-4 py-3 text-sm font-bold border-b border-gray-100">
                      {item.price.toLocaleString("vi-VN")}đ
                    </td>
                    <td className="px-4 py-3 border-b border-gray-100">
                      {item.status === "AVAILABLE" ? (
                        <span className="inline-flex px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                          Đang bán
                        </span>
                      ) : (
                        <span className="inline-flex px-2.5 py-1 rounded-full text-[11px] font-bold bg-gray-100 text-gray-700">
                          Tạm ẩn
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 border-b border-gray-100">
                      <div className="flex gap-1.5">
                        <button className="px-3.5 py-1.5 text-xs font-semibold border-[1.5px] border-gray-200 bg-white rounded-md hover:bg-gray-50 transition"
                          onClick={() => handleOpenEdit(item)}>
                          ✏️ Sửa
                        </button>
                        <button className="px-3.5 py-1.5 text-xs font-semibold bg-red-50 text-red-500 border-[1.5px] border-red-200 rounded-md hover:bg-red-100 transition"
                          onClick={() => setDeleteTarget(item)}>
                          🗑️ Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex items-center justify-between px-5 py-3.5 border-t border-gray-200">
            <div className="text-[13px] text-gray-400">Hiển thị {filteredItems.length} / {menuItems.length} món</div>
            <div className="flex gap-1">
              {["‹", "1", "›"].map((p, i) => (
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

      {/* Delete Confirm Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/40 z-[200] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-[400px] shadow-2xl p-6">
            <div className="text-base font-bold mb-2">Xác nhận xóa món ăn</div>
            <p className="text-sm text-gray-500 mb-5">
              Bạn có chắc muốn xóa món <span className="font-semibold text-gray-800">{deleteTarget.name}</span>? Hành động này không thể hoàn tác.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
                className="px-4 py-2 border-[1.5px] border-gray-200 rounded-lg text-[13px] font-semibold bg-white hover:bg-gray-50 transition"
              >
                Hủy
              </button>
              <button
                onClick={handleDeleteItem}
                disabled={deleting}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white rounded-lg text-[13px] font-semibold transition"
              >
                {deleting ? "Đang xóa..." : "Xóa món ăn"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Menu Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-[200] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-[520px] max-h-[85vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
              <div className="text-base font-bold">{editingItem ? "✏️ Sửa món ăn" : "+ Thêm món ăn mới"}</div>
              <button onClick={handleCloseModal} className="text-gray-400 text-xl hover:text-gray-600">×</button>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <label className="block text-[13px] font-semibold mb-1.5">Tên món ăn *</label>
                <input
                  className="w-full px-3.5 py-2.5 border-[1.5px] border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500 transition"
                  type="text"
                  placeholder="VD: Phở Bò Đặc Biệt"
                  value={newItem.name}
                  onChange={e => setNewItem(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-2 gap-3.5 mb-4">
                <div>
                  <label className="block text-[13px] font-semibold mb-1.5">Danh mục *</label>
                  <select
                    className="w-full px-3.5 py-2.5 border-[1.5px] border-gray-200 rounded-lg text-sm bg-white outline-none focus:border-blue-500"
                    value={newItem.categoryId}
                    onChange={e => setNewItem(prev => ({ ...prev, categoryId: e.target.value }))}
                  >
                    <option value="">-- Chọn danh mục --</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[13px] font-semibold mb-1.5">Giá bán (đồng) *</label>
                  <input
                    type="number"
                    className="w-full px-3.5 py-2.5 border-[1.5px] border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500 transition"
                    placeholder="95000"
                    value={newItem.price}
                    onChange={e => setNewItem(prev => ({ ...prev, price: e.target.value }))}
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-[13px] font-semibold mb-1.5">Mô tả</label>
                <textarea
                  rows={3}
                  className="w-full px-3.5 py-2.5 border-[1.5px] border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500 transition resize-none"
                  placeholder="Mô tả ngắn về món ăn..."
                  value={newItem.description}
                  onChange={e => setNewItem(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-[13px] font-semibold mb-1.5">Trạng thái</label>
                <select
                  className="w-full px-3.5 py-2.5 border-[1.5px] border-gray-200 rounded-lg text-sm bg-white outline-none focus:border-blue-500"
                  value={newItem.status}
                  onChange={e => setNewItem(prev => ({ ...prev, status: e.target.value as "AVAILABLE" | "UNAVAILABLE" }))}
                >
                  <option value="AVAILABLE">Đang bán</option>
                  <option value="UNAVAILABLE">Tạm ẩn</option>
                </select>
              </div>
              {formError && (
                <p className="mt-3 text-xs text-red-500 font-medium">{formError}</p>
              )}
            </div>
            <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-gray-200">
              <button
                onClick={handleCloseModal}
                disabled={saving}
                className="px-4 py-2 border-[1.5px] border-gray-200 rounded-lg text-[13px] font-semibold bg-white hover:bg-gray-50 transition"
              >
                Hủy
              </button>
              <button
                onClick={editingItem ? handleUpdateItem : handleAddItem}
                disabled={saving}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white rounded-lg text-[13px] font-semibold transition"
              >
                {saving ? "Đang lưu..." : editingItem ? "Cập nhật" : "Lưu món ăn"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
