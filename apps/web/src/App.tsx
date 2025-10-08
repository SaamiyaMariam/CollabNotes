import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Auth from "./pages/Auth/Auth";
import Dashboard from "./pages/Dashboard/Dashboard";
import FolderView from "./pages/FolderView/index";
import NoteView from "./pages/NoteView/index";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/auth" replace />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/app" element={<Dashboard />} />
        {/* Folder pages */}
        <Route path="/:folderUrl" element={<FolderView />} />
        {/* Notes inside folders */}
        <Route path="/:folderUrl/:noteUrl" element={<NoteView />} />
        {/* Root-level notes */}
        <Route path="/note/:noteUrl" element={<NoteView />} />
      </Routes>
    </BrowserRouter>
  );
}
