import React, { useState } from "react";
import "./FileUpload.scss";

const FileUpload = (props) => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const fileText = event.target.result;
        props.setCode(fileText);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div>
      <input
        type="file"
        onChange={handleFileChange}
        style={{ display: "none" }}
      />
      <button
        className="uploadButton"
        onClick={() => document.querySelector('input[type="file"]').click()}
      >
        Choose File
      </button>
    </div>
  );
};

export default FileUpload;
