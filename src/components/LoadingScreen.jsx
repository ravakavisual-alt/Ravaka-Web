import { useState, useEffect } from "react";

export default function LoadingScreen({ onFinish }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((old) => {
        if (old >= 100) {
          clearInterval(interval);
          setTimeout(onFinish, 300); // setelah penuh hilang
          return 100;
        }
        return old + 2; // kecepatan loading
      });
    }, 40);
    return () => clearInterval(interval);
  }, [onFinish]);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white z-50">
      <p className="mb-3 text-sm font-medium text-gray-600">
        {progress}%
      </p>
      <div className="w-48 h-1 bg-gray-200">
        <div
          className="h-1 bg-black"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
