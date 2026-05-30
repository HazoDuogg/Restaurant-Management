import { useState } from "react"
import AdminLayout from "../components/AdminLayout"

const menuItems = [
  { id: "MN001", emoji: "🍜", bg: "bg-amber-50", name: "Phở Bò Đặc Biệt", category: "Súp & Bún", price: "95,000đ", status: "active", sold: 348 },
  { id: "MN002", emoji: "🥘", bg: "bg-pink-50", name: "Bún Bò Huế", category: "Súp & Bún", price: "85,000đ", status: "active", sold: 210 },
  { id: "MN003", emoji: "🍗", bg: "bg-emerald-50", name: "Gà Nướng Mắc Khén", category: "Món chính", price: "145,000đ", status: "active", sold: 185 },
  { id: "MN004", emoji: "🥗", bg: "bg-violet-50", name: "Gỏi Cuốn Tôm Thịt", category: "Khai vị", price: "65,000đ", status: "active", sold: 156 },
  { id: "MN005", emoji: "🦐", bg: "bg-amber-50", name: "Tôm Hùm Nướng Phô Mai", category: "Món chính", price: "380,000đ", status: "hidden", sold: 42 },
  { id: "MN006", emoji: "🥩", bg: "bg-blue-50", name: "Bò Lúc Lắc", category: "Món chính", price: "175,000đ", status: "active", sold: 128 },
  { id: "MN007", emoji: "🍮", bg: "bg-red-50", name: "Chè Bà Ba", category: "Tráng miệng", price: "35,000đ", status: "active", sold: 95 },
]

const categories = [
  "Tất cả (85)", "Khai vị (12)", "Món chính (28)",
  "Súp & Bún (18)", "Lẩu (8)", "Tráng miệng (10)", "Đồ uống (9)",
]

export default function AdminMenuPage() {
  const [showModal, setShowModal] = useState(false)
  const [activeCategory, setActiveCategory] = useState(0)

  return (
    <AdminLayout
      title="🍽️ Quản lý Món Ăn"
      topbarRight={
        <>
          <button className="px-4 py-2 border-[1.5px] border-gray-200 bg-white rounded-lg text-[13px] font-semibold text-gray-700 hover:bg-gray-50 transition">
            📥 Nhập Excel
          </button>
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
            { num: "85", label: "Tổng số món", color: "" },
            { num: "72", label: "Đang bán", color: "text-emerald-500" },
            { num: "13", label: "Tạm ẩn", color: "text-gray-400" },
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
            defaultValue="Phở"
            className="flex-1 min-w-[200px] max-w-[300px] px-3.5 py-2.5 border-[1.5px] border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500"
          />
          <select className="px-3.5 py-2.5 border-[1.5px] border-gray-200 rounded-lg text-sm bg-white outline-none">
            <option>Tất cả danh mục</option>
            {["Khai vị", "Món chính", "Súp & Bún", "Tráng miệng", "Đồ uống"].map((o) => <option key={o}>{o}</option>)}
          </select>
          <select className="px-3.5 py-2.5 border-[1.5px] border-gray-200 rounded-lg text-sm bg-white outline-none">
            <option>Tất cả trạng thái</option>
            {["Đang bán", "Tạm ẩn", "Hết hàng"].map((o) => <option key={o}>{o}</option>)}
          </select>
          <select className="px-3.5 py-2.5 border-[1.5px] border-gray-200 rounded-lg text-sm bg-white outline-none">
            <option>Sắp xếp: Tên A-Z</option>
            {["Giá tăng dần", "Giá giảm dần", "Bán chạy nhất"].map((o) => <option key={o}>{o}</option>)}
          </select>
        </div>

        {/* Category tabs */}
        <div className="flex gap-1.5 flex-wrap mb-5">
          {categories.map((cat, i) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(i)}
              className={`px-4 py-1.5 rounded-full text-[13px] font-medium border-[1.5px] transition ${
                activeCategory === i
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"
              }`}
            >
              {cat}
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
                {["Món Ăn", "Danh mục", "Giá bán", "Trạng thái", "Đã bán (tháng)", "Thao tác"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wide border-b border-gray-200">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {menuItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 border-b border-gray-100">
                    <input type="checkbox" className="rounded" />
                  </td>
                  <td className="px-4 py-3 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className={`w-11 h-11 rounded-lg flex items-center justify-center text-[22px] flex-shrink-0 ${item.bg}`}>
                        {item.emoji}
                      </div>
                      <div>
                        <div className="text-sm font-semibold">{item.name}</div>
                        <div className="text-xs text-gray-400">ID: #{item.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm border-b border-gray-100">{item.category}</td>
                  <td className="px-4 py-3 text-sm font-bold border-b border-gray-100">{item.price}</td>
                  <td className="px-4 py-3 border-b border-gray-100">
                    {item.status === "active" ? (
                      <span className="inline-flex px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                        Đang bán
                      </span>
                    ) : (
                      <span className="inline-flex px-2.5 py-1 rounded-full text-[11px] font-bold bg-gray-100 text-gray-700">
                        Tạm ẩn
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm border-b border-gray-100">{item.sold} phần</td>
                  <td className="px-4 py-3 border-b border-gray-100">
                    <div className="flex gap-1.5">
                      <button className="px-3.5 py-1.5 text-xs font-semibold border-[1.5px] border-gray-200 bg-white rounded-md hover:bg-gray-50 transition">
                        ✏️ Sửa
                      </button>
                      <button className="px-3.5 py-1.5 text-xs font-semibold bg-red-50 text-red-500 border-[1.5px] border-red-200 rounded-md hover:bg-red-100 transition">
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
            <div className="text-[13px] text-gray-400">Hiển thị 1–7 / 85 món</div>
            <div className="flex gap-1">
              {["‹", "1", "2", "3", "...", "12", "›"].map((p, i) => (
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

      {/* Add Menu Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-[200] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-[520px] max-h-[85vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
              <div className="text-base font-bold">+ Thêm món ăn mới</div>
              <button onClick={() => setShowModal(false)} className="text-gray-400 text-xl hover:text-gray-600">×</button>
            </div>
            <div className="p-6">
              <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center text-[13px] text-gray-400 cursor-pointer hover:border-blue-400 transition mb-4">
                📷 Tải ảnh món ăn lên
                <br />
                <span className="text-xs">PNG, JPG, tối đa 5MB</span>
              </div>
              <div className="mb-4">
                <label className="block text-[13px] font-semibold mb-1.5">Tên món ăn *</label>
                <input
                  className="w-full px-3.5 py-2.5 border-[1.5px] border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500 transition"
                  type="text"
                  placeholder="VD: Phở Bò Đặc Biệt"
                />
              </div>
              <div className="grid grid-cols-2 gap-3.5 mb-4">
                <div>
                  <label className="block text-[13px] font-semibold mb-1.5">Danh mục *</label>
                  <select className="w-full px-3.5 py-2.5 border-[1.5px] border-gray-200 rounded-lg text-sm bg-white outline-none focus:border-blue-500">
                    {["Khai vị", "Món chính", "Súp & Bún", "Tráng miệng", "Đồ uống"].map((o) => (
                      <option key={o}>{o}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[13px] font-semibold mb-1.5">Giá bán (đồng) *</label>
                  <input
                    type="number"
                    className="w-full px-3.5 py-2.5 border-[1.5px] border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500 transition"
                    placeholder="95000"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-[13px] font-semibold mb-1.5">Mô tả</label>
                <textarea
                  rows={3}
                  className="w-full px-3.5 py-2.5 border-[1.5px] border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500 transition resize-none"
                  placeholder="Mô tả ngắn về món ăn..."
                />
              </div>
              <div>
                <label className="block text-[13px] font-semibold mb-1.5">Trạng thái</label>
                <select className="w-full px-3.5 py-2.5 border-[1.5px] border-gray-200 rounded-lg text-sm bg-white outline-none focus:border-blue-500">
                  <option>Đang bán</option>
                  <option>Tạm ẩn</option>
                </select>
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
                Lưu món ăn
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
