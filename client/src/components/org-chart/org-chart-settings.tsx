import React from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

interface OrgChartSettingsProps {
  onClose: () => void;
  chartLayout: "vertical" | "horizontal";
  setChartLayout: (layout: "vertical" | "horizontal") => void;
}

const OrgChartSettings = ({ 
  onClose, 
  chartLayout, 
  setChartLayout 
}: OrgChartSettingsProps) => {
  return (
    <Sheet open={true} onOpenChange={() => onClose()}>
      <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-2xl">Organization Chart Settings</SheetTitle>
          <SheetDescription>
            Customize how your organization chart looks and behaves
          </SheetDescription>
        </SheetHeader>

        <Accordion type="single" collapsible className="w-full" defaultValue="appearance">
          {/* Appearance Settings */}
          <AccordionItem value="appearance">
            <AccordionTrigger className="text-lg font-medium">
              Appearance
            </AccordionTrigger>
            <AccordionContent className="space-y-6 pt-4">
              {/* Chart Layout */}
              <div className="space-y-4">
                <h3 className="text-base font-medium">Chart Layout</h3>
                <RadioGroup 
                  value={chartLayout} 
                  onValueChange={(v) => setChartLayout(v as "vertical" | "horizontal")}
                  className="grid grid-cols-2 gap-4"
                >
                  <div>
                    <RadioGroupItem
                      value="vertical"
                      id="vertical"
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor="vertical"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 rounded-full bg-muted-foreground/20" />
                        <div className="space-y-1">
                          <div className="w-16 h-2 rounded-md bg-muted-foreground/20" />
                          <div className="w-10 h-2 rounded-md bg-muted-foreground/20" />
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-4 justify-center">
                        <div className="flex flex-col items-center gap-1">
                          <div className="w-6 h-6 rounded-full bg-muted-foreground/20" />
                          <div className="w-12 h-1.5 rounded-md bg-muted-foreground/20" />
                        </div>
                        <div className="flex flex-col items-center gap-1">
                          <div className="w-6 h-6 rounded-full bg-muted-foreground/20" />
                          <div className="w-12 h-1.5 rounded-md bg-muted-foreground/20" />
                        </div>
                      </div>
                      <span className="block w-full text-center font-medium mt-2">
                        Vertical
                      </span>
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem
                      value="horizontal"
                      id="horizontal"
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor="horizontal"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 rounded-full bg-muted-foreground/20" />
                        <div className="space-y-1">
                          <div className="w-16 h-2 rounded-md bg-muted-foreground/20" />
                          <div className="w-10 h-2 rounded-md bg-muted-foreground/20" />
                        </div>
                      </div>
                      <div className="flex flex-col gap-3 items-center">
                        <div className="flex items-center gap-1">
                          <div className="w-6 h-6 rounded-full bg-muted-foreground/20" />
                          <div className="w-12 h-1.5 rounded-md bg-muted-foreground/20" />
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-6 h-6 rounded-full bg-muted-foreground/20" />
                          <div className="w-12 h-1.5 rounded-md bg-muted-foreground/20" />
                        </div>
                      </div>
                      <span className="block w-full text-center font-medium mt-2">
                        Horizontal
                      </span>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <Separator />

              {/* Card Style */}
              <div className="space-y-4">
                <h3 className="text-base font-medium">Card Style</h3>
                <Select defaultValue="standard">
                  <SelectTrigger>
                    <SelectValue placeholder="Select card style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="compact">Compact</SelectItem>
                    <SelectItem value="detailed">Detailed</SelectItem>
                    <SelectItem value="minimal">Minimal</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Card Features */}
              <div className="space-y-4">
                <h3 className="text-base font-medium">Card Features</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="show-photos" className="flex-1">Show profile photos</Label>
                    <Switch id="show-photos" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="show-department" className="flex-1">Show department badge</Label>
                    <Switch id="show-department" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="show-contact" className="flex-1">Show contact buttons</Label>
                    <Switch id="show-contact" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="show-actions" className="flex-1">Show actions menu</Label>
                    <Switch id="show-actions" defaultChecked />
                  </div>
                </div>
              </div>

              {/* Colors */}
              <div className="space-y-4">
                <h3 className="text-base font-medium">Color Theme</h3>
                <Select defaultValue="default">
                  <SelectTrigger>
                    <SelectValue placeholder="Select color theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="department">Department Colors</SelectItem>
                    <SelectItem value="hierarchy">Hierarchy Levels</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Behavior Settings */}
          <AccordionItem value="behavior">
            <AccordionTrigger className="text-lg font-medium">
              Behavior
            </AccordionTrigger>
            <AccordionContent className="space-y-6 pt-4">
              {/* Collapse/Expand */}
              <div className="space-y-4">
                <h3 className="text-base font-medium">Default Expansion</h3>
                <Select defaultValue="first-level">
                  <SelectTrigger>
                    <SelectValue placeholder="Default expansion behavior" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Expand All</SelectItem>
                    <SelectItem value="first-level">Expand First Level</SelectItem>
                    <SelectItem value="second-level">Expand Second Level</SelectItem>
                    <SelectItem value="none">Collapse All</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              {/* Interactive Features */}
              <div className="space-y-4">
                <h3 className="text-base font-medium">Interactive Features</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="enable-drag" className="flex-1">Enable drag and drop</Label>
                    <Switch id="enable-drag" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="enable-zoom" className="flex-1">Enable zoom controls</Label>
                    <Switch id="enable-zoom" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="enable-pan" className="flex-1">Enable panning</Label>
                    <Switch id="enable-pan" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="enable-minimap" className="flex-1">Show minimap</Label>
                    <Switch id="enable-minimap" />
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Data Settings */}
          <AccordionItem value="data">
            <AccordionTrigger className="text-lg font-medium">
              Data Settings
            </AccordionTrigger>
            <AccordionContent className="space-y-6 pt-4">
              {/* Update Frequency */}
              <div className="space-y-4">
                <h3 className="text-base font-medium">Data Update Frequency</h3>
                <Select defaultValue="live">
                  <SelectTrigger>
                    <SelectValue placeholder="Update frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="live">Live Updates</SelectItem>
                    <SelectItem value="hourly">Hourly</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="manual">Manual Refresh</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              {/* Data Source */}
              <div className="space-y-4">
                <h3 className="text-base font-medium">Data Source</h3>
                <Select defaultValue="default">
                  <SelectTrigger>
                    <SelectValue placeholder="Select data source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Employee Directory</SelectItem>
                    <SelectItem value="custom">Custom Import</SelectItem>
                    <SelectItem value="external">External Integration</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* External Integrations */}
              <div className="space-y-4">
                <h3 className="text-base font-medium">External Integrations</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="enable-google" className="flex-1">Google Workspace</Label>
                    <Switch id="enable-google" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="enable-azure" className="flex-1">Microsoft Azure/O365</Label>
                    <Switch id="enable-azure" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="enable-slack" className="flex-1">Slack</Label>
                    <Switch id="enable-slack" />
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Export & Sharing */}
          <AccordionItem value="export">
            <AccordionTrigger className="text-lg font-medium">
              Export & Sharing
            </AccordionTrigger>
            <AccordionContent className="space-y-6 pt-4">
              {/* Export Format */}
              <div className="space-y-4">
                <h3 className="text-base font-medium">Export Format</h3>
                <Select defaultValue="png">
                  <SelectTrigger>
                    <SelectValue placeholder="Select export format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="png">PNG Image</SelectItem>
                    <SelectItem value="svg">SVG Vector</SelectItem>
                    <SelectItem value="pdf">PDF Document</SelectItem>
                    <SelectItem value="excel">Excel Spreadsheet</SelectItem>
                    <SelectItem value="csv">CSV</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              {/* Sharing Options */}
              <div className="space-y-4">
                <h3 className="text-base font-medium">Sharing Options</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="enable-public" className="flex-1">Public link sharing</Label>
                    <Switch id="enable-public" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="enable-password" className="flex-1">Password protection</Label>
                    <Switch id="enable-password" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="enable-expiry" className="flex-1">Link expiration</Label>
                    <Switch id="enable-expiry" />
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <SheetFooter className="mt-8">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button>Save Changes</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default OrgChartSettings;