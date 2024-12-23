import React, { useRef, useState, useEffect } from "react";
import { FaImage, FaPaperclip, FaMicrophone, FaBars } from "react-icons/fa";
import { RectangleStackIcon } from "@heroicons/react/24/outline";


const fetchFaqQuestions = () => {
  return [
    "How can I reset my password?",
    "Where can I find the user manual?",
    "How do I contact customer support?",
    "Define DBMS",
  ];
};

const MainBody = ({ user, addToHistory, initialMessages, currentMessages, setCurrentMessages, setHistory }) => {
  const [messages, setMessages] = useState(initialMessages || []);
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [faqQuestions, setFaqQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const fileInputRef = useRef(null);

  const handleAddDocument = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    setUploadedFiles(prevFiles => [...prevFiles, ...files]);
  };

  const handleRemoveFile = (fileToRemove) => {
    setUploadedFiles(prevFiles => {
      const updatedFiles = prevFiles.filter(file => file !== fileToRemove);
      // Reset the file input so the same file can be uploaded again
      if (updatedFiles.length < prevFiles.length) {
        fileInputRef.current.value = null; // Reset the file input
      }
      return updatedFiles;
    });
  };

  const handleSendMessage = async () => {
    if (query.trim() || uploadedFiles.length) {
      const userMessage = { user: 'user', text: query, files: uploadedFiles.map(file => file.name) };
      setMessages([...messages, userMessage]);
      setCurrentMessages([...currentMessages, userMessage]);

      setLoading(true);
      try {
        const collectionName = "your_collection_name"; // Replace with actual collection name
        const response = await fetch(`http://localhost:8000/response/?prompt=${encodeURIComponent(query)}&collection_name=${collectionName}`);

        if (!response.ok) {
          throw new Error('Failed to fetch response from backend');
        }

        const data = await response.json();
        const botMessage = { user: 'bot', text: data.response };
        setMessages((prevMessages) => [...prevMessages, botMessage]);
        setCurrentMessages((prevMessages) => [...prevMessages, botMessage]);

        // Handle file uploads
        if (uploadedFiles.length > 0) {
          const formData = new FormData();
          uploadedFiles.forEach(file => formData.append('files', file));

          const uploadResponse = await fetch('http://localhost:8000/upload', {
            method: 'POST',
            body: formData,
          });

          if (!uploadResponse.ok) {
            throw new Error('Failed to upload files');
          }
          // Optionally handle the response from the upload
        }
      } catch (error) {
        console.error('Error:', error);
        const errorMessage = { user: 'bot', text: 'Error: Unable to fetch response or upload files.' };
        setMessages((prevMessages) => [...prevMessages, errorMessage]);
        setCurrentMessages((prevMessages) => [...prevMessages, errorMessage]);
      } finally {
        setLoading(false);
      }

      // Clear input fields
      setQuery('');
      setUploadedFiles([]);
    }
  };

  const handleSaveSession = () => {
    const topicName = prompt("Enter a name for this topic:");
    if (topicName) {
      addToHistory({ name: topicName, messages });
      alert(`Session saved as "${topicName}"`);
    }
  };

  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleStartRecording = () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then((stream) => {
          const mediaRecorder = new MediaRecorder(stream);
          mediaRecorder.ondataavailable = (event) => {
            const audioBlob = event.data;
            const reader = new FileReader();
            reader.onloadend = () => {
              const audioData = reader.result;
              console.log("Audio Data:", audioData);
              setQuery("Sample transcribed text from audio");
            };
            reader.readAsDataURL(audioBlob);
          };
          mediaRecorder.start();
          setTimeout(() => mediaRecorder.stop(), 5000);
        })
        .catch((error) => {
          console.error("Error accessing microphone:", error);
        });
    } else {
      console.error("Microphone not supported");
    }
  };

  useEffect(() => {
    setMessages(initialMessages || []);
    setCurrentMessages(initialMessages || []);
  }, [initialMessages, setCurrentMessages]);

  useEffect(() => {
    setFaqQuestions(fetchFaqQuestions());
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      const chatWindow = document.querySelector('.chat-window');
      chatWindow.scrollTop = chatWindow.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex-1 flex flex-col p-4 bg-black relative" >
      {/* Header Section */}
      <div className="border-b border-gray-600 pb-2 mb-4 flex items-center justify-between relative">
        <h2 className="text-xl font-semibold text-white ">Aadhya</h2>
        <FaBars className="w-5 h-5 text-gray-100 cursor-pointer" onClick={handleSidebarToggle} />
      </div>

      {/* Sidebar */}
      {isSidebarOpen && (
        <div className="fixed top-14 right-0 h-[calc(100%-3.5rem)] w-64 bg-black shadow-lg border-l border-gray-300 p-4 z-50">
          <h2 className="text-xl text-white font-semibold mb-4">Topic List</h2>
          <ul>
            <li className="mb-2 text-white">Topic 1</li>
            <li className="mb-2 text-white">Topic 2</li>
            <li className="mb-2 text-white">Topic 3</li>
          </ul>
        </div>
      )}

        <div className={`overflow-y-scroll flex-1 `} style={{ maxHeight: 'calc(100vh - <desired height>)' }}>

                <div className={`flex flex-1 relative transition-all duration-300 ease-in-out ${isSidebarOpen ? 'lg:mr-64' : ''}`}>
                  {/* Main Chat Section */}
                  <div className="flex-1 chat-window mb-2 p-3 rounded">
          <div className="messages p-20">
            {/* {messages.length === 0 && (
              <div className={`flex flex-wrap gap-4 justify-start text-white items-start text-3xl max-w-3xl mx-auto p-4`}>
                Welcome! How can I assist you today?
              </div>
              
            )} */}

            {messages.length === 0 && (
              <div className="flex flex-col gap-4 justify-start items-center text-white max-w-3xl mx-auto p-4 ">
                <div className="text-5xl text-center">
                  Welcome!
                </div>
                <div className="text-xl text-center">
                  I am your personal intelligent assistant Aadhya. How can I assist you today?
                </div>
              </div>
            )}
{messages.map((msg, index) => (
  <div
    key={index}
    className={`message mb-2 p-2 rounded max-w-lg ${
      msg.user === 'user' ? 'text-black ml-auto rounded-lg w-fit' : 'text-black mr-auto'
    }`}
    style={{
      background: msg.user === 'user'
        ? 'linear-gradient(to right, #ff0000, #ff6f20)' // Red to orange for user
        : 'linear-gradient(to right, #3B82F6, #60A3D9)', // Blue to light blue for others
      alignSelf: msg.user === 'user' ? 'flex-end' : 'flex-start',
      color: 'white',
      padding: '8px', // Decreased padding
      borderRadius: '8px',
      fontSize: '0.875rem', // Optional: smaller font size
      wordWrap: 'break-word', // Allow text to wrap within the bounds
      overflowWrap: 'break-word', // Break long words if necessary
    }}
  >
    {msg.text && (
      <div > {/* Ensure white space is preserved and wraps properly */}
        {msg.text.split('\n').map((line, idx) => (
          <div key={idx}>{line}</div>
        ))}
      </div>
    )}
    {msg.files && msg.files.length > 0 && (
      <div className="mt-1"> {/* Reduced margin */}
        {msg.files.map((file, fileIndex) => (
          <div key={fileIndex} className="text-gray-600">
            {file}
          </div>
        ))}
      </div>
    )}
  </div>
))}


            {loading && (
              <div className="loading-indicator mb-2 p-2 rounded max-w-lg bg-gray-200 text-black">
                <span>Loading</span>
                <span className="animate-pulse">...</span>
              </div>
            )}
          </div>
        </div>
        </div>
    


        {/* Frequently Asked Questions Section */}
        <div className={`transition-all duration-300 ease-in-out ${isSidebarOpen ? 'lg:mr-64' : ''} mt-40`} >
          {messages.length === 0 && (
            <div className={`flex flex-wrap gap-4 justify-center items-center max-w-3xl mx-auto p-4`}>
              <h2 className="w-full text-lg text-gray-400 text-center">Frequently Asked Questions:</h2>
              {faqQuestions.map((question, index) => (
                <div key={index} className="bg-gradient-to-r from-red-500 to-orange-500 rounded-full p-2 shadow flex-shrink-0" >
                  <p className="text-white font-medium">{question}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    

      {/* File Preview Section */}
      <div className="mt-4">
        {uploadedFiles.length > 0 && (
          <div className="flex flex-wrap gap-4">
            {uploadedFiles.map((file, index) => (
              <div key={index} className="flex items-center">
                {file.type.startsWith('image/') ? (
                  <img src={URL.createObjectURL(file)} alt={file.name} className="w-20 h-20 object-cover rounded" />
                ) : (
                  <div className="bg-gray-200 p-2 rounded">{file.name}</div>
                )}
                <button
                  className="ml-2 text-red-500"
                  onClick={() => handleRemoveFile(file)}
                >
                  x
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className={`border-t border-gray-400 mt-4 pt-4 flex flex-col relative transition-all duration-300 ease-in-out ${isSidebarOpen ? 'lg:mr-64' : ''}`} style={{ height: '20%' }}>
        <div className="flex items-center space-x-4 mb-2">
          <FaImage className="w-5 h-5 text-gray-600 cursor-pointer" onClick={handleAddDocument} />
          <FaPaperclip className="w-5 h-5 text-gray-600 cursor-pointer" onClick={handleAddDocument} />
          <FaMicrophone className="w-5 h-5 text-gray-700 cursor-pointer" onClick={handleStartRecording} />
        </div>
        <textarea
          className="w-full text-white mb-2 p-2 pt-4 resize-none bg-black focus:outline-none pe-24"
          placeholder="Type your message here..."
          rows="3"
          value={query}
          onFocus={() => setIsFocused(true)}
          onBlur={() => !query && setIsFocused(false)}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault(); // Prevents adding a new line
              handleSendMessage(); // Call your function to send the message
            }
          }}
        />

    

  <div className="flex items-center justify-end space-x-2 absolute bottom-1 right-5">
    <div
      className="bg-gradient-to-r from-red-500 to-orange-500 w-10 h-10 flex items-center justify-center  rounded cursor-pointer transition-colors duration-300"
      onClick={handleSaveSession}
    >
      <RectangleStackIcon className="w-6 h-6 text-white" />
    </div>
    <button
      className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-4 py-2 rounded hover:bg-[#365BB2]"
      type="submit"
      onClick={handleSendMessage}
    >
      Send
    </button>
  </div>
</div>

      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
        multiple // Allow multiple file selection
      />
    </div>
  );
};

export default MainBody;




