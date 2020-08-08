import { useState, useEffect } from "react";

import { css } from "emotion";
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-json";
import "prismjs/components/prism-json5";
import Editor from "react-simple-code-editor";
import Modal from 'react-modal';

import editorStyles from "../utils/editorStyles"

const modalStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)'
  }
};

const EditArea = ({ value, onValueChange }) => (
  <Editor
    {...{ value, onValueChange }}
    highlight={(code) => highlight(code, languages.json5)}
    padding={10}
    className={css`
      font-family: "Fira Code", "Fira Mono", monospace;
      font-size: 12;
      max-width: 600px;
      border: 5px solid #302658;
      background: #302658;
    `}
    textareaClassName={css`
      caret-color: white;
      &:focus {
        outline: none;
      }
    `}
    preClassName={css(editorStyles)}
  />
);

const Combined = ({ isOpen, setIsOpen, content, onEdit }) => {
  let [value, setValue] = useState(content);

  useEffect(()=>{
    setValue(content)
  },[content]);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={()=>{
        onEdit(value);
        setIsOpen(false);
      }}
      style={modalStyles}
      contentLabel="Edit"
    >
      <EditArea value={value} onValueChange={(val)=>setValue(val)}/>
    </Modal>
  )
}

export default Combined;