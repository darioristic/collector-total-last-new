import { generateMeta } from "@/lib/utils";

export async function generateMetadata() {
  return generateMeta({
    title: "Finance Admin Dashboard",
    description:
      "A finance dashboard is an admin panel that visualizes key financial data such as income, expenses, cash flow, budget, and profit. Built with Collector CRM, Tailwind CSS, Next.js.",
    canonical: "/finance"
  });
}

export default function Page() {
  return (
    <div className="space-y-4">
      <div className="flex flex-row items-center justify-between">
        <h1 className="text-xl font-bold tracking-tight lg:text-2xl">Finance Dashboard</h1>
      </div>
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Finance components have been moved to the default dashboard.</p>
      </div>
    </div>
  );
}
