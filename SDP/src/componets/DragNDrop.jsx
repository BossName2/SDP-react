import { useState, useRef } from "react";
import "./DragNDrop.scss";

function DragNDrop({ setCode }, code) {
  // drag state
  const [dragActive, setDragActive] = useState(false);
  const [uploadText, setUploadText] = useState(
    "Drag and drop a file here or paste your code in!"
  );
  // ref
  const inputRef = useRef("test");

  // handle drag events
  const handleDrag = function (e) {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // triggers when file is dropped
  const handleDrop = function (e) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      let file = e.dataTransfer.files[0],
        reader = new FileReader();
      reader.onload = function (event) {
        const newFileText = event.target.result;
        if (newFileText !== code) {
          setUploadText(newFileText);
          setCode(newFileText);
        }
      };
      // Read the file as text
      reader.readAsText(file);
    }
  };

  // triggers when file is selected with click
  const handleChange = function (e) {
    e.preventDefault();
    const { name, value } = e.target;
    if (e.target.files && e.target.files[0]) {
      //
    } else if (name === "code") {
      setUploadText(value);
      setCode(value);
    }
  };

  return (
    <form
      id="form-file-upload"
      onDragEnter={handleDrag}
      onSubmit={(e) => e.preventDefault()}
    >
      <input
        ref={inputRef}
        type="file"
        id="input-file-upload"
        multiple={true}
        onChange={handleChange}
      />
      <label
        id="label-file-upload"
        htmlFor="input-file-upload"
        className={dragActive ? "drag-active" : ""}
      ></label>

      <div
        id="drag-file-element"
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <textarea
          type="text"
          name="code"
          value={uploadText}
          //value={conformance.js2html["code"](code.code)}
          onChange={handleChange}
        />
      </div>
    </form>
  );
}
export default DragNDrop;
