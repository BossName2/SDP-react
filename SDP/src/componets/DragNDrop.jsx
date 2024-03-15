import { useState, useRef } from "react";
import PropTypes from "prop-types";
import "./DragNDrop.scss";

function DragNDrop(props) {
  // drag state
  const [dragActive, setDragActive] = useState(false);

  console.log(props.code);
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
        if (newFileText !== props.code) {
          props.setCode(newFileText);
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
      props.setCode(value);
    }
  };

  return (
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
        value={props.code}
        //value={conformance.js2html["code"](code.code)}
        onChange={handleChange}
      />
    </div>
  );
}
DragNDrop.propTypes = {
  code: PropTypes.string,
  setCode: PropTypes.func,
};
export default DragNDrop;
