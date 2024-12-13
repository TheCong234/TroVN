import { Skeleton } from "@/components/ui/skeleton";

export const ListingLoading = () => {
  return (
    <div className="p-8">
      <Skeleton className="h-6 w-2/3" />
      <Skeleton className="h-6 w-full mt-2" />
      <Skeleton className=" w-full aspect-square mt-2" />

      <Skeleton className="h-6 w-full mt-2" />
      <Skeleton className="h-6 w-full mt-2" />
      <Skeleton className="h-6 w-full mt-2" />

      <Skeleton className="h-6 w-full mt-2" />
      <Skeleton className="h-6 w-full mt-2" />
      <Skeleton className="h-6 w-full mt-2" />
    </div>
  );
};
