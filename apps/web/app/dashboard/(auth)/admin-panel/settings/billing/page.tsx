"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { SidebarNav } from "../components/sidebar-nav";
import { CreditCardIcon, DownloadIcon, PlusIcon, CheckIcon, LoaderIcon } from "lucide-react";
import { useAuth, authenticatedFetch } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

export default function BillingPage() {
  const { token } = useAuth();
  const { toast } = useToast();
  
  const [billingData, setBillingData] = useState({
    currentPlan: {
      id: 'pro',
      name: 'Pro Plan',
      price: 29,
      currency: 'USD',
      interval: 'month',
      status: 'active',
      nextBillingDate: '2024-12-20T00:00:00Z',
      paymentMethod: {
        type: 'card',
        last4: '4242',
        brand: 'visa',
        expiryMonth: 12,
        expiryYear: 2025
      }
    },
    features: [
      'Unlimited projects',
      'Advanced analytics',
      'Priority support',
      'Custom integrations',
      'Team collaboration',
      'API access',
      'Advanced security',
      '99.9% uptime SLA'
    ],
    billingHistory: [
      {
        id: '1',
        date: '2024-11-20T00:00:00Z',
        amount: 29.00,
        currency: 'USD',
        status: 'paid',
        description: 'Pro Plan - Monthly'
      },
      {
        id: '2',
        date: '2024-10-20T00:00:00Z',
        amount: 29.00,
        currency: 'USD',
        status: 'paid',
        description: 'Pro Plan - Monthly'
      },
      {
        id: '3',
        date: '2024-09-20T00:00:00Z',
        amount: 29.00,
        currency: 'USD',
        status: 'paid',
        description: 'Pro Plan - Monthly'
      }
    ]
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Load billing data on component mount
  useEffect(() => {
    const loadBillingData = async () => {
      if (!token) return;
      
      setIsLoading(true);
      try {
        const response = await authenticatedFetch('/api/users/billing', {
          method: 'GET'
        }, token);
        
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setBillingData(data.data);
          }
        }
      } catch (error) {
        console.error('Error loading billing data:', error);
        toast({
          title: "Error",
          description: "Failed to load billing data",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadBillingData();
  }, [token, toast]);

  const handleChangePlan = async (planId: string) => {
    if (!token) return;
    
    setIsProcessing(true);
    try {
      const response = await authenticatedFetch('/api/users/billing', {
        method: 'POST',
        body: JSON.stringify({
          action: 'changePlan',
          planId
        })
      }, token);
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          toast({
            title: "Success",
            description: "Plan changed successfully"
          });
          // Reload billing data
          window.location.reload();
        }
      } else {
        const errorData = await response.json();
        toast({
          title: "Error",
          description: errorData.error || "Failed to change plan",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error changing plan:', error);
      toast({
        title: "Error",
        description: "Failed to change plan",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUpdatePaymentMethod = async (paymentMethodId: string) => {
    if (!token) return;
    
    setIsProcessing(true);
    try {
      const response = await authenticatedFetch('/api/users/billing', {
        method: 'POST',
        body: JSON.stringify({
          action: 'updatePaymentMethod',
          paymentMethodId
        })
      }, token);
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          toast({
            title: "Success",
            description: "Payment method updated successfully"
          });
          // Reload billing data
          window.location.reload();
        }
      } else {
        const errorData = await response.json();
        toast({
          title: "Error",
          description: errorData.error || "Failed to update payment method",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error updating payment method:', error);
      toast({
        title: "Error",
        description: "Failed to update payment method",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

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
                  <h3 className="text-xl font-semibold">
                    {isLoading ? 'Loading...' : billingData.currentPlan.name}
                  </h3>
                  <p className="text-muted-foreground">
                    {isLoading ? 'Loading...' : `$${billingData.currentPlan.price}/${billingData.currentPlan.interval} • Billed ${billingData.currentPlan.interval}ly`}
                  </p>
                </div>
                <Badge variant="secondary">
                  {isLoading ? 'Loading...' : billingData.currentPlan.status}
                </Badge>
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Next Billing Date</p>
                  <p className="text-sm text-muted-foreground">
                    {isLoading ? 'Loading...' : new Date(billingData.currentPlan.nextBillingDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Amount</p>
                  <p className="text-sm text-muted-foreground">
                    {isLoading ? 'Loading...' : `$${billingData.currentPlan.price.toFixed(2)}`}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Payment Method</p>
                  <p className="text-sm text-muted-foreground">
                    {isLoading ? 'Loading...' : `•••• •••• •••• ${billingData.currentPlan.paymentMethod.last4}`}
                  </p>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => handleChangePlan('enterprise')}
                  disabled={isLoading || isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <LoaderIcon className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Change Plan'
                  )}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => handleUpdatePaymentMethod('new')}
                  disabled={isLoading || isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <LoaderIcon className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Update Payment Method'
                  )}
                </Button>
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
                  {isLoading ? (
                    <div className="space-y-3">
                      {[...Array(4)].map((_, i) => (
                        <div key={`loading-feature-2-${i}`} className="flex items-center gap-2">
                          <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
                          <div className="w-32 h-4 bg-gray-200 rounded animate-pulse"></div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    billingData.features.slice(0, 4).map((feature) => (
                      <div key={`feature-${feature}`} className="flex items-center gap-2">
                        <CheckIcon className="w-4 h-4 text-green-500" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))
                  )}
                </div>
                <div className="space-y-3">
                  {isLoading ? (
                    <div className="space-y-3">
                      {[...Array(4)].map((_, i) => (
                        <div key={`loading-feature-2-${i}`} className="flex items-center gap-2">
                          <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
                          <div className="w-32 h-4 bg-gray-200 rounded animate-pulse"></div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    billingData.features.slice(4).map((feature) => (
                      <div key={`feature-${feature}`} className="flex items-center gap-2">
                        <CheckIcon className="w-4 h-4 text-green-500" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))
                  )}
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
                {isLoading ? (
                  <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                      <div key={`loading-history-${i}`} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="space-y-1">
                          <div className="w-24 h-4 bg-gray-200 rounded animate-pulse"></div>
                          <div className="w-32 h-3 bg-gray-200 rounded animate-pulse"></div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-12 h-4 bg-gray-200 rounded animate-pulse"></div>
                          <div className="w-20 h-8 bg-gray-200 rounded animate-pulse"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  billingData.billingHistory.map((invoice) => (
                    <div key={invoice.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="space-y-1">
                        <p className="font-medium">
                          {new Date(invoice.date).toLocaleDateString('en-US', { 
                            month: 'long', 
                            year: 'numeric' 
                          })}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {invoice.description}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">${invoice.amount.toFixed(2)}</span>
                        <Button variant="outline" size="sm">
                          <DownloadIcon className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </div>
                  ))
                )}
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
                    <p className="font-medium">
                      {isLoading ? 'Loading...' : `${billingData.currentPlan.paymentMethod.brand.charAt(0).toUpperCase() + billingData.currentPlan.paymentMethod.brand.slice(1)} ending in ${billingData.currentPlan.paymentMethod.last4}`}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {isLoading ? 'Loading...' : `Expires ${billingData.currentPlan.paymentMethod.expiryMonth}/${billingData.currentPlan.paymentMethod.expiryYear}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">Default</Badge>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleUpdatePaymentMethod('edit')}
                    disabled={isLoading || isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <LoaderIcon className="w-3 h-3 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      'Edit'
                    )}
                  </Button>
                </div>
              </div>
              
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => handleUpdatePaymentMethod('add')}
                disabled={isLoading || isProcessing}
              >
                {isProcessing ? (
                  <>
                    <LoaderIcon className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Add Payment Method
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
