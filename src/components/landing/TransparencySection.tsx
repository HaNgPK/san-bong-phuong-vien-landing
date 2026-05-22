import { useState, useMemo } from "react";
import {
  Search,
  ArrowRight,
  Calendar,
  MessageCircle,
  RefreshCw,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useDonations } from "@/contexts/DonationContext";
import { formatCurrency, getCategoryColor } from "@/lib/format";
import CertificateModal from "./CertificateModal";

function parseDateString(dateStr: string): number {
  if (!dateStr) return 0;
  const parts = dateStr.split("/");
  if (parts.length === 3) {
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // 0-indexed month
    const year = parseInt(parts[2], 10);
    return new Date(year, month, day).getTime();
  }
  const parsed = Date.parse(dateStr);
  return isNaN(parsed) ? 0 : parsed;
}

export default function TransparencySection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState<any>(null);

  const { donations, loading, refreshData } = useDonations();
  const [sortField, setSortField] = useState<"date" | "category" | "amount">("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshData();
    setTimeout(() => setIsRefreshing(false), 500); // UI feedback delay
  };

  const handleSort = (field: "date" | "category" | "amount") => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const filteredDonations = useMemo(() => {
    let result = [...donations];

    // Lọc theo từ khóa tìm kiếm
    if (searchQuery.trim()) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(
        (d) =>
          d.name.toLowerCase().includes(lowerQuery) ||
          d.message.toLowerCase().includes(lowerQuery) ||
          d.category.toLowerCase().includes(lowerQuery),
      );
    }

    // Sắp xếp theo cột
    result.sort((a, b) => {
      let comparison = 0;
      if (sortField === "date") {
        comparison = parseDateString(a.date) - parseDateString(b.date);
      } else if (sortField === "category") {
        comparison = a.category.localeCompare(b.category, "vi");
      } else if (sortField === "amount") {
        comparison = a.amount - b.amount;
      }
      return sortDirection === "asc" ? comparison : -comparison;
    });

    return result;
  }, [searchQuery, donations, sortField, sortDirection]);

  return (
    <section
      id="transparency-section"
      className="py-10 md:py-12 bg-white border-y border-gray-100"
    >
      <div className="container px-4 mx-auto max-w-5xl">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-8 gap-4 text-center md:text-left">
          <div className="flex-1">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Sao Kê Đóng Góp
            </h2>
            <p className="text-gray-500 mb-4 md:mb-0 flex flex-wrap items-center gap-1.5 justify-center md:justify-start">
              <span>Cập nhật tự động mọi khoản thu</span>
              <span className="hidden sm:inline-block w-1.5 h-1.5 bg-emerald-300 rounded-full"></span>
              <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded text-xs animate-pulse">🌟 Nhấp dòng sao kê để xem Vinh Danh</span>
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto items-center">
            <Button
              onClick={handleRefresh}
              variant="outline"
              className="w-full sm:w-auto bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
              disabled={isRefreshing || loading}
            >
              <RefreshCw
                className={`w-4 h-4 mr-2 ${isRefreshing || loading ? "animate-spin" : ""}`}
              />
              Làm mới
            </Button>
            {/* Ẩn chức năng Tạo Chứng Nhận theo yêu cầu */}
            {/* <Button
              onClick={() => {
                setSelectedDonation(null);
                setIsModalOpen(true);
              }}
              className="w-full sm:w-auto bg-yellow-500 hover:bg-yellow-600 text-white font-bold shadow-md shadow-yellow-200/50"
            >
              <Medal className="w-4 h-4 mr-2" />
              Tạo Chứng Nhận
            </Button> */}
            <div className="relative w-full sm:w-64 lg:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Tìm kiếm tên, nội dung..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
              />
            </div>
          </div>
        </div>

        <CertificateModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          donation={selectedDonation}
        />

        <Card className="shadow-sm border border-gray-200 overflow-hidden rounded-2xl bg-gray-50/50">
          {/* GIAO DIỆN DESKTOP (TABLE) */}
          <div className="hidden md:block [&>div]:max-h-[600px] [&>div]:overflow-y-auto [&>div]:custom-scrollbar">
            <Table className="bg-white min-w-[700px]">
              <TableHeader className="bg-gray-50 sticky top-0 z-10 shadow-sm">
                <TableRow>
                  <TableHead 
                    className="w-[120px] font-bold text-gray-700 bg-gray-50 cursor-pointer select-none hover:bg-gray-100 hover:text-emerald-700 transition-colors"
                    onClick={() => handleSort("date")}
                  >
                    <div className="flex items-center gap-1">
                      Ngày
                      {sortField === "date" ? (
                        sortDirection === "asc" ? (
                          <ArrowUp className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <ArrowDown className="w-3.5 h-3.5 text-emerald-600" />
                        )
                      ) : (
                        <ArrowUpDown className="w-3 h-3 text-gray-400 opacity-60" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="w-[140px] font-bold text-gray-700 bg-gray-50 cursor-pointer select-none hover:bg-gray-100 hover:text-emerald-700 transition-colors"
                    onClick={() => handleSort("category")}
                  >
                    <div className="flex items-center gap-1">
                      Phân loại
                      {sortField === "category" ? (
                        sortDirection === "asc" ? (
                          <ArrowUp className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <ArrowDown className="w-3.5 h-3.5 text-emerald-600" />
                        )
                      ) : (
                        <ArrowUpDown className="w-3 h-3 text-gray-400 opacity-60" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="font-bold text-gray-700 bg-gray-50">
                    Người gửi
                  </TableHead>
                  <TableHead className="font-bold text-gray-700 bg-gray-50">
                    Lời nhắn
                  </TableHead>
                  <TableHead 
                    className="text-right font-bold text-gray-700 bg-gray-50 cursor-pointer select-none hover:bg-gray-100 hover:text-emerald-700 transition-colors"
                    onClick={() => handleSort("amount")}
                  >
                    <div className="flex items-center justify-end gap-1">
                      Số tiền
                      {sortField === "amount" ? (
                        sortDirection === "asc" ? (
                          <ArrowUp className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <ArrowDown className="w-3.5 h-3.5 text-emerald-600" />
                        )
                      ) : (
                        <ArrowUpDown className="w-3 h-3 text-gray-400 opacity-60" />
                      )}
                    </div>
                  </TableHead>
                  {/* Ẩn cột hành động Tạo Chứng Nhận */}
                  {/* <TableHead className="w-[50px] bg-gray-50"></TableHead> */}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDonations.length > 0 ? (
                  filteredDonations.map((donation) => (
                    <TableRow
                      key={donation.id}
                      className="hover:bg-emerald-50/80 cursor-pointer active:bg-emerald-100/40 transition-all duration-150"
                      onClick={() => {
                        setSelectedDonation(donation);
                        setIsModalOpen(true);
                      }}
                    >
                      <TableCell className="text-gray-600 py-3">
                        {donation.date}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${getCategoryColor(donation.category)}`}
                        >
                          {donation.category}
                        </span>
                      </TableCell>
                      <TableCell className="font-semibold text-gray-900">
                        {donation.name}
                      </TableCell>
                      <TableCell className="text-gray-600 italic text-sm">
                        {donation.message || (
                          <span className="text-gray-300">---</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right font-bold text-emerald-600 text-lg">
                        +{formatCurrency(donation.amount)}
                      </TableCell>
                      {/* Ẩn chức năng Tạo Chứng Nhận trên từng dòng giao dịch */}
                      {/* <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Tạo chứng nhận"
                          onClick={() => {
                            setSelectedDonation({
                              name: donation.name,
                              amount: donation.amount,
                            });
                            setIsModalOpen(true);
                          }}
                          className="text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50 h-8 w-8 rounded-full"
                        >
                          <Medal className="w-4 h-4" />
                        </Button>
                      </TableCell> */}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-10 text-gray-500"
                    >
                      Không tìm thấy kết quả nào cho "{searchQuery}"
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* GIAO DIỆN MOBILE (CARDS) */}
          <div className="md:hidden flex flex-col gap-3 p-3 max-h-[600px] overflow-y-auto custom-scrollbar">
            {filteredDonations.length > 0 ? (
              filteredDonations.map((donation) => (
                <div
                  key={donation.id}
                  onClick={() => {
                    setSelectedDonation(donation);
                    setIsModalOpen(true);
                  }}
                  className="bg-white p-4 rounded-xl border border-gray-100 hover:border-emerald-300 shadow-sm flex flex-col gap-3 cursor-pointer active:scale-[0.98] active:bg-emerald-50/10 transition-all duration-150"
                >
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex flex-col gap-1.5">
                      <span className="font-bold text-gray-900 text-base leading-tight">
                        {donation.name}
                      </span>
                      <span
                        className={`w-max px-2 py-0.5 text-[11px] font-bold rounded-full border uppercase tracking-wider ${getCategoryColor(donation.category)}`}
                      >
                        {donation.category}
                      </span>
                    </div>
                    <span className="font-black text-emerald-600 text-lg text-right whitespace-nowrap">
                      +{formatCurrency(donation.amount)}
                    </span>
                  </div>

                  <div className="flex flex-col gap-2 mt-1">
                    <div className="flex items-center text-xs text-gray-500 font-medium">
                      <Calendar className="w-3.5 h-3.5 mr-1.5 text-gray-400" />
                      {donation.date}
                    </div>
                    {donation.message && (
                      <div className="flex items-start text-sm text-gray-700 bg-gray-50 p-2.5 rounded-lg border border-gray-100 italic">
                        <MessageCircle className="w-4 h-4 mr-2 text-gray-400 shrink-0 mt-0.5" />
                        "{donation.message}"
                      </div>
                    )}
                    {/* Ẩn chức năng Nhận Chứng Nhận trên mobile */}
                    {/* <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedDonation({
                          name: donation.name,
                          amount: donation.amount,
                        });
                        setIsModalOpen(true);
                      }}
                      className="w-full mt-1 border-yellow-200 text-yellow-700 hover:bg-yellow-50 flex items-center justify-center gap-2"
                    >
                      <Medal className="w-4 h-4" />
                      Nhận Chứng Nhận
                    </Button> */}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-gray-500 bg-white rounded-xl border border-gray-100">
                Không tìm thấy kết quả nào cho "{searchQuery}"
              </div>
            )}
          </div>

          <div className="bg-gray-50 p-3 border-t border-gray-100 flex justify-center">
            <Button
              variant="ghost"
              className="text-emerald-700 hover:bg-emerald-100 font-semibold text-sm w-full md:w-auto"
            >
              Xem Thêm Giao Dịch <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </Card>
      </div>
    </section>
  );
}
