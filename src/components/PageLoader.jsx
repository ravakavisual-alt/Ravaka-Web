import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function PageLoader() {
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => setLoading(false), 700); // animasi singkat
    return () => clearTimeout(timeout);
  }, [location]);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/90 z-40">
      <div className="w-40 h-1 bg-gray-200  overflow-hidden">
        <div className="h-1 bg-black animate-[loading_0.7s_linear]" />
      </div>
    </div>
  );
}
