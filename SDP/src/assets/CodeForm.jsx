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
const logo = `
 ______                                     __                      __   ______             
/      \\                                   |  \\                    |  \\ /      \\           
|  $$$$$$\\  ______   ______ ____    ______  | $$  ______   __    __  \\$$|  $$$$$$\\ __    __  
| $$   \\$$ /      \\ |      \\    \\  /      \\ | $$ /      \\ |  \\  /  \\|  \\| $$_  \\$$|  \\  |  \\
| $$      |  $$$$$$\\| $$$$$$\\$$$$\\|  $$$$$$\\| $$|  $$$$$$\\ \\$$\\/  $$| $$| $$ \\    | $$  | $$
| $$   __ | $$  | $$| $$ | $$ | $$| $$  | $$| $$| $$    $$  >$$  $$ | $$| $$$$    | $$  | $$
| $$__/  \\| $$__/ $$| $$ | $$ | $$| $$__/ $$| $$| $$$$$$$$ /  $$$$\\ | $$| $$      | $$__/ $$
\\$$    $$ \\$$    $$| $$ | $$ | $$| $$    $$| $$ \\$$     \\|  $$ \\$$\\| $$| $$       \\$$    $$ 
 \\$$$$$$   \\$$$$$$  \\$$  \\$$  \\$$| $$$$$$$  \\$$  \\$$$$$$$ \\$$   \\$$ \\$$ \\$$       _\\$$$$$$$ 
                                 | $$                                            |  \\__| $$ 
                                 | $$                                             \\$$    $$ 
                                  \\$$                                              \\$$$$$$  

`;

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
  const endpointCC = `${apiURL}/cc`;
  const endpointHcc = `${apiURL}/hcc`;

  // State ---------------------------------------
  const [code, setCode] = useState(
    "Drag and drop a file here or paste your code in!"
  );
  const [scoreJson, setScoreJson] = useState({});
  const [score, setScore] = useState(0);
  const [language, setLanguage] = useState("Lets see what you got!");
  const [scores, setScores] = useState({});
  const [metric, setMetric] = useState("");
  const [cycloScores, setCycloScores] = useState("");
  const cycloToString = (cyclo) => {
    return (
      `If Score: ${cyclo.ifScore}\n` +
      `Try Score: ${cyclo.tryScore}\n` +
      `Catch Score: ${cyclo.catchScore}\n` +
      `Then Score: ${cyclo.thenScore}\n` +
      `Select Score: ${cyclo.selectScore}\n` +
      `Switch Score: ${cyclo.switchScore}\n` +
      `For Score: ${cyclo.forScore}\n` +
      `Do Score: ${cyclo.doScore}\n` +
      `While Score: ${cyclo.whileScore}\n`
    );
  };
  const [halsteadScores, setHalsteadScores] = useState("");

  const halToString = (hal) => {
    return (
      `Program length: ${hal.programLengthScore.toFixed(2)}\n` +
      `Size of vocabulary: ${hal.sizeOfVocabScore.toFixed(2)}\n` +
      `Program volume: ${hal.programVolumeScore.toFixed(2)}\n` +
      `Difficulty measure: ${hal.difficultyScore.toFixed(2)}\n` +
      `Programming level: ${hal.progLevelScore.toFixed(2)}\n` +
      `Effort measure: ${hal.effortScore.toFixed(2)}\n` +
      `Estimated time required to program: ${hal.timeToImplemScore.toFixed(
        2
      )}\n` +
      `Estimated number of bugs: ${hal.bugsScore.toFixed(2)}`
    );
  };

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

  const handleSubmit = async (endpoint) => {
    setLanguage("Processing...");
    console.log(endpoint + `?="${code}"`);
    const response = await apiPost(endpoint, code);
    if (response.isSuccess) {
      setScoreJson(response.result);
      setScore(response.result.score);
      if (response.result.code === "Unknown") {
        setLanguage("Unknown language");
      } else {
        setLanguage(response.result.code);
      }
      const { code, score, metric, ...newScores } = response.result;
      setMetric(metric);
      setCycloScores(cycloToString(newScores));
    } else {
      alert(response.message);
    }
  };
  const handleSubmitHcc = async (endpoint) => {
    setLanguage("Processing...");
    console.log(endpoint + `?="${code}"`);
    const response = await apiPost(endpoint, code);
    if (response.isSuccess) {
      console.log(response.result);
      setScoreJson(response.result);
      setScore(response.result.score);
      if (response.result.code === "Unknown") {
        setLanguage("Unknown language");
      } else {
        setLanguage(response.result.code);
      }
      const { code, score, metric, ...hal } = response.result;
      setMetric(metric);
      setHalsteadScores(halToString(hal));
    } else {
      alert(response.message);
    }
  };
  const handleCancel = () => {
    setCode("");
  };
  const handleDownload = () => {
    let formattedString = "";
    let title = "";
    let finalScore = "";
    let breaker = "------------------- \n";
    let detectedLanguage = `Detected language: ${language}\n ${breaker}`;
    if (metric === "Cycolomatic") {
      title = `Cyclomatic complexity score and breakdown:\n ${breaker}`;
      formattedString = cycloScores;
      finalScore = `FINAL CYCLOMATIC COMPLEXITY SCORE: ${score}\n ${breaker}`;
    } else if (metric === "Halstead") {
      title = `Halstead complexity score and breakdown: \n ${breaker}`;
      formattedString = halsteadScores;
    }

    const element = document.createElement("a");
    const file = new Blob(
      [logo, title, detectedLanguage, finalScore, formattedString],
      {
        type: "text/plain",
      }
    );
    element.href = URL.createObjectURL(file);
    element.download = `Complexify${metric}Analysis.txt`;
    document.body.appendChild(element);
    element.click();
  };

  const handleShare = () => {};

  // View ----------------------------------------
  return (
    <>
      <Header />
      <div className="Body">
        <div className="ResultSide">
          {metric === "" ? (
            <div className="ResultTitle">Results Analysis:</div>
          ) : (
            <div className="ResultTitle">{metric} Analysis:</div>
          )}
          <div className="Score">
            <div className="ScoreSection">
              {metric === "Cycolomatic" && (
                <>
                  <div className="Title">Overall score:</div>
                  <div className="Results">
                    {score}
                    {score < 9 && score > 2 && (
                      <div className="EncouragingMessage">
                        Great job! Keep it up!
                      </div>
                    )}
                    {score > 9 && (
                      <div className="EncouragingMessage">Almost there!</div>
                    )}
                    {score === 1 && (
                      <div className="EncouragingMessage">Perfect Code!</div>
                    )}
                  </div>
                </>
              )}
            </div>
            <div className="ScoreSection">
              <div className="Title">Breakdown:</div>
              <div className="Results">
                {metric === "Cycolomatic" ? (
                  <div className="Hal">{cycloScores}</div>
                ) : (
                  metric === "Halstead" && (
                    <div className="Hal">{halsteadScores}</div>
                  )
                )}
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
          <div className="FormSubmit">
            <span className="Cancel button" onClick={() => handleShare()}>
              Share
            </span>
            <span className="Cancel button" onClick={() => handleDownload()}>
              Download
            </span>
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
            <span
              className="CCsubmit button"
              onClick={() => handleSubmit(endpointCC)}
            >
              Submit CC
            </span>
            <span
              className="CCsubmit button"
              onClick={() => handleSubmitHcc(endpointHcc)}
            >
              Submit HCC
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
