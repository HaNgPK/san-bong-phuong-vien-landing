"use client";

import { useState } from "react";

export default function AdminCashEntryPage() {
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    message: "",
    category: "Cá nhân",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const response = await fetch("/api/sheet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          amount: parseInt(formData.amount.replace(/\D/g, "") || "0"),
          message: formData.message,
          category: formData.category,
          date: new Date().toLocaleString("vi-VN"),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Có lỗi xảy ra");
      }

      setStatus("success");
      setFormData({ name: "", amount: "", message: "", category: "Cá nhân" });
      
      // Auto reset success message after 3 seconds
      setTimeout(() => setStatus("idle"), 3000);
    } catch (error: any) {
      console.error(error);
      setErrorMessage(error.message);
      setStatus("error");
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Format to currency layout
    const value = e.target.value.replace(/\D/g, "");
    if (value) {
      const formatted = new Intl.NumberFormat("vi-VN").format(parseInt(value));
      setFormData({ ...formData, amount: formatted });
    } else {
      setFormData({ ...formData, amount: "" });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Nhập Tiền Mặt</h1>
          <p className="text-gray-500 text-sm mt-2">Dành cho BQL Sân Bóng Phương Viên</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên người đóng góp *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="VD: Nguyễn Văn A"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Số tiền (VNĐ) *
            </label>
            <input
              type="text"
              required
              value={formData.amount}
              onChange={handleAmountChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 font-medium text-green-700"
              placeholder="VD: 500.000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nhóm / Đối tượng
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="Cá nhân">Cá nhân</option>
              <option value="Đội bóng">Đội bóng</option>
              <option value="Doanh nghiệp">Doanh nghiệp</option>
              <option value="Khác">Khác</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Lời nhắn / Ghi chú
            </label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="VD: Ủng hộ tiền mặt"
              rows={3}
            />
          </div>

          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:bg-gray-400"
          >
            {status === "loading" ? "Đang xử lý..." : "Lưu Dữ Liệu"}
          </button>
        </form>

        {status === "success" && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-center">
            <p className="font-medium">✅ Đã lưu thành công!</p>
            <p className="text-sm mt-1">Dữ liệu đã được cập nhật vào Google Sheets.</p>
          </div>
        )}

        {status === "error" && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-center">
            <p className="font-medium">❌ Lỗi</p>
            <p className="text-sm mt-1">{errorMessage}</p>
          </div>
        )}
      </div>
    </div>
  );
}
