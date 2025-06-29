import { Card, CardContent } from "../ui/card";

const BlogsSkeleton = () => {
  return (
    <div className="space-y-6">
      {Array.from({ length: 5 }).map((_, index) => (
        <Card
          key={`skeleton-${index}`}
          className="bg-card dark:bg-black dark:lg:bg-card border-0 shadow-none lg:border lg:shadow-sm rounded-2xl py-0"
        >
          <CardContent className="py-6 border-b max-[375px]:px-0 lg:border-0">
            {/* Author section skeleton */}
            <div className="flex items-center space-x-3 mb-4">
              <div className="size-10 rounded-full bg-muted animate-pulse" />
              <div className="space-y-2">
                <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                <div className="h-3 w-16 bg-muted rounded animate-pulse" />
              </div>
            </div>

            {/* Content skeleton */}
            <div className="md:flex md:h-28 flex-col md:flex-row md:w-[625px] lg:w-2xl lg:justify-between xl:w-[715px]">
              <div className="h-full md:w-md xl:w-[500px] mb-2 space-y-2">
                <div className="h-6 w-full bg-muted rounded animate-pulse" />
                <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
                <div className="h-4 w-1/2 bg-muted rounded animate-pulse" />
              </div>
              
              {/* Random banner image skeleton */}
              {Math.random() > 0.5 && (
                <div className="md:w-44 h-36 md:h-full bg-muted rounded-xl animate-pulse" />
              )}
            </div>

            {/* Actions skeleton */}
            <div className="flex items-center h-6 justify-between mt-3">
              <div className="flex gap-4 mx-1">
                <div className="flex gap-1 items-center">
                  <div className="size-5 bg-muted rounded animate-pulse" />
                  <div className="h-4 w-8 bg-muted rounded animate-pulse" />
                </div>
                <div className="flex gap-1 items-center">
                  <div className="size-5 bg-muted rounded animate-pulse" />
                  <div className="h-4 w-8 bg-muted rounded animate-pulse" />
                </div>
              </div>
              <div className="size-5 bg-muted rounded animate-pulse" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default BlogsSkeleton;