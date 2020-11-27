import React from "react";
import FolderList from "./Folders/FolderList";
import NoteList from "./Notes/NoteList";
import Context from "./Context";

export default function HomePage() {
  return (
    <Context.Consumer>
      {(context) => {
        return (
          <main className="App">
            <div className="content-container">
              <div className="Folder-Sidebar">
                <FolderList folders={context.folders}/>
              </div>
              <div className="Note-section">
                <NoteList notes={context.notes}/>
              </div>
            </div>
          </main>
        );
      }}
    </Context.Consumer>
  );
}

