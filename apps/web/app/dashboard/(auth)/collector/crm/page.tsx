'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter,
  Plus,
  Eye,
  Edit,
  TrendingUp,
  DollarSign,
  Target
} from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { authenticatedFetch } from '@/hooks/use-auth';

interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  status: 'active' | 'inactive' | 'potential';
  source?: string;
  createdAt: string;
  assignedTo?: {
    id: string;
    name: string;
    email: string;
  };
}

interface Lead {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'closed_won' | 'closed_lost';
  value?: number;
  source?: string;
  createdAt: string;
  assignedTo?: {
    id: string;
    name: string;
    email: string;
  };
}

export default function CRMDashboard() {
  const { token } = useAuth();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchCRMData = useCallback(async () => {
    try {
      setLoading(true);
      
      const [customersResponse, leadsResponse] = await Promise.all([
        authenticatedFetch('/api/crm/customers', {}, token),
        authenticatedFetch('/api/crm/leads', {}, token)
      ]);

      const customersData = await customersResponse.json();
      const leadsData = await leadsResponse.json();

      if (customersData.success) {
        setCustomers(customersData.data.customers);
      }

      if (leadsData.success) {
        setLeads(leadsData.data.leads);
      }
    } catch (error) {
      console.error('Error fetching CRM data:', error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchCRMData();
    }
  }, [token, fetchCRMData]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'new':
        return 'bg-green-100 text-green-800';
      case 'inactive':
      case 'closed_lost':
        return 'bg-red-100 text-red-800';
      case 'potential':
      case 'contacted':
        return 'bg-yellow-100 text-yellow-800';
      case 'qualified':
      case 'proposal':
        return 'bg-blue-100 text-blue-800';
      case 'closed_won':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.company?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredLeads = leads.filter(lead =>
    lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.company?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalValue = leads.reduce((sum, lead) => sum + (lead.value || 0), 0);
  const wonLeads = leads.filter(lead => lead.status === 'closed_won').length;
  const conversionRate = leads.length > 0 ? (wonLeads / leads.length) * 100 : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading CRM data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">CRM Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your customers, leads, and sales pipeline
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Customer
          </Button>
          <Button variant="outline">
            <UserPlus className="mr-2 h-4 w-4" />
            Add Lead
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customers.length}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +12% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Leads</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{leads.length}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +8% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pipeline Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +15% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{conversionRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +3% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search customers and leads..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Filter
        </Button>
      </div>

      {/* Customers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Customers</CardTitle>
          <CardDescription>
            Your latest customer additions and updates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredCustomers.slice(0, 5).map((customer) => (
              <div key={customer.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">{customer.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {customer.email} • {customer.company}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getStatusColor(customer.status)}>
                    {customer.status}
                  </Badge>
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            {filteredCustomers.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No customers found
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Leads Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Leads</CardTitle>
          <CardDescription>
            Your latest lead additions and updates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredLeads.slice(0, 5).map((lead) => (
              <div key={lead.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Target className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">{lead.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {lead.email} • {lead.company}
                    </p>
                    {lead.value && (
                      <p className="text-sm font-medium text-green-600">
                        ${lead.value.toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getStatusColor(lead.status)}>
                    {lead.status.replace('_', ' ')}
                  </Badge>
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            {filteredLeads.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No leads found
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
