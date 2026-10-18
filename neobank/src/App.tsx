import "./App.css";
import { useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Home } from "./Components/Home";
import { Simple } from "./Components/Simple";
import { Compound } from "./Components/Compound";
import { Credit } from "./Components/Credit";
import { Share } from "./Components/Share";
import { Aboutme } from "./Components/Aboutme";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/simple" element={<Simple />} />
        <Route path="/compound" element={<Compound />} />
        <Route path="/credit" element={<Credit />} />
        <Route path="/share" element={<Share />} />
        <Route path="/aboutme" element={<Aboutme />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;