import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import apiUrl from "../api/ApiUrl";
import Header from "../componets/Header.jsx";
import DragNDrop from "../componets/DragNDrop.jsx";
import FileUpload from "../componets/FileUpload.jsx";
import "./CodeForm.scss";

// const initialCode = {
//   code: `Place code here`,
// };
const initialCode = "Place code here";

function CodeForm({ onCancel, onSuccess }) {
  // Initialisation ------------------------------
  const conformance = {
    html2js: {
      code: (value) => (value === "" ? null : value),
    },
    js2html: {
      code: (value) => (value === "" ? null : value),
    },
  };
  const apiURL = apiUrl;
  const endpoint = `${apiURL}/cc`;

  // State ---------------------------------------
  const [code, setCode] = useState(
    "Drag and drop a file here or paste your code in!"
  );
  const [score, setScore] = useState(0);
  const [language, setLanguage] = useState("Lets see what you got!");
  const [scores, setScores] = useState({});

  const apiPost = async (endpoint, record) => {
    // Build request object
    const request = {
      method: "POST",
      body: JSON.stringify(record),
      headers: { "Content-type": "application/json" },
    };

    // Call the Fetch
    const response = await fetch(endpoint, request);
    const result = await response.json();
    return response.status >= 200 && response.status < 300
      ? { isSuccess: true, result: result }
      : { isSuccess: false, message: result.message };
  };

  useEffect(() => {}, []);
  // Handlers ------------------------------------

  const handleSubmit = async () => {
    setLanguage("Processing...");
    console.log(endpoint + `?="${code}"`);
    const response = await apiPost(endpoint, code);
    if (response.isSuccess) {
      console.log(response.result);
      setScore(response.result.score);
      if (response.result.code === "Unknown") {
        setLanguage("Unknown language");
      } else {
        setLanguage(response.result.code);
      }
      const { code, score, ...newScores } = response.result;
      setScores(newScores);
    } else {
      alert(response.message);
    }
    console.log(response);
  };
  const handleCancel = () => {
    setCode("");
  };

  // View ----------------------------------------
  return (
    <>
      <Header />
      <div className="Body">
        <div className="ResultSide">
          <div className="ResultTitle">Results Analysis:</div>
          <div className="Score">
            <div className="ScoreSection">
              <div className="Title">Cyclomatic Complexity Analysis:</div>
              <div className="Results">
                {score}
                {score < 9 && (
                  <div className="EncouragingMessage">
                    Great job! Keep it up!
                  </div>
                )}
                {score > 9 && score < 2 && (
                  <div className="EncouragingMessage">Almost there!</div>
                )}
                {score == 1 && (
                  <div className="EncouragingMessage">Perfect Code!</div>
                )}
              </div>
            </div>
            <div className="ScoreSection">
              <div className="Title">Breakdown:</div>
              <div className="Results">
                {Object.entries(scores).map(([key, value]) => (
                  <div className="line" key={key}>
                    {key.split("").map((char, index) => (
                      <span
                        className="letter"
                        style={{ "--i": index }}
                        key={index}
                      >
                        {char}
                      </span>
                    ))}
                    <span className="letter" style={{ "--i": key.length }}>
                      :
                    </span>
                    <span className="letter" style={{ "--i": key.length + 1 }}>
                      {" "}
                    </span>
                    {value
                      .toString()
                      .split("")
                      .map((char, index) => (
                        <span
                          className="letter"
                          style={{ "--i": key.length + 2 + index }}
                          key={index}
                        >
                          {char}
                        </span>
                      ))}
                  </div>
                ))}
              </div>
            </div>
            <div className="ScoreSection">
              <div className="Title">Detected language:</div>
              <div className="Results">
                {language === "Processing..."
                  ? language.split("").map((char, index) => (
                      <span
                        className="letter"
                        style={{ "--i": index }}
                        key={index}
                      >
                        {char}
                      </span>
                    ))
                  : language}
              </div>
            </div>
          </div>
        </div>
        <div className="FormSide">
          <div className="FormTitle">
            <span className="FormLabel">Paste your code OR Drag and Drop:</span>
            <span>
              <FileUpload setCode={(newCode) => setCode(newCode)}></FileUpload>
            </span>
          </div>
          <div className="codeForm">
            <div className="FormTray">
              <DragNDrop
                setCode={(newCode) => setCode(newCode)}
                code={code}
              ></DragNDrop>
            </div>
          </div>
          <div className="FormSubmit">
            <span className="Cancel button" onClick={() => handleCancel()}>
              Clear
            </span>
            <span className="CCsubmit button" onClick={() => handleSubmit()}>
              Submit
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

CodeForm.propTypes = {
  onCancel: PropTypes.func,
  onSuccess: PropTypes.func,
};

export default CodeForm;
