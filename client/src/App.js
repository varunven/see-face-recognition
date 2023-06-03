import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import { io } from "socket.io-client";
import LearnedFaces from './pages/LearnedFaces';
import ObjectDetectionSettings from './pages/ObjectDetectionSettings';
import ObjectRecognitionSettings from './pages/ObjectRecognitionSettings';
import ViewStream from './pages/ViewStream';
import SpeechAssistant from './components/SpeechAssistant';
import Navbar from './components/Navbar/Navbar';
import logo from "./assets/logo.png";

const server_url = process.env.REACT_APP_SERVER_URL;
const socket = io(server_url, { transports: ['websocket', 'polling', 'flashsocket'] });

// renders the home screen
function Home({
  learnedFaceEvent
}) {

  const navigate = useNavigate();

  useEffect(() => {
    if (learnedFaceEvent) {
      navigate('/learned-faces');
    }

  }, [learnedFaceEvent]);
  
  return (
    <div
      className="text-logo-container"
    >
      <div className='main-container'>
        <img className='main-logo' src={logo}></img>
        <p className='main-sub'>Welcome to SEE. Configure you device settings here. For more help, say help.</p>
      </div>
    </div>
  );
}

// top-level component. Renders all components in the web app
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

  const handleClearEvent = () => {
    setLearnedFaceObj(null);
  }

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
        <div className='all'>
          <Routes>
            <Route exact path="/" element={<Home  learnedFaceEvent={learnedFaceObj}/>} />
            <Route exact path="/object-recognition" element={<ObjectRecognitionSettings socket={socket} onSettingsChange={onSettingsChange} onVoiceCommandError={setVoiceCommandError}  learnedFaceEvent={learnedFaceObj}/>} />
            <Route exact path="/object-detection" element={<ObjectDetectionSettings socket={socket} onSettingsChange={onSettingsChange} onVoiceCommandError={setVoiceCommandError}  learnedFaceEvent={learnedFaceObj}/>} />
            <Route exact path="/learned-faces" element={<LearnedFaces socket={socket} learnedFaceEvent={learnedFaceObj} clearFaceEvent={handleClearEvent} onVoiceCommandError={setVoiceCommandError}/>} />
            <Route exact path="/view-stream" element={<ViewStream socket={socket} learnedFaceEvent={learnedFaceObj}/>} />
          </Routes>
        </div>
        <SpeechAssistant socket={socket} allPagesText={allPagesText} voiceError={voiceCommandError}></SpeechAssistant>
      </div>
    </Router>
  );
}

export default App;
