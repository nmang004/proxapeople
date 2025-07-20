import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon, Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { TimePickerDemo } from "@/components/ui/time-picker"

interface DatePickerProps {
  date: Date | undefined
  setDate: (date: Date | undefined) => void
  showTimePicker?: boolean
  className?: string
}

export function DatePicker({ date, setDate, showTimePicker = false, className }: DatePickerProps) {
  const [selectedHour, setSelectedHour] = React.useState<string>("12")
  const [selectedMinute, setSelectedMinute] = React.useState<string>("00")
  const [selectedMeridiem, setSelectedMeridiem] = React.useState<"AM" | "PM">("PM")

  // Update time when hour, minute or meridiem changes
  React.useEffect(() => {
    if (date && showTimePicker) {
      const newDate = new Date(date)
      let hour = parseInt(selectedHour, 10)
      
      // Convert from 12-hour to 24-hour format
      if (selectedMeridiem === "PM" && hour < 12) {
        hour += 12
      } else if (selectedMeridiem === "AM" && hour === 12) {
        hour = 0
      }
      
      newDate.setHours(hour, parseInt(selectedMinute, 10))
      setDate(newDate)
    }
  }, [selectedHour, selectedMinute, selectedMeridiem, date, showTimePicker, setDate])

  // When date is selected from calendar, preserve the current time if it exists
  const handleDateSelect = (newDate: Date | undefined) => {
    if (newDate && date) {
      const currentDate = new Date(date)
      newDate.setHours(currentDate.getHours(), currentDate.getMinutes())
    }
    setDate(newDate)
  }

  // Initialize time values from provided date
  React.useEffect(() => {
    if (date && showTimePicker) {
      const hours = date.getHours()
      const minutes = date.getMinutes()
      
      // Convert to 12-hour format
      let hour = hours % 12
      if (hour === 0) hour = 12
      
      setSelectedHour(hour.toString())
      setSelectedMinute(minutes < 10 ? `0${minutes}` : minutes.toString())
      setSelectedMeridiem(hours >= 12 ? "PM" : "AM")
    }
  }, [date, showTimePicker])

  const hours = Array.from({ length: 12 }, (_, i) => (i + 1).toString())
  const minutes = Array.from({ length: 60 }, (_, i) => i < 10 ? `0${i}` : i.toString())

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? (
            format(date, showTimePicker ? "PPP 'at' h:mm a" : "PPP")
          ) : (
            <span>Pick a date</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleDateSelect}
          initialFocus
        />

        {showTimePicker && (
          <div className="border-t border-border p-3 flex gap-2 items-center">
            <Clock className="h-4 w-4 opacity-70" />
            
            <div className="grid grid-cols-3 gap-2">
              <Select value={selectedHour} onValueChange={setSelectedHour}>
                <SelectTrigger>
                  <SelectValue placeholder="Hour" />
                </SelectTrigger>
                <SelectContent>
                  {hours.map((hour) => (
                    <SelectItem key={hour} value={hour}>
                      {hour}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={selectedMinute} onValueChange={setSelectedMinute}>
                <SelectTrigger>
                  <SelectValue placeholder="Min" />
                </SelectTrigger>
                <SelectContent>
                  {minutes.map((minute) => (
                    <SelectItem key={minute} value={minute}>
                      {minute}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select
                value={selectedMeridiem}
                onValueChange={(value) => setSelectedMeridiem(value as "AM" | "PM")}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AM">AM</SelectItem>
                  <SelectItem value="PM">PM</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}