const PendingLoader = () => {
  return (
    <div className="fixed flex inset-0 justify-center items-center h-screen w-full bg-background z-50">
      <p className="font-bold dark:text-white text-black">Loader...</p>
    </div>
  );
};

export default PendingLoader;