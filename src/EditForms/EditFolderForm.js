import React from "react";
import { withRouter } from 'react-router-dom'
import Context from "../Context";
import ValidationError from "../ErrorHandlers/ValidationError";
import config from "../config"

class EditFolderForm extends React.Component {
  static contextType = Context;
  state = {
    name: "",
    touched: false,
    error: null,
  }

  componentDidMount() {
    const { folderid } = this.props.match.params
    fetch(`${config.API_ENDPOINT}/folders/${folderid}`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
        "authorization": `Bearer ${config.API_KEY}`
      }
    })
      .then(res => {
        if(!res.ok)
          return res.json().then(error => Promise.reject(error))
        
        return res.json()
      })
      .then(responseData => {
        this.setState({
          name: responseData.name
        })
      })
      .catch(error => {
        console.error(error)
        this.setState({ error })
      })
  }

  handleChangeName = (e) => {
    this.setState({
      name: e.target.value
    })
  }

  validateFolderName = () => {
    const folderName = this.state.name;
    if (folderName.trim() == '') {
      return 'Folder name is required';
    }
    if (!folderName.match(/^[A-Za-z]+$/)) {
      return 'Folder name must only contain letters A-Z (not case sensitive)';
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const { folderid } = this.props.match.params
    const { name } = this.state
    const newFolder = { name }

    //PATCH request here
    fetch(`${config.API_ENDPOINT}/folders/${folderid}`, {
      method: "PATCH",
      body: JSON.stringify(newFolder),
      headers: {
        "content-type": "application/json",
        "Authorization": `Bearer ${config.API_KEY}`
      }
    })
      .then(res => {
        if(!res.ok) {
          return res.json().then(error => Promise.reject(error))
        }
        return res.json()
      })
      .then(responseData => {
        this.setState({
          name: responseData.name,
        }, () => {
          this.context.updateFolder(responseData)
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
  };

  render() {
    const { error, name } = this.state
    return (
      <section className='EditFolder'>
        <h2>Edit Folder</h2>
        <form
          className='EditFolder__form'
          onSubmit={(e) => this.handleSubmit(e)}
        >
          <div className='EditFolder__error' role='alert'>
          {error && <p>{error.message}</p>}
          </div>
          <div>
            <label htmlFor='name'>
            Folder Name:
            {' '}
            </label>
            <input
            type='text'
            name='name'
            id='name'
            placeholder='Random folder!'
            required
            value={name}
            onChange={(e) => this.handleChangeName(e)}
            />
            {this.state.touched && (
            <ValidationError message={this.validateFolderName()} />
            )}
          </div>
          <div className='EditFolder__buttons'>
            <button type='button' onClick={this.handleClickCancel}>
              Cancel
            </button>
            {' '}
            <button 
              type='submit' 
              disabled={this.validateFolderName()}
            >
              Save
            </button>
          </div>
        </form>
      </section>
    )
  }
}

export default withRouter(EditFolderForm);