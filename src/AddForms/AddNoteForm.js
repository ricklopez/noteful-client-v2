import React from "react";
import { Link } from "react-router-dom";
import Context from "../Context";
import ValidationError from "../ErrorHandlers/ValidationError";
import config from "../config"
// import propTypes from "prop-types";

class AddNoteForm extends React.Component {
  static contextType = Context;
  
  state = {
    name: {
      value: "",
      touched: false,
    },
    content: {
      value: "",
      touched: false,
    },
    folder: {
      value: "",
      touched: false,
    },
    error: null,
  };

  handleSubmit(event) {
    event.preventDefault();
    
    const note = {
      name: event.target["note-name-select"].value,
      content: event.target["note-content-select"].value,
      folderid: event.target["note-folder-select"].value,
      modified: new Date(),
    };
    const url = `${config.API_ENDPOINT}/notes`;
    const options = {
      method: "POST",
      body: JSON.stringify(note),
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${config.API_KEY}`
      },
    };

    //POST request here
    fetch(url, options)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Something went wrong, please try again later");
        }
        return res.json();
      })
      .then((data) => {
        this.setState({
          name: { value: note.name },
          content: { value: note.content },
          folder: { value: note.folder },
          modified: { value: note.modified },
        });
        this.context.addNote(data);
      })
      .catch((err) => {
        this.setState({
          error: err.message,
        });
      });
  }

  updateNoteName(name) {
    this.setState({ name: { value: name, touched: true } });
  }

  updateNoteContent(content) {
    this.setState({ content: { value: content, touched: true } });
  }

  updateNoteFolder(folderid) {
    this.setState({ folder: { value: folderid, touched: true } });
  }

  validateNoteName() {
    const noteName = this.state.name.value;
    if (noteName.trim() == "") {
      return "Note name is required";
    }
    if (!noteName.match(/^[A-Za-z]+$/)) {
      return "Note name must only contain letters A-Z (not case sensitive)";
    }
  }

  validateNoteContent() {
    const noteContent = this.state.content.value;
    if (noteContent.trim() == "") {
      return "You must specify content inside of the new note";
    }
  }

  validateFolderSelect() {
    const folderid = this.state.folder.value;
    if (folderid.trim() === "" || folderid === "...") {
      return "You must specify an existing folder to store this new note";
    }
  }

  render() {
    const { folders = [] } = this.context;
    return (
      <>
        <Link to="/">
          <button className="back-btn">Go Back</button>
        </Link>
        <form id="note-form" onSubmit={(e) => this.handleSubmit(e)}>
          <label htmlFor="note-name-select">Note Name:</label>
          <input
            type="text"
            name="note-name-select"
            id="note-name-select"
            onChange={(e) => this.updateNoteName(e.target.value)}
          />
          {this.state.name.touched && (
            <ValidationError message={this.validateNoteName()} />
          )}
          <label htmlFor="note-content-select">Content:</label>
          <textarea
            name="note-content-select"
            id="note-content-select"
            rows="6"
            cols="50"
            onChange={(e) => this.updateNoteContent(e.target.value)}
          />
          {this.state.content.touched && (
            <ValidationError message={this.validateNoteContent()} />
          )}
          <label htmlFor="note-folder-select">Folder</label>
          <select
            id="note-folder-select"
            name="note-folder-select"
            onChange={(e) => this.updateNoteFolder(e.target.value)}
          >
            <option value={null}>...</option>
            {folders.map((folder) => (
              <option key={folder.id} value={folder.id}>
                {folder.name}
              </option>
            ))}
          </select>
          {this.state.folder.touched && (
            <ValidationError message={this.validateFolderSelect()} />
          )}
          <button
            className="addNote-btn"
            type="submit"
            disabled={(this.validateNoteName(), this.validateNoteContent(), this.validateFolderSelect())}
          >
            Add Note
          </button>
        </form>
      </>
    );
  }
}

// AddNoteForm.propTypes = {
//   name: propTypes.shape({
//     value: propTypes.string,
//     touched: propTypes.bool,
//   }),
//   content: propTypes.shape({
//     value: propTypes.string,
//     touched: propTypes.bool,
//   }),
//   folder: propTypes.shape({
//     value: propTypes.string,
//     touched: propTypes.bool,
//   }),
//   error: propTypes.bool,
// };

export default AddNoteForm;
