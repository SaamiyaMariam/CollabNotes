import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import {
  ME_QUERY,
  FOLDERS_QUERY,
  ROOT_NOTES_QUERY,
  CREATE_FOLDER,
  CREATE_NOTE,
} from "./queries";

export default function Dashboard() {
  const token = localStorage.getItem("accessToken");
  if (!token) return <Navigate to="/auth" replace />;

  const navigate = useNavigate();

  const { data: meData } = useQuery(ME_QUERY);
  const { data: foldersData, loading: foldersLoading, refetch: refetchFolders } = useQuery(FOLDERS_QUERY);
  const { data: notesData, loading: notesLoading, refetch: refetchNotes } = useQuery(ROOT_NOTES_QUERY);

  const [createFolder] = useMutation(CREATE_FOLDER);
  const [createNote] = useMutation(CREATE_NOTE);

  const [activeTab, setActiveTab] = useState<"workspace" | "all">("workspace");
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [newName, setNewName] = useState("");

  const username = meData?.me?.displayName ?? "User";

  const handleAddFolder = async () => {
    if (!newName.trim()) return;
    await createFolder({ variables: { name: newName, color: "blue" } });
    setShowFolderModal(false);
    setNewName("");
    refetchFolders();
  };

  const handleAddNote = async () => {
    if (!newName.trim()) return;
    await createNote({ variables: { title: newName } });
    setShowNoteModal(false);
    setNewName("");
    refetchNotes();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <h1 className="text-4xl font-bold text-teal-800">Hi {username}! 👋</h1>
      <p className="mt-2 text-lg text-gray-600">Welcome to CollabNotes 🎉</p>

      {/* Tabs */}
      <div className="mt-6 flex gap-6 border-b">
        <button
          onClick={() => setActiveTab("workspace")}
          className={`pb-2 ${
            activeTab === "workspace" ? "border-b-2 border-teal-600 font-medium" : "text-gray-500 hover:text-teal-600"
          }`}
        >
          My Workspace
        </button>
        <button
          onClick={() => setActiveTab("all")}
          className={`pb-2 ${
            activeTab === "all" ? "border-b-2 border-teal-600 font-medium" : "text-gray-500 hover:text-teal-600"
          }`}
        >
          All Notes
        </button>
      </div>

      {/* Content */}
      <div className="mt-6 grid grid-cols-4 gap-4">
        {activeTab === "workspace" && (
          <>
            {/* Folders */}
            {foldersLoading ? <p>Loading folders...</p> : foldersData?.findUserFolders?.map((folder: any) => (
              <div
                key={folder.id}
                className="p-4 rounded-lg shadow bg-white cursor-pointer hover:bg-gray-100"
                onClick={() => navigate(`/folder/${folder.id}`)}
              >
                <h3 className="font-semibold">{folder.name}</h3>
                <p className="text-sm text-gray-500">{folder.notes.length} notes</p>
              </div>
            ))}

            {/* Root Notes */}
            {notesLoading ? <p>Loading notes...</p> : notesData?.findUserNotes
              ?.filter((n: any) => !n.folderId)
              .map((note: any) => (
                <div
                  key={note.id}
                  className="p-4 rounded-lg shadow bg-white cursor-pointer hover:bg-gray-100"
                  onClick={() => navigate(`/note/${note.id}`)}
                >
                  <h3 className="font-semibold">{note.title}</h3>
                </div>
              ))}
          </>
        )}

        {activeTab === "all" && (
          <>
            {notesLoading ? <p>Loading notes...</p> : notesData?.findUserNotes?.map((note: any) => (
              <div
                key={note.id}
                className="p-4 rounded-lg shadow bg-white cursor-pointer hover:bg-gray-100"
                onClick={() => navigate(`/note/${note.id}`)}
              >
                <h3 className="font-semibold">{note.title}</h3>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Action Buttons */}
      <div className="fixed bottom-6 right-6 flex gap-3">
        <button
          onClick={() => setShowFolderModal(true)}
          className="bg-teal-600 text-white px-4 py-2 rounded shadow hover:bg-teal-700"
        >
          + Folder
        </button>
        <button
          onClick={() => setShowNoteModal(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded shadow hover:bg-indigo-700"
        >
          + Note
        </button>
      </div>

      {/* Folder Modal */}
      {showFolderModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">New Folder</h2>
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Folder name"
              className="border w-full px-3 py-2 rounded mb-4"
            />
            <button
              onClick={handleAddFolder}
              className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700"
            >
              Create
            </button>
          </div>
        </div>
      )}

      {/* Note Modal */}
      {showNoteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">New Note</h2>
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Note title"
              className="border w-full px-3 py-2 rounded mb-4"
            />
            <button
              onClick={handleAddNote}
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            >
              Create
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
