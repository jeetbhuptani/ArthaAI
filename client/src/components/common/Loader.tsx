import RingLoader from 'react-spinners/RingLoader';
export const Loader = () => (
    <div className="fixed inset-0 flex items-center justify-center bg-white/80 dark:bg-black/80 backdrop-blur-sm z-50">
      <div className="relative">
        <RingLoader color="#00d5a8" />
      </div>
    </div>
  );
