import { SearchIcon } from "lucide-react";

import { Input } from "~/components/common/ui/input";

export function SearchInput() {
  return (
    <form className="flex w-full items-center space-x-2 rounded-md border bg-input p-2 text-foreground">
      <SearchIcon />
      <Input className="w-full" type="search" placeholder="Search" />
    </form>
  );
}
