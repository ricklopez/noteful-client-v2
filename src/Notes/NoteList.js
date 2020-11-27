import React from "react";
import { Link } from "react-router-dom";
import Context from "../Context";
import Note from "./Note";
// import propTypes from "prop-types";

class NoteList extends React.Component {
  static contextType = Context;
  render() {
    const { addNote } = this.context;
    return (
      <section className="Note-List">
        <div className="List-Notes">
          {this.props.notes.map((note, i) => (
            <Note
              key={i}
              id={note.id}
              header={note.name}
              modified={note.modified}
              folderId={note.folderId}
              content={note.content}
            />
          ))}
        </div>
        <Link to="/addNote">
          <button
            className="add-note-btn"
            type="button"
            onClick={() => addNote}
          >
            Add Note
          </button>
        </Link>
      </section>
    );
  }
}

// NoteList.propTypes = {
//   notes: propTypes.arrayOf(
//     propTypes.shape({
//       id: propTypes.string,
//       name: propTypes.string,
//       modified: propTypes.string,
//       folderId: propTypes.string,
//       content: propTypes.string,
//     })
//   ),
// };

export default NoteList;
