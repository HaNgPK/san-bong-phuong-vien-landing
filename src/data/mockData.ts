export const FUNDING_GOAL = 460000000;
export const CURRENT_RAISED = 207000000;

export const DONORS_BUSINESS = [
  { id: 'b1', name: "Công ty Cổ phần Xây Dựng ABC", amount: 50000000, message: "Đồng hành cùng thể thao địa phương", rank: 1 },
  { id: 'b2', name: "Doanh nghiệp Tư nhân Thành Phát", amount: 30000000, message: "Chúc dự án sớm hoàn thành", rank: 2 },
  { id: 'b3', name: "Nhà xe Hải Âu", amount: 15000000, message: "Góp sức vì cộng đồng", rank: 3 },
];

export const DONORS_TEAM = [
  { id: 't1', name: "FC SKYKING", amount: 20000000, message: "FC SKYKING ủng hộ sân", rank: 1 },
  { id: 't5', name: "FC VLC", amount: 20000000, message: "FC VLC góp sức", rank: 2 },
  { id: 't2', name: "FC Thanh Niên Xóm 3", amount: 20000000, message: "Anh em Xóm 3 ủng hộ hết mình", rank: 3 },
  { id: 't3', name: "FC Cựu Cầu Thủ", amount: 15000000, message: "Mong một sân chơi khang trang", rank: 4 },
  { id: 't4', name: "FC Khách Mời", amount: 10000000, message: "Giao lưu và đóng góp", rank: 5 },
];

export const DONORS_INDIVIDUAL = [
  { id: 'i1', name: "Bác Hùng (Xóm 1)", amount: 10000000, message: "Chú ruột ủng hộ các cháu", rank: 1 },
  { id: 'i2', name: "Anh Tuấn (Hà Nội)", amount: 5000000, message: "Cố lên anh em quê nhà", rank: 2 },
  { id: 'i3', name: "Chị Hoa (Quán Tạp Hoá)", amount: 3000000, message: "Góp chút sức mọn", rank: 3 },
];

// Combine and sort for Marquee
export const ALL_TOP_SPONSORS = [...DONORS_BUSINESS, ...DONORS_TEAM, ...DONORS_INDIVIDUAL].sort((a, b) => b.amount - a.amount);

export const ALL_DONATIONS = [
  { id: 100, date: "05/05/2026", category: "Đội bóng", name: "FC SKYKING", message: "FC SKYKING ủng hộ quỹ sân", amount: 20000000 },
  { id: 122, date: "05/05/2026", category: "Đội bóng", name: "FC VLC", message: "FC VLC góp sức", amount: 20000000 },
  { id: 1, date: "05/05/2026", category: "Doanh nghiệp", name: "Công ty TNHH Vận Tải XYZ", message: "Góp quỹ", amount: 5000000 },
  { id: 2, date: "04/05/2026", category: "Đội bóng", name: "FC Anh Em", message: "Tiền sân tháng 4", amount: 2000000 },
  { id: 101, date: "04/05/2026", category: "Cá nhân", name: "Thái A (Thai Anh)", message: "Cố lên anh em", amount: 500000 },
  { id: 102, date: "04/05/2026", category: "Cá nhân", name: "A Nghĩa (Kim Nghia)", message: "Góp viên gạch", amount: 500000 },
  { id: 103, date: "04/05/2026", category: "Cá nhân", name: "A Duẩn (Bin)", message: "Ủng hộ sân mới", amount: 1000000 },
  { id: 104, date: "04/05/2026", category: "Cá nhân", name: "A Hà (Khac Ha)", message: "Mong sớm hoàn thành", amount: 500000 },
  { id: 105, date: "03/05/2026", category: "Cá nhân", name: "A Bu (Dinh Linh)", message: "", amount: 500000 },
  { id: 106, date: "03/05/2026", category: "Cá nhân", name: "Tân (Vantonn)", message: "Cho mượn áo số 26", amount: 500000 },
  { id: 107, date: "03/05/2026", category: "Cá nhân", name: "Hải (Hải Anh Jr)", message: "Góp sức", amount: 200000 },
  { id: 108, date: "03/05/2026", category: "Cá nhân", name: "Việt (Viet Anh)", message: "", amount: 300000 },
  { id: 109, date: "03/05/2026", category: "Cá nhân", name: "Tuấn", message: "Ủng hộ mạnh", amount: 1000000 },
  { id: 110, date: "02/05/2026", category: "Cá nhân", name: "Hưng", message: "AE cố gắng", amount: 500000 },
  { id: 111, date: "02/05/2026", category: "Cá nhân", name: "Thanh (Chi Thanh)", message: "", amount: 500000 },
  { id: 112, date: "02/05/2026", category: "Cá nhân", name: "Thái E (Nguyễn Thành Thái)", message: "Áo XL", amount: 500000 },
  { id: 113, date: "02/05/2026", category: "Cá nhân", name: "Dương 2k4 (Duonggg)", message: "Ủng hộ ae", amount: 200000 },
  { id: 114, date: "01/05/2026", category: "Cá nhân", name: "Duy 2k4 (BA DUY)", message: "", amount: 200000 },
  { id: 115, date: "01/05/2026", category: "Cá nhân", name: "Hiếu (Trung Hieu)", message: "Sân bóng đẹp", amount: 500000 },
  { id: 116, date: "01/05/2026", category: "Cá nhân", name: "Phong (Đình Phong)", message: "", amount: 300000 },
  { id: 117, date: "01/05/2026", category: "Cá nhân", name: "Vũ (Dinh Vu)", message: "Chúc ae nhiều sức khoẻ", amount: 500000 },
  { id: 118, date: "01/05/2026", category: "Cá nhân", name: "A Cường (Trần Mạnh Cường)", message: "Góp sức", amount: 1000000 },
  { id: 119, date: "01/05/2026", category: "Cá nhân", name: "Dương 2k6 (DUONG)", message: "", amount: 200000 },
  { id: 120, date: "01/05/2026", category: "Cá nhân", name: "Duy 2k7 (Tien Duy)", message: "", amount: 200000 },
  { id: 121, date: "01/05/2026", category: "Cá nhân", name: "Bảo (tm)", message: "Bắt gôn", amount: 200000 },
  { id: 6, date: "01/05/2026", category: "Doanh nghiệp", name: "Cửa hàng VLXD Quân", message: "Chúc dự án thành công", amount: 10000000 },
];

export const BUDGET_BREAKDOWN = [
  { item: "Hệ thống thảm cỏ nhân tạo", amount: 300000000, color: "bg-emerald-500" },
  { item: "Hệ thống chiếu sáng (Cột, Đèn LED)", amount: 60000000, color: "bg-blue-500" },
  { item: "Hệ thống lưới bao & Cầu môn", amount: 100000000, color: "bg-orange-500" },
];

export const BANK_DETAILS = {
  bankName: "Ngân hàng Quân Đội (MB Bank)",
  accountNumber: "123456789",
  accountName: "BAN QUAN LY SAN BONG PHUONG VIEN",
  transferSyntax: "HO TEN THON ung ho san bong",
  qrCodeUrl: "https://api.vietqr.io/image/970422-123456789-9b9x0Jp.jpg?accountName=BAN%20QUAN%20LY%20SAN%20BONG%20PHUONG%20VIEN&amount=0&addInfo=ung%20ho%20san%20bong"
};

// Danh sách ảnh giải đấu (Đã lấy trực tiếp từ Album ImgBB của bạn)
export const TOURNAMENT_IMAGES = [
  "https://i.ibb.co/bjGMx5S1/DAI94521.jpg",
  "https://i.ibb.co/DHcGQLfJ/DAI94546-1.jpg",
  "https://i.ibb.co/Kxn6Xb18/DAI95804.jpg",
  "https://i.ibb.co/czVNKMm/DAI95758.jpg",
  "https://i.ibb.co/Wpq1gPKL/DAI95765.jpg",
  "https://i.ibb.co/27SDqSSx/DAI98108.jpg",
  "https://i.ibb.co/KzSqL7bx/DAI98120.jpg",
  "https://i.ibb.co/ynJmd9vx/DAI97542.jpg",
  "https://i.ibb.co/WNMhZg20/682420626-122108516570882605-922693745172358632-n.jpg",
  "https://i.ibb.co/dTxgj8D/647299636-2400221127075331-4888226803337103169-n.jpg",
  "https://i.ibb.co/GfWZ2KLs/641591912-1236199518643076-7943011371465466531-n.jpg",
  "https://i.ibb.co/27gkjC76/640565163-1236199565309738-5188919279278337313-n.jpg",
  "https://i.ibb.co/GvM16VM1/641588174-1236199538643074-211545830101920673-n.jpg",
  "https://i.ibb.co/xqH9fM81/641574828-1236199548643073-8555782169534233516-n.jpg"
];
