import { Card, CardContent } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

const BlogPostSkeleton = () => (
  <Card className="bg-card dark:bg-black dark:lg:bg-card border-0 shadow-none lg:border lg:shadow-sm rounded-2xl py-0">
    <CardContent className="py-6 border-b max-[375px]:px-0 lg:border-0">
      <div className="flex items-center space-x-3 mb-4">
        <Skeleton className="size-10 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
      <div className="md:flex md:h-28 flex-col md:flex-row md:w-[625px] lg:w-2xl lg:justify-between xl:w-[715px]">
        <div className="h-full md:w-md xl:w-[500px] mb-2">
          <Skeleton className="h-6 w-full mb-2" />
          <Skeleton className="h-6 w-4/5 mb-2" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
        <Skeleton className="md:w-44 h-36 md:h-full rounded-xl" />
      </div>
      <div className="flex items-center h-6 justify-between mt-3">
        <div className="flex gap-4 mx-1">
          <div className="flex gap-1 items-center">
            <Skeleton className="size-5" />
            <Skeleton className="h-4 w-8" />
            <Skeleton className="h-4 w-12 hidden lg:flex" />
          </div>
          <div className="flex gap-1 items-center">
            <Skeleton className="size-5" />
            <Skeleton className="h-4 w-8" />
            <Skeleton className="h-4 w-16 hidden lg:flex" />
          </div>
        </div>
        <Skeleton className="size-5" />
      </div>
    </CardContent>
  </Card>
);

const BlogsSkeleton = () => {
  return (
    <div className="space-y-6">
     {Array.from({ length: 5 }).map((_, index) => (
      <BlogPostSkeleton key={index} />
    ))}
    </div>
  );
};

export default BlogsSkeleton;

