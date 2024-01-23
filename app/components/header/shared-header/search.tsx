import SearchSVG from "~/styles/svg/search";

import { Input } from "~/components/common/ui/input";

export function Search() {
  return (
    <form className="flex w-full items-center space-x-2 rounded-md border bg-input p-2 text-foreground">
      <SearchSVG />
      <Input className="w-full" type="search" placeholder="Search" />
    </form>
  );
}
