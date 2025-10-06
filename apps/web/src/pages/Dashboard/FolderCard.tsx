import type { GetFoldersQuery } from "../../generated/graphql";
import "../../styles/FolderCard.css";
import Checkbox from "../../components/Checkbox";

type Folder = GetFoldersQuery["folders"][0];

interface FolderCardProps {
  folder: Folder;
  onClick: () => void;
  selected: boolean;
  onSelectToggle: () => void;
}

export default function FolderCard({ folder, onClick, selected, onSelectToggle }: FolderCardProps) {
  return (
    <div
      className="folder-card relative"
      style={{ backgroundColor: folder.color || "#cfb5eb" }}
    >
      {/* Checkbox FIRST, so it layers above everything */}
      <Checkbox
        checked={selected}
        onChange={(e) => {
          e.stopPropagation();
          onSelectToggle();
        }}
      />

      {/* Rest of the folder content */}
      <div
        onClick={onClick}
        className="w-full h-full cursor-pointer flex flex-col justify-between"
      >
        <div className="folder-wrapper">
          <div className="folder">
            <div className="front-side">
              <div className="tip"></div>
              <div className="cover"></div>
            </div>
            <div className="back-side cover"></div>
          </div>
        </div>

        <div className="folder-info">
          <h3 className="folder-title">{folder.name}</h3>
          <p className="folder-count">{folder.notes?.length ?? 0} notes</p>
        </div>
      </div>
    </div>


  );
}
