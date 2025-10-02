import type { GetFoldersQuery } from "../../generated/graphql";
import { Folder as FolderIcon } from "lucide-react";

type Folder = GetFoldersQuery["folders"][0];

interface FolderCardProps {
  folder: Folder;
  onClick: () => void;
}

export default function FolderCard({ folder, onClick }: FolderCardProps) {
  return (
    <div
      onClick={onClick}
      className="p-5 rounded-xl shadow-sm bg-white cursor-pointer hover:shadow-md transition flex flex-col gap-2 border border-gray-100"
    >
      <div className="flex items-center justify-between">
        <FolderIcon className="text-teal-600" size={24} />
        <span
          className="w-4 h-4 rounded-full"
          style={{ backgroundColor: folder.color || "#38b2ac" }}
        ></span>
      </div>
      <h3 className="font-semibold text-gray-800 truncate">{folder.name}</h3>
      {/* ✅ safe check for notes */}
      <p className="text-sm text-gray-500">{folder.notes?.length ?? 0} notes</p>
    </div>
  );
}
