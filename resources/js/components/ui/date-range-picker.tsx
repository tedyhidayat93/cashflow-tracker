"use client"

import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { type DateRange } from "react-day-picker"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export interface DateRangePickerProps {
  value?: DateRange;
  onChange?: (range: DateRange | undefined) => void;
  className?: string;
  placeholder?: string;
  id?: string;
  label?: string;
  showLabel?: boolean;
}

export function DateRangePicker({
  value,
  onChange,
  className,
  placeholder = "Pilih rentang tanggal",
  id = "date-picker-range",
  label = "Rentang Tanggal",
  showLabel = true,
}: DateRangePickerProps) {
  const [date, setDate] = React.useState<DateRange | undefined>(value)

  const handleDateChange = (newDate: DateRange | undefined) => {
    setDate(newDate)
    onChange?.(newDate)
  }
  
  return (
    <div className={className}>
      {label && (
        <label 
          htmlFor={id}
          className="block text-xs font-medium text-gray-700 mb-1"
        >
          {label}
        </label>
      )}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id={id}
            className="w-full justify-start text-left font-normal px-2.5"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "dd/MM/yyyy")} -{" "}
                  {format(date.to, "dd/MM/yyyy")}
                </>
              ) : (
                format(date.from, "dd/MM/yyyy")
              )
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleDateChange}
            numberOfMonths={2}
            showOutsideDays={false}
            onDayClick={(day) => {
              // jika range sebelumnya sudah lengkap
              // maka klik baru dianggap sebagai start baru
              if (date?.from && date?.to) {
                const resetRange = {
                  from: day,
                  to: undefined,
                }

                setDate(resetRange)
                onChange?.(resetRange)
              }
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default DateRangePicker;
