import { Editor } from "@tiptap/react";
import { Bold, Italic, Underline, List, ListOrdered, CheckSquare, Highlighter, Undo, Redo, Smile } from "lucide-react";

interface ToolbarProps {
  editor: Editor | null;
}

export default function EditorToolbar({ editor }: ToolbarProps) {
  if (!editor) return null;

  const Button = ({
    icon: Icon,
    action,
    isActive,
    title,
  }: {
    icon: any;
    action: () => void;
    isActive?: boolean;
    title?: string;
  }) => (
    <button
      onClick={action}
      title={title}
      className={`p-2 rounded-md hover:bg-gray-200 transition ${
        isActive ? "bg-gray-300 text-gray-900" : "text-gray-700"
      }`}
    >
      <Icon size={18} />
    </button>
  );

  return (
    <div className="flex flex-wrap gap-1 border-b border-gray-200 pb-1 mb-3 sticky top-0 bg-white/80 backdrop-blur z-10 rounded-t-xl">
      <Button
        icon={Bold}
        action={() => editor.chain().focus().toggleBold().run()}
        isActive={editor.isActive("bold")}
        title="Bold"
      />
      <Button
        icon={Italic}
        action={() => editor.chain().focus().toggleItalic().run()}
        isActive={editor.isActive("italic")}
        title="Italic"
      />
      <Button
        icon={Underline}
        action={() => editor.chain().focus().toggleUnderline().run()}
        isActive={editor.isActive("underline")}
        title="Underline"
      />
      <Button
        icon={Highlighter}
        action={() =>
          editor.chain().focus().toggleHighlight({ color: "#FFE066" }).run()
        }
        isActive={editor.isActive("highlight")}
        title="Highlight"
      />
      <Button
        icon={List}
        action={() => editor.chain().focus().toggleBulletList().run()}
        isActive={editor.isActive("bulletList")}
        title="Bullet List"
      />
      <Button
        icon={ListOrdered}
        action={() => editor.chain().focus().toggleOrderedList().run()}
        isActive={editor.isActive("orderedList")}
        title="Numbered List"
      />
      <Button
        icon={CheckSquare}
        action={() => editor.chain().focus().toggleTaskList().run()}
        isActive={editor.isActive("taskList")}
        title="Task List"
      />
      <Button icon={Undo} action={() => editor.chain().undo().run()} title="Undo" />
      <Button icon={Redo} action={() => editor.chain().redo().run()} title="Redo" />
      <Button icon={Smile} action={() => alert("Emoji picker coming soon 😄")} title="Emoji" />
    </div>
  );
}
