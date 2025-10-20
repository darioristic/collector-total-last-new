'use client';

import * as React from "react";
import {
  GripVertical,
  Mail,
  MessageSquare,
  PlusCircleIcon,
  Search,
  CheckIcon,
  SlidersHorizontalIcon,
  SearchIcon,
  DollarSign,
  Building,
  Phone,
  Target
} from "lucide-react";
import { cn } from "@/lib/utils";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import * as Kanban from "@/components/ui/kanban";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useAuth } from '@/hooks/use-auth';
import { authenticatedFetch } from '@/hooks/use-auth';

interface Lead {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  source?: string;
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'closed_won' | 'closed_lost';
  value?: number;
  createdAt: string;
  assignedTo?: {
    id: string;
    name: string;
    email: string;
  };
}

export default function PipelinePage() {
  const { token } = useAuth();
  const [leads, setLeads] = React.useState<Lead[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [columns, setColumns] = React.useState<Record<string, Lead[]>>({
    new: [],
    contacted: [],
    qualified: [],
    proposal: [],
    closed_won: [],
    closed_lost: []
  });

  const [columnTitles, setColumnTitles] = React.useState<Record<string, string>>({
    new: "New Leads",
    contacted: "Contacted",
    qualified: "Qualified",
    proposal: "Proposal",
    closed_won: "Closed Won",
    closed_lost: "Closed Lost"
  });

  const [filteredColumns, setFilteredColumns] = React.useState(columns);
  const [filterStatus, setFilterStatus] = React.useState<string | null>(null);
  const [filterSource, setFilterSource] = React.useState<string | null>(null);
  const [filterUser, setFilterUser] = React.useState<string | null>(null);
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");

  const fetchLeads = React.useCallback(async () => {
    try {
      setLoading(true);
      
      const response = await authenticatedFetch('/api/crm/leads', {}, token);
      const data = await response.json();

      if (data.success) {
        const leadsData = data.data.leads;
        setLeads(leadsData);
        
        // Organize leads by status
        const organizedColumns: Record<string, Lead[]> = {
          new: [],
          contacted: [],
          qualified: [],
          proposal: [],
          closed_won: [],
          closed_lost: []
        };

        leadsData.forEach((lead: Lead) => {
          if (organizedColumns[lead.status]) {
            organizedColumns[lead.status].push(lead);
          }
        });

        setColumns(organizedColumns);
        setFilteredColumns(organizedColumns);
      }
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  React.useEffect(() => {
    if (token) {
      fetchLeads();
    }
  }, [token, fetchLeads]);

  const getActiveFilters = () => {
    const filters = [];
    if (filterStatus) filters.push(filterStatus);
    if (filterSource) filters.push(filterSource);
    if (filterUser) filters.push(filterUser);
    return filters;
  };

  const filterLeads = React.useCallback(() => {
    let filtered: Record<string, Lead[]> = { ...columns };

    Object.keys(filtered).forEach((columnKey) => {
      filtered[columnKey] = columns[columnKey].filter((lead) => {
        const searchMatch =
          searchQuery === "" ||
          lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (lead.email?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
          (lead.company?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
          (lead.assignedTo?.name.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);

        const statusMatch = !filterStatus || lead.status === filterStatus;
        const sourceMatch = !filterSource || lead.source === filterSource;
        const userMatch = !filterUser || lead.assignedTo?.name === filterUser;

        return searchMatch && statusMatch && sourceMatch && userMatch;
      });
    });

    setFilteredColumns(filtered);
  }, [columns, searchQuery, filterStatus, filterSource, filterUser]);

  React.useEffect(() => {
    filterLeads();
  }, [filterLeads]);

  const FilterDropdown = () => {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline">
            <SlidersHorizontalIcon />
            <span className="hidden lg:inline">
              {getActiveFilters().length > 0 ? (
                <>Filters ({getActiveFilters().length})</>
              ) : (
                "Filters"
              )}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[240px] p-0" align="end">
          <Command>
            <CommandInput placeholder="Search filters..." />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>

              {/* Status Filters */}
              <CommandGroup heading="Status">
                <CommandItem
                  onSelect={() => {
                    setFilterStatus("new");
                    setOpen(false);
                  }}>
                  <span>New</span>
                </CommandItem>
                <CommandItem
                  onSelect={() => {
                    setFilterStatus("contacted");
                    setOpen(false);
                  }}>
                  <span>Contacted</span>
                </CommandItem>
                <CommandItem
                  onSelect={() => {
                    setFilterStatus("qualified");
                    setOpen(false);
                  }}>
                  <span>Qualified</span>
                </CommandItem>
                <CommandItem
                  onSelect={() => {
                    setFilterStatus("proposal");
                    setOpen(false);
                  }}>
                  <span>Proposal</span>
                </CommandItem>
                <CommandItem
                  onSelect={() => {
                    setFilterStatus("closed_won");
                    setOpen(false);
                  }}>
                  <span>Closed Won</span>
                </CommandItem>
                <CommandItem
                  onSelect={() => {
                    setFilterStatus("closed_lost");
                    setOpen(false);
                  }}>
                  <span>Closed Lost</span>
                </CommandItem>
              </CommandGroup>

              <CommandSeparator />

              {/* Source Filters */}
              <CommandGroup heading="Source">
                {Array.from(
                  new Set(leads.map(lead => lead.source).filter(Boolean))
                ).map((source) => (
                  <CommandItem
                    key={source}
                    onSelect={() => {
                      setFilterSource(source || null);
                      setOpen(false);
                    }}>
                    <span>{source}</span>
                  </CommandItem>
                ))}
              </CommandGroup>

              <CommandSeparator />

              {/* User Filters */}
              <CommandGroup heading="Assigned To">
                {Array.from(
                  new Set(leads.map(lead => lead.assignedTo?.name).filter(Boolean))
                ).map((userName) => (
                  <CommandItem
                    key={userName}
                    onSelect={() => {
                      setFilterUser(userName || null);
                      setOpen(false);
                    }}>
                    <Avatar className="mr-2 h-5 w-5">
                      <AvatarFallback>{userName?.[0]}</AvatarFallback>
                    </Avatar>
                    <span>{userName}</span>
                  </CommandItem>
                ))}
              </CommandGroup>

              <CommandSeparator />

              {/* Clear Filters */}
              <CommandGroup>
                <CommandItem
                  onSelect={() => {
                    setFilterStatus(null);
                    setFilterSource(null);
                    setFilterUser(null);
                    setOpen(false);
                  }}
                  className="justify-center text-center">
                  Clear Filters
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800';
      case 'contacted':
        return 'bg-yellow-100 text-yellow-800';
      case 'qualified':
        return 'bg-purple-100 text-purple-800';
      case 'proposal':
        return 'bg-orange-100 text-orange-800';
      case 'closed_won':
        return 'bg-green-100 text-green-800';
      case 'closed_lost':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getColumnValue = (leads: Lead[]) => {
    return leads.reduce((sum, lead) => sum + (lead.value || 0), 0);
  };

  const totalValue = leads.reduce((sum, lead) => sum + (lead.value || 0), 0);
  const wonValue = getColumnValue(columns.closed_won);
  const activeValue = totalValue - wonValue - getColumnValue(columns.closed_lost);
  const conversionRate = leads.length > 0 ? (columns.closed_won.length / leads.length) * 100 : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading pipeline...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-row items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight lg:text-2xl">Sales Pipeline</h1>
          <p className="text-muted-foreground">Manage your sales leads through the pipeline</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex -space-x-2 overflow-hidden">
            <Avatar className="border-background border-2">
              <AvatarImage src="/images/avatars/01.png" alt="..." />
              <AvatarFallback>AT</AvatarFallback>
            </Avatar>
            <Avatar className="border-background border-2">
              <AvatarImage src="/images/avatars/02.png" alt="..." />
              <AvatarFallback>AT</AvatarFallback>
            </Avatar>
            <Avatar className="border-background border-2">
              <AvatarImage src="/images/avatars/03.png" alt="..." />
              <AvatarFallback>AT</AvatarFallback>
            </Avatar>
            <Avatar className="border-background border-2">
              <AvatarFallback className="text-xs">+{leads.length - 3}</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>

      {/* Pipeline Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pipeline</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {leads.length} total leads
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Pipeline</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${activeValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              In progress
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Won Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${wonValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {columns.closed_won.length} deals won
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{conversionRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              Win rate
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="board" className="w-full">
        <div className="mb-2 flex justify-between gap-2">
          <TabsList>
            <TabsTrigger value="board">Pipeline</TabsTrigger>
            <TabsTrigger value="list">List</TabsTrigger>
            <TabsTrigger value="table">Table</TabsTrigger>
          </TabsList>

          <div className="flex gap-2">
            <div className="relative hidden w-auto lg:block">
              <SearchIcon className="absolute top-2.5 left-3 size-4 opacity-50" />
              <Input
                placeholder="Search leads..."
                className="ps-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="none lg:hidden">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline">
                    <SearchIcon />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[240px] p-0" align="end">
                  <Input
                    placeholder="Search leads..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <FilterDropdown />

            <Button>
              <PlusCircleIcon />
              <span className="hidden lg:inline">Add Lead</span>
            </Button>
          </div>
        </div>
        <TabsContent value="board">
          <Kanban.Root
            value={filteredColumns}
            onValueChange={setColumns}
            getItemValue={(item) => item.id}>
            <Kanban.Board className="flex w-full gap-4 overflow-x-auto pb-4">
              {Object.entries(filteredColumns).map(([columnValue, columnLeads]) => (
                <Kanban.Column
                  key={columnValue}
                  value={columnValue}
                  className="w-[340px] min-w-[340px]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold">{columnTitles[columnValue]}</span>
                      <Badge variant="outline">{columnLeads.length}</Badge>
                      <Badge className={getStatusColor(columnValue)}>
                        ${getColumnValue(columnLeads).toLocaleString()}
                      </Badge>
                    </div>
                    <div className="flex">
                      <Kanban.ColumnHandle asChild>
                        <Button variant="ghost" size="icon">
                          <GripVertical className="h-4 w-4" />
                        </Button>
                      </Kanban.ColumnHandle>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <PlusCircleIcon />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Add Lead</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </div>
                  {columnLeads.length > 0 ? (
                    <div className="flex flex-col gap-2 p-0.5">
                      {columnLeads.map((lead) => (
                        <Kanban.Item key={lead.id} value={lead.id} asHandle asChild>
                          <Card className="border-0">
                            <CardHeader>
                              <CardTitle className="text-base font-semibold">
                                {lead.name}
                              </CardTitle>
                              <CardDescription>
                                {lead.company || lead.email || 'No company info'}
                              </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <div className="text-muted-foreground flex items-center justify-between text-sm">
                                <div className="flex -space-x-2 overflow-hidden">
                                  {lead.assignedTo && (
                                    <Avatar className="border-background border-2">
                                      <AvatarImage
                                        src="/images/avatars/01.png"
                                        alt={lead.assignedTo.name}
                                      />
                                      <AvatarFallback>
                                        {lead.assignedTo.name.split(' ').map(n => n[0]).join('')}
                                      </AvatarFallback>
                                    </Avatar>
                                  )}
                                </div>
                                {lead.value && (
                                  <div className="flex items-center gap-1 text-green-600 font-medium">
                                    <DollarSign className="h-3 w-3" />
                                    <span>{lead.value.toLocaleString()}</span>
                                  </div>
                                )}
                              </div>
                              <Separator />
                              <div className="text-muted-foreground flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2">
                                  {lead.source && (
                                    <Badge variant="outline" className="text-xs">
                                      {lead.source}
                                    </Badge>
                                  )}
                                </div>
                                <div className="flex items-center gap-3">
                                  {lead.email && (
                                    <div className="flex items-center gap-1">
                                      <Mail className="h-3 w-3" />
                                    </div>
                                  )}
                                  {lead.phone && (
                                    <div className="flex items-center gap-1">
                                      <Phone className="h-3 w-3" />
                                    </div>
                                  )}
                                  {lead.company && (
                                    <div className="flex items-center gap-1">
                                      <Building className="h-3 w-3" />
                                    </div>
                                  )}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </Kanban.Item>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col justify-center gap-4 pt-4">
                      <div className="text-muted-foreground text-sm">No leads in this stage.</div>
                      <Button variant="outline">Add Lead</Button>
                    </div>
                  )}
                </Kanban.Column>
              ))}
            </Kanban.Board>
            <Kanban.Overlay>
              <div className="bg-primary/10 size-full rounded-md" />
            </Kanban.Overlay>
          </Kanban.Root>
        </TabsContent>
        <TabsContent value="list">List view coming soon...</TabsContent>
        <TabsContent value="table">Table view coming soon...</TabsContent>
      </Tabs>
    </div>
  );
}
