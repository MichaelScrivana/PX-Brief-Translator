import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import HomePage from "./HomePage";
import ToolsPage from "./ToolsPage";
import EducationPage from "./EducationPage";
import PXAgent from "./PXAgent";
import "./styles.css";
import "./pxagent.css";

export default function App() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className={`hub ${darkMode ? "dark" : "light"}`}>
      <Header darkMode={darkMode} setDarkMode={setDarkMode} />
      <Routes>
        <Route path="/" element={<HomePage darkMode={darkMode} />} />
        <Route path="/tools" element={<ToolsPage />} />
        <Route path="/education" element={<EducationPage />} />
      </Routes>
      <Footer />
      <PXAgent />
    </div>
  );
}
