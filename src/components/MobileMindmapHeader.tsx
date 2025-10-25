import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Search, Filter } from 'lucide-react';

interface MobileMindmapHeaderProps {
  onAddElement: () => void;
  onSearch: () => void;
  onFilter: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const MobileMindmapHeader: React.FC<MobileMindmapHeaderProps> = ({
  onAddElement,
  onSearch,
  onFilter,
  searchQuery,
  onSearchChange
}) => {
  return (
    <div className="lg:hidden bg-background/95 backdrop-blur-sm border-b border-border/50 sticky top-0 z-50">
      <div className="flex items-center justify-between p-3">
        {/* Search Bar */}
        <div className="flex-1 mr-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search elements..."
              className="w-full pl-9 pr-3 py-2 bg-background/50 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onFilter}
            className="p-2"
          >
            <Filter className="w-4 h-4" />
          </Button>
          
          <Button
            onClick={onAddElement}
            size="sm"
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-4"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MobileMindmapHeader;
