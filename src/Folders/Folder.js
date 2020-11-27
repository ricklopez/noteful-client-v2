import React from "react";
import { Link } from "react-router-dom";
import config from "../config";
import Context from "../Context";
// import proptypes from "prop-types";

function deleteFolderRequest(folderid,cb) {
  fetch(`${config.API_ENDPOINT}/folders/${folderid}`, {
    method: "DELETE",
    headers: {
      "content-type": "application/json",
      "authorization": `Bearer ${config.API_KEY}`
    },
  })
    .then((res) => {
      if (!res.ok) {
        return res.json().then((error) => {
          throw error; 
        })
      }
      return res
    })
    .then(() => {
      cb(folderid)
    })
    .catch((error) => { 
      console.error(error);
    })
}

export default function Folder(props) {
  return (
    <Context.Consumer>
      {(context) => (  
        <div className="folder">
          <h2>
            <Link to={`/folders/${props.id}`}>{props.header}</Link> 
          </h2>
          <button 
            className="edit-folder-btn">
            <Link to={`/editFolder/${props.id}`}>Edit</Link> 
          </button>
          <button 
            className="delete-folder-btn" 
            onClick={() => {
              deleteFolderRequest(props.id, context.deleteFolder)
            }}>
            Delete
          </button>
        </div>
      )}
    </Context.Consumer>
  );
}

// Folder.propTypes = {
//   id: proptypes.string,
//   header: proptypes.string,
// };

