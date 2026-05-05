export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)
}

export const getCategoryColor = (category: string) => {
  switch(category) {
    case "Doanh nghiệp": return "bg-blue-100 text-blue-800 border-blue-200";
    case "Đội bóng": return "bg-orange-100 text-orange-800 border-orange-200";
    case "Cá nhân": return "bg-emerald-100 text-emerald-800 border-emerald-200";
    default: return "bg-gray-100 text-gray-800 border-gray-200";
  }
}
