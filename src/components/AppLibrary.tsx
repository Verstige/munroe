import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Map, 
  FileText, 
  CheckSquare, 
  UserPlus, 
  Mail, 
  Calendar, 
  Users, 
  Timer, 
  CalendarDays, 
  Bot, 
  Search,
  X,
  Sparkles,
  Target,
  Clock,
  Building2,
  Network,
  Database,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AppLibraryProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToTab: (tab: string) => void;
  className?: string;
}

interface BusinessTool {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  category: 'productivity' | 'communication' | 'management' | 'ai' | 'analytics';
  color: string;
  isNew?: boolean;
  isPopular?: boolean;
}

const businessTools: BusinessTool[] = [
  {
    id: 'mindmap',
    name: 'Business Map',
    description: 'Visual project mapping and business ecosystem overview',
    icon: Map,
    category: 'management',
    color: 'bg-blue-500',
    isPopular: true
  },
  {
    id: 'notes',
    name: 'Notes',
    description: 'Project notes and documentation',
    icon: FileText,
    category: 'productivity',
    color: 'bg-green-500'
  },
  {
    id: 'tasks',
    name: 'Tasks',
    description: 'Task management and project tracking',
    icon: CheckSquare,
    category: 'productivity',
    color: 'bg-orange-500',
    isPopular: true
  },
  {
    id: 'crm',
    name: 'Connect',
    description: 'Customer relationship management',
    icon: UserPlus,
    category: 'communication',
    color: 'bg-purple-500'
  },
  {
    id: 'email',
    name: 'Email',
    description: 'Email management & Gmail integration',
    icon: Mail,
    category: 'communication',
    color: 'bg-red-500'
  },
  {
    id: 'calendar',
    name: 'Calendar',
    description: 'Workspace calendar & scheduling',
    icon: Calendar,
    category: 'productivity',
    color: 'bg-indigo-500'
  },
  {
    id: 'team',
    name: 'Team',
    description: 'Team management and collaboration',
    icon: Users,
    category: 'management',
    color: 'bg-pink-500'
  },
  {
    id: 'timer',
    name: 'Timer',
    description: 'Time tracking and productivity monitoring',
    icon: Timer,
    category: 'productivity',
    color: 'bg-yellow-500'
  },
  {
    id: 'bookings',
    name: 'Bookings',
    description: 'Appointment booking management',
    icon: CalendarDays,
    category: 'management',
    color: 'bg-teal-500'
  },
  {
    id: 'nova',
    name: 'Nova AI',
    description: 'AI assistant for business intelligence',
    icon: Bot,
    category: 'ai',
    color: 'bg-cyan-500',
    isNew: true,
    isPopular: true
  }
];

const categories = [
  { id: 'all', name: 'All Tools', icon: Database },
  { id: 'productivity', name: 'Productivity', icon: Zap },
  { id: 'communication', name: 'Communication', icon: Network },
  { id: 'management', name: 'Management', icon: Building2 },
  { id: 'ai', name: 'AI Tools', icon: Bot }
];

export default function AppLibrary({ isOpen, onClose, onNavigateToTab, className }: AppLibraryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredTools = businessTools.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleToolClick = (toolId: string) => {
    onNavigateToTab(toolId);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={cn("fixed inset-0 z-50 bg-black/50 backdrop-blur-sm", className)}>
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="bg-background/95 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <Database className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">App Library</h2>
                <p className="text-sm text-muted-foreground">All your business tools in one place</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Search and Filters */}
          <div className="p-6 border-b border-border/50">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search business tools..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2 overflow-x-auto">
                {categories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <Button
                      key={category.id}
                      variant={selectedCategory === category.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(category.id)}
                      className="whitespace-nowrap"
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {category.name}
                    </Button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Tools Grid */}
          <div className="p-6 overflow-y-auto max-h-[60vh]">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredTools.map((tool) => {
                const Icon = tool.icon;
                return (
                  <div
                    key={tool.id}
                    onClick={() => handleToolClick(tool.id)}
                    className="group relative bg-card/50 hover:bg-card/80 border border-border/50 hover:border-border rounded-xl p-4 cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105"
                  >
                    {/* Badges */}
                    <div className="absolute top-3 right-3 flex gap-1">
                      {tool.isNew && (
                        <Badge variant="secondary" className="text-xs bg-green-500/10 text-green-600 border-green-500/20">
                          New
                        </Badge>
                      )}
                      {tool.isPopular && (
                        <Badge variant="secondary" className="text-xs bg-blue-500/10 text-blue-600 border-blue-500/20">
                          Popular
                        </Badge>
                      )}
                    </div>

                    {/* Icon */}
                    <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-3", tool.color)}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>

                    {/* Content */}
                    <div className="space-y-2">
                      <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">
                        {tool.name}
                      </h3>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {tool.description}
                      </p>
                    </div>

                    {/* Hover Effect */}
                    <div className="absolute inset-0 rounded-xl bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                );
              })}
            </div>

            {filteredTools.length === 0 && (
              <div className="text-center py-12">
                <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No tools found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-border/50 bg-muted/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Sparkles className="w-4 h-4" />
                <span>{filteredTools.length} tools available</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Target className="w-4 h-4" />
                <span>Click any tool to open it</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
