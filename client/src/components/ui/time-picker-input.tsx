import * as React from "react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"

interface TimePickerInputProps {
  value: number
  onChange: (value: number) => void
  max?: number
  disabled?: boolean
  id?: string
  className?: string
}

export function TimePickerInput({
  value,
  onChange,
  max = 59,
  disabled = false,
  id,
  className,
}: TimePickerInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp") {
      e.preventDefault()
      onChange(value === max ? 0 : value + 1)
    } else if (e.key === "ArrowDown") {
      e.preventDefault()
      onChange(value === 0 ? max : value - 1)
    }
  }

  return (
    <Input
      id={id}
      type="number"
      value={value}
      onChange={(e) => {
        const newValue = parseInt(e.target.value, 10)
        if (isNaN(newValue)) {
          onChange(0)
        } else if (newValue > max) {
          onChange(max)
        } else if (newValue < 0) {
          onChange(0)
        } else {
          onChange(newValue)
        }
      }}
      onKeyDown={handleKeyDown}
      className={cn("w-14 text-center", className)}
      disabled={disabled}
      min={0}
      max={max}
    />
  )
}