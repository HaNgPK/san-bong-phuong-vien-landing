import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { amount, description, returnUrl, cancelUrl } = body;

    const clientId = process.env.PAYOS_CLIENT_ID || "d2a12679-6577-4262-a067-96327020ecb2";
    const apiKey = process.env.PAYOS_API_KEY || "75eae530-b4ca-4bc7-a10f-8f3e853d7783";
    const checksumKey = process.env.PAYOS_CHECKSUM_KEY || "c09274514702e02a7248e41e4649e3548387bf28";

    // Generate unique order code (PayOS requires an integer max 9007199254740991)
    const orderCode = Number(String(Date.now()).slice(-9));

    // PayOS requires description to be English characters, numbers, and spaces only, max 25 chars
    const removeAccents = (str: string) => {
      return str.normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/đ/g, 'd').replace(/Đ/g, 'D');
    };
    
    let safeDescription = removeAccents(description || "Quyen gop san bong")
      .replace(/[^a-zA-Z0-9 ]/g, "")
      .trim();
      
    if (!safeDescription) safeDescription = "Quyen gop san bong";
    
    const finalDescription = safeDescription.substring(0, 25);

    // Data for signature
    const signatureData = `amount=${amount}&cancelUrl=${cancelUrl}&description=${finalDescription}&orderCode=${orderCode}&returnUrl=${returnUrl}`;
    
    // Create HMAC SHA256 signature
    const signature = crypto.createHmac("sha256", checksumKey).update(signatureData).digest("hex");

    const payload = {
      orderCode,
      amount,
      description: finalDescription,
      returnUrl,
      cancelUrl,
      signature
    };

    console.log("PayOS Payload:", payload);

    const response = await fetch("https://api-merchant.payos.vn/v2/payment-requests", {
      method: "POST",
      headers: {
        "x-client-id": clientId,
        "x-api-key": apiKey,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    console.log("PayOS Response:", data);

    if (data.code === "00" && data.data && data.data.checkoutUrl) {
      return NextResponse.json({ checkoutUrl: data.data.checkoutUrl });
    } else {
      throw new Error(data.desc || "Lỗi tạo link thanh toán");
    }

  } catch (error: any) {
    console.error("PayOS Route Error:", error);
    return NextResponse.json(
      { error: "Không thể tạo link thanh toán", details: error?.message },
      { status: 500 }
    );
  }
}
