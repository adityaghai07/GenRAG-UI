import { useState, useRef, useEffect } from "react";
import "./App.css";
import Welcome from "./components/welcome.jsx";
import Heart from "./assets/heart.png";
import checked from "./assets/checked.png";
import Loader from "./components/loader.jsx";
import TextLoader from "./components/textloader.jsx";
import { MetricsModal } from "./components/metricsModal.jsx";
import { Button } from "flowbite-react";

function App() {
  const [uploadpdfStatus, setuploadpdfStatus] = useState("false");
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [metrics, setMetrics] = useState([]);
  const pdfFileInputRef = useRef(null);
  const questionInputRef = useRef(null);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const transformTopResults = (topResults) => {
    return topResults.split("\n").map((result) => {
      const [scorePart, chunkPart] = result.split(", Relevant Chunk: ");
      const score = parseFloat(scorePart.split(": ")[1]);
      const chunk = chunkPart;
      return { score, chunk };
    });
  };

  async function uploadPDF() {
    const formData = new FormData();
    formData.append("file", pdfFileInputRef.current.files[0]);

    try {
      setuploadpdfStatus("inprogress");

      const response = await fetch("http://localhost:8000/upload-pdf", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      console.log(data);

      // Hide progress bar
      setuploadpdfStatus("success");
    } catch (error) {
      console.error("Error uploading PDF:", error);
      setuploadpdfStatus("failed");
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
      const transformedData = transformTopResults(data.top_results);
      setMetrics(transformedData);

      setChatHistory((prevHistory) => [
        ...prevHistory,
        { question, answer: data.answer },
      ]);

      questionInputRef.current.value = "";
    } catch (error) {
      console.error("Error asking question:", error);
    }

    setLoading(false);
  }

  return (
    <div className="flex gap-2 h-full">
      <div className="bg-[#222222] h-full max-w-96 flex flex-col gap-2 items-center justify-between">
        <div className="flex flex-col gap-4 p-4 mt-4">
          <div className="text-2xl text-white">Chat-With-PDF</div>
          <p className="text-white">
            Upload your PDF files & click on the upload button.
          </p>
          <div className="upload-button-container bg-[#101010] text-white flex flex-col gap-8 justify-center p-4 rounded-lg">
            <div className="form-group text-center">
              <input
                type="file"
                className="form-control-file upload-button"
                ref={pdfFileInputRef}
              />
            </div>
            <Button
              className="btn btn-primary mb-3 bg-[#222222] rounded-md p-1 ring-1 ring-[#333333] focus:ring-0 hover:ring-1 hover:ring-cyan-700"
              onClick={uploadPDF}
            >
              Upload PDF
            </Button>
            {uploadpdfStatus === "inprogress" && <Loader />}
            {uploadpdfStatus === "success" && (
              <p className="flex gap-2 justify-center">
                <img src={checked} width={25} height={16} alt="" />
                PDF uploaded successfully!
              </p>
            )}
          </div>
          <p className="text-white">
            Ask a question and see its relevant chunks.
          </p>
          <div className="upload-button-container bg-[#101010] text-white flex flex-col gap-8 justify-center p-4 rounded-lg">
            <MetricsModal data={metrics} />
          </div>
        </div>
        <div className="text-[#9da3af] flex flex-col gap-2 bg-[#101010] w-full max-w-80 p-4 rounded-lg mb-4 text-center">
          <p className="flex gap-2 justify-center">
            Made with <img src={Heart} width={25} height={16} alt="" /> &
            efforts
          </p>
        </div>
      </div>
      <div className="container bg-[#101010] h-full flex flex-col gap-4 py-4 pl-4">
        {chatHistory.length === 0 ? (
          <Welcome />
        ) : (
          <div
            id="AnswerContainer"
            className="text-[#9da3af] bg-[#101010] px-8 rounded-lg flex flex-col gap-6 h-full overflow-y-scroll"
            ref={chatContainerRef}
          >
            {chatHistory.map((entry, index) => (
              <div key={index} className="p-2 bg-[#101010] rounded-lg mt-auto">
                <p className="text-white p-4">{entry.question}</p>
                <br />
                <p>{entry.answer}</p>
                <div className="h-[2px] w-full bg-[#222222] mt-8"></div>
              </div>
            ))}
          </div>
        )}
        <div id="questionSection" className="mt-auto">
          {loading && <TextLoader />}
          <div className="form-group flex gap-2 w-full pr-4">
            <input
              className="form-control bg-[#222222] rounded-lg p-4 text-[#9da3af] outline-none"
              ref={questionInputRef}
              placeholder="Ask your question..."
              style={{ flex: 1 }}
            />
            <button
              className="btn btn-primary bg-[#222222] p-4 text-[#9da3af] rounded-lg"
              onClick={askQuestion}
            >
              Ask
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
