import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import Navbar from "../../components/Navbar";
import {
  ME_QUERY,
  FOLDERS_QUERY,
  ROOT_NOTES_QUERY,
  CREATE_FOLDER,
  CREATE_NOTE,
} from "./queries";

export default function Dashboard() {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    return <Navigate to="/auth" replace />;
  }

  const { data: meData } = useQuery(ME_QUERY);
  const { data: foldersData, refetch: refetchFolders } = useQuery(FOLDERS_QUERY);
  const { data: notesData, refetch: refetchNotes } = useQuery(ROOT_NOTES_QUERY);

  const [createFolder] = useMutation(CREATE_FOLDER);
  const [createNote] = useMutation(CREATE_NOTE);

  const [showFolderModal, setShowFolderModal] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [activeTab, setActiveTab] = useState<"workspace" | "all">("workspace");

  const username = meData?.me?.displayName ?? "User";

  const handleAddFolder = async () => {
    await createFolder({ variables: { name: newName, color: "blue" } });
    setShowFolderModal(false);
    setNewName("");
    refetchFolders();
  };

  const handleAddNote = async () => {
    await createNote({ variables: { title: newName } });
    setShowNoteModal(false);
    setNewName("");
    refetchNotes();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <Navbar username={username} />

      <div className="p-8">
        {/* Greeting */}
        <h2 className="text-3xl font-semibold text-gray-800">
          Hi {username}! 👋
        </h2>
        <p className="text-gray-500 mt-1">Welcome back to CollabNotes 🎉</p>

        {/* Tabs */}
        <div className="mt-6 flex gap-6 border-b">
          <button
            className={`pb-2 ${
              activeTab === "workspace"
                ? "border-b-2 border-teal-600 font-medium"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("workspace")}
          >
            My Workspace
          </button>
          <button
            className={`pb-2 ${
              activeTab === "all"
                ? "border-b-2 border-teal-600 font-medium"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("all")}
          >
            All Notes
          </button>
        </div>

        {/* Workspace View */}
        {activeTab === "workspace" && (
          <>
            {/* Folders */}
            <h3 className="mt-6 mb-2 text-lg font-semibold text-gray-700">
              Folders
            </h3>
            <div className="grid grid-cols-4 gap-4">
              {foldersData?.findUserFolders?.length ? (
                foldersData.findUserFolders.map((folder: any) => (
                  <div
                    key={folder.id}
                    className="p-4 rounded-lg shadow bg-white hover:shadow-md cursor-pointer border-l-4 border-teal-500"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-teal-600">📁</span>
                      <h4 className="font-semibold">{folder.name}</h4>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {folder.notes.length} notes
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 italic">
                  No folders yet. Create one below 👇
                </p>
              )}
            </div>

            {/* Folderless Notes */}
            <h3 className="mt-8 mb-2 text-lg font-semibold text-gray-700">
              Notes
            </h3>
            <div className="grid grid-cols-4 gap-4">
              {notesData?.findUserNotes?.filter((n: any) => !n.folderId).length ? (
                notesData.findUserNotes
                  .filter((n: any) => !n.folderId)
                  .map((note: any) => (
                    <div
                      key={note.id}
                      className="p-4 rounded-lg shadow bg-white hover:shadow-md cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-indigo-600">📝</span>
                        <h4 className="font-semibold truncate">{note.title}</h4>
                      </div>
                    </div>
                  ))
              ) : (
                <p className="text-gray-400 italic">
                  Create a note below 👇
                </p>
              )}
            </div>
          </>
        )}

        {/* All Notes View */}
        {activeTab === "all" && (
          <div className="grid grid-cols-4 gap-4 mt-6">
            {notesData?.findUserNotes?.length ? (
              notesData.findUserNotes.map((note: any) => (
                <div
                  key={note.id}
                  className="p-4 rounded-lg shadow bg-white hover:shadow-md cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-indigo-600">📝</span>
                    <h4 className="font-semibold truncate">{note.title}</h4>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400 italic">No notes yet. Create one below 👇</p>
            )}
          </div>
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
