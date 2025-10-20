"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { SidebarNav } from "../components/sidebar-nav";
import { CreditCardIcon, DownloadIcon, PlusIcon, CheckIcon } from "lucide-react";

export default function BillingPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Billing & Subscription</h1>
          <p className="text-muted-foreground">
            Manage your subscription and billing information
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <SidebarNav />
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Current Plan */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCardIcon className="w-5 h-5" />
                Current Plan
              </CardTitle>
              <CardDescription>
                Your current subscription details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="text-xl font-semibold">Pro Plan</h3>
                  <p className="text-muted-foreground">
                    $29/month • Billed monthly
                  </p>
                </div>
                <Badge variant="secondary">Active</Badge>
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Next Billing Date</p>
                  <p className="text-sm text-muted-foreground">December 20, 2024</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Amount</p>
                  <p className="text-sm text-muted-foreground">$29.00</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Payment Method</p>
                  <p className="text-sm text-muted-foreground">•••• •••• •••• 4242</p>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline">Change Plan</Button>
                <Button variant="outline">Update Payment Method</Button>
              </div>
            </CardContent>
          </Card>

          {/* Plan Features */}
          <Card>
            <CardHeader>
              <CardTitle>Plan Features</CardTitle>
              <CardDescription>
                What's included in your current plan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckIcon className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Unlimited projects</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckIcon className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Advanced analytics</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckIcon className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Priority support</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckIcon className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Custom integrations</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckIcon className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Team collaboration</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckIcon className="w-4 h-4 text-green-500" />
                    <span className="text-sm">API access</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckIcon className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Advanced security</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckIcon className="w-4 h-4 text-green-500" />
                    <span className="text-sm">99.9% uptime SLA</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Billing History */}
          <Card>
            <CardHeader>
              <CardTitle>Billing History</CardTitle>
              <CardDescription>
                Your recent invoices and payments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="space-y-1">
                    <p className="font-medium">November 2024</p>
                    <p className="text-sm text-muted-foreground">
                      Pro Plan - Monthly
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">$29.00</span>
                    <Button variant="outline" size="sm">
                      <DownloadIcon className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="space-y-1">
                    <p className="font-medium">October 2024</p>
                    <p className="text-sm text-muted-foreground">
                      Pro Plan - Monthly
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">$29.00</span>
                    <Button variant="outline" size="sm">
                      <DownloadIcon className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="space-y-1">
                    <p className="font-medium">September 2024</p>
                    <p className="text-sm text-muted-foreground">
                      Pro Plan - Monthly
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">$29.00</span>
                    <Button variant="outline" size="sm">
                      <DownloadIcon className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Methods */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>
                Manage your payment methods
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <CreditCardIcon className="w-8 h-8" />
                  <div className="space-y-1">
                    <p className="font-medium">Visa ending in 4242</p>
                    <p className="text-sm text-muted-foreground">
                      Expires 12/25
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">Default</Badge>
                  <Button variant="outline" size="sm">Edit</Button>
                </div>
              </div>
              
              <Button variant="outline" className="w-full">
                <PlusIcon className="w-4 h-4 mr-2" />
                Add Payment Method
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
