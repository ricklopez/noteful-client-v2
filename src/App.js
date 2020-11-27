import React from "react";
import { Route, Link, withRouter } from "react-router-dom";
import "./App.css";
import Context from "./Context";
import HomePage from "./HomePage";
import FolderPage from "./Folders/FolderPage";
import NotePage from "./Notes/NotePage";
import AddFolderForm from "./AddForms/AddFolderForm";
import AddNoteForm from "./AddForms/AddNoteForm";
import EditFolderForm from "./EditForms/EditFolderForm"
import EditNoteForm from "./EditForms/EditNoteForm"
import ErrorBoundary from "./ErrorHandlers/ErrorBoundary";
import config from "./config"

class App extends React.Component {
  state = {
    folders: [],
    notes: [],
    error: null,
  };

  setFolders = (folders) => {
    this.setState({
      folders,
      error: null,
    });
  };

  setNotes = (notes) => {
    this.setState({
      notes,
      error: null,
    });
  };

  addFolder = (folder) => {
    const newFolders = [...this.state.folders];
    newFolders.push(folder);
    this.setState({
      folders: newFolders,
    });
    this.props.history.push("/");
  };

  addNote = (note) => {
    const newNotes = [...this.state.notes];
    newNotes.push(note);
    this.setState({
      notes: newNotes,
    });
    this.props.history.push("/");
  };

  deleteFolder = (folderid) => {
    const newFolders = this.state.folders.filter((folder) => folder.id !== folderid);
    this.props.history.push("/")
    this.setState({
      folders: newFolders
    })
  }

  deleteNote = (noteId) => {
    console.log(noteId);
    const newNotes = this.state.notes.filter((note) => note.id !== noteId);
    this.props.history.push("/");
    this.setState({
      notes: newNotes,
    });
  };

  updateFolder = (updatedFolder) => {
    this.setState({
      folders: this.state.folders.map(folder => folder.id !== updatedFolder.id ? folder : updatedFolder)
    })
  }

  updateNote = (updatedNote) => {
    this.setState({
      notes: this.state.notes.map(note => note.id !== updatedNote.id ? note : updatedNote)
    })
  }

  componentDidMount() {
    //Get folders from API
    fetch(`${config.API_ENDPOINT}/folders`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
        "Authorization": `Bearer ${config.API_KEY}`
      },
    })
      .then((resFolders) => {
        if (!resFolders.ok) {
          throw new Error(resFolders.status);
        }
        return resFolders.json();
      })
      .then(this.setFolders)
      .catch((error) => this.setState({ error }));

    //Get notes from API
    fetch(`${config.API_ENDPOINT}/notes`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
        "Authorization": `Bearer ${config.API_KEY}`
      },
    })
      .then((resNotes) => {
        if (!resNotes.ok) {
          throw new Error(resNotes.status);
        }
        return resNotes.json();
      })
      .then(this.setNotes)
      .catch((error) => this.setState({ error }));
  }

  render() {
    const contextValue = {
      folders: this.state.folders,
      notes: this.state.notes,
      addFolder: this.addFolder,
      addNote: this.addNote,
      deleteFolder: this.deleteFolder,
      deleteNote: this.deleteNote,
      updateFolder: this.updateFolder,
      updateNote: this.updateNote
    };

    return (
      <div className="App">
        <header className="App-header">
          <h1>
            <Link to="/">Noteful</Link>
          </h1>
        </header>
        <Context.Provider value={contextValue}>
          <Route
            exact
            path="/"
            component={HomePage}
          />
          <ErrorBoundary>
            <Route
              path="/folders/:folderid"
              component={FolderPage}
            />
          </ErrorBoundary>
          <ErrorBoundary>
            <Route
              path="/notes/:noteId"
              component={NotePage}
            />
          </ErrorBoundary>
          <Route path="/addFolder" component={AddFolderForm} />
          <Route path="/addNote" component={AddNoteForm} />
          <ErrorBoundary>
            <Route path="/editFolder/:folderid" component={EditFolderForm} />
          </ErrorBoundary>
          <ErrorBoundary>
            <Route path="/editNote/:noteid" component={EditNoteForm} />
          </ErrorBoundary>
        </Context.Provider>
      </div>
    );
  }
}

export default withRouter(App);
