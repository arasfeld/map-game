"use client";

import { Settings } from "lucide-react";
import type { GameSettings } from "@/lib/game-settings";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface SettingsMenuProps {
  settings: GameSettings;
  onSettingsChange: (settings: GameSettings) => void;
  disabled?: boolean;
}

export function SettingsMenu({
  settings,
  onSettingsChange,
  disabled = false,
}: SettingsMenuProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon">
          <Settings className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Game settings</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-auto">
        <div className="grid gap-3">
          <div className="flex items-center gap-2">
            <Checkbox
              id="include-dc"
              checked={settings.includeDC}
              onCheckedChange={(checked) =>
                onSettingsChange({ ...settings, includeDC: !!checked })
              }
              disabled={disabled}
            />
            <Label htmlFor="include-dc">Include Washington, D.C.</Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="include-territories"
              checked={settings.includeTerritories}
              onCheckedChange={(checked) =>
                onSettingsChange({ ...settings, includeTerritories: !!checked })
              }
              disabled={disabled}
            />
            <Label htmlFor="include-territories">
              Include U.S. Territories
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="include-associated-states"
              checked={settings.includeAssociatedStates}
              onCheckedChange={(checked) =>
                onSettingsChange({
                  ...settings,
                  includeAssociatedStates: !!checked,
                })
              }
              disabled={disabled}
            />
            <Label htmlFor="include-associated-states">
              Include Associated States
            </Label>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
