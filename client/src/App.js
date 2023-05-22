import React from 'react';
import './App.css';
import { BrowserRouter as Router, Link, Route, Routes } from 'react-router-dom';
import ForgetFaces from "./forgetFaces"
import ChangeFaces from './changeFaces';
import BuzzerSettings from './buzzerSettings';
import ObjectRecognitionSettings from './objectRecognitionSettings';
import ViewStream from './pages/ViewStream';
import SpeechSynthesis from './components/SpeechSynthesis';
import SpeechListener from './components/SpeechListener';
import SpeechAssistant from './components/SpeechAssistant';

function Home() {

  return (
    <div
      className="text-logo-container"
      style={{ width: `${373}px`, height: `${360}px` }}
    >
      <div className="white-text">Welcome to S.E.E.</div>
      <SpeechAssistant></SpeechAssistant>
      {/* <SpeechListener></SpeechListener>
      <SpeechSynthesis text={"  Welcome to SEE. To list a page's components, say: read page. For more help, say: help"}></SpeechSynthesis> */}
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="App">
        {/* <div className="Menu">
          <Link to="/" className="MenuItem">Home</Link>
          <Link to="/objectrecognition" className="MenuItem">Object Recognition Settings</Link>
          <Link to="/buzzersettings" className="MenuItem">Buzzer Settings</Link>
          <Link to="/changefaces" className="MenuItem">Change Faces</Link>
          <Link to="/forgetfaces" className="MenuItem">Forget Faces</Link>
        </div> */}

        <div>
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route exact path="/objectrecognition" element={<ObjectRecognitionSettings />} />
            <Route exact path="/buzzersettings" element={<BuzzerSettings />} />
            <Route exact path="/changefaces" element={<ChangeFaces />} />
            <Route exact path="/forgetfaces" element={<ForgetFaces />} />
            <Route exact path="/viewStream" element={<ViewStream />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
