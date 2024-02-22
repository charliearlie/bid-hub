import { Form, Link, useFetcher } from "@remix-run/react";
import { useCombobox } from "downshift";
import { SearchIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import { loader } from "~/routes/api+/realtime-search";

import { Input } from "~/components/common/ui/input";

import { Button } from "../common/ui/button";
import { Card } from "../common/ui/card";
import { Separator } from "../common/ui/separator";

export function SearchInput() {
  const fetcher = useFetcher<typeof loader>();
  const [query, setQuery] = useState("");
  let [debouncedQuery] = useDebounce(query, 300);

  useEffect(() => {
    if (debouncedQuery.length <= 2) return;
    fetcher.submit(
      { query: debouncedQuery },
      { method: "GET", action: "/api/realtime-search" }
    );
  }, [debouncedQuery]);

  const { getInputProps, getMenuProps } = useCombobox({
    items: fetcher.data || [],
  });

  const shouldShowAllResultsButton = fetcher?.data?.length === 3;

  return (
    <div className="relative w-full">
      <Form
        action="/search"
        method="GET"
        className="flex w-full items-center space-x-2 rounded-md border bg-input p-2 text-foreground"
      >
        <label htmlFor="query" className="sr-only">
          Search
        </label>
        <SearchIcon />
        <Input
          className="w-full"
          {...getInputProps({
            "aria-expanded":
              fetcher.data?.length && fetcher?.data?.length > 0 ? true : false,
            name: "query",
            onChange: (event) => setQuery(event.currentTarget.value),
            placeholder: "Search",
            type: "search",
            value: query,
          })}
        />
      </Form>
      <Card
        id="search-list"
        className="absolute z-50 max-h-72 w-full overflow-scroll"
        {...getMenuProps()}
      >
        <ul className="space-y-2">
          {fetcher?.data?.map(({ slug, thumbnail, title }) => (
            <li key={slug} className="flex items-center space-x-2">
              <Link className="flex gap-4 p-2" to={`/listings/${slug}`}>
                <img
                  src={thumbnail}
                  alt={title}
                  className="h-12 w-12 rounded-md object-cover"
                />
                <h4>{title}</h4>
              </Link>
            </li>
          ))}
        </ul>
        {shouldShowAllResultsButton && (
          <>
            <Separator />
            <Button className="w-full text-foreground" asChild variant="link">
              <Link to={`/search?query=${debouncedQuery}`}>
                See all results
              </Link>
            </Button>
          </>
        )}
      </Card>
    </div>
  );
}
