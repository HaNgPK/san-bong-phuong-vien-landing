# Sân Bóng Phương Viên Landing Page

Dự án Landing Page giới thiệu và sao kê đóng góp xây dựng sân bóng Phương Viên.

---

## 🚀 Hướng dẫn Chạy Dự án (Local)

### 1. Cài đặt thư viện
```bash
pnpm install
```

### 2. Khởi động môi trường phát triển (Dev Server)
```bash
pnpm run dev
```
Trang web sẽ chạy tại địa chỉ: [http://localhost:3000](http://localhost:3000).

### 3. Build sản phẩm hoàn chỉnh
```bash
pnpm run build
pnpm run start
```

---

## 📸 Công cụ Xuất Ảnh Vinh Danh Hàng Loạt (Batch Screenshot Tool)

Để giải quyết vấn đề ảnh chụp bị lỗi font, mất viền hoặc lệch dấu đỏ khi vẽ bằng canvas trên trình duyệt client, dự án được tích hợp sẵn công cụ chụp ảnh vinh danh bằng trình duyệt Chromium chạy ngầm (Puppeteer).

### Cách sử dụng:

1. **Bước 1**: Đảm bảo Local Server của bạn đang chạy ở cổng 3000 (đã chạy lệnh `pnpm run dev`).
2. **Bước 2**: Mở một cửa sổ Terminal mới tại thư mục dự án và chạy lệnh:
   ```bash
   pnpm run export-certs
   ```
3. **Bước 3**: Nhập lựa chọn khi Terminal yêu cầu:
   - Nhập ngày đóng góp cụ thể (định dạng `DD/MM/YYYY`, ví dụ: `21/05/2026`) để chỉ xuất ảnh của ngày đó.
   - Nhập **`all`** để xuất toàn bộ danh sách từ trước đến nay.
4. **Bước 4**: Nhận ảnh chụp:
   - Các ảnh chụp định dạng PNG sắc nét tỉ lệ 9:16 sẽ được tạo tự động và lưu ngay ngoài **Desktop (Màn hình chính)** của bạn dưới dạng thư mục:
     `Desktop/chứng_nhận_đến_ngày_DD-MM-YYYY` (hoặc `Desktop/chứng_nhận_DD-MM-YYYY`).

---

## 🔑 Trang Quản trị (Admin)

Truy cập địa chỉ: [http://localhost:3000/admin](http://localhost:3000/admin) để vào giao diện quản trị hệ thống:
- **Nhập tiền mặt**: Cho phép ghi nhận các khoản đóng góp thủ công bằng tiền mặt thẳng vào Google Sheets.
- **Quản lý Google Sheets**: Liên kết trực tiếp tới file Google Sheets dữ liệu gốc.
- **Xuất ảnh vinh danh**: Hướng dẫn chạy công cụ xuất ảnh chụp vinh danh hàng loạt.
