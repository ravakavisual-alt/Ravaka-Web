// index.jsx
import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import Loader from "./components/Loader";

function ErrorBoundary({ children }) {
  const [error, setError] = useState(null);

  if (error) {
    return (
      <div style={{ padding: "2rem", color: "red" }}>
        <h1>❌ Ada error di aplikasi</h1>
        <pre>{error.toString()}</pre>
      </div>
    );
  }

  return (
    <React.Suspense fallback={<Loader />}>
      {children}
    </React.Suspense>
  );
}

function Main() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return loading ? <Loader /> : <App />;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary>
      <Main />
    </ErrorBoundary>
  </React.StrictMode>
);
