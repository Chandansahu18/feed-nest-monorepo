import BlogPosts from "@/components/home-page-section/blogPosts";

const HomePage = () => {
  return (
    <div className="pb-16 mt-20 sm:mt-16 sm:p-8 min-h-screen w-full flex justify-center px-4 mx-auto xl:w-7xl sm:px-6 lg:w-3xl">
      <BlogPosts />
    </div>
  );
};

export default HomePage;