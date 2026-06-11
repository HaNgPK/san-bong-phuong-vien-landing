"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import CertificateCard from "@/components/landing/CertificateCard";

function CertificateRenderContent() {
  const searchParams = useSearchParams();
  
  const name = searchParams.get("name") || "";
  const amount = parseInt(searchParams.get("amount") || "0", 10);
  const message = searchParams.get("message") || "";
  const category = searchParams.get("category") || "Cá nhân";
  const date = searchParams.get("date") || "";
  const id = searchParams.get("id") || "";

  const donation = {
    name,
    amount,
    message,
    category,
    date,
    id
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-4 sm:p-8">
      {/* Container với kích thước cố định tối đa 420px, khớp với Modal hiển thị */}
      <div className="w-[420px] max-w-full flex items-center justify-center">
        <CertificateCard donation={donation} />
      </div>
    </div>
  );
}

export default function CertificateRenderPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center text-white/50 text-sm">
        Đang tải mẫu vinh danh...
      </div>
    }>
      <CertificateRenderContent />
    </Suspense>
  );
}
