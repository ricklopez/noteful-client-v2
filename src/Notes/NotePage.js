import React from "react";
import { Link } from "react-router-dom";
import Context from "../Context";
import config from "../config"
// import propTypes from "prop-types";

function deleteNoteRequest(noteId, callback) {
  fetch(`${config.API_ENDPOINT}/notes/${noteId}`, {
    method: "DELETE",
    headers: {
      "content-type": "application/json",
      "Authorization": `Bearer ${config.API_KEY}`
    },
  })
    .then((res) => {
      if (!res.ok) {
        return res.json().then((error) => {
          throw error;
        });
      }
      return res
    })
    .then(() => {
      callback(noteId);
    })
    .catch((error) => {
      console.error(error);
    });
}

export default function NotePage(props) {
  return (
    <Context.Consumer>
      {(context) => {
        const currentNote = context.notes.find((note) => {
          if (note.id === Number(props.match.params.noteId)) {
            return note;
          }
        });
        const currentFolder = context.folders.find((folder) => {
          if (currentNote.folderid === folder.id) {
            return folder;
          }
        });
        return (
          <div className="content-container">
            <Link to="/">
              <button className="back-btn">Go Back</button>
            </Link>
            <div className="Folder-Sidebar">
              <div className="folder">
                <h2>{currentFolder.name}</h2>
              </div>
            </div>
            <div className="Note-section">
              <div className="note">
                <h2>{currentNote.name}</h2>
                <p>Date modified on: {currentNote.modified}</p>
                <Link to={`/editNote/${currentNote.id}`}>
                  <button
                    type="button"
                  >
                  Edit Note
                  </button>
                </Link>
                <button
                  type="button"
                  onClick={() => deleteNoteRequest(props.match.params.noteId, context.deleteNote)}
                >
                  Delete Note
                </button>
                <p>{currentNote.content}</p>
              </div>
            </div>
          </div>
        );
      }}
    </Context.Consumer>
  );
}

// NotePage.propTypes = {
//   match: propTypes.shape({
//     isExact: propTypes.bool,
//     params: propTypes.shape({
//       noteId: propTypes.string,
//     }),
//     path: propTypes.string,
//     url: propTypes.string,
//   }),
// };
