import { Routes, Route } from "react-router-dom";
import React, { Suspense } from "react";
import FullPageLoader from "./components/Loader";
import NotFound from "./NotFound";



// Lazy-loaded components
const Landing = React.lazy(() => import("./pages/Landing"));
const Auth = React.lazy(() => import("./pages/Auth"));
const Dashboard = React.lazy(() => import("./pages/Dashboard"));

function App() {
  return (
    <Suspense fallback={<FullPageLoader />}>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/dashboard/*" element={<Dashboard />} />

        <Route path="*" element={<NotFound />} />

      </Routes>
    </Suspense>
  );
}

export default App;
