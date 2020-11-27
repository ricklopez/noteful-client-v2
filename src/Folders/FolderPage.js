import React from "react";
import FolderList from "./FolderList";
import NoteList from "../Notes/NoteList";
import Context from "../Context";
// import propTypes from "prop-types";

class FolderPage extends React.Component {
  static contextType = Context;
  render() {
    const { folders, notes } = this.context;
    const folder = folders.find((folder) => {
      if (folder.id === Number(this.props.match.params.folderid)){
        return folder;
      }
    });
    if (folder === undefined) {
      throw new Error("This folder doesn't exist");
    }
    const folderNotes = notes.filter((note) => {
      if (note.folderid === Number(this.props.match.params.folderid)) {
        return note;
      }
    });
    return (
      <div className="content-container">
        <div className="Folder-Sidebar">
          <FolderList folders={folders}/>
        </div>
        <div className="Note-section">
          <NoteList notes={folderNotes}/>
        </div>
      </div>
    );
  }
}

// FolderPage.propTypes = {
//   match: propTypes.shape({
//     isExact: propTypes.bool,
//     params: propTypes.shape({
//       folderId: propTypes.string,
//     }),
//     path: propTypes.string,
//     url: propTypes.string,
//   }),
// };

export default FolderPage;
