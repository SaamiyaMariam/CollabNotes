// apps/web/src/components/TipTapEditor.tsx
import { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import Heading from "@tiptap/extension-heading";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { common, createLowlight } from "lowlight";

const lowlight = createLowlight(common);

interface TiptapEditorProps {
  content: any; // JSON from DB
  onChange: (json: any, text: string) => void;
}

export default function TiptapEditor({ content, onChange }: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TaskList,
      TaskItem.configure({ nested: true }),
      Heading.configure({ levels: [1, 2, 3] }),
      BulletList,
      OrderedList,
      CodeBlockLowlight.configure({ lowlight }),
    ],
    content: content || { type: "doc", content: [] },
    onUpdate: ({ editor }) => {
      const json = editor.getJSON();
      const text = editor.getText();
      onChange(json, text);
    },
    editorProps: {
      attributes: {
        class:
          "focus:outline-none prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none min-h-[60vh]",
      },
    },
  });

  // Reload content when the note changes
  useEffect(() => {
    if (editor && content) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  return (
    <div>
      <EditorContent editor={editor} />
    </div>
  );
}
