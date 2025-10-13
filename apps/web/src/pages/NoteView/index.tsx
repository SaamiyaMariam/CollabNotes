import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useGetNoteByUrlQuery,
  useRenameNoteMutation,
  useUpdateNoteContentMutation,
  useMeQuery,
} from "../../generated/graphql";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import tinycolor from "tinycolor2";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import "../../styles/NoteView.css";

export default function NoteView() {
  const { noteUrl } = useParams<{ noteUrl: string }>();
  const { data: meData } = useMeQuery();
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");
  if (!token) return navigate("/auth");

  const { data, refetch } = useGetNoteByUrlQuery({
    variables: { url: noteUrl! },
    skip: !noteUrl,
  });
  const [renameNote] = useRenameNoteMutation();
  const [updateContent] = useUpdateNoteContentMutation();
  const username = meData?.me?.displayName ?? "User";

  const note = data?.NoteByUrl;
  const [title, setTitle] = useState(note?.title || "");
  const [isSaving, setIsSaving] = useState(false);

  const saveTimeout = useRef<NodeJS.Timeout | null>(null);
  const lastSavedJson = useRef<any>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);

  // 🖊️ TipTap Editor
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "It’s empty here… let’s write something ✏️",
      }),
    ],
    content: note?.contentJson || "",
    autofocus: true,
    editorProps: {
      attributes: {
        class:
          "focus:outline-none prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl max-w-none text-gray-800",
      },
    },
    onUpdate: ({ editor }) => {
      const json = editor.getJSON();
      const text = editor.getText();

      // If content unchanged, do nothing
      if (JSON.stringify(json) === JSON.stringify(lastSavedJson.current)) return;

      // As soon as user types — mark as saving
      setIsSaving(true);

      // Reset debounce timer
      if (saveTimeout.current) clearTimeout(saveTimeout.current);

      // Debounced save after 2s of inactivity
      saveTimeout.current = setTimeout(async () => {
        if (!note) return;

        await updateContent({
          variables: { input: { id: note.id, contentText: text, contentJson: json } },
        });

        lastSavedJson.current = json;
        setTimeout(() => setIsSaving(false), 300); // only mark done when actual save finishes
      }, 2000);
    },

  });

  // Load content
  useEffect(() => {
    if (note && editor) {
      editor.commands.setContent(note.contentJson || "");
      setTitle(note.title);
      lastSavedJson.current = note.contentJson;
    }
  }, [note, editor]);

  useEffect(() => {
    if (note && editor) {
      editor.commands.setContent(note.contentJson || "");
      setTitle(note.title);
      if (titleRef.current) titleRef.current.innerText = note.title; // 🧠 keep DOM text synced without re-render
      lastSavedJson.current = note.contentJson;
    }
  }, [note, editor]);

  // Prevent cursor reset on title typing
  const handleTitleInput = (e: React.FormEvent<HTMLElement>) => {
    setTitle(e.currentTarget.innerText);
  };

  // Rename on blur
  const handleRename = async () => {
    if (!note) return;
    const trimmed = title.trim();
    if (trimmed && trimmed !== note.title) {
      const res = await renameNote({
        variables: { input: { id: note.id, title: trimmed } },
      });

      const newUrl = res.data?.renameNote?.url;
      if (newUrl && newUrl !== note.url) {
        navigate(`/notes/${newUrl}`); // 🧭 redirect to updated note URL
      } else {
        await refetch(); // fallback
      }
    }
  };

  const base = note?.color ?? "#c5d5f0";
  const lighter = tinycolor(base).lighten(5).toString();

  return (
    <div className="min-h-screen flex flex-col pt-16 bg-gradient-to-b from-white to-[#f2ffff]">
      <Navbar username={username} />

      <div className="flex flex-1">
        <Sidebar currentNoteId={note?.id} folderId={note?.folderId ?? null} />

        <main
          className="flex-1 mt-[8px] p-8 rounded-2xl mx-2 shadow-inner overflow-y-auto"
          style={{
            background: `linear-gradient(to bottom, ${base}, ${lighter})`,
          }}
        >
          <div className="max-w-3xl mx-auto bg-white/70 p-6 rounded-2xl shadow-sm prose">
            {/* Title */}
            <h1
              ref={titleRef}
              contentEditable
              suppressContentEditableWarning
              onInput={handleTitleInput}
              onBlur={handleRename}
              className="text-3xl font-bold mb-2 outline-none border-b border-transparent focus:border-gray-300 text-gray-800 caret-black"
            >
            </h1>

            <p className="text-gray-400 text-sm mt-1">
              {isSaving ? "Saving..." : "All changes saved"}
            </p>

            {/* Editor */}
            <div className="mt-6 min-h-[60vh] bg-transparent outline-none text-gray-700 text-lg">
              <EditorContent editor={editor} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}