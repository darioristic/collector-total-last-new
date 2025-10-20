"use client";

import { ArrowDownIcon, CreditCardIcon, TrendingDownIcon } from "lucide-react";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const outcomeData = [
  { category: "Housing", amount: 25000, color: "var(--chart-1)" },
  { category: "Food", amount: 18000, color: "var(--chart-2)" },
  { category: "Transportation", amount: 12000, color: "var(--chart-3)" },
  { category: "Utilities", amount: 8000, color: "var(--chart-4)" }
];

export default function OutcomeSources() {
  return (
    <Card className="pb-0">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Outcome Sources</CardTitle>
          <Button variant="ghost" size="sm">
            <ArrowDownIcon className="rotate-45" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="grow space-y-4 lg:space-y-6">
        <div>
          <div className="text-muted-foreground mb-1 text-sm">Total Expenses</div>
          <div className="font-display mb-2 text-3xl">$63,000</div>
          <div className="mb-4 flex items-center text-sm text-red-600">
            <TrendingDownIcon className="mr-1 size-4" />
            8.2%
            <span className="text-muted-foreground ml-1">compared to last month</span>
          </div>
        </div>

        <div className="flex h-3 overflow-hidden rounded-full">
          {outcomeData.map((item) => (
            <div
              key={item.category}
              className="h-full"
              style={{
                backgroundColor: item.color,
                width: `${(item.amount / 63000) * 100}%`
              }}
            />
          ))}
        </div>

        <div className="space-y-4">
          {outcomeData.map((item) => (
            <div key={item.category} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-3">
                <div className="size-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-muted-foreground">{item.category}</span>
              </div>
              <span className="font-medium" suppressHydrationWarning>
                ${item.amount.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="bg-muted py-4">
        <div className="flex items-start">
          <CreditCardIcon className="text-muted-foreground mt-0.5 mr-3 h-5 w-5" />
          <div className="text-muted-foreground text-sm">
            <div className="mb-1 font-medium">Expense tracking helps optimize budget.</div>
            <div>Monitor spending patterns for better financial control.</div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
