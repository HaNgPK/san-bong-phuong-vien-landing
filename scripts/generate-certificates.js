import fs from 'fs';
import path from 'path';
import readline from 'readline';
import puppeteer from 'puppeteer';

const SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/1yHmRSx16zLBLQubtJ4RYhhfxixfetLIMsUcA-97kkjQ/export?format=csv";

function parseCSVLine(text) {
  const result = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char === '"') {
      if (inQuotes && text[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}

function parseCSV(text) {
  const lines = text.split("\n");
  const result = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const row = parseCSVLine(line);

    if (row.length >= 6) {
      const rawAmount = row[5] || "0";
      const amountStr = rawAmount
        .replace(/\./g, "")
        .replace(/,/g, "")
        .replace(/đ/gi, "")
        .trim();
      const amount = parseInt(amountStr, 10) || 0;

      result.push({
        id: row[0] || i.toString(),
        date: row[1] || "",
        category: row[2] || "Khác",
        name: row[3] || "Ẩn danh",
        message: row[4] || "",
        amount: amount,
      });
    }
  }
  return result;
}

async function checkDevServer() {
  try {
    const res = await fetch('http://localhost:3000', { method: 'HEAD' });
    return res.status >= 200 && res.status < 400;
  } catch (err) {
    return false;
  }
}

function cleanFilename(name) {
  // Loại bỏ các ký tự không hợp lệ cho tên tệp trên Windows
  return name.replace(/[\\/:*?"<>|]/g, '_').trim();
}

async function run() {
  console.log("\x1b[36m%s\x1b[0m", "==========================================================");
  console.log("\x1b[36m%s\x1b[0m", "   CÔNG CỤ CHỤP ẢNH VINH DANH HÀNG LOẠT (PUPPETEER)       ");
  console.log("\x1b[36m%s\x1b[0m", "==========================================================");

  // 1. Kiểm tra Server dev
  console.log("Đang kiểm tra server cục bộ http://localhost:3000...");
  const serverRunning = await checkDevServer();
  if (!serverRunning) {
    console.error('\x1b[31m%s\x1b[0m', 'LỖI: Không tìm thấy server Next.js chạy tại http://localhost:3000.');
    console.log('Vui lòng mở một cửa sổ Terminal mới, chạy lệnh:');
    console.log('   \x1b[33mpnpm run dev\x1b[0m  (hoặc npm run dev / npm run build & start)');
    console.log('và sau đó chạy lại công cụ này.');
    process.exit(1);
  }
  console.log("\x1b[32m%s\x1b[0m", "✓ Server local đang hoạt động.");

  // 2. Tải danh sách đóng góp từ Google Sheets
  console.log("Đang tải dữ liệu từ Google Sheets...");
  let donations = [];
  try {
    const response = await fetch(SHEET_CSV_URL + '?t=' + Date.now());
    if (!response.ok) throw new Error("Lỗi kết nối HTTP: " + response.statusText);
    const csvText = await response.text();
    donations = parseCSV(csvText);
    console.log(`\x1b[32m✓ Tải thành công. Tìm thấy tổng cộng ${donations.length} khoản đóng góp.\x1b[0m`);
  } catch (err) {
    console.error('\x1b[31m%s\x1b[0m', `LỖI: Không thể lấy dữ liệu từ Google Sheets: ${err.message}`);
    process.exit(1);
  }

  // 3. Hỏi ngày xuất ảnh
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const getTargetDate = () => {
    return new Promise((resolve) => {
      rl.question('\nNhập ngày đóng góp muốn xuất ảnh (DD/MM/YYYY, ví dụ: 21/05/2026)\nHoặc nhập "all" để xuất toàn bộ danh sách\nNgày: ', (answer) => {
        resolve(answer.trim());
      });
    });
  };

  const targetDateInput = await getTargetDate();
  rl.close();

  let filtered = [];
  if (targetDateInput.toLowerCase() === 'all') {
    filtered = donations;
    console.log(`\nChuẩn bị xuất TOÀN BỘ ${filtered.length} chứng nhận vinh danh...`);
  } else {
    filtered = donations.filter(d => d.date === targetDateInput);
    console.log(`\nTìm thấy ${filtered.length} chứng nhận vinh danh cho ngày ${targetDateInput}`);
  }

  if (filtered.length === 0) {
    console.log("Không có dữ liệu phù hợp để xuất ảnh. Kết thúc chương trình.");
    process.exit(0);
  }

  // 4. Tạo thư mục lưu trữ exports
  const exportBaseDir = path.join(process.cwd(), 'exports');
  if (!fs.existsSync(exportBaseDir)) {
    fs.mkdirSync(exportBaseDir);
  }

  const dateSubFolder = cleanFilename(targetDateInput.toLowerCase() === 'all' ? 'tat_ca' : targetDateInput.replace(/\//g, '-'));
  const exportDir = path.join(exportBaseDir, `chứng_nhận_${dateSubFolder}`);
  if (!fs.existsSync(exportDir)) {
    fs.mkdirSync(exportDir);
  }

  console.log(`Ảnh chụp sẽ được lưu tại: \x1b[35m${exportDir}\x1b[0m\n`);

  // 5. Khởi chạy Puppeteer
  console.log("Đang khởi chạy trình duyệt ngầm...");
  const browser = await puppeteer.launch({
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  
  // Thiết lập khung nhìn rộng hơn một chút, deviceScaleFactor = 3 giúp ảnh cực kỳ sắc nét khi xuất
  await page.setViewport({
    width: 600,
    height: 1000,
    deviceScaleFactor: 3
  });

  // 6. Lặp qua từng bản ghi để chụp ảnh
  for (let i = 0; i < filtered.length; i++) {
    const donation = filtered[i];
    const index = i + 1;
    console.log(`[${index}/${filtered.length}] Đang xử lý: \x1b[33m${donation.name}\x1b[0m (+${donation.amount.toLocaleString('vi-VN')} VND)...`);

    // Tạo URL render với query params
    const query = new URLSearchParams({
      name: donation.name,
      amount: donation.amount.toString(),
      message: donation.message || "",
      category: donation.category,
      date: donation.date,
      id: donation.id.toString()
    });

    const renderUrl = `http://localhost:3000/certificate-render?${query.toString()}`;

    try {
      // Điều hướng đến trang render
      await page.goto(renderUrl, { waitUntil: 'networkidle0', timeout: 30000 });

      // Chờ các font chữ được tải xong hoàn toàn
      await page.evaluateHandle(() => document.fonts.ready);

      // Đợi thêm một chút để hoạt họa hoặc hình ảnh ổn định
      await new Promise(resolve => setTimeout(resolve, 800));

      // Định vị thẻ ảnh
      const cardElement = await page.$('#certificate-card');
      if (!cardElement) {
        throw new Error("Không tìm thấy thẻ vinh danh #certificate-card");
      }

      // Tạo tên file an toàn
      const cleanName = cleanFilename(donation.name);
      const filename = `${index.toString().padStart(3, '0')}_${donation.amount}_${cleanName}.png`;
      const outputPath = path.join(exportDir, filename);

      // Chụp ảnh khu vực thẻ vinh danh
      await cardElement.screenshot({
        path: outputPath,
        type: 'png'
      });

      console.log(`   \x1b[32m✓ Chụp thành công -> ${filename}\x1b[0m`);
    } catch (err) {
      console.error(`   \x1b[31m✗ Thất bại khi chụp ảnh ${donation.name}: ${err.message}\x1b[0m`);
    }
  }

  await browser.close();
  console.log("\n\x1b[32m%s\x1b[0m", "==========================================================");
  console.log("\x1b[32m%s\x1b[0m", "   ĐÃ HOÀN THÀNH XUẤT ẢNH VINH DANH HÀNG LOẠT!             ");
  console.log("\x1b[32m%s\x1b[0m", "==========================================================");
  console.log(`Vui lòng kiểm tra thư mục chứa ảnh tại:\n\x1b[34m${exportDir}\x1b[0m`);
  console.log("==========================================================\n");
}

run();
