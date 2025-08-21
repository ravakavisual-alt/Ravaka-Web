// index.jsx
import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom"; // ✅ tambahin ini
import App from "./App";
import LoadingScreen from "./components/LoadingScreen";


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

  return <React.Suspense fallback={<LoadingScreen />}>{children}</React.Suspense>;
}

function Main() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return loading ? <LoadingScreen /> : <App />;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary>
      {/* ✅ Bungkus App dengan BrowserRouter */}
      <BrowserRouter basename="/Ravaka-Web">
        <Main />
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>
);
