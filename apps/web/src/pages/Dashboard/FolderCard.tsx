import type { GetFoldersQuery } from "../../generated/graphql";
import "../../styles/FolderCard.css";

type Folder = GetFoldersQuery["folders"][0];

interface FolderCardProps {
  folder: Folder;
  onClick: () => void;
}

export default function FolderCard({ folder, onClick }: FolderCardProps) {
  return (
    <div className="folder-card" 
    onClick={onClick}
    style={{
        backgroundColor: folder.color || "#cfb5eb",
      }}>
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
  );
}
