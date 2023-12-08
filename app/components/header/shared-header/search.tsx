import SearchSVG from "~/styles/svg/search";
import { Input } from "~/components/common/ui/input";

export function Search() {
    return (
        <form className="w-full flex items-center space-x-2 rounded-md border bg-input p-2 text-foreground">
            <SearchSVG />
            <Input
                className="w-full sm:w-auto"
                type="search"
                placeholder="Search"
            />
        </form>
    );
}
