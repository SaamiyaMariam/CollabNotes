import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import {
  useMeQuery,
  useGetFoldersQuery,
  useGetNotesQuery,
  useCreateFolderMutation,
  useCreateNoteMutation,
} from "../../generated/graphql";
import FolderCard from "./FolderCard";
import NoteCard from "./NoteCard";
import Navbar from "../../components/Navbar";
import {
  Home,
  Trash2,
  MoreHorizontal,
  FolderPlus,
  FilePlus,
} from "lucide-react";

export default function Dashboard() {
  const token = localStorage.getItem("accessToken");
  const navigate = useNavigate();
  if (!token) return <Navigate to="/auth" replace />;

  // Queries
  const { data: meData } = useMeQuery();
  const { data: foldersData, refetch: refetchFolders } = useGetFoldersQuery();
  const { data: notesData, refetch: refetchNotes } = useGetNotesQuery();

  // Mutations
  const [createFolder] = useCreateFolderMutation();
  const [createNote] = useCreateNoteMutation();

  // UI State
  const [activeTab, setActiveTab] = useState<"workspace" | "all">("workspace");
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [newName, setNewName] = useState("");

  const username = meData?.me?.displayName ?? "User";

  // Handlers
  const handleAddFolder = async () => {
    if (!newName.trim()) return;
    await createFolder({
      variables: { input: { name: newName, color: "blue" } },
    });
    setShowFolderModal(false);
    setNewName("");
    refetchFolders();
  };

  const handleAddNote = async () => {
    if (!newName.trim()) return;
    await createNote({ variables: { input: { title: newName } } });
    setShowNoteModal(false);
    setNewName("");
    refetchNotes();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#e5e7f0] to-[#f2ffff] flex flex-col pt-2 px-2">
      {/* Navbar (always at top) */}
      <Navbar username={username} />

      {/* Row below Navbar */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-16 mt-[8px] border-r border-white/60 bg-white/70 backdrop-blur-sm shadow-sm rounded-r-3xl flex flex-col items-center gap-5 py-6">
          <button
            onClick={() => navigate("/dashboard")}
            className="p-2 rounded-xl bg-white/70 hover:bg-white shadow-sm transition text-gray-600 hover:text-[#eb8db5]"
          >
            <Home size={22} />
          </button>
          <button
            className="p-2 rounded-xl bg-white/70 hover:bg-white shadow-sm transition text-gray-600 hover:text-[#eb8db5]"
          >
            <Trash2 size={22} />
          </button>
        </aside>

      {/* Main */}
       <main className="flex-1 mt-2 w-full">
        {/* Navbar (your gradient/rounded version) */}

        {/* Greeting card */}
        <div className="px-8 pt-2">
          <div
            className="rounded-2xl p-6 text-white shadow-sm"
            style={{ background: "linear-gradient(135deg, #f4c3c8, #eb8db5)" }}
          >
            <h1 className="text-4xl font-bold font-poppins">
              Hi {username}! 👋
            </h1>
            <p className="mt-2 text-lg opacity-95">
              Ready to plan your day? Welcome to your dashboard ✨
            </p>
          </div>
        </div>

        {/* Tabs + Actions row */}
        <div className="mt-6 px-8 flex items-center justify-between">
          {/* Tabs (thin underline like wireframe) */}
          <div className="flex gap-8 text-lg">
            <button
              onClick={() => setActiveTab("workspace")}
              className={`pb-1 transition ${
                activeTab === "workspace"
                  ? "text-[#d46a92] border-b-2 border-[#d46a92]"
                  : "text-gray-600 hover:text-[#d46a92]"
              }`}
            >
              My Workspace
            </button>
            <button
              onClick={() => setActiveTab("all")}
              className={`pb-1 transition ${
                activeTab === "all"
                  ? "text-[#d46a92] border-b-2 border-[#d46a92]"
                  : "text-gray-600 hover:text-[#d46a92]"
              }`}
            >
              All Notes
            </button>
          </div>

          {/* Actions: add folder, add note, options */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowFolderModal(true)}
              className="p-3 rounded-full bg-[#eb8db5] text-white shadow-md hover:shadow-lg hover:brightness-105 transition"
              title="New Folder"
            >
              <FolderPlus size={18} />
            </button>
            <button
              onClick={() => setShowNoteModal(true)}
              className="p-3 rounded-full bg-[#a8d1e7] text-white shadow-md hover:shadow-lg hover:brightness-105 transition"
              title="New Note"
            >
              <FilePlus size={18} />
            </button>
            <button
              className="p-3 rounded-full bg-white text-gray-700 shadow-md hover:shadow-lg hover:bg-gray-50 transition"
              title="Options"
            >
              <MoreHorizontal size={18} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {activeTab === "workspace" ? (
            <>
              {/* Folders */}
              {foldersData?.folders?.length ? (
                foldersData.folders.map((folder) => (
                  <FolderCard
                    key={folder.id}
                    folder={folder}
                    onClick={() => navigate(`/folder/${folder.id}`)}
                  />
                ))
              ) : (
                <div className="col-span-full text-center text-gray-500 flex flex-col items-center">
                  <span className="text-6xl mb-2">📂</span>
                  <p>No folders yet. Create one above!</p>
                </div>
              )}

              {/* Root notes */}
              {notesData?.notes
                ?.filter((n) => !n.folderId)
                .map((note) => (
                  <NoteCard
                    key={note.id}
                    note={note}
                    onClick={() => navigate(`/note/${note.id}`)}
                  />
                ))}
            </>
          ) : (
            <>
              {notesData?.notes?.length ? (
                notesData.notes.map((note) => (
                  <NoteCard
                    key={note.id}
                    note={note}
                    onClick={() => navigate(`/note/${note.id}`)}
                  />
                ))
              ) : (
                <div className="col-span-full text-center text-gray-500 flex flex-col items-center">
                  <span className="text-6xl mb-2">📝</span>
                  <p>No notes yet. Create one above!</p>
                </div>
              )}
            </>
          )}
        </div>

        {/* ---------- MODALS (kept exactly as you set up) ---------- */}

        {/* Folder Modal */}
        {showFolderModal && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
              <button
                onClick={() => setShowFolderModal(false)}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
              <h2 className="text-xl font-bold mb-4">New Folder</h2>
              <input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Folder name"
                className="border w-full px-3 py-2 rounded mb-4"
              />
              <button
                onClick={handleAddFolder}
                className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 w-full"
              >
                Create
              </button>
            </div>
          </div>
        )}

        {/* Note Modal */}
        {showNoteModal && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
              <button
                onClick={() => setShowNoteModal(false)}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
              <h2 className="text-xl font-bold mb-4">New Note</h2>
              <input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Note title"
                className="border w-full px-3 py-2 rounded mb-4"
              />
              <button
                onClick={handleAddNote}
                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 w-full"
              >
                Create
              </button>
            </div>
          </div>
        )}
        {/* -------------------------------------------------------- */}
      </main>
      </div>
    </div>
  );
}
