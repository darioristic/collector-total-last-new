import { generateMeta } from "@/lib/utils";

import CustomDateRangePicker from "@/components/custom-date-range-picker";
import { Button } from "@/components/ui/button";

import {
  ChatWidget,
  TotalRevenueCard
} from "@/app/dashboard/(auth)/default/components";
import KPICards from "@/app/dashboard/(auth)/finance/components/kpi-cards";
import Revenue from "@/app/dashboard/(auth)/finance/components/revenue";
import OutcomeSources from "@/app/dashboard/(auth)/finance/components/outcome-sources";
import Summary from "@/app/dashboard/(auth)/finance/components/summary";
import Transactions from "@/app/dashboard/(auth)/finance/components/transactions";
import { Download } from "lucide-react";

export async function generateMetadata() {
  return generateMeta({
    title: "Admin Dashboard",
    description:
      "The admin dashboard template offers a sleek and efficient interface for monitoring important data and user interactions. Built with Collector CRM.",
    canonical: "/default"
  });
}

export default function Page() {
  return (
    <div className="space-y-4">
      <div className="flex flex-row items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight lg:text-2xl">Collector Dashboard</h1>
          <p className="text-sm text-muted-foreground">Comprehensive financial overview and expense tracking</p>
        </div>
        <div className="flex items-center space-x-2">
          <CustomDateRangePicker />
          <Button size="icon">
            <Download />
          </Button>
        </div>
      </div>

      <KPICards />

      <div className="gap-4 space-y-4 lg:grid lg:grid-cols-3 lg:space-y-0">
        <TotalRevenueCard />
        <Revenue />
        <Summary />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <TotalRevenueCard />
        <OutcomeSources />
        <Summary />
      </div>

      <div className="grid-cols-1 gap-4 space-y-4 lg:grid lg:space-y-0">
        <Transactions />
      </div>

      <div className="gap-4 space-y-4 lg:grid lg:grid-cols-1 lg:space-y-0">
        <ChatWidget />
      </div>
    </div>
  );
}
