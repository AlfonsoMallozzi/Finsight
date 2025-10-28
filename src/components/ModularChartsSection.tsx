import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { UserRole } from "../App";
import { AnalyticsSection, WidgetLayout, GridSize, ColorPalette, Timeframe } from "../types/widgets";
import { WidgetRenderer } from "./widgets/WidgetRenderer";
import { Button } from "./ui/button";
import { X, GripVertical, Maximize2, Palette } from "lucide-react";
import { Reorder } from "motion/react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "./ui/dropdown-menu";
import { widgetRegistry } from "../data/widgetRegistry";
import { colorPalettes } from "../utils/colorPalettes";
import { Business, Financials } from "../services/businessService";

interface ModularChartsSectionProps {
  timePeriod: string;
  currentRole: UserRole;
  isDesignMode: boolean;
  widgetLayout: WidgetLayout;
  onRemoveWidget: (section: string, widgetId: string) => void;
  onReorderWidgets: (section: string, newOrder: any[]) => void;
  onResizeWidget: (section: string, widgetId: string, newSize: GridSize) => void;
  onSectionChange: (section: AnalyticsSection) => void;
  onChangePalette: (section: string, widgetId: string, palette: ColorPalette) => void;
  business: Business | null;
  financials: Financials | null;
}

export function ModularChartsSection({ 
  timePeriod, 
  currentRole, 
  isDesignMode, 
  widgetLayout,
  onRemoveWidget,
  onReorderWidgets,
  onResizeWidget,
  onSectionChange,
  onChangePalette,
  business,
  financials
}: ModularChartsSectionProps) {
  const getRoleChartConfig = (role: UserRole) => {
    switch (role) {
      case 'cfo':
        return {
          tabs: [
            { key: 'financial' as AnalyticsSection, label: 'Financial Performance' },
            { key: 'profitability' as AnalyticsSection, label: 'Profitability' },
            { key: 'cashflow' as AnalyticsSection, label: 'Cash Flow' }
          ]
        };
      case 'operations':
        return {
          tabs: [
            { key: 'efficiency' as AnalyticsSection, label: 'Operational Efficiency' },
            { key: 'inventory' as AnalyticsSection, label: 'Inventory Management' },
            { key: 'delivery' as AnalyticsSection, label: 'Delivery Performance' }
          ]
        };
      case 'sales':
        return {
          tabs: [
            { key: 'sales' as AnalyticsSection, label: 'Sales Performance' },
            { key: 'pipeline' as AnalyticsSection, label: 'Sales Pipeline' },
            { key: 'customers' as AnalyticsSection, label: 'Customer Analytics' }
          ]
        };
      default:
        return {
          tabs: [
            { key: 'financial' as AnalyticsSection, label: 'Financial Performance' },
            { key: 'inventory' as AnalyticsSection, label: 'Inventory' },
            { key: 'cashflow' as AnalyticsSection, label: 'Cash Flow' }
          ]
        };
    }
  };

  const config = getRoleChartConfig(currentRole);
  const [activeTab, setActiveTab] = useState<AnalyticsSection>(config.tabs[0].key);

  const handleTabChange = (value: string) => {
    const section = value as AnalyticsSection;
    setActiveTab(section);
    onSectionChange(section);
  };

  const defaultSizeOptions: GridSize[] = [
    { cols: 2, rows: 2 },
    { cols: 2, rows: 3 },
    { cols: 3, rows: 2 },
    { cols: 3, rows: 3 },
    { cols: 4, rows: 2 },
    { cols: 4, rows: 3 },
  ];

  const getSizeLabel = (size: GridSize) => {
    return `${size.cols}x${size.rows}`;
  };

  // Get size options for a specific widget
  const getSizeOptionsForWidget = (widgetType: string, section: AnalyticsSection): GridSize[] => {
    const widgets = widgetRegistry[section];
    const widgetDef = widgets?.find(w => w.type === widgetType);
    
    // If widget has allowedSizes, use those
    if (widgetDef?.allowedSizes && widgetDef.allowedSizes.length > 0) {
      return widgetDef.allowedSizes;
    }
    
    // Otherwise use default options
    return defaultSizeOptions;
  };

  const renderWidgetGrid = (section: AnalyticsSection) => {
    const widgets = widgetLayout[section] || [];
    
    if (widgets.length === 0) {
      return (
        <div className="text-center py-12 border-2 border-dashed rounded-lg border-border">
          <p className="text-muted-foreground">
            {isDesignMode 
              ? 'No widgets added yet. Click "Add Widget" to get started.' 
              : 'No data to display for this section.'}
          </p>
        </div>
      );
    }

    // Grid layout with 4 columns - use CSS Grid positioning for precise control
    const gridStyle = "grid grid-cols-4 gap-4 auto-rows-[200px]";

    if (isDesignMode) {
      return (
        <Reorder.Group 
          axis="y" 
          values={widgets} 
          onReorder={(newOrder) => onReorderWidgets(section, newOrder)}
          className={gridStyle}
        >
          {widgets.map((widget) => (
            <Reorder.Item 
              key={widget.id} 
              value={widget}
              className="relative group"
              style={{
                gridColumn: widget.gridPosition ? `${widget.gridPosition.x + 1} / span ${widget.size.cols}` : `span ${widget.size.cols}`,
                gridRow: widget.gridPosition ? `${widget.gridPosition.y + 1} / span ${widget.size.rows}` : `span ${widget.size.rows}`,
              }}
            >
              <div className="absolute -left-3 top-4 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing z-10">
                <GripVertical className="h-5 w-5 text-muted-foreground" />
              </div>
              
              <div className="relative h-full">
                <div className="absolute -top-2 -right-2 z-10 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="secondary"
                        size="icon"
                        className="h-8 w-8 rounded-full shadow-md"
                      >
                        <Maximize2 className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Resize</DropdownMenuLabel>
                      {getSizeOptionsForWidget(widget.widgetType, section).map((size) => (
                        <DropdownMenuItem
                          key={`${size.cols}-${size.rows}`}
                          onClick={() => onResizeWidget(section, widget.id, size)}
                        >
                          {getSizeLabel(size)}
                          {widget.size.cols === size.cols && widget.size.rows === size.rows && ' ✓'}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="secondary"
                        size="icon"
                        className="h-8 w-8 rounded-full shadow-md"
                      >
                        <Palette className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Color Palette</DropdownMenuLabel>
                      {(Object.keys(colorPalettes) as ColorPalette[]).map((paletteKey) => (
                        <DropdownMenuItem
                          key={paletteKey}
                          onClick={() => onChangePalette(section, widget.id, paletteKey)}
                        >
                          <div className="flex items-center gap-2">
                            <div className="flex gap-0.5">
                              {colorPalettes[paletteKey].colors.slice(0, 4).map((color, i) => (
                                <div
                                  key={i}
                                  className="w-3 h-3 rounded-sm"
                                  style={{ backgroundColor: color }}
                                />
                              ))}
                            </div>
                            {colorPalettes[paletteKey].name}
                            {widget.colorPalette === paletteKey && ' ✓'}
                          </div>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                  
                  <Button
                    variant="destructive"
                    size="icon"
                    className="h-8 w-8 rounded-full shadow-md"
                    onClick={() => onRemoveWidget(section, widget.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="ring-2 ring-primary/30 rounded-lg transition-all h-full hover:ring-primary/50">
                  <WidgetRenderer 
                    type={widget.widgetType} 
                    colorPalette={widget.colorPalette}
                    business={business}
                    financials={financials}
                    timeframe={timePeriod as Timeframe}
                  />
                </div>
              </div>
            </Reorder.Item>
          ))}
        </Reorder.Group>
      );
    }

    return (
      <div className={gridStyle}>
        {widgets.map((widget) => (
          <div 
            key={widget.id}
            style={{
              gridColumn: widget.gridPosition ? `${widget.gridPosition.x + 1} / span ${widget.size.cols}` : `span ${widget.size.cols}`,
              gridRow: widget.gridPosition ? `${widget.gridPosition.y + 1} / span ${widget.size.rows}` : `span ${widget.size.rows}`,
            }}
          >
            <WidgetRenderer 
              type={widget.widgetType} 
              colorPalette={widget.colorPalette}
              business={business}
              financials={financials}
              timeframe={timePeriod as Timeframe}
            />
          </div>
        ))}
      </div>
    );
  };

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        {config.tabs.map(tab => (
          <TabsTrigger key={tab.key} value={tab.key}>{tab.label}</TabsTrigger>
        ))}
      </TabsList>
      
      {config.tabs.map(tab => (
        <TabsContent key={tab.key} value={tab.key}>
          {renderWidgetGrid(tab.key)}
        </TabsContent>
      ))}
    </Tabs>
  );
}
