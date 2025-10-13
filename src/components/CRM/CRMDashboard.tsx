import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { 
  Users, 
  UserPlus, 
  Search, 
  Plus, 
  Mail, 
  Phone, 
  Building2, 
  DollarSign,
  TrendingUp,
  Target,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Download,
  Upload,
  BarChart3,
  PieChart,
  Activity,
  Settings,
  Calendar,
  Tag,
  Filter
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

// Types
interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  position?: string;
  status: 'lead' | 'prospect' | 'customer' | 'inactive';
  source: string;
  lastContact?: string;
  notes?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

interface Deal {
  id: string;
  title: string;
  contactId: string;
  contactName: string;
  value: number;
  stage: 'prospecting' | 'qualification' | 'proposal' | 'negotiation' | 'closed-won' | 'closed-lost';
  probability: number;
  expectedCloseDate: string;
  createdAt: string;
  updatedAt: string;
}

export default function CRMDashboard() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isAddContactOpen, setIsAddContactOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'contacts' | 'deals' | 'analytics'>('contacts');
  const [analyticsFilter, setAnalyticsFilter] = useState<'status' | 'source' | 'tags' | 'all'>('all');
  const [isManageSourcesOpen, setIsManageSourcesOpen] = useState(false);
  const [newSource, setNewSource] = useState('');
  const [availableSources, setAvailableSources] = useState([
    'Website', 'LinkedIn', 'Cold Email', 'Referral', 'Trade Show', 'Manual Entry', 'Social Media', 'Google Ads'
  ]);
  const [newContact, setNewContact] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    position: '',
    status: 'lead' as 'lead' | 'prospect' | 'customer' | 'inactive',
    source: '',
    notes: '',
    tags: [] as string[]
  });

  // Initialize empty data - replace with actual API calls
  useEffect(() => {
    // TODO: Replace with actual API calls to load contacts and deals
    setContacts([]);
    setDeals([]);
    setIsLoading(false);
  }, []);

  // Filter contacts
  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         contact.company?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || contact.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'lead': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'prospect': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'customer': return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleAddContact = () => {
    if (!newContact.name || !newContact.email) {
      alert('Please fill in at least name and email fields');
      return;
    }

    const contact: Contact = {
      id: Date.now().toString(),
      name: newContact.name,
      email: newContact.email,
      phone: newContact.phone || undefined,
      company: newContact.company || undefined,
      position: newContact.position || undefined,
      status: newContact.status,
      source: newContact.source || 'Manual Entry',
      lastContact: new Date().toISOString().split('T')[0],
      notes: newContact.notes || undefined,
      tags: newContact.tags,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setContacts([...contacts, contact]);
    setNewContact({
      name: '',
      email: '',
      phone: '',
      company: '',
      position: '',
      status: 'lead',
      source: '',
      notes: '',
      tags: []
    });
    setIsAddContactOpen(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setNewContact(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTagsChange = (value: string) => {
    const tags = value.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    setNewContact(prev => ({
      ...prev,
      tags
    }));
  };

  const handleAddSource = () => {
    if (newSource.trim() && !availableSources.includes(newSource.trim())) {
      setAvailableSources([...availableSources, newSource.trim()]);
      setNewSource('');
    }
  };

  const handleRemoveSource = (sourceToRemove: string) => {
    setAvailableSources(availableSources.filter(source => source !== sourceToRemove));
  };

  // Analytics calculations
  const getAnalyticsData = () => {
    const statusData = contacts.reduce((acc, contact) => {
      acc[contact.status] = (acc[contact.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const sourceData = contacts.reduce((acc, contact) => {
      acc[contact.source] = (acc[contact.source] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const tagData = contacts.reduce((acc, contact) => {
      contact.tags.forEach(tag => {
        acc[tag] = (acc[tag] || 0) + 1;
      });
      return acc;
    }, {} as Record<string, number>);

    const dealStageData = deals.reduce((acc, deal) => {
      acc[deal.stage] = (acc[deal.stage] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const totalPipelineValue = deals
      .filter(d => !['closed-won', 'closed-lost'].includes(d.stage))
      .reduce((sum, d) => sum + d.value, 0);

    const wonDeals = deals.filter(d => d.stage === 'closed-won');
    const totalWonValue = wonDeals.reduce((sum, d) => sum + d.value, 0);

    const conversionRate = contacts.length > 0 ? 
      Math.round((contacts.filter(c => c.status === 'customer').length / contacts.length) * 100) : 0;

    return {
      statusData,
      sourceData,
      tagData,
      dealStageData,
      totalPipelineValue,
      totalWonValue,
      conversionRate,
      totalContacts: contacts.length,
      totalDeals: deals.length,
      activeDeals: deals.filter(d => !['closed-won', 'closed-lost'].includes(d.stage)).length
    };
  };

  const analyticsData = getAnalyticsData();

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-background min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">CRM Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage your contacts, leads, and deals</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Upload className="w-4 h-4 mr-2" />
            Import
          </Button>
          <Button 
            className="bg-blue-600 hover:bg-blue-700"
            onClick={() => setIsAddContactOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Contact
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-chatgpt-card border-border shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Contacts</p>
                <p className="text-2xl font-bold text-foreground">{contacts.length}</p>
              </div>
              <div className="p-3 bg-blue-500/20 rounded-full">
                <Users className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-chatgpt-card border-border shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Deals</p>
                <p className="text-2xl font-bold text-foreground">{deals.filter(d => !['closed-won', 'closed-lost'].includes(d.stage)).length}</p>
              </div>
              <div className="p-3 bg-green-500/20 rounded-full">
                <Target className="w-6 h-6 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-chatgpt-card border-border shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pipeline Value</p>
                <p className="text-2xl font-bold text-foreground">
                  {formatCurrency(deals.filter(d => !['closed-won', 'closed-lost'].includes(d.stage)).reduce((sum, d) => sum + d.value, 0))}
                </p>
              </div>
              <div className="p-3 bg-purple-500/20 rounded-full">
                <DollarSign className="w-6 h-6 text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-chatgpt-card border-border shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Conversion Rate</p>
                <p className="text-2xl font-bold text-foreground">
                  {contacts.length > 0 ? Math.round((contacts.filter(c => c.status === 'customer').length / contacts.length) * 100) : 0}%
                </p>
              </div>
              <div className="p-3 bg-orange-500/20 rounded-full">
                <TrendingUp className="w-6 h-6 text-orange-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-4 border-b border-border">
        <button
          onClick={() => setActiveTab('contacts')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'contacts'
              ? 'text-blue-400 border-b-2 border-blue-400'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Contacts ({contacts.length})
        </button>
        <button
          onClick={() => setActiveTab('deals')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'deals'
              ? 'text-blue-400 border-b-2 border-blue-400'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Deals ({deals.length})
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'analytics'
              ? 'text-blue-400 border-b-2 border-blue-400'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Analytics
        </button>
      </div>

      {/* Contacts Tab */}
      {activeTab === 'contacts' && (
        <div className="space-y-4">
          {/* Search and Filters */}
          <Card className="bg-chatgpt-card border-border shadow-sm">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search contacts..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 bg-background border-border text-foreground placeholder:text-muted-foreground"
                    />
                  </div>
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full md:w-48 bg-background border-border text-foreground">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="lead">Lead</SelectItem>
                    <SelectItem value="prospect">Prospect</SelectItem>
                    <SelectItem value="customer">Customer</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Contacts List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredContacts.map((contact) => (
              <Card key={contact.id} className="bg-chatgpt-card border-border shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-foreground">{contact.name}</h3>
                      <p className="text-sm text-muted-foreground">{contact.position}</p>
                      <p className="text-sm text-muted-foreground">{contact.company}</p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Contact
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Mail className="w-4 h-4 mr-2" />
                          Send Email
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="w-4 h-4" />
                      {contact.email}
                    </div>
                    {contact.phone && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="w-4 h-4" />
                        {contact.phone}
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Building2 className="w-4 h-4" />
                      {contact.source}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <Badge className={`${getStatusColor(contact.status)} border`}>
                      {contact.status}
                    </Badge>
                    <div className="flex gap-1">
                      {contact.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Deals Tab */}
      {activeTab === 'deals' && (
        <div className="space-y-4">
          {/* Search and Filters */}
          <Card className="bg-chatgpt-card border-border shadow-sm">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search deals..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 bg-background border-border text-foreground placeholder:text-muted-foreground"
                    />
                  </div>
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full md:w-48 bg-background border-border text-foreground">
                    <SelectValue placeholder="Filter by stage" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Stages</SelectItem>
                    <SelectItem value="prospecting">Prospecting</SelectItem>
                    <SelectItem value="qualification">Qualification</SelectItem>
                    <SelectItem value="proposal">Proposal</SelectItem>
                    <SelectItem value="negotiation">Negotiation</SelectItem>
                    <SelectItem value="closed-won">Closed Won</SelectItem>
                    <SelectItem value="closed-lost">Closed Lost</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Deals List */}
          <div className="space-y-4">
            {deals.map((deal) => (
              <Card key={deal.id} className="bg-chatgpt-card border-border shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <h3 className="font-semibold text-foreground">{deal.title}</h3>
                        <Badge className={`${
                          deal.stage === 'prospecting' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                          deal.stage === 'qualification' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                          deal.stage === 'proposal' ? 'bg-orange-100 text-orange-800 border-orange-200' :
                          deal.stage === 'negotiation' ? 'bg-purple-100 text-purple-800 border-purple-200' :
                          deal.stage === 'closed-won' ? 'bg-green-100 text-green-800 border-green-200' :
                          'bg-red-100 text-red-800 border-red-200'
                        } border`}>
                          {deal.stage.replace('-', ' ')}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Contact:</span>
                          <p className="font-medium text-foreground">{deal.contactName}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Value:</span>
                          <p className="font-medium text-foreground">{formatCurrency(deal.value)}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Probability:</span>
                          <p className="font-medium text-foreground">{deal.probability}%</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Expected Close:</span>
                          <p className="font-medium text-foreground">{new Date(deal.expectedCloseDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {deals.length === 0 && (
              <div className="text-center py-12">
                <Target className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">No Deals Found</h3>
                <p className="text-muted-foreground">Start by creating your first deal to track your sales pipeline.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          {/* Analytics Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Analytics Dashboard</h2>
              <p className="text-muted-foreground">Insights into your CRM performance</p>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                onClick={() => setIsManageSourcesOpen(true)}
                className="border-border text-foreground hover:bg-background/50"
              >
                <Settings className="w-4 h-4 mr-2" />
                Manage Sources
              </Button>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>

          {/* Analytics Filters */}
          <Card className="bg-chatgpt-card border-border shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <Filter className="w-5 h-5 text-muted-foreground" />
                <span className="font-medium text-foreground">Filter by:</span>
                <div className="flex gap-2">
                  {(['all', 'status', 'source', 'tags'] as const).map((filter) => (
                    <Button
                      key={filter}
                      variant={analyticsFilter === filter ? "default" : "outline"}
                      size="sm"
                      onClick={() => setAnalyticsFilter(filter)}
                      className={
                        analyticsFilter === filter 
                          ? "bg-blue-600 hover:bg-blue-700" 
                          : "border-border text-foreground hover:bg-background/50"
                      }
                    >
                      {filter === 'all' ? 'All Data' : 
                       filter === 'status' ? 'Status' :
                       filter === 'source' ? 'Source' : 'Tags'}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-chatgpt-card border-border shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Contacts</p>
                    <p className="text-3xl font-bold text-foreground">{analyticsData.totalContacts}</p>
                    <p className="text-sm text-green-600">+12% from last month</p>
                  </div>
                  <div className="p-3 bg-blue-500/20 rounded-full">
                    <Users className="w-6 h-6 text-blue-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-chatgpt-card border-border shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Active Deals</p>
                    <p className="text-3xl font-bold text-foreground">{analyticsData.activeDeals}</p>
                    <p className="text-sm text-blue-600">{formatCurrency(analyticsData.totalPipelineValue)} pipeline</p>
                  </div>
                  <div className="p-3 bg-green-500/20 rounded-full">
                    <Target className="w-6 h-6 text-green-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-chatgpt-card border-border shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Conversion Rate</p>
                    <p className="text-3xl font-bold text-foreground">{analyticsData.conversionRate}%</p>
                    <p className="text-sm text-purple-600">Lead to Customer</p>
                  </div>
                  <div className="p-3 bg-purple-500/20 rounded-full">
                    <TrendingUp className="w-6 h-6 text-purple-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-chatgpt-card border-border shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                    <p className="text-3xl font-bold text-foreground">{formatCurrency(analyticsData.totalWonValue)}</p>
                    <p className="text-sm text-green-600">Closed deals value</p>
                  </div>
                  <div className="p-3 bg-orange-500/20 rounded-full">
                    <DollarSign className="w-6 h-6 text-orange-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Status Distribution */}
            {(analyticsFilter === 'all' || analyticsFilter === 'status') && (
              <Card className="bg-chatgpt-card border-border shadow-sm">
                <CardHeader>
                  <CardTitle className="text-foreground flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Contact Status Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(analyticsData.statusData).map(([status, count]) => {
                    const percentage = analyticsData.totalContacts > 0 ? 
                      Math.round((count / analyticsData.totalContacts) * 100) : 0;
                    const colorClass = status === 'customer' ? 'bg-green-500' :
                                     status === 'prospect' ? 'bg-blue-500' :
                                     status === 'lead' ? 'bg-yellow-500' : 'bg-gray-500';
                    
                    return (
                      <div key={status} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-foreground capitalize">{status}</span>
                          <span className="text-sm text-muted-foreground">{count} ({percentage}%)</span>
                        </div>
                        <div className="w-full bg-background rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${colorClass}`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            )}

            {/* Source Distribution */}
            {(analyticsFilter === 'all' || analyticsFilter === 'source') && (
              <Card className="bg-chatgpt-card border-border shadow-sm">
                <CardHeader>
                  <CardTitle className="text-foreground flex items-center gap-2">
                    <PieChart className="w-5 h-5" />
                    Lead Sources
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(analyticsData.sourceData).map(([source, count]) => {
                    const percentage = analyticsData.totalContacts > 0 ? 
                      Math.round((count / analyticsData.totalContacts) * 100) : 0;
                    const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 'bg-red-500', 'bg-cyan-500'];
                    const colorClass = colors[Object.keys(analyticsData.sourceData).indexOf(source) % colors.length];
                    
                    return (
                      <div key={source} className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${colorClass}`}></div>
                          <span className="text-sm font-medium text-foreground">{source}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-bold text-foreground">{count}</span>
                          <span className="text-xs text-muted-foreground ml-2">({percentage}%)</span>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            )}

            {/* Tags Distribution */}
            {(analyticsFilter === 'all' || analyticsFilter === 'tags') && Object.keys(analyticsData.tagData).length > 0 && (
              <Card className="bg-chatgpt-card border-border shadow-sm">
                <CardHeader>
                  <CardTitle className="text-foreground flex items-center gap-2">
                    <Tag className="w-5 h-5" />
                    Contact Tags
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(analyticsData.tagData).map(([tag, count]) => {
                    const percentage = analyticsData.totalContacts > 0 ? 
                      Math.round((count / analyticsData.totalContacts) * 100) : 0;
                    
                    return (
                      <div key={tag} className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className="text-xs">{tag}</Badge>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-bold text-foreground">{count}</span>
                          <span className="text-xs text-muted-foreground ml-2">({percentage}%)</span>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            )}

            {/* Deal Stage Distribution */}
            {Object.keys(analyticsData.dealStageData).length > 0 && (
              <Card className="bg-chatgpt-card border-border shadow-sm">
                <CardHeader>
                  <CardTitle className="text-foreground flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Deal Pipeline Stages
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(analyticsData.dealStageData).map(([stage, count]) => {
                    const percentage = analyticsData.totalDeals > 0 ? 
                      Math.round((count / analyticsData.totalDeals) * 100) : 0;
                    const stageColors: Record<string, string> = {
                      'prospecting': 'bg-blue-500',
                      'qualification': 'bg-yellow-500',
                      'proposal': 'bg-orange-500',
                      'negotiation': 'bg-purple-500',
                      'closed-won': 'bg-green-500',
                      'closed-lost': 'bg-red-500'
                    };
                    const colorClass = stageColors[stage] || 'bg-gray-500';
                    
                    return (
                      <div key={stage} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-foreground capitalize">
                            {stage.replace('-', ' ')}
                          </span>
                          <span className="text-sm text-muted-foreground">{count} ({percentage}%)</span>
                        </div>
                        <div className="w-full bg-background rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${colorClass}`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Recent Activity */}
          <Card className="bg-chatgpt-card border-border shadow-sm">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Recent Activity Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-background/50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-400 mb-1">
                    {contacts.filter(c => new Date(c.updatedAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length}
                  </div>
                  <div className="text-sm text-muted-foreground">Contacts Updated (7 days)</div>
                </div>
                <div className="text-center p-4 bg-background/50 rounded-lg">
                  <div className="text-2xl font-bold text-green-400 mb-1">
                    {deals.filter(d => new Date(d.updatedAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length}
                  </div>
                  <div className="text-sm text-muted-foreground">Deals Updated (7 days)</div>
                </div>
                <div className="text-center p-4 bg-background/50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-400 mb-1">
                    {contacts.filter(c => new Date(c.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length}
                  </div>
                  <div className="text-sm text-muted-foreground">New Contacts (30 days)</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Add Contact Dialog */}
      <Dialog open={isAddContactOpen} onOpenChange={setIsAddContactOpen}>
        <DialogContent className="max-w-2xl bg-chatgpt-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">Add New Contact</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name" className="text-foreground">Name *</Label>
                <Input
                  id="name"
                  placeholder="Enter contact name"
                  value={newContact.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="bg-background border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>
              
              <div>
                <Label htmlFor="email" className="text-foreground">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter email address"
                  value={newContact.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="bg-background border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>
              
              <div>
                <Label htmlFor="phone" className="text-foreground">Phone</Label>
                <Input
                  id="phone"
                  placeholder="Enter phone number"
                  value={newContact.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="bg-background border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>
              
              <div>
                <Label htmlFor="company" className="text-foreground">Company</Label>
                <Input
                  id="company"
                  placeholder="Enter company name"
                  value={newContact.company}
                  onChange={(e) => handleInputChange('company', e.target.value)}
                  className="bg-background border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>
              
              <div>
                <Label htmlFor="position" className="text-foreground">Position</Label>
                <Input
                  id="position"
                  placeholder="Enter job position"
                  value={newContact.position}
                  onChange={(e) => handleInputChange('position', e.target.value)}
                  className="bg-background border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>
              
              <div>
                <Label htmlFor="source" className="text-foreground">Source</Label>
                <Select value={newContact.source} onValueChange={(value) => handleInputChange('source', value)}>
                  <SelectTrigger className="bg-background border-border text-foreground">
                    <SelectValue placeholder="Select source" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableSources.map((source) => (
                      <SelectItem key={source} value={source}>{source}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="status" className="text-foreground">Status</Label>
                <Select value={newContact.status} onValueChange={(value) => handleInputChange('status', value)}>
                  <SelectTrigger className="bg-background border-border text-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lead">Lead</SelectItem>
                    <SelectItem value="prospect">Prospect</SelectItem>
                    <SelectItem value="customer">Customer</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="tags" className="text-foreground">Tags</Label>
                <Input
                  id="tags"
                  placeholder="Enter tags (comma-separated)"
                  value={newContact.tags.join(', ')}
                  onChange={(e) => handleTagsChange(e.target.value)}
                  className="bg-background border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="notes" className="text-foreground">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Enter any additional notes..."
                value={newContact.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                rows={3}
                className="bg-background border-border text-foreground placeholder:text-muted-foreground"
              />
            </div>
            
            <div className="flex items-center justify-end gap-2 pt-4">
              <Button 
                variant="outline" 
                onClick={() => setIsAddContactOpen(false)}
                className="border-border text-foreground hover:bg-background/50"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleAddContact}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Contact
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Manage Sources Dialog */}
      <Dialog open={isManageSourcesOpen} onOpenChange={setIsManageSourcesOpen}>
        <DialogContent className="max-w-2xl bg-chatgpt-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">Manage Customer Sources</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Add New Source */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="newSource" className="text-foreground">Add New Source</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    id="newSource"
                    placeholder="Enter new source name"
                    value={newSource}
                    onChange={(e) => setNewSource(e.target.value)}
                    className="bg-background border-border text-foreground placeholder:text-muted-foreground"
                  />
                  <Button 
                    onClick={handleAddSource}
                    disabled={!newSource.trim()}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add
                  </Button>
                </div>
              </div>
            </div>

            {/* Current Sources */}
            <div>
              <Label className="text-foreground mb-4 block">Current Sources</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {availableSources.map((source) => (
                  <div key={source} className="flex items-center justify-between p-3 bg-background/50 rounded-lg border border-border">
                    <span className="text-sm font-medium text-foreground">{source}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleRemoveSource(source)}
                      className="h-6 w-6 p-0 text-red-400 hover:text-red-600 hover:bg-red-500/20"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Dialog Actions */}
            <div className="flex items-center justify-end gap-2 pt-4">
              <Button 
                variant="outline" 
                onClick={() => setIsManageSourcesOpen(false)}
                className="border-border text-foreground hover:bg-background/50"
              >
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}