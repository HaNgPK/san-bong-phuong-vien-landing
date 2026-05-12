"use client";

import Link from "next/link";
import { Banknote, FileSpreadsheet, LayoutDashboard, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();

  const handleLogout = () => {
    // Xóa cookie bằng cách set max-age về 0
    document.cookie = "admin_auth=; path=/; max-age=0";
    router.push("/admin/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-emerald-900 text-white p-4 shadow-md">
        <div className="container mx-auto max-w-5xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <LayoutDashboard className="w-6 h-6 text-emerald-400" />
            <span className="font-bold text-lg">Quản trị Hệ thống</span>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-emerald-200 hover:text-white transition-colors text-sm font-medium bg-emerald-800 hover:bg-emerald-700 px-3 py-1.5 rounded-lg"
          >
            <LogOut className="w-4 h-4" />
            Đăng xuất
          </button>
        </div>
      </nav>

      <div className="container mx-auto max-w-5xl p-6 md:p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-gray-900 mb-2">Xin chào Admin 👋</h1>
          <p className="text-gray-500">Chọn các công cụ bên dưới để quản lý dữ liệu quỹ sân bóng.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Menu 1 */}
          <Link 
            href="/admin/nhap-tien-mat" 
            className="group bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-emerald-200 hover:-translate-y-1 transition-all duration-300 block"
          >
            <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-emerald-500 transition-colors">
              <Banknote className="w-7 h-7 text-emerald-600 group-hover:text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Nhập Tiền Mặt</h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              Ghi nhận giao dịch quyên góp bằng tiền mặt thủ công. Dữ liệu sẽ được đẩy thẳng vào Google Sheets.
            </p>
          </Link>

          {/* Menu 2 */}
          <a 
            href="https://docs.google.com/spreadsheets/d/1yHmRSx16zLBLQubtJ4RYhhfxixfetLIMsUcA-97kkjQ/edit" 
            target="_blank" 
            rel="noopener noreferrer"
            className="group bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-blue-200 hover:-translate-y-1 transition-all duration-300 block"
          >
            <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-500 transition-colors">
              <FileSpreadsheet className="w-7 h-7 text-blue-600 group-hover:text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Quản lý Google Sheets</h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              Mở trực tiếp file Google Sheets để xem toàn bộ giao dịch, sửa đổi hoặc xuất file báo cáo.
            </p>
          </a>
        </div>
      </div>
    </div>
  );
}
