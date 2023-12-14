import { Skeleton } from "~/components/common/ui/skeleton";

export const SimilarListingsSkeleton = () => {
  return (
    <div className="py-8">
      <Skeleton className="h-8 w-36" />
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-2 p-2">
            <Skeleton className="h-64 w-full rounded-lg" />
            <Skeleton className="h-10 w-2/3" />
            <Skeleton className="h-10 w-1/3" />
          </div>
        ))}
      </div>
    </div>
  );
};
