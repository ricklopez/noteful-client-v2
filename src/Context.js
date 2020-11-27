import React from "react";

const Context = React.createContext({
  folders: [],
  notes: [],
  addFolder: () => {},
  addNote: () => {},
  deleteFolder: () => {},
  deleteNote: () => {},
  updateFolder: () => {},
  updateNote: () => {}
});

export default Context;
