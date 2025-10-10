import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useGetNoteByUrlQuery,
  useRenameNoteMutation,
  useUpdateNoteContentMutation,
} from "../../generated/graphql";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import tinycolor from "tinycolor2";

export default function NoteView() {
  const { noteUrl } = useParams<{ noteUrl: string }>();
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");
  if (!token) return navigate("/auth");

  console.log("🔹 Note URL param:", noteUrl);

  const { data, refetch } = useGetNoteByUrlQuery({
    variables: { url: noteUrl! },
    skip: !noteUrl,
  });
  const [renameNote] = useRenameNoteMutation();
  const [updateContent] = useUpdateNoteContentMutation();

  const note = data?.NoteByUrl;

  console.log("🟠 Note Object:", note);

  const [title, setTitle] = useState(note?.title || "");
  const [content, setContent] = useState(note?.contentText || "");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (note) {
      console.log("✅ Note data loaded:", note);
      setTitle(note.title);
      setContent(note.contentText || "");
    } else {
      console.warn("⚠️ Note is null (check backend or URL mismatch)");
    }
  }, [note]);

  useEffect(() => {
    const timeout = setTimeout(async () => {
      if (!note) return;
      setIsSaving(true);
      console.log("💾 Auto-saving note:", note.id);
      await updateContent({
        variables: { id: note.id, contentText: content },
      });
      setIsSaving(false);
    }, 800);
    return () => clearTimeout(timeout);
  }, [content]);

  const handleRename = async () => {
    console.log("🟣 Rename mutation payload:", note?.id, title);
    if (!note) return;
    await renameNote({ variables: { input: { id: note.id, title } } });
    refetch();
  };

  const base = note?.color ?? "#c5d5f0";
  const lighter = tinycolor(base).lighten(20).toString();

  return (
    <div className="min-h-screen flex flex-col pt-16 bg-gradient-to-b from-white to-[#f2ffff]">
      <Navbar username="Saamiya" />

      <div className="flex flex-1">
        <Sidebar currentNoteId={note?.id} folderId={note?.folderId ?? null} />

        <main
          className="flex-1 mt-[8px] p-8 rounded-2xl mx-2 shadow-inner overflow-y-auto"
          style={{
            background: `linear-gradient(to bottom, ${base}, ${lighter})`,
          }}
        >
          <div className="max-w-3xl mx-auto bg-white/70 p-6 rounded-2xl shadow-sm">
            <h1 className="text-3xl font-bold mb-2">{title || "Untitled Note"}</h1>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleRename}
              className="w-full text-lg font-medium bg-transparent outline-none border-b border-gray-200 pb-1 text-gray-600"
              placeholder="Edit title..."
            />

            <p className="text-gray-400 text-sm mt-1">
              {isSaving ? "Saving..." : "All changes saved"}
            </p>

            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="It’s empty here… let’s write something ✏️"
              className="w-full min-h-[60vh] bg-transparent mt-6 outline-none text-gray-700 text-lg resize-none"
            />
          </div>
        </main>
      </div>
    </div>
  );
}
