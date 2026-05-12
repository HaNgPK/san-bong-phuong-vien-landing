import { NextResponse } from 'next/server';
import { google } from 'googleapis';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("Nhận Webhook từ PayOS:", JSON.stringify(body, null, 2));

    // Lấy phần data từ webhook (PayOS trả về `data` và `code`)
    const { data, code } = body;

    // "00" nghĩa là thanh toán thành công
    if (code !== "00") {
       return NextResponse.json({ success: true, message: "Bỏ qua webhook không thành công" });
    }

    if (!data) {
       return NextResponse.json({ success: false, message: "Thiếu thông tin data" });
    }

    const { amount, description, orderCode, counterAccountName } = data;

    // Chuẩn bị thông tin ghi vào Google Sheets
    const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
    const sheetId = process.env.GOOGLE_SHEET_ID;

    if (!clientEmail || !privateKey || !sheetId) {
       console.error("Lỗi: Chưa cấu hình Google Sheets Credentials");
       return NextResponse.json({ error: 'Chưa cấu hình Google Sheets' }, { status: 500 });
    }

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: clientEmail,
        private_key: privateKey,
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // Lấy tên sheet đầu tiên
    const spreadsheetInfo = await sheets.spreadsheets.get({
      spreadsheetId: sheetId,
    });
    const firstSheetName = spreadsheetInfo.data.sheets?.[0]?.properties?.title || 'Trang tính1';

    // Tìm dòng trống
    const colAResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: `'${firstSheetName}'!A:A`,
    });
    
    const numRows = colAResponse.data.values?.length || 0;
    const nextEmptyRow = numRows + 1;

    // Chuẩn bị dữ liệu định dạng ngày tháng
    const today = new Date();
    const formattedDate = `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear()}`;

    // Cố gắng lấy Tên chủ tài khoản từ ngân hàng (Nếu ngân hàng đó có hỗ trợ trả về)
    // Nếu không có, sẽ tự động cắt Tên người gửi ra khỏi nội dung chuyển khoản
    let senderName = counterAccountName || 'Người đóng góp (PayOS)';
    const transferMsg = description || '';
    
    // Nếu ngân hàng KHÔNG trả về tên chủ tài khoản, ta mới dùng cách cắt chữ
    if (!counterAccountName && transferMsg) {
      const lowerDesc = transferMsg.toLowerCase();
      const ungHoIndex = lowerDesc.indexOf('ung ho');
      
      if (ungHoIndex > 0) {
        // Lấy phần trước chữ "ung ho" làm Tên người gửi
        senderName = transferMsg.substring(0, ungHoIndex).trim();
      } else {
        // Nếu không có chữ "ung ho", lấy toàn bộ nội dung làm Tên người gửi luôn
        senderName = transferMsg.trim();
      }
    }

    // Dữ liệu dòng mới
    const rowData = [
      [
        orderCode || Date.now().toString().slice(-8), // Mã giao dịch từ PayOS
        formattedDate, // Ngày tháng DD/MM/YYYY
        'Cá nhân', // Mặc định Phân loại là Cá nhân
        senderName, // Tên người gửi (Đã được tách tự động)
        transferMsg, // Lời nhắn chuyển khoản (Giữ nguyên gốc)
        amount || 0, // Số tiền
        'CK' // Hình Thức (Chuyển Khoản) - Bắt buộc là CK!
      ],
    ];

    // Ghi vào Google Sheets
    await sheets.spreadsheets.values.update({
      spreadsheetId: sheetId,
      range: `'${firstSheetName}'!A${nextEmptyRow}:G${nextEmptyRow}`, 
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: rowData,
      },
    });

    return NextResponse.json({ success: true, message: "Đã cập nhật vào Google Sheets thành công" });
  } catch (error: any) {
    console.error('Lỗi khi xử lý Webhook PayOS:', error);
    return NextResponse.json(
      { error: error.message || 'Lỗi hệ thống' },
      { status: 500 }
    );
  }
}
