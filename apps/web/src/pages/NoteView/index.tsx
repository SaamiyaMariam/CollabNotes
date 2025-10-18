import { useState, useEffect, useRef, useMemo } from "react";
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
import Underline from "@tiptap/extension-underline";
import Highlight from "@tiptap/extension-highlight";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import OrderedList from "@tiptap/extension-ordered-list";
import BulletList from "@tiptap/extension-bullet-list";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Link from "@tiptap/extension-link";
import EditorToolbar from "../../components/EditorToolbar";
import "../../styles/NoteView.css";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCursor from "@tiptap/extension-collaboration-cursor";

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

  const saveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSavedJson = useRef<any>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);

  const ydoc = useMemo(() => new Y.Doc(), []);
  const [provider, setProvider] = useState<WebsocketProvider | null>(null);

  // connect the provider when we have a note id
  useEffect(() => {
    if (!note?.id) return;

    const p = new WebsocketProvider(
      "ws://localhost:1234", // dev y-websocket server
      `note-${note.id}`,     // room name per note
      ydoc
    );

    setProvider(p);

    return () => {
      p.destroy();
      setProvider(null);
    };
  }, [note?.id, ydoc]);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ underline: false, link: false }),
      Underline,
      Highlight,
      TextStyle,
      Color,
      Link.configure({ openOnClick: false }),
      TaskList,
      TaskItem.configure({ nested: true }),
      BulletList,
      OrderedList,
      Placeholder.configure({
        placeholder: "It’s empty here… let’s write something ✏️",
      }),

      // Realtime!
      Collaboration.configure({ document: ydoc }),
      CollaborationCursor.configure({
        provider,
        user: {
          name: username,
          // simple distinct color per user:
          color: "#" + ((Math.random() * 0xffffff) | 0).toString(16).padStart(6, "0"),
        },
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

      if (JSON.stringify(json) === JSON.stringify(lastSavedJson.current)) return;

      setIsSaving(true);
      if (saveTimeout.current) clearTimeout(saveTimeout.current);

      saveTimeout.current = setTimeout(async () => {
        if (!note) return;
        try {
          await updateContent({
            variables: { input: { id: note.id, contentText: text, contentJson: json } },
          });
          lastSavedJson.current = json;
        } finally {
          setIsSaving(false);
        }
      }, 1000);
    },
  });

  // Properly sync note content on load/change
  useEffect(() => {
    if (note && editor) {
      const currentJson = editor.getJSON();
      if (JSON.stringify(note.contentJson) !== JSON.stringify(currentJson)) {
        editor.commands.setContent(note.contentJson || "");
        lastSavedJson.current = note.contentJson;
      }
      setTitle(note.title);
      if (titleRef.current) titleRef.current.innerText = note.title;
    }
  }, [note?.id]);

  const handleTitleInput = (e: React.FormEvent<HTMLElement>) => {
    setTitle(e.currentTarget.innerText);
  };

  const handleRename = async () => {
    if (!note) return;
    const trimmed = title.trim();
    if (trimmed && trimmed !== note.title) {
      const res = await renameNote({
        variables: { input: { id: note.id, title: trimmed } },
      });
      const newUrl = res.data?.renameNote?.url;
      if (newUrl && newUrl !== note.url) navigate(`/notes/${newUrl}`);
      else await refetch();
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
          style={{ background: `linear-gradient(to bottom, ${base}, ${lighter})` }}
        >
          <div className="max-w-3xl mx-auto bg-white/70 p-6 rounded-2xl shadow-sm prose">
            <h1
              ref={titleRef}
              contentEditable
              suppressContentEditableWarning
              onInput={handleTitleInput}
              onBlur={handleRename}
              className="text-3xl font-bold mb-2 outline-none border-b border-transparent focus:border-gray-300 text-gray-800 caret-black"
            ></h1>

            <p className="text-gray-400 text-sm mt-1">
              {isSaving ? "Saving..." : "All changes saved"}
            </p>

            <div className="mt-6 min-h-[60vh] bg-transparent outline-none text-gray-700 text-lg">
              <EditorToolbar editor={editor} />
              <EditorContent editor={editor} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
