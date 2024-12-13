import { Skeleton } from "../ui/skeleton";

export const SidebarLoading = () => {
  return (
    <div className="grid gap-2">
      <Skeleton className="h-28 w-full rounded-md" />
      <Skeleton className="h-28 w-full rounded-md" />
      <Skeleton className="h-28 w-full rounded-md" />
      <Skeleton className="h-28 w-full rounded-md" />
      <Skeleton className="h-28 w-full rounded-md" />
      <Skeleton className="h-28 w-full rounded-md" />
      <Skeleton className="h-28 w-full rounded-md" />
      <Skeleton className="h-28 w-full rounded-md" />
    </div>
  );
};
