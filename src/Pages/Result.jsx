import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function Result() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // State for the API request
  const [noteData, setNoteData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Safely grab the transcript from the location state
  const transcript = location.state?.transcript || "";

  useEffect(() => {
    // If there is no transcript (e.g., user refreshed the page directly), stop loading.
    if (!transcript) {
      setLoading(false);
      setError("No audio recorded. Please go back and dictate a note.");
      return;
    }

    const fetchSummary = async () => {
      try {
        // Ensure this port matches the port your Node server is running on (e.g., 5001)
        const response = await fetch("http://localhost:2888/api/generate-summary", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ transcript }),
        });

        if (!response.ok) {
          throw new Error("Failed to generate summary from the server.");
        }

        const data = await response.json();
        setNoteData(data);
      } catch (err) {
        console.error(err);
        setError("Something went wrong while generating your note.");
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [transcript]);

  return (
    <div className="min-h-screen bg-gray-50 p-8 flex justify-center">
      <div className="max-w-6xl w-full">
        
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-purple-900">Your Conversation</h1>
          <button 
            onClick={() => navigate("/")}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors shadow-sm"
          >
            ← Back to Dictation
          </button>
        </div>

        {/* State Handling: Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-800 mb-4"></div>
            <p className="text-gray-600 font-medium animate-pulse">Analyzing transcript with AI...</p>
          </div>
        )}

        {/* State Handling: Error */}
        {error && !loading && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded shadow-sm">
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        )}

        {/* Main Content Layout (Only shows when data is successfully fetched) */}
        {noteData && !loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* LEFT COLUMN: Summary & Important Notes (Takes up 2/3 of the grid) */}
            <div className="md:col-span-2 flex flex-col gap-6">
              
              {/* Summary Box */}
              <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                <h2 className="text-xl font-bold text-gray-800 mb-3 border-b pb-2">Summary</h2>
                <p className="text-gray-700 leading-relaxed">
                  {noteData.summary}
                </p>
              </div>

              {/* Important Notes Box */}
              <div className="bg-purple-50 p-6 rounded-xl shadow-md border border-purple-100">
                <h2 className="text-xl font-bold text-purple-900 mb-3 border-b border-purple-200 pb-2">
                  Important Notes & Actions
                </h2>
                <ul className="list-disc pl-5 space-y-2">
                  {noteData.importantNotes.map((note, index) => (
                    <li key={index} className="text-purple-900">
                      {note}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Raw Transcript Dropdown (Optional, but good for UX) */}
              <details className="bg-gray-100 p-4 rounded-lg cursor-pointer">
                <summary className="font-semibold text-gray-700">View Raw Transcript</summary>
                <p className="mt-3 text-sm text-gray-600 italic whitespace-pre-wrap pl-2 border-l-2 border-gray-300">
                  "{transcript}"
                </p>
              </details>

            </div>

            {/* RIGHT COLUMN: Key Terms (Takes up 1/3 of the grid) */}
            <div className="md:col-span-1">
              <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 h-full">
                <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Key Terms</h2>
                <div className="space-y-4">
                  {noteData.keyTerms.map((item, index) => (
                    <div key={index} className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                      <h3 className="font-bold text-purple-700">{item.term}</h3>
                      <p className="text-sm text-gray-600 mt-1">{item.explanation}</p>
                    </div>
                  ))}
                  
                  {noteData.keyTerms.length === 0 && (
                    <p className="text-sm text-gray-500 italic">No medical terms detected.</p>
                  )}
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}

export default Result;