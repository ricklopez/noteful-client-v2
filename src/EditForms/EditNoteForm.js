import React from "react"
import Context from "../Context"
import { withRouter } from 'react-router-dom'
import ValidationError from "../ErrorHandlers/ValidationError";
import config from "../config"

class EditNoteForm extends React.Component {
  static contextType = Context

  state = {
    error: null,
    name : {
      value: '',
      touched: false,
    },
    content : {
      value: '',
      touched: false,
    },
    folderid : {
      value: '',
      touched: false,
    }
  }

  componentDidMount(){
    const { noteid } = this.props.match.params
    fetch(`${config.API_ENDPOINT}/notes/${noteid}`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
        "Authorization": `Bearer ${config.API_KEY}`
      }
    })
      .then(res => {
        if(!res.ok)
          return res.json().then(error => Promise.reject(error))
        
        return res.json()
      })
      .then(responseData => {
        this.setState({
          name: { value: responseData.name },
          content: { value: responseData.content },
          folderid: { value: responseData.folderid }
        })
      })
      .catch(error => {
        console.error(error)
        this.setState({ error })
      })
  }

  handleChangeName = (newName) => {
    this.setState({
      name: { value: newName, touched: true }
    })
  }
  
  handleChangeContent = (newContent) => {
    this.setState({
      content: { value: newContent, touched: true }
    })
  }

  handleChangeFolderid = (newFolderId) => {
    this.setState({
      folderid: { value: newFolderId, touched: true }
    })
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

  handleSubmit = (e) => {
    e.preventDefault();
    const { noteid } = this.props.match.params
    const name = this.state.name.value
    const content = this.state.content.value
    const folderid = this.state.folderid.value
    const newNote = { name, content, folderid }

    //PATCH request here
    fetch(`${config.API_ENDPOINT}/notes/${noteid}`, {
      method: "PATCH",
      body: JSON.stringify(newNote),
      headers: {
        "content-type" : "application/json",
        "Authorization" : `Bearer ${config.API_KEY}`
      }
    })
      .then(res => {
        if(!res.ok)
          return res.json().then(error => Promise.reject(error))
        
        return res.json()
      })
      .then(responseData => {
        this.setState({
          name: { value: responseData.name },
          content: { value: responseData.content },
          folderid: { value: responseData.folderid }
        }, () => {
          this.context.updateNote(responseData)
          this.props.history.push("/")
        })
      })
      .catch(error => {
        console.error(error)
        this.setState({ error })
      })
  }

  handleClickCancel = () => {
    this.props.history.push("/")
  }

  render(){
    const { folders } = this.context
    const { error } = this.state
    const name = this.state.name.value
    const content = this.state.content.value
    const folderid = this.state.folderid.value
    return (
      <section className='EditNote'>
        <h2>Edit Note</h2>
        <form 
          className="EditNote__form" 
          onSubmit={this.handleSubmit}
        >
          <div className='EditNote__error' role='alert'>
            {error && <p>{error.message}</p>}
          </div>
          <div>
            <label htmlFor='name'>
              Note Name:
              {' '}
            </label>
            <input
              type='text'
              name='name'
              id='name'
              placeholder='Random Note Name'
              required
              value={name}
              onChange={(e) => this.handleChangeName(e.target.value)}
            />
            {this.state.name.touched && (
            <ValidationError message={this.validateNoteName()} />
            )}
          </div>
          <textarea
            type="text"
            name="content"
            id="content"
            rows="6"
            cols="50"
            required
            value={content}
            onChange={(e) => this.handleChangeContent(e.target.value)}
          />
          {this.state.content.touched && (
            <ValidationError message={this.validateNoteContent()} />
          )}
          <select
            id="folders"
            name="folders"
            value={folderid}
            onChange={(e) => this.handleChangeFolderid(e.target.value)}
          >
            {folders.map((folder) => (
              <option key={folder.id} value={folder.id}>
                {folder.name}
              </option>
            ))}
          </select>
          <div className='EditNote__buttons'>
            <button 
              type='button' 
              onClick={this.handleClickCancel}
            >
              Cancel
            </button>
            {' '}
            <button 
              type='submit'
              disabled={(this.validateNoteName(), this.validateNoteContent())}
            >
              Save
            </button>
          </div>
        </form>
      </section>
    )
  }
}

export default withRouter(EditNoteForm);