// src/pages/Dashboard/Dashboard.tsx
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

  // State
  const [activeTab, setActiveTab] = useState<"workspace" | "all">("workspace");
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [newName, setNewName] = useState("");

  const username = meData?.me?.displayName ?? "User";

  // Handlers
  const handleAddFolder = async () => {
    if (!newName.trim()) return;
    await createFolder({ variables: { input: { name: newName, color: "blue" } } });
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
    <div className="min-h-screen bg-gray-50">
      {/* Greeting */}
      <div className="px-8 pt-8">
        <h1 className="text-4xl font-bold text-gray-800">Hi {username}! 👋</h1>
        <p className="mt-2 text-lg text-gray-500">Welcome to CollabNotes 🎉</p>
      </div>

      {/* Tabs */}
      <div className="mt-6 px-8 flex gap-8 border-b">
        <button
          onClick={() => setActiveTab("workspace")}
          className={`pb-3 font-medium ${
            activeTab === "workspace"
              ? "border-b-2 border-teal-600 text-teal-700"
              : "text-gray-500 hover:text-teal-600"
          }`}
        >
          My Workspace
        </button>
        <button
          onClick={() => setActiveTab("all")}
          className={`pb-3 font-medium ${
            activeTab === "all"
              ? "border-b-2 border-teal-600 text-teal-700"
              : "text-gray-500 hover:text-teal-600"
          }`}
        >
          All Notes
        </button>
      </div>

      {/* Content */}
      <div className="p-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {activeTab === "workspace" && (
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
              <p className="col-span-full text-center text-gray-400">
                No folders yet. Create one below!
              </p>
            )}

            {/* Root Notes */}
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
        )}

        {activeTab === "all" && (
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
              <p className="col-span-full text-center text-gray-400">
                No notes yet. Create one below!
              </p>
            )}
          </>
        )}
      </div>

      {/* Floating Add Buttons */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3">
        <button
          onClick={() => setShowFolderModal(true)}
          className="bg-teal-600 w-14 h-14 rounded-full shadow-lg text-white text-2xl hover:bg-teal-700"
        >
          +
        </button>
        <button
          onClick={() => setShowNoteModal(true)}
          className="bg-indigo-600 w-14 h-14 rounded-full shadow-lg text-white text-2xl hover:bg-indigo-700"
        >
          +
        </button>
      </div>

      {/* Folder Modal */}
      {showFolderModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
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
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
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
    </div>
  );
}
