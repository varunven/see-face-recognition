import React, { styled, useState } from 'react';
import './App.css';
import { useNavigate } from "react-router-dom";
import { BrowserRouter as Router, Link, Route, Routes } from 'react-router-dom';
import ForgetFaces from "./forgetFaces"
import ChangeFaces from './changeFaces';
import BuzzerSettings from './buzzerSettings';

// function App() {
//   const [currentPage, setCurrentPage] = useState(1);

//   const goToChangeFaces = () => {
//     setCurrentPage(2);
//   };

//   const goToForgetFaces = () => {
//     setCurrentPage(3);
//   };

//   const goToBuzzerSettings = () => {
//     setCurrentPage(4);
//   };

//   const goToObjectRecognition = () => {
//     setCurrentPage(5);
//   };

//   const returnToSettings = () => {
//     setCurrentPage(1);
//   };

//   return (
//     <div className="App">
//       {currentPage === 1 && (
//         <div className="page">
//           <h1>Settings Page</h1>
//           <ul>
//           <li>
//               <button onClick={goToChangeFaces}>Change Faces</button>
//             </li>
//           <li>
//               <button onClick={goToForgetFaces}>Forget Faces</button>
//           </li>
//           <li>
//             <button onClick={goToBuzzerSettings}>Buzzer Settings</button>
//           </li>
//           <li>
//             <button onClick={goToObjectRecognition}>Object Recognition</button>
//           </li>
//           </ul>
//         </div>
//       )}
//       {currentPage === 2 && (
//         <div className="page">
//           <h1>Select the image of the person whose face you would like to change</h1>
//           <button onClick={returnToSettings}>Go to Settings</button>
//         </div>
//       )}
//       {currentPage === 3 && (
//         <div className="page">
//           <h1>Would you like to forget all faces?</h1>
//           <button onClick={returnToSettings}>Go to Settings</button>
//         </div>
//       )}
//       {currentPage === 4 && (
//         <div className="page">
//           <h1>Adjust Buzzer Settings</h1>
//           <button onClick={returnToSettings}>Go to Settings</button>
//         </div>
//       )}
//       {currentPage === 5 && (
//         <div className="page">
//           <h1>Adjust Object Recognition Settings</h1>
//           <button onClick={returnToSettings}>Go to Settings</button>
//         </div>
//       )}
//     </div>
//   );
// }

function Home() {
  return <h1>Welcome to the Home Page</h1>;
}

function App() {
  return (
    <Router>
      <div className="App">
        <div className="Menu">
          <Link to="/" className="MenuItem">Home</Link>
          <Link to="/objectrecognition" className="MenuItem">Object Recognition Settings</Link>
          <Link to="/buzzersettings" className="MenuItem">Buzzer Settings</Link>
          <Link to="/services" className="MenuItem">Change Faces</Link>
          <Link to="/forgetfaces" className="MenuItem">Forget Faces</Link>
        </div>

        <div className="Content">
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route exact path="/objectrecognition" element={<ObjectRecognitionSettings />} />
            <Route exact path="/buzzersettings" element={<BuzzerSettings />} />
            <Route exact path="/changefaces" element={<ChangeFaces />} />
            <Route exact path="/forgetfaces" element={<ForgetFaces />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
