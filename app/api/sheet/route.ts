import { NextResponse } from 'next/server';
import { google } from 'googleapis';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, amount, message, date, category } = body;

    // TODO: Require user to setup these env variables
    const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
    // Replace literal \n with actual newlines if necessary
    const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
    const sheetId = process.env.GOOGLE_SHEET_ID;

    if (!clientEmail || !privateKey || !sheetId) {
      return NextResponse.json(
        { error: 'Missing Google Sheets credentials in environment variables' },
        { status: 500 }
      );
    }

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: clientEmail,
        private_key: privateKey,
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // Fetch the first sheet's name dynamically
    const spreadsheetInfo = await sheets.spreadsheets.get({
      spreadsheetId: sheetId,
    });
    const firstSheetName = spreadsheetInfo.data.sheets?.[0]?.properties?.title || 'Trang tính1';

    // 1. Get all data in Column A to find the true last row (ignoring pre-formatted empty rows)
    const colAResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: `'${firstSheetName}'!A:A`,
    });
    
    // Number of rows that actually have a Mã GD. 
    const numRows = colAResponse.data.values?.length || 0;
    const nextEmptyRow = numRows + 1;

    // 2. Generate new row data
    const newId = Date.now().toString().slice(-8);
    
    // Format date as DD/MM/YYYY to match Google Sheets Date Validation
    const today = new Date();
    const formattedDate = `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear()}`;

    const rowData = [
      [
        newId,
        formattedDate, // Sends '12/05/2026' without time so it's a valid Date
        category || 'Cá nhân', 
        name || 'Ẩn danh',
        message || '',
        amount || 0, // Sends raw number (e.g. 100000) so Google Sheets applies its own Currency format
        'TM' // Hình Thức (Tiền mặt)
      ],
    ];

    // 3. Update exactly at the empty row
    const response = await sheets.spreadsheets.values.update({
      spreadsheetId: sheetId,
      range: `'${firstSheetName}'!A${nextEmptyRow}:G${nextEmptyRow}`, 
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: rowData,
      },
    });

    return NextResponse.json({ success: true, data: response.data });
  } catch (error: any) {
    console.error('Error updating Google Sheets:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update Google Sheets' },
      { status: 500 }
    );
  }
}
