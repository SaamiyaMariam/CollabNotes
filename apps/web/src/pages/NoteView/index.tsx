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
import TiptapEditor from "../../components/TipTapEditor";

export default function NoteView() {
  const { noteUrl } = useParams<{ noteUrl: string }>();
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");
  if (!token) return navigate("/auth");

  const { data, refetch } = useGetNoteByUrlQuery({
    variables: { url: noteUrl! },
    skip: !noteUrl,
  });
  const [renameNote] = useRenameNoteMutation();
  const [updateContent] = useUpdateNoteContentMutation();

  const note = data?.NoteByUrl;
  const [title, setTitle] = useState(note?.title || "");
  const [content, setContent] = useState(note?.contentText || "");
  const [isSaving, setIsSaving] = useState(false);
  const [contentJson, setContentJson] = useState(note?.contentJson || null);
  const [contentText, setContentText] = useState(note?.contentText || "");

  // load note data when fetched
  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.contentText || "");
    }
  }, [note]);

  // autosave content
  useEffect(() => {
    const timeout = setTimeout(async () => {
      if (!note) return;
      setIsSaving(true);
      await updateContent({
        variables: { id: note.id, contentText: content },
      });
      setIsSaving(false);
    }, 800);
    return () => clearTimeout(timeout);
  }, [content]);

  // rename on blur
  const handleRename = async () => {
    if (!note) return;
    const trimmed = title.trim();
    if (trimmed && trimmed !== note.title) {
      await renameNote({ variables: { input: { id: note.id, title: trimmed } } });
      refetch();
    }
  };

  // auto-save the structured JSON
  useEffect(() => {
    const timeout = setTimeout(async () => {
      if (!note) return;
      setIsSaving(true);
      await updateContent({
        variables: {
          id: note.id,
          contentText: contentText,
          contentJson: JSON.stringify(contentJson),
        },
      });
      setIsSaving(false);
    }, 1000);
    return () => clearTimeout(timeout);
  }, [contentJson, contentText]);

  const base = note?.color ?? "#c5d5f0";
  const lighter = tinycolor(base).lighten(5).toString();

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
            {/* Inline editable title */}
            <h1
              contentEditable
              suppressContentEditableWarning
              onInput={(e) => setTitle((e.target as HTMLElement).innerText)}
              onBlur={handleRename}
              className="text-3xl font-bold mb-2 outline-none border-b border-transparent focus:border-gray-300 text-gray-800"
            >
              {title || "Untitled Note"}
            </h1>

            <p className="text-gray-400 text-sm mt-1">
              {isSaving ? "Saving..." : "All changes saved"}
            </p>

            <TiptapEditor
              content={contentJson}
              onChange={(json, text) => {
                setContentJson(json);
                setContentText(text);
              }}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
