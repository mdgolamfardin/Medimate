import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

function MainApp() {
  const [text, setText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for browser support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onresult = (event) => {
        // Combine all results into a single string
        const currentTranscript = Array.from(event.results)
          .map((result) => result[0].transcript)
          .join("");
        setText(currentTranscript);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } else {
      console.warn("Speech Recognition API is not supported in this browser.");
    }
  }, []);

  const toggleListen = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const handleDone = () => {
    // Navigate to the result page and pass the text in the router state
    navigate("/result", { state: { transcript: text } });
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="shadow-lg bg-gray-100 w-[35rem] h-64 border-2 rounded-lg border-purple-800 flex flex-col p-4 relative">
        
        {/* Text Area for Dictation / Typing */}
        <textarea
          className="flex-grow w-full bg-transparent resize-none outline-none text-gray-800 placeholder-gray-400"
          placeholder="Click the mic and start speaking, or type here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        {/* Controls */}
        <div className="flex justify-between items-center mt-4 pt-2 border-t border-gray-300">
          <button
            onClick={toggleListen}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-white transition-colors ${
              isListening ? "bg-red-500 hover:bg-red-600 animate-pulse" : "bg-purple-600 hover:bg-purple-700"
            }`}
          >
            {/* Simple SVG Mic Icon */}
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path>
            </svg>
            {isListening ? "Listening..." : "Dictate"}
          </button>

          <button
            onClick={handleDone}
            disabled={!text.trim()}
            className="px-6 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

export default MainApp;