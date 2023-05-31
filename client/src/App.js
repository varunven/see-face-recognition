import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Link, Route, Routes, useNavigate } from 'react-router-dom';
import { io } from "socket.io-client";

import ForgetFaces from "./forgetFaces"
import ChangeFaces from './changeFaces';
import ObjectDetectionSettings from './objectDetectionSettings';
import ObjectRecognitionSettings from './objectRecognitionSettings';
import ViewStream from './pages/ViewStream';
import SpeechSynthesis from './components/SpeechSynthesis';
import SpeechListener from './components/SpeechListener';
import SpeechAssistant from './components/SpeechAssistant';
import Navbar from './components/Navbar/Navbar';

const server_url = 'https://7f46-2601-602-867f-c8d0-a8b4-eee3-ec61-e127.ngrok-free.app'
// const server_url = 'http://localhost:3001'
const socket = io(server_url, { transports: ['websocket', 'polling', 'flashsocket'] });

function Home({
  learnedFaceEvent
}) {

  const navigate = useNavigate();

  useEffect(() => {
    if (learnedFaceEvent) {
      // console.log("going to faces");
      // navigate('/change-faces');
    }

  }, [learnedFaceEvent]);
  
  return (
    <div
      className="text-logo-container"
      style={{ width: `${373}px`, height: `${360}px` }}
    >
      <div className="white-text">Welcome to S.E.E.</div>
      {/* <SpeechListener></SpeechListener>
      <SpeechSynthesis text={"  Welcome to SEE. To list a page's components, say: read page. For more help, say: help"}></SpeechSynthesis> */}
    </div>
  );
}

function App() {

  const [allPagesText, setAllPagesText] = useState({
    objectRecognition: "",
    objectDetection: "",
  });

  const [learnedFaceObj, setLearnedFaceObj] = useState();
  const [voiceCommandError, setVoiceCommandError] = useState("");

  const onSettingsChange = (page, newSettingsText) => {
    setAllPagesText(prevSettings => ({
      ...prevSettings,
      [page]: newSettingsText
    }));
  }

<<<<<<< HEAD

=======
>>>>>>> d6f31125319a1d7e5bd5f20537b97d61d42e2e92
  useEffect(() => {
    socket.on('connect', () => {
      console.log(`Connected to server, socket = ${socket.id}`);
      socket.emit("react-app-real");

    });

    socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    socket.on('learn-face', (currentFrame, callback) => {
      setLearnedFaceObj({
        faceFrame: currentFrame,
        callback: callback
      });
    });
  }, []);

  

  return (
    <Router>
              <Navbar/>
      <div className="App">
        <div className="Menu">
          <SpeechAssistant socket={socket} allPagesText={allPagesText} voiceError={voiceCommandError}></SpeechAssistant>
          <Link to="/" className="MenuItem">Home</Link>
          <Link to="/object-recognition" className="MenuItem">Object Recognition Settings</Link>
          <Link to="/object-detection" className="MenuItem">Object Detection Settings</Link>
          <Link to="/change-faces" className="MenuItem">Learned Faces</Link>
          <Link to="/forget-faces" className="MenuItem">Forget Faces</Link>
        </div>

        <div>
          <Routes>
<<<<<<< HEAD
            <Route exact path="/" element={<Home learnedFaceEvent={learnedFaceObj}/>} />
            <Route exact path="/object-recognition" element={<ObjectRecognitionSettings socket={socket} onSettingsChange={onSettingsChange} onVoiceCommandError={setVoiceCommandError} learnedFaceEvent={learnedFaceObj}/>} />
            <Route exact path="/object-detection" element={<ObjectDetectionSettings socket={socket} onSettingsChange={onSettingsChange} onVoiceCommandError={setVoiceCommandError} learnedFaceEvent={learnedFaceObj}/>} />
            <Route exact path="/change-faces" element={<ChangeFaces socket={socket} learnedFaceEvent={learnedFaceObj}/>} />
            <Route exact path="/forget-faces" element={<ForgetFaces socket={socket} learnedFaceEvent={learnedFaceObj}/>} />
=======
            <Route exact path="/" element={<Home />} />
            <Route exact path="/object-recognition" element={<ObjectRecognitionSettings socket={socket} onSettingsChange={onSettingsChange} onVoiceCommandError={setVoiceCommandError}/>} />
            <Route exact path="/object-detection" element={<ObjectDetectionSettings socket={socket} onSettingsChange={onSettingsChange} onVoiceCommandError={setVoiceCommandError}/>} />
            <Route exact path="/change-faces" element={<ChangeFaces socket={socket}/>} />
            <Route exact path="/forget-faces" element={<ForgetFaces socket={socket} />} />
>>>>>>> d6f31125319a1d7e5bd5f20537b97d61d42e2e92
            <Route exact path="/viewStream" element={<ViewStream />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
