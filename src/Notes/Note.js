import React from "react";
import Context from "../Context";
import { Link } from "react-router-dom";
import config from "../config"
// import Proptypes from "prop-types";

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

export default function Note(props) {
  return (
    <Context.Consumer>
      {(context) => (
        <div className="note">
          <Link to={`/notes/${props.id}`}>
            <h2>{props.header}</h2>
          </Link>
          <p>Date modified on: {props.modified}</p>
          <button
            className="edit-note-btn">
            <Link to={`/editNote/${props.id}`}>Edit</Link>  
          </button>
          <button
            className="delete-note-btn"
            onClick={() => {
              deleteNoteRequest(props.id, context.deleteNote);
            }}
          >
            Delete
          </button>
        </div>
      )}
    </Context.Consumer>
  );
}

// Note.propTypes = {
//   id: Proptypes.string,
//   header: Proptypes.string,
//   modified: Proptypes.string,
// };
