import * as React from "react"
import { Clock } from "lucide-react"
import { Label } from "@/components/ui/label"
import { TimePickerInput } from "./time-picker-input"

interface TimePickerDemoProps {
  setHour: (hour: number) => void
  setMinute: (minute: number) => void
  hourValue?: number
  minuteValue?: number
  disabled?: boolean
}

export function TimePickerDemo({
  setHour,
  setMinute,
  hourValue = 12,
  minuteValue = 0,
  disabled = false,
}: TimePickerDemoProps) {
  return (
    <div className="flex items-end gap-2">
      <div className="grid gap-1 text-center">
        <Label htmlFor="hours" className="text-xs">Hours</Label>
        <TimePickerInput
          id="hours"
          value={hourValue}
          onChange={(value) => setHour(value)}
          max={12}
          disabled={disabled}
        />
      </div>
      <div className="grid gap-1 text-center">
        <Label htmlFor="minutes" className="text-xs">Minutes</Label>
        <TimePickerInput
          id="minutes"
          value={minuteValue}
          onChange={(value) => setMinute(value)}
          max={59}
          disabled={disabled}
        />
      </div>
      <div className="grid gap-1 text-center">
        <Label htmlFor="ampm" className="text-xs">AM/PM</Label>
        <select
          id="ampm"
          className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
          disabled={disabled}
        >
          <option>AM</option>
          <option>PM</option>
        </select>
      </div>
    </div>
  )
}