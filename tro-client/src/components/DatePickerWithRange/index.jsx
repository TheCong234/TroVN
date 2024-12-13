import * as React from "react";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { addDays, format, isAfter, isBefore } from "date-fns"; // Sử dụng các hàm để so sánh ngày

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const DatePickerWithRange = ({ className, adsPackageSelect }) => {
  const duration = adsPackageSelect?.advertisingPackage?.duration || 7;

  const [date, setDate] = React.useState({
    from: new Date(),
    to: addDays(new Date(), duration),
  });

  // Xử lý việc chọn ngày, đảm bảo chỉ chọn trong phạm vi duration
  const handleDateSelect = (selectedDate) => {
    if (selectedDate?.from) {
      const newToDate = addDays(selectedDate.from, duration); // Giới hạn ngày kết thúc dựa trên duration
      setDate({
        from: selectedDate.from,
        to: newToDate,
      });
    } else if (selectedDate?.to) {
      // Chặn việc chọn ngày phía sau nếu ngày kết thúc vượt quá duration
      if (isBefore(selectedDate.to, addDays(date.from, duration)) || isAfter(selectedDate.to, addDays(date.from, duration))) {
        return; // Không cập nhật nếu ngày vượt quá phạm vi
      }
      setDate((prev) => ({
        ...prev,
        to: selectedDate.to,
      }));
    }
  };

  return (
    <div className={cn("grid gap-2 z-[50]", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleDateSelect}
            numberOfMonths={2}
            disabled={(day) => isBefore(day, new Date())} // Chặn việc chọn ngày trước ngày hiện tại
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DatePickerWithRange;
