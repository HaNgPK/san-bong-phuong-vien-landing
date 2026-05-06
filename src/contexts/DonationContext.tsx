import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { FUNDING_GOAL } from "../data/mockData";

const SHEET_CSV_URL =
  "https://docs.google.com/spreadsheets/d/1yHmRSx16zLBLQubtJ4RYhhfxixfetLIMsUcA-97kkjQ/export?format=csv";

export interface Donation {
  id: string | number;
  date: string;
  category: string;
  name: string;
  message: string;
  amount: number;
}

export interface DonorRank extends Donation {
  rank: number;
}

interface DonationContextType {
  donations: Donation[];
  currentRaised: number;
  fundingGoal: number;
  donorsBusiness: DonorRank[];
  donorsTeam: DonorRank[];
  donorsIndividual: DonorRank[];
  allTopSponsors: DonorRank[];
  categoryTotals: Record<string, number>;
  loading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
}

const DonationContext = createContext<DonationContextType | undefined>(
  undefined,
);

export function DonationProvider({ children }: { children: ReactNode }) {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(SHEET_CSV_URL + '&t=' + new Date().getTime());
      if (!response.ok)
        throw new Error("Không thể tải dữ liệu từ Google Sheets");
      const csvText = await response.text();

      const parsedDonations = parseCSV(csvText);
      setDonations(parsedDonations);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const currentRaised = donations.reduce((sum, d) => sum + d.amount, 0);

  const categoryTotals = donations.reduce((acc, current) => {
    const cat = current.category || 'Khác';
    acc[cat] = (acc[cat] || 0) + current.amount;
    return acc;
  }, {} as Record<string, number>);

  // Helper to get top donors with rank
  const getRankedDonors = (categoryFilter?: string): DonorRank[] => {
    const filtered = categoryFilter
      ? donations.filter((d) =>
          d.category.toLowerCase().includes(categoryFilter.toLowerCase()),
        )
      : [...donations];

    // Group by name if there are multiple donations from the same person?
    // Based on original mock, we just sorted them.
    // If we want accurate leaderboard, we should group by name first.
    const grouped = filtered.reduce((acc, current) => {
      const existing = acc.find(
        (item) => item.name.toLowerCase() === current.name.toLowerCase(),
      );
      if (existing) {
        existing.amount += current.amount;
      } else {
        acc.push({ ...current });
      }
      return acc;
    }, [] as Donation[]);

    return grouped
      .sort((a, b) => b.amount - a.amount)
      .map((d, index) => ({ ...d, rank: index + 1 }));
  };

  const donorsBusiness = getRankedDonors("Doanh nghiệp");
  const donorsTeam = getRankedDonors("Đội bóng");
  const donorsIndividual = getRankedDonors("Cá nhân");
  const allTopSponsors = getRankedDonors();

  return (
    <DonationContext.Provider
      value={{
        donations,
        currentRaised,
        fundingGoal: FUNDING_GOAL,
        donorsBusiness,
        donorsTeam,
        donorsIndividual,
        allTopSponsors,
        categoryTotals,
        loading,
        error,
        refreshData: fetchData
      }}
    >
      {children}
    </DonationContext.Provider>
  );
}

export function useDonations() {
  const context = useContext(DonationContext);
  if (context === undefined) {
    throw new Error("useDonations must be used within a DonationProvider");
  }
  return context;
}

function parseCSVLine(text: string): string[] {
  const result: string[] = [];
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

function parseCSV(text: string): Donation[] {
  const lines = text.split("\n");
  const result: Donation[] = [];

  // Skip header (i=0)
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
