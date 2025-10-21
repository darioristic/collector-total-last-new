"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  UsersIcon, 
  FileTextIcon, 
  UserCheckIcon,
  DollarSignIcon,
  FolderIcon,
  SaveIcon,
  RefreshCwIcon
} from "lucide-react";
import { WorkspaceSidebarNav } from "../components/workspace-sidebar-nav";

export default function ModulesPage() {
  const [isLoading, setIsLoading] = useState(false);
  
  // Module Settings States
  const [crmEnabled, setCrmEnabled] = useState(true);
  const [offersEnabled, setOffersEnabled] = useState(true);
  const [invoiceEnabled, setInvoiceEnabled] = useState(true);
  const [projectManagementEnabled, setProjectManagementEnabled] = useState(true);
  const [hrEnabled, setHrEnabled] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <FolderIcon className="w-8 h-8" />
            Module Configuration
          </h1>
          <p className="text-muted-foreground">
            Enable and configure modules for your workspace
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" disabled={isLoading}>
            <RefreshCwIcon className="w-4 h-4 mr-2" />
            Reset
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            <SaveIcon className="w-4 h-4 mr-2" />
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <WorkspaceSidebarNav />
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* CRM Module */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UsersIcon className="w-5 h-5" />
                CRM Module
              </CardTitle>
              <CardDescription>
                Customer Relationship Management system
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable CRM</Label>
                  <p className="text-sm text-muted-foreground">
                    Customer management, leads, and sales pipeline
                  </p>
                </div>
                <Switch checked={crmEnabled} onCheckedChange={setCrmEnabled} />
              </div>
              
              {crmEnabled && (
                <div className="pl-4 space-y-3 border-l-2 border-primary/20">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Lead Management</Label>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Customer Database</Label>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Sales Pipeline</Label>
                    <Switch defaultChecked />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Offers Module */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileTextIcon className="w-5 h-5" />
                Offers Module
              </CardTitle>
              <CardDescription>
                Quotation and proposal management system
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable Offers</Label>
                  <p className="text-sm text-muted-foreground">
                    Create and manage quotations and proposals
                  </p>
                </div>
                <Switch checked={offersEnabled} onCheckedChange={setOffersEnabled} />
              </div>
              
              {offersEnabled && (
                <div className="pl-4 space-y-3 border-l-2 border-primary/20">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Template Management</Label>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">PDF Generation</Label>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Email Integration</Label>
                    <Switch defaultChecked />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Invoice Module */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSignIcon className="w-5 h-5" />
                Invoice Module
              </CardTitle>
              <CardDescription>
                Billing and invoicing system
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable Invoicing</Label>
                  <p className="text-sm text-muted-foreground">
                    Create, send, and track invoices
                  </p>
                </div>
                <Switch checked={invoiceEnabled} onCheckedChange={setInvoiceEnabled} />
              </div>
              
              {invoiceEnabled && (
                <div className="pl-4 space-y-3 border-l-2 border-primary/20">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Payment Tracking</Label>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Tax Calculation</Label>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Recurring Invoices</Label>
                    <Switch />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Project Management Module */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FolderIcon className="w-5 h-5" />
                Project Management Module
              </CardTitle>
              <CardDescription>
                Project planning and task management system
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable Project Management</Label>
                  <p className="text-sm text-muted-foreground">
                    Plan, track, and manage projects and tasks
                  </p>
                </div>
                <Switch checked={projectManagementEnabled} onCheckedChange={setProjectManagementEnabled} />
              </div>
              
              {projectManagementEnabled && (
                <div className="pl-4 space-y-3 border-l-2 border-primary/20">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Task Management</Label>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Time Tracking</Label>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Gantt Charts</Label>
                    <Switch />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* HR Module */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheckIcon className="w-5 h-5" />
                HR Module
              </CardTitle>
              <CardDescription>
                Human Resources management system
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable HR Management</Label>
                  <p className="text-sm text-muted-foreground">
                    Employee management, attendance, and payroll
                  </p>
                </div>
                <Switch checked={hrEnabled} onCheckedChange={setHrEnabled} />
              </div>
              
              {hrEnabled && (
                <div className="pl-4 space-y-3 border-l-2 border-primary/20">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Employee Database</Label>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Attendance Tracking</Label>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Payroll Management</Label>
                    <Switch />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
