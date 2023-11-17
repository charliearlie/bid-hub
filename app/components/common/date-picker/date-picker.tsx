import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import * as React from "react";

import { Button } from "~/components/common/ui/button";
import { Calendar } from "~/components/common/ui/calendar";
import { Input } from "~/components/common/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/common/ui/popover";

import { cn } from "~/util/utils";

type Props = {
  name: string;
  disabled?: {
    before: Date;
  };
};

export function DatePicker({ disabled, name }: Props) {
  const [date, setDate] = React.useState<Date>();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "h-10 w-full justify-start bg-input text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          initialFocus
          disabled={disabled}
        />
      </PopoverContent>
      <Input name={name} type="hidden" value={date?.toISOString()} />
    </Popover>
  );
}
