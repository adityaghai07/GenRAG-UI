import { useState, useRef } from "react";
import "./App.css";
import Welcome from "./components/welcome";

function App() {
  const [progressBarVisible, setProgressBarVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const pdfFileInputRef = useRef(null);
  const questionInputRef = useRef(null);

  async function uploadPDF() {
    const formData = new FormData();
    formData.append("file", pdfFileInputRef.current.files[0]);

    try {
      setProgressBarVisible(true);

      const response = await fetch("http://localhost:8000/upload-pdf", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      console.log(data);

      // Hide progress bar
      setProgressBarVisible(false);
    } catch (error) {
      console.error("Error uploading PDF:", error);
      setProgressBarVisible(false);
    }
  }

  async function askQuestion() {
    const question = questionInputRef.current.value;

    setLoading(true);

    try {
      const response = await fetch("http://localhost:8000/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question }),
      });
      const data = await response.json();

      // Append the new question and answer to the chat history
      setChatHistory((prevHistory) => [
        ...prevHistory,
        { question, answer: data.answer },
      ]);

      // Clear the input field
      questionInputRef.current.value = "";
    } catch (error) {
      console.error("Error asking question:", error);
    }

    setLoading(false);
  }

  return (
    <div className="flex gap-2 h-full">
      <div className="bg-[#333333] h-full max-w-96 flex flex-col gap-2 items-center justify-between">
        <div className="flex flex-col gap-4 p-4 mt-4">
          <div className="text-2xl text-white">Chat-With-PDF</div>
          <p className="text-white">
            Upload your PDF files & click on the submit buttons
          </p>
          <div className="upload-button-container bg-[#222222] text-white flex flex-col gap-8 justify-center p-4 rounded-lg">
            <div className="form-group text-center">
              <input
                type="file"
                className="form-control-file upload-button"
                ref={pdfFileInputRef}
              />
            </div>
            <button
              className="btn btn-primary mb-3 bg-[#333333] rounded-md p-2"
              onClick={uploadPDF}
            >
              Upload PDF
            </button>
            {progressBarVisible && (
              <div className="progress" id="progressBar">
                <div
                  className="progress-bar progress-bar-striped progress-bar-animated"
                  role="progressbar"
                  style={{ width: "100%" }}
                  aria-valuenow="100"
                  aria-valuemin="0"
                  aria-valuemax="100"
                >
                  Uploading...
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="text-[#9da3af] flex flex-col gap-2 bg-[#222222] w-full max-w-80 p-4 rounded-lg mb-4 text-center">
          <p>Made with Love & efforts</p>
        </div>
      </div>
      <div className="container bg-[#222222] h-full flex flex-col gap-4 p-4">
        {chatHistory.length === 0 ? <Welcome /> : (
        <div
          id="AnswerContainer"
          className="text-[#9da3af] bg-[#222222] rounded-lg flex flex-col gap-6 justify-end h-full overflow-y-scroll"
        >
          {chatHistory.map((entry, index) => (
            <div key={index} className="p-2 bg-[#333333] rounded-lg">
              <p className="text-white">
                <strong>Question:</strong> {entry.question}
              </p>
              <br />
              <p>
                <strong className="text-white">Answer:</strong> {entry.answer}
              </p>
            </div>
          ))}
        </div>
        )}
        <div id="questionSection" className="mt-auto">
          <div className="form-group flex gap-2 w-full">
            <input
              className="form-control bg-[#333333] rounded-lg p-4 text-[#9da3af] outline-none"
              ref={questionInputRef}
              placeholder="Ask your question..."
              style={{ flex: 1 }}
            />
            <button
              className="btn btn-primary bg-[#333333] p-4 text-[#9da3af] rounded-lg"
              onClick={askQuestion}
            >
              Ask
            </button>
          </div>
          {loading && (
            <div id="loader" className="text-[#9da3af]">
              Loading...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
