import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Bot, 
  Workflow, 
  FileText, 
  Plug, 
  BarChart3,
  Settings,
  Play,
  Activity,
  TrendingUp,
  Users,
  Mail,
  Calendar,
  Zap,
  Database,
  Globe,
  Shield,
  Bell,
  Search,
  Plus,
  MoreHorizontal,
  Star,
  Clock,
  CheckCircle,
  AlertCircle,
  Info,
  Sparkles,
  Target,
  Brain,
  Rocket,
  ArrowRight,
  Crown,
  Lightbulb,
  Gauge,
  MessageSquare,
  UserCheck,
  Megaphone,
  Wrench
} from 'lucide-react';

import AgentManager from './AgentManager';
import WorkflowBuilder from './WorkflowBuilder';
import { AIAgent, Workflow as WorkflowType, APIConnector } from '@/types/nexus';
import { agentManager } from '@/lib/agent-manager';

interface EnhancedNexusDashboardProps {
  className?: string;
}

// AI Agent Character Components
const AuroraCharacter = ({ className = "" }: { className?: string }) => (
  <div className={`relative ${className}`}>
    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center shadow-lg animate-float">
      {/* Body */}
      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white rounded-full relative flex items-center justify-center">
        {/* Eyes */}
        <div className="absolute top-3 left-3 w-2 h-2 bg-black rounded-full"></div>
        <div className="absolute top-3 right-3 w-2 h-2 bg-black rounded-full"></div>
        {/* Mouth */}
        <div className="absolute top-6 w-4 h-0.5 bg-black rounded-full"></div>
        {/* Bow Tie */}
        <div className="absolute -top-2 w-6 h-4 bg-purple-500 rounded-full flex items-center justify-center">
          <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
        </div>
        {/* Waistcoat */}
        <div className="absolute bottom-0 w-12 h-6 bg-white border-2 border-purple-300 rounded-t-lg"></div>
        {/* Tray */}
        <div className="absolute -left-6 top-8 w-4 h-2 bg-gray-300 rounded-sm transform rotate-12"></div>
      </div>
    </div>
  </div>
);

const VegaCharacter = ({ className = "" }: { className?: string }) => (
  <div className={`relative ${className}`}>
    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center shadow-lg animate-float" style={{ animationDelay: '0.5s' }}>
      {/* Body */}
      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white rounded-full relative flex items-center justify-center">
        {/* Eyes */}
        <div className="absolute top-3 left-3 w-2 h-2 bg-black rounded-full"></div>
        <div className="absolute top-3 right-3 w-2 h-2 bg-black rounded-full"></div>
        {/* Mouth */}
        <div className="absolute top-6 w-4 h-0.5 bg-black rounded-full"></div>
        {/* Shirt */}
        <div className="absolute top-2 w-10 h-8 bg-blue-100 rounded-lg"></div>
        {/* Tie */}
        <div className="absolute top-4 w-2 h-6 bg-orange-400 rounded-full"></div>
        {/* Thumbs Up */}
        <div className="absolute -right-2 top-6 w-3 h-3 bg-white rounded-full flex items-center justify-center shadow-md">
          <div className="w-1 h-2 bg-blue-500 rounded-full"></div>
        </div>
      </div>
    </div>
  </div>
);

const LumaCharacter = ({ className = "" }: { className?: string }) => (
  <div className={`relative ${className}`}>
    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center shadow-lg animate-float" style={{ animationDelay: '1s' }}>
      {/* Body */}
      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white rounded-full relative flex items-center justify-center">
        {/* Eyes */}
        <div className="absolute top-3 left-3 w-2 h-2 bg-black rounded-full"></div>
        <div className="absolute top-3 right-3 w-2 h-2 bg-black rounded-full"></div>
        {/* Mouth */}
        <div className="absolute top-6 w-4 h-0.5 bg-black rounded-full"></div>
        {/* Headset */}
        <div className="absolute -top-1 w-18 h-6 bg-black rounded-full flex items-center justify-center">
          <div className="w-4 h-2 bg-gray-600 rounded-full"></div>
          <div className="absolute -left-2 w-2 h-1 bg-gray-400 rounded-full"></div>
        </div>
        {/* Shirt */}
        <div className="absolute bottom-2 w-12 h-4 bg-green-100 rounded-lg"></div>
      </div>
    </div>
  </div>
);

const OrionCharacter = ({ className = "" }: { className?: string }) => (
  <div className={`relative ${className}`}>
    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center shadow-lg animate-float" style={{ animationDelay: '1.5s' }}>
      {/* Body */}
      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white rounded-full relative flex items-center justify-center">
        {/* Eyes */}
        <div className="absolute top-3 left-3 w-2 h-2 bg-black rounded-full"></div>
        <div className="absolute top-3 right-3 w-2 h-2 bg-black rounded-full"></div>
        {/* Mouth */}
        <div className="absolute top-6 w-4 h-0.5 bg-black rounded-full"></div>
        {/* Hair */}
        <div className="absolute -top-2 w-14 h-4 bg-yellow-300 rounded-full flex items-center justify-center">
          <div className="flex gap-1">
            <div className="w-1 h-3 bg-yellow-400 rounded-full transform rotate-12"></div>
            <div className="w-1 h-3 bg-yellow-400 rounded-full"></div>
            <div className="w-1 h-3 bg-yellow-400 rounded-full transform -rotate-12"></div>
          </div>
        </div>
        {/* Shirt */}
        <div className="absolute bottom-2 w-12 h-4 bg-orange-100 rounded-lg"></div>
        {/* Creative sparkles */}
        <div className="absolute -right-2 -top-1 w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
      </div>
    </div>
  </div>
);

export default function EnhancedNexusDashboard({ className }: EnhancedNexusDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [agents, setAgents] = useState<AIAgent[]>([]);
  const [workflows, setWorkflows] = useState<WorkflowType[]>([]);
  const [connectors, setConnectors] = useState<APIConnector[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<AIAgent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const allAgents = await agentManager.getAllAgents();
      setAgents(allAgents);
      
      // TODO: Load workflows and connectors
      // const allWorkflows = await workflowManager.getAllWorkflows();
      // const allConnectors = await connectorManager.getAllConnectors();
      
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    {
      id: 'overview',
      label: 'Overview',
      icon: <BarChart3 className="w-4 h-4" />,
      badge: null
    },
    {
      id: 'agents',
      label: 'Active Agents',
      icon: <Bot className="w-4 h-4" />,
      badge: agents.filter(a => a.status === 'active').length
    },
    {
      id: 'workflows',
      label: 'Workflows',
      icon: <Workflow className="w-4 h-4" />,
      badge: workflows.length
    },
    {
      id: 'templates',
      label: 'Templates',
      icon: <FileText className="w-4 h-4" />,
      badge: null
    },
    {
      id: 'integrations',
      label: 'Integrations',
      icon: <Plug className="w-4 h-4" />,
      badge: connectors.length
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: <Activity className="w-4 h-4" />,
      badge: null
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <Settings className="w-4 h-4" />,
      badge: null
    }
  ];

  const getOverviewMetrics = () => {
    const activeAgents = agents.filter(a => a.status === 'active').length;
    const totalInteractions = agents.reduce((sum, agent) => sum + agent.metrics.totalInteractions, 0);
    const successRate = agents.length > 0 
      ? agents.reduce((sum, agent) => sum + agent.metrics.successfulTasks, 0) / 
        agents.reduce((sum, agent) => sum + agent.metrics.totalInteractions, 0) * 100
      : 0;
    const avgResponseTime = agents.length > 0
      ? agents.reduce((sum, agent) => sum + agent.metrics.averageResponseTime, 0) / agents.length
      : 0;

    return {
      activeAgents,
      totalInteractions,
      successRate: Math.round(successRate),
      avgResponseTime: Math.round(avgResponseTime)
    };
  };

  const getRecentActivity = () => {
    // TODO: Load actual activity from database
    return [];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const metrics = getOverviewMetrics();
  const recentActivity = getRecentActivity();

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Enhanced Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-purple-500/5 to-blue-500/10 rounded-2xl"></div>
        <div className="relative p-4 sm:p-6 lg:p-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-4 w-full lg:w-auto">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-primary to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
                    Nexus AI Business Suite
                  </h1>
                  <p className="text-sm sm:text-base lg:text-lg text-muted-foreground">
                    Your autonomous AI business platform powered by Gemini
                  </p>
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                <Badge variant="secondary" className="px-2 sm:px-3 py-1 text-xs">
                  <Crown className="w-3 h-3 mr-1" />
                  Enterprise Ready
                </Badge>
                <Badge variant="outline" className="px-2 sm:px-3 py-1 text-xs">
                  <Brain className="w-3 h-3 mr-1" />
                  AI-Powered
                </Badge>
                <Badge variant="outline" className="px-2 sm:px-3 py-1 text-xs">
                  <Zap className="w-3 h-3 mr-1" />
                  Real-time
                </Badge>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
              <Button variant="outline" size="lg" className="shadow-lg w-full sm:w-auto">
                <Search className="w-4 h-4 mr-2" />
                Quick Search
              </Button>
              <Button size="lg" className="shadow-lg bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 w-full sm:w-auto">
                <Plus className="w-4 h-4 mr-2" />
                Create Agent
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Animated Hero Section - AI Agents */}
      <div className="relative">
        <div className="text-center mb-6 sm:mb-8 px-4">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3">
            <Target className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
            Meet Your AI Business Team
            <Target className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto">
            Deploy intelligent AI agents that work 24/7 to grow your business. Each agent specializes in specific business functions and learns from your data.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 px-4 sm:px-0">
          {/* Aurora - Executive Assistant */}
          <Card className="group hover:shadow-xl transition-all duration-300 border-border bg-gradient-to-br from-purple-50/50 to-purple-100/30 dark:from-purple-900/20 dark:to-purple-800/10">
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-4">
                <AuroraCharacter />
              </div>
              <CardTitle className="text-xl text-purple-600 dark:text-purple-400">Aurora</CardTitle>
              <CardDescription className="text-sm font-medium">AI Executive Assistant</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-xs sm:text-sm font-semibold text-purple-600 dark:text-purple-400 mb-3">What I can do</h4>
                <div className="grid grid-cols-2 gap-1 sm:gap-2">
                  <Badge variant="secondary" className="text-xs justify-center py-1">Schedule Calendar</Badge>
                  <Badge variant="secondary" className="text-xs justify-center py-1">Prioritize Tasks</Badge>
                  <Badge variant="secondary" className="text-xs justify-center py-1">Reply to Emails</Badge>
                  <Badge variant="secondary" className="text-xs justify-center py-1">Take Notes</Badge>
                </div>
              </div>
              <p className="text-xs text-muted-foreground text-center">and hundreds more skills...</p>
            </CardContent>
          </Card>

          {/* Vega - Sales Representative */}
          <Card className="group hover:shadow-xl transition-all duration-300 border-border bg-gradient-to-br from-blue-50/50 to-blue-100/30 dark:from-blue-900/20 dark:to-blue-800/10">
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-4">
                <VegaCharacter />
              </div>
              <CardTitle className="text-xl text-blue-600 dark:text-blue-400">Vega</CardTitle>
              <CardDescription className="text-sm font-medium">AI Sales Representative</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-xs sm:text-sm font-semibold text-blue-600 dark:text-blue-400 mb-3">What I can do</h4>
                <div className="grid grid-cols-2 gap-1 sm:gap-2">
                  <Badge variant="secondary" className="text-xs justify-center py-1">Update CRM</Badge>
                  <Badge variant="secondary" className="text-xs justify-center py-1">Chase Opportunities</Badge>
                  <Badge variant="secondary" className="text-xs justify-center py-1">Find Leads</Badge>
                  <Badge variant="secondary" className="text-xs justify-center py-1">Personalized Outreach</Badge>
                </div>
              </div>
              <p className="text-xs text-muted-foreground text-center">and hundreds more skills...</p>
            </CardContent>
          </Card>

          {/* Luma - Customer Support */}
          <Card className="group hover:shadow-xl transition-all duration-300 border-border bg-gradient-to-br from-green-50/50 to-green-100/30 dark:from-green-900/20 dark:to-green-800/10">
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-4">
                <LumaCharacter />
              </div>
              <CardTitle className="text-xl text-green-600 dark:text-green-400">Luma</CardTitle>
              <CardDescription className="text-sm font-medium">AI Customer Support</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-xs sm:text-sm font-semibold text-green-600 dark:text-green-400 mb-3">What I can do</h4>
                <div className="grid grid-cols-2 gap-1 sm:gap-2">
                  <Badge variant="secondary" className="text-xs justify-center py-1">Respond to Tickets</Badge>
                  <Badge variant="secondary" className="text-xs justify-center py-1">Escalate Issues</Badge>
                  <Badge variant="secondary" className="text-xs justify-center py-1">Take Actions</Badge>
                  <Badge variant="secondary" className="text-xs justify-center py-1">Solve Problems</Badge>
                </div>
              </div>
              <p className="text-xs text-muted-foreground text-center">and hundreds more skills...</p>
            </CardContent>
          </Card>

          {/* Orion - Marketing Strategist */}
          <Card className="group hover:shadow-xl transition-all duration-300 border-border bg-gradient-to-br from-orange-50/50 to-orange-100/30 dark:from-orange-900/20 dark:to-orange-800/10">
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-4">
                <OrionCharacter />
              </div>
              <CardTitle className="text-xl text-orange-600 dark:text-orange-400">Orion</CardTitle>
              <CardDescription className="text-sm font-medium">AI Marketing Strategist</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-xs sm:text-sm font-semibold text-orange-600 dark:text-orange-400 mb-3">What I can do</h4>
                <div className="grid grid-cols-2 gap-1 sm:gap-2">
                  <Badge variant="secondary" className="text-xs justify-center py-1">Write Blog Posts</Badge>
                  <Badge variant="secondary" className="text-xs justify-center py-1">Run SEO</Badge>
                  <Badge variant="secondary" className="text-xs justify-center py-1">Manage Social Media</Badge>
                  <Badge variant="secondary" className="text-xs justify-center py-1">Write with Brand Voice</Badge>
                </div>
              </div>
              <p className="text-xs text-muted-foreground text-center">and hundreds more skills...</p>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-6 sm:mt-8 px-4">
          <Button size="lg" className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 shadow-lg w-full sm:w-auto touch-manipulation">
            <Rocket className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            Launch Your AI Team
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="overflow-x-auto scrollbar-hide">
          <TabsList className="grid w-full min-w-[700px] grid-cols-7 bg-background border border-border shadow-lg">
            {tabs.map((tab) => (
              <TabsTrigger key={tab.id} value={tab.id} className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm touch-manipulation">
                {tab.icon}
                <span className="hidden sm:inline">{tab.label}</span>
                {tab.badge !== null && (
                  <Badge variant="secondary" className="ml-1 text-xs">
                    {tab.badge}
                  </Badge>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4 sm:space-y-6">
          {/* Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 px-4 sm:px-0">
            <Card className="hover:shadow-lg transition-shadow touch-manipulation">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium">Active Agents</CardTitle>
                <Bot className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-xl sm:text-2xl font-bold">{metrics.activeAgents}</div>
                <p className="text-xs text-muted-foreground">
                  {agents.length - metrics.activeAgents} inactive
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow touch-manipulation">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium">Total Interactions</CardTitle>
                <Activity className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-xl sm:text-2xl font-bold">{metrics.totalInteractions.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  <TrendingUp className="inline w-3 h-3 mr-1" />
                  +12% from last week
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow touch-manipulation">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium">Success Rate</CardTitle>
                <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-xl sm:text-2xl font-bold">{metrics.successRate}%</div>
                <p className="text-xs text-muted-foreground">
                  <TrendingUp className="inline w-3 h-3 mr-1" />
                  +2% from last week
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow touch-manipulation">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium">Avg Response Time</CardTitle>
                <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-xl sm:text-2xl font-bold">{metrics.avgResponseTime}ms</div>
                <p className="text-xs text-muted-foreground">
                  <TrendingUp className="inline w-3 h-3 mr-1" />
                  -5% from last week
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-yellow-500" />
                Quick Actions
              </CardTitle>
              <CardDescription>
                Common tasks to get started with your AI agents
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button 
                  variant="outline" 
                  className="h-auto p-4 flex flex-col items-start gap-2 hover:shadow-md transition-all"
                  onClick={() => setActiveTab('agents')}
                >
                  <Bot className="w-6 h-6 text-blue-500" />
                  <div className="text-left">
                    <div className="font-medium">Create Agent</div>
                    <div className="text-sm text-muted-foreground">Set up a new AI agent</div>
                  </div>
                </Button>

                <Button 
                  variant="outline" 
                  className="h-auto p-4 flex flex-col items-start gap-2 hover:shadow-md transition-all"
                  onClick={() => setActiveTab('workflows')}
                >
                  <Workflow className="w-6 h-6 text-green-500" />
                  <div className="text-left">
                    <div className="font-medium">Build Workflow</div>
                    <div className="text-sm text-muted-foreground">Create automation workflow</div>
                  </div>
                </Button>

                <Button 
                  variant="outline" 
                  className="h-auto p-4 flex flex-col items-start gap-2 hover:shadow-md transition-all"
                  onClick={() => setActiveTab('integrations')}
                >
                  <Plug className="w-6 h-6 text-purple-500" />
                  <div className="text-left">
                    <div className="font-medium">Connect API</div>
                    <div className="text-sm text-muted-foreground">Link external services</div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-primary" />
                  Recent Activity
                </CardTitle>
                <CardDescription>
                  Latest actions across your AI agents
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        {activity.icon}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{activity.message}</p>
                        <p className="text-xs text-muted-foreground">
                          {activity.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gauge className="w-5 h-5 text-green-500" />
                  Agent Status
                </CardTitle>
                <CardDescription>
                  Current status of your AI agents
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {agents.slice(0, 5).map((agent) => (
                    <div key={agent.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${
                          agent.status === 'active' ? 'bg-green-500' : 
                          agent.status === 'inactive' ? 'bg-gray-500' : 'bg-yellow-500'
                        }`} />
                        <div>
                          <p className="text-sm font-medium">{agent.name}</p>
                          <p className="text-xs text-muted-foreground">{agent.role}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{agent.metrics.totalInteractions}</p>
                        <p className="text-xs text-muted-foreground">interactions</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Agents Tab */}
        <TabsContent value="agents">
          <AgentManager 
            onAgentSelect={setSelectedAgent}
            selectedAgentId={selectedAgent?.id}
          />
        </TabsContent>

        {/* Workflows Tab */}
        <TabsContent value="workflows">
          <WorkflowBuilder />
        </TabsContent>

        {/* Templates Tab */}
        <TabsContent value="templates" className="space-y-6">
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Template Library</h3>
            <p className="text-muted-foreground mb-4">
              Pre-built workflow templates for common business processes
            </p>
            <Button>Browse Templates</Button>
          </div>
        </TabsContent>

        {/* Integrations Tab */}
        <TabsContent value="integrations" className="space-y-6">
          <div className="text-center py-12">
            <Plug className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">API Integrations</h3>
            <p className="text-muted-foreground mb-4">
              Connect your favorite business tools and services
            </p>
            <Button>Connect Service</Button>
          </div>
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports" className="space-y-6">
          <div className="text-center py-12">
            <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Analytics & Reports</h3>
            <p className="text-muted-foreground mb-4">
              Detailed insights into your AI agents' performance
            </p>
            <Button>Generate Report</Button>
          </div>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <div className="text-center py-12">
            <Settings className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Settings</h3>
            <p className="text-muted-foreground mb-4">
              Configure your Nexus AI platform preferences
            </p>
            <Button>Open Settings</Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
