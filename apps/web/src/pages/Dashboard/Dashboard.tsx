import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import {
  useMeQuery,
  useGetFoldersQuery,
  useGetNotesQuery,
  useCreateFolderMutation,
  useCreateNoteMutation,
  useSetFolderColorMutation,
  useSetNoteColorMutation,
  useDeleteFolderMutation,
  useDeleteNoteMutation,
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
import CardForm from "../../components/CardForm";
import ColorPaletteModal from "../../components/ColorPaletteModal";
import Dropdown from "../../components/Dropdown";


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
  const [selectedItems, setSelectedItems] = useState<{ id: string; type: "folder" | "note" }[]>([]);
  const [showColorModal, setShowColorModal] = useState(false);
  const [updateFolderColor] = useSetFolderColorMutation();
  const [updateNoteColor] = useSetNoteColorMutation();
  const [deleteFolder] = useDeleteFolderMutation();
  const [deleteNote] = useDeleteNoteMutation();

  const username = meData?.me?.displayName ?? "User";

  const toggleSelect = (id: string, type: "folder" | "note") => {
    setSelectedItems((prev) =>
      prev.some((item) => item.id === id)
        ? prev.filter((item) => item.id !== id)
        : [...prev, { id, type }]
    );
  };

  const clearSelection = () => setSelectedItems([]);

  const handleColorChange = async (color: string) => {
    const folders = selectedItems.filter((i) => i.type === "folder");
    const notes = selectedItems.filter((i) => i.type === "note");

    await Promise.all([
      ...folders.map((f) => updateFolderColor({ variables: { id: f.id, color } })),
      ...notes.map((n) => updateNoteColor({ variables: { id: n.id, color } })),
    ]);
    console.log("Changing color to", color, "for", selectedItems);

    setShowColorModal(false);
    clearSelection();
    await Promise.all([refetchFolders(), refetchNotes()]);
  };


  const handleDeleteSelected = async () => {
    if (!window.confirm("Are you sure you want to delete the selected items?")) return;

    const folders = selectedItems.filter((i) => i.type === "folder");
    const notes = selectedItems.filter((i) => i.type === "note");

    try {
      // Perform deletions in parallel
      await Promise.all([
        ...folders.map((f) => deleteFolder({ variables: { id: f.id } })),
        ...notes.map((n) => deleteNote({ variables: { id: n.id } })),
      ]);

      clearSelection();
      await Promise.all([refetchFolders(), refetchNotes()]);
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return (
    // <div className="min-h-screen bg-gradient-to-b from-[#e5e7f0] to-[#f2ffff] flex flex-col pt-2 px-2">
  <div className="min-h-screen bg-gradient-to-b from-[#ffffff] to-[#f2ffff] flex flex-col pt-16 px-2"> 
    {/* Navbar (always at top) */}
      <Navbar username={username} />

      {/* Row below Navbar */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-16 mt-[8px] border-r border-white/60 bg-white/70 backdrop-blur-sm shadow-sm rounded-r-3xl flex flex-col items-center gap-5 py-6">
          <button
            onClick={async () => {
              navigate("/app");
            }}
            
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
       <main className="flex-1 mt-2 w-full bg-gradient-to-b from-[#e5e7f0] to-[#f2ffff] rounded-2xl shadow-inner">
        {/* Navbar */}

        {/* Greeting card */}
        <div className="px-2 pt-2">
          <div
            className="rounded-2xl p-6 text-white shadow-sm"
            style={{ background: "linear-gradient(135deg, #eb8db5, #f4c3c8)" }}
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
            <Dropdown
              label={
                <div
                  className="p-3 rounded-full shadow-md bg-white text-gray-700 hover:shadow-lg hover:bg-gray-50 transition"
                  title="Options"
                >
                  <MoreHorizontal size={18} />
                </div>
              }
              options={[
                {
                  label: (
                    <span
                      className={`flex items-center gap-2 ${
                        selectedItems.length === 0
                          ? "opacity-50 cursor-not-allowed"
                          : "cursor-pointer"
                      }`}
                    >
                      Change Color
                    </span>
                  ),
                  onClick: () => {
                    if (selectedItems.length === 0) return;
                    setShowColorModal(true);
                  },
                },
                {
                  label: (
                    <span
                      className={`flex items-center gap-2 ${
                        selectedItems.length === 0
                          ? "opacity-50 cursor-not-allowed"
                          : "cursor-pointer"
                      }`}
                    >
                      Delete Selected
                    </span>
                  ),
                  onClick: () => {
                    if (selectedItems.length === 0) return;
                    handleDeleteSelected();
                  },
                },
              ]}
            />

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
                    onClick={() => navigate(`/${folder.url}`)}
                    selected={selectedItems.some((i) => i.id === folder.id)}
                    onSelectToggle={() => toggleSelect(folder.id, "folder")}
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
                    onClick={() => navigate(`/note/${note.url}`)}
                    selected={selectedItems.some((i) => i.id === note.id)}
                    onSelectToggle={() => toggleSelect(note.id, "note")}
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
                    onClick={() => navigate(`/note/${note.url}`)}
                    selected={selectedItems.some((i) => i.id === note.id)}
                    onSelectToggle={() => toggleSelect(note.id, "note")}
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
          <CardForm
            heading="New Folder"
            placeholder="Folder name"
            buttonText="Create"
            onSubmit={async (val) => {
              await createFolder({ variables: { input: { name: val, color: "#cfb5eb" } } });
              setShowFolderModal(false);
              refetchFolders();
            }}
            onClose={() => setShowFolderModal(false)}
          />
        )}

        {/* Note Modal */}
        {showNoteModal && (
          <CardForm
            heading="New Note"
            placeholder="Note title"
            buttonText="Create"
            onSubmit={async (val) => {
              if (!val.trim()) return;
              await createNote({
                variables: { input: { title: val } },
              });
              setShowNoteModal(false);
              refetchNotes();
            }}
            onClose={() => setShowNoteModal(false)}
          />
        )}
        {/* -------------------------------------------------------- */}
        {showColorModal && (
          <ColorPaletteModal
            onSelect={handleColorChange}
            onClose={() => setShowColorModal(false)}
          />
        )}
      </main>
      </div>
    </div>
  );
}
