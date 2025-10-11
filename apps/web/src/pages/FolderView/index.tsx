import { useState } from "react";
import { useNavigate, useParams, Navigate } from "react-router-dom";
import {
  useMeQuery,
  useGetFolderByUrlQuery,
  useGetNotesByFolderIdQuery,
  useCreateNoteMutation,
  useSetNoteColorMutation,
  useDeleteNoteMutation,
  GetFoldersDocument,
} from "../../generated/graphql";

import Navbar from "../../components/Navbar";
import NoteCard from "../Dashboard/NoteCard";
import CardForm from "../../components/CardForm";
import ColorPaletteModal from "../../components/ColorPaletteModal";
import Dropdown from "../../components/Dropdown";
import { Home, Trash2, MoreHorizontal, FilePlus } from "lucide-react";
// import tinycolor from "tinycolor2";

export default function FolderView() {
  const token = localStorage.getItem("accessToken");
  const navigate = useNavigate();
  const { folderUrl } = useParams() as { folderUrl: string };
  if (!token) return <Navigate to="/auth" replace />;

  // Queries
  const { data: meData } = useMeQuery();
  const { data: folderData } = useGetFolderByUrlQuery({
    variables: { url: folderUrl! },
    skip: !folderUrl,
  });

  const folderId = folderData?.folderByUrl?.id ?? "";
  const { data: notesData, refetch: refetchNotes } = useGetNotesByFolderIdQuery({
    variables: { folderId },
    skip: !folderId,
  });

  // Mutations
  const [createNote] = useCreateNoteMutation();
  const [updateNoteColor] = useSetNoteColorMutation();
  const [deleteNote] = useDeleteNoteMutation();

  // UI State
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [selectedNotes, setSelectedNotes] = useState<string[]>([]);
  const [showColorModal, setShowColorModal] = useState(false);

  const username = meData?.me?.displayName ?? "User";
  const folderName = folderData?.folderByUrl?.name ?? "Folder";
//   const base = tinycolor(folderData?.folderByUrl?.color ?? "#cfb5eb").lighten(10).toString() ;
//   const lighter = tinycolor(base).lighten(5).toString();


  const toggleSelect = (id: string) => {
    setSelectedNotes((prev) =>
      prev.includes(id)
        ? prev.filter((n) => n !== id)
        : [...prev, id]
    );
  };

  const clearSelection = () => setSelectedNotes([]);

  const handleColorChange = async (color: string) => {
    await Promise.all(
      selectedNotes.map((id) =>
        updateNoteColor({ variables: { id, color } })
      )
    );
    setShowColorModal(false);
    clearSelection();
    await refetchNotes();
  };

  const handleDeleteSelected = async () => {
    if (!window.confirm("Are you sure you want to delete the selected notes?"))
      return;
    try {
      await Promise.all(
        selectedNotes.map((id) => deleteNote({ variables: { id },
          refetchQueries: [{ query: GetFoldersDocument }],
        })
      )
      );
      clearSelection();
      await refetchNotes();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#ffffff] to-[#f2ffff] flex flex-col pt-16 px-2">
      <Navbar username={username} />

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-16 mt-[8px] border-r border-white/60 bg-white/70 backdrop-blur-sm shadow-sm rounded-r-3xl flex flex-col items-center gap-5 py-6">
          <button
            onClick={() => navigate("/app")}
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
        <main className="flex-1 mt-2 w-full rounded-2xl shadow-inner bg-gradient-to-b from-[#e5e7f0] to-[#f2ffff]"
          >
          {/* Folder header */}
          <div className="px-2 pt-2">
            <div
              className="rounded-2xl p-6 text-white shadow-sm"
              style={{
                background: "linear-gradient(135deg, #eb8db5, #f4c3c8)",
              }}
            >
              <h1 className="text-3xl font-bold font-poppins"
              style={{ color: "#ffffff" }}>
                {folderName}
              </h1>
            </div>
          </div>

          {/* Actions row */}
          <div className="mt-6 px-8 flex items-center justify-between">
            <h2 className="text-lg text-gray-700 font-medium">
              {notesData?.notes?.length ?? 0} {notesData?.notes?.length === 1 ? "Note" : "Notes"}
            </h2>

            <div className="flex items-center gap-3">
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
                          selectedNotes.length === 0
                            ? "opacity-50 cursor-not-allowed"
                            : "cursor-pointer"
                        }`}
                      >
                        Change Color
                      </span>
                    ),
                    onClick: () => {
                      if (selectedNotes.length === 0) return;
                      setShowColorModal(true);
                    },
                  },
                  {
                    label: (
                      <span
                        className={`flex items-center gap-2 ${
                          selectedNotes.length === 0
                            ? "opacity-50 cursor-not-allowed"
                            : "cursor-pointer"
                        }`}
                      >
                        Delete Selected
                      </span>
                    ),
                    onClick: handleDeleteSelected,
                  },
                ]}
              />
            </div>
          </div>

          {/* Notes grid */}
          <div className="p-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {notesData?.notes?.length ? (
              notesData.notes.map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  onClick={() => navigate(`/${folderUrl}/${note.url}`)}
                  selected={selectedNotes.includes(note.id)}
                  onSelectToggle={() => toggleSelect(note.id)}
                />
              ))
            ) : (
              <div className="col-span-full text-center text-gray-500 flex flex-col items-center">
                <span className="text-6xl mb-2">📝</span>
                <p>No notes yet. Create one above!</p>
              </div>
            )}
          </div>

          {/* New Note Modal */}
          {showNoteModal && (
            <CardForm
              heading="New Note"
              placeholder="Note title"
              buttonText="Create"
              onSubmit={async (val) => {
                if (!val.trim()) return;
                console.log("Creating note with title:", val);
                await createNote({
                  variables: { input: { title: val, folderId } },
                  refetchQueries: [{ query: GetFoldersDocument }],
                });
                setShowNoteModal(false);
                refetchNotes();
              }}
              onClose={() => setShowNoteModal(false)}
            />
          )}

          {/* Color Modal */}
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
