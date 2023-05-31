import React, { useState, useEffect, useRef } from 'react'
import { images, audio_files } from './face_files'
import { useLocation, useNavigate } from "react-router-dom";

const ChangeFaces = ({
  socket,
  learnedFaceEvent
}) => {

  const navigate = useNavigate(); 

  const [currentIndex, setCurrentIndex] = useState(0)
  const [showOverlay, setShowOverlay] = useState(false)
  const [newFirstName, setFirstName] = useState("")
  const [newLastName, setLastName] = useState("")


  const [learnFaceView, setLearnFaceView] = useState();
  const [learnedFaceName, setLearnedFaceName] = useState("");
  const [learnedFaceImageData, setLearnedFaceImageData] = useState();
  const canvasRef = useRef();
  // const { images, audio_files} = { images, audio_files} // normally would use api to get images

  // person name is name of file separated by _ --> "jason_statham" --> Jason Statham
  const nameWithoutExtension = images[currentIndex].split(".")[0]
  const newNameWithoutExtension = nameWithoutExtension.replace('/static/media/', '')
  const nameParams = newNameWithoutExtension.split(".")[0]
  const [faceId, firstName, lastName] = nameParams.split("_")

  useEffect(() => {
    console.log("new face incoming");
    if (learnedFaceEvent) {
      setLearnFaceView(true);
      const {faceFrame, callback} = learnedFaceEvent;
      // const canvas = canvasRef.current;
      // const context = canvas.getContext('2d');

      const i420Data = faceFrame.data;
      const width = faceFrame.width;
      const height = faceFrame.height;
      const imageData = i420ToCanvas(new Uint8Array(i420Data), width, height);
      console.log("setting new imagedata");
      setLearnedFaceImageData(imageData);

    }
  }, [learnedFaceEvent])

  useEffect(() => {
    if (learnFaceView) {
      console.log("putting into image");
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      context.putImageData(learnedFaceImageData, 0, 0);
    }
  }, [learnFaceView, learnedFaceImageData])


  function i420ToCanvas(data, width, height) {
    // Convert I420 (YUV420p) to RGB
    const ySize = width * height;
    const uvSize = (width / 2) * (height / 2);
    const yPlane = data.subarray(0, ySize);
    const uPlane = data.subarray(ySize, ySize + uvSize);
    const vPlane = data.subarray(ySize + uvSize, ySize + 2 * uvSize);

    const rgbData = new Uint8Array(width * height * 4); // We need 4 channels for ImageData
    let indexY = 0;
    let indexUV = 0;
    let indexRGB = 0;

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const Y = yPlane[indexY++];
            const U = uPlane[indexUV];
            const V = vPlane[indexUV];

            const C = Y - 16;
            const D = U - 128;
            const E = V - 128;

            rgbData[indexRGB++] = Math.min(255, Math.max(0, (298 * C + 409 * E + 128) >> 8));
            rgbData[indexRGB++] = Math.min(255, Math.max(0, (298 * C - 100 * D - 208 * E + 128) >> 8));
            rgbData[indexRGB++] = Math.min(255, Math.max(0, (298 * C + 516 * D + 128) >> 8));
            rgbData[indexRGB++] = 255; // Add an alpha channel with full opacity

            if (x % 2 === 1) {
                indexUV++;
            }
        }

        if (y % 2 === 0) {
            indexUV -= width / 2;
        }
    }

    const clampedRgbData = new Uint8ClampedArray(rgbData.buffer);

    // Create a canvas and draw the RGB data onto it
    const imageData = new ImageData(clampedRgbData, width, height);
    return imageData;
}


  // Move to prev/next photo
  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1))
  }

  // When button is pressed do action
  const handleFaceClick = () => {
    const audioElement = document.getElementById(newNameWithoutExtension);
    if (audioElement) {
      audioElement.play();
    }
    setShowOverlay(true)
  }

  const handleSubmit = (faceId, newFirstName, newLastName) => {
    console.log("Sent submission change request")

    socket.emit('see-request', {
      service_name: "change-faces",
      faceId: faceId,
      newFirstName: newFirstName,
      newLastName: newLastName
     })
    setShowOverlay(false)
  }

  const handleLearnedFaceNameChange = (e) => {
    setLearnedFaceName(e.target.value);
  }

  const handleSaveFace = () => {
    learnedFaceEvent.callback(learnedFaceName, 200);
    setLearnFaceView(false);
    navigate('/');
  }

  useEffect(() => {
    // Retrieve the stored value from local storage on component mount
    const name = localStorage.getItem(currentIndex)
    if (name) {
      setFirstName(parseInt(name.split(" ")[0]))
      setLastName(parseInt(name.split(" ")[1]))
    }
  }, [currentIndex])

<<<<<<< HEAD
  if (learnFaceView) {
    return(
      <div className='learn-face-container'>
        <div className='learn-face-header'>
          <p className='learn-face-header-title'>New Face Detected!</p>
        </div>

        <div className='learn-face-body'>
          <canvas ref={canvasRef} width={learnedFaceEvent.faceFrame.width} height={learnedFaceEvent.faceFrame.height}></canvas>
          <input
          type="text"
          value={learnedFaceName}
          onChange={handleLearnedFaceNameChange}
        />
        <button onClick={handleSaveFace}>
          Save Face
=======
  //TODO on raspi:
  // Send face id through socket to server
  // socket.emit('add-face', faceid) when learn face is pressed

  //TODO on server:
  // io.on('connection', (socket) => {
  //   socket.on('add-face', ( imageurl) => { (to web client)   
  //   io.emit('add-face', { firstname, lastname }); (back to pi)
    //  save the img with face id at the time as firstname_lastname_faceid.png
  //   });
  // });

  //TODO on web client side:
  // socket.on('add-face', (imageurl) => {
  //   get a pop up of image, say this is face id --> what should their name be?
  //  send back faceid, firstname, lastname
  // });

  //TODO on server: do the inbetween
  
  // have get all images to show all learned faces with their names
  return (
    <div className="gallery">
      <div className="image-container">
        <button className="left-gallery-button" onClick={handlePrev}>
        {"\u2190"} {/* Left arrow symbol */}
>>>>>>> d6f31125319a1d7e5bd5f20537b97d61d42e2e92
        </button>
          
        </div>
<<<<<<< HEAD

      </div>
    )
  } else {    
    return (
      <div className="gallery">
        <div className="image-container">
          <button className="left-gallery-button" onClick={handlePrev}>
          {"\u2190"} {/* Left arrow symbol */}
          </button>
          <img src={images[currentIndex]} alt={`Photo ${firstName} ${lastName}`} className="scaled-image" />
          <div className="button-container">
            <button className="face-button" onClick={handleFaceClick}>
              Would you like to assign a name to this person?
            </button>
          </div>
          {showOverlay && (
          <div className="overlay">
            <div className="overlay-content">
                <h2>What should this person be renamed?</h2>
              <input
                type="text"
                value={newFirstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <input
                type="text"
                value={newLastName}
                onChange={(e) => setLastName(e.target.value)}
              />
              <button onClick={() => handleSubmit(newNameWithoutExtension, newFirstName, newLastName)}>Submit</button>
            </div>
=======
        {showOverlay && (
        <div className="overlay">
          <div className="overlay-content">
              <h2>What should this person be renamed?</h2>
            <input
              type="text"
              value={newFirstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <input
              type="text"
              value={newLastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            <button onClick={() => handleSubmit(faceId, newFirstName, newLastName)}>Submit</button>
>>>>>>> d6f31125319a1d7e5bd5f20537b97d61d42e2e92
          </div>
        )}

        <button className="right-gallery-button" onClick={handleNext}>
        {"\u2192"} {/* Right arrow symbol */}
        </button>

        {/* {learnedFaceEvent && <canvas ref={canvasRef} width={learnedFaceEvent.faceFrame.width} height={learnedFaceEvent.faceFrame.height}></canvas>} */}

      </div>
    </div>
    
  )}
    return (
      <div className="gallery">
        <div className="image-container">
          <button className="left-gallery-button" onClick={handlePrev}>
          {"\u2190"} {/* Left arrow symbol */}
          </button>
          <img src={images[currentIndex]} alt={`Photo ${firstName} ${lastName}`} className="scaled-image" />
          <div className="button-container">
            <button className="face-button" onClick={handleFaceClick}>
              Would you like to assign a name to this person?
            </button>
          </div>
          {showOverlay && (
          <div className="overlay">
            <div className="overlay-content">
                <h2>What should this person be renamed?</h2>
              <input
                type="text"
                value={newFirstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <input
                type="text"
                value={newLastName}
                onChange={(e) => setLastName(e.target.value)}
              />
              <button onClick={() => handleSubmit(newNameWithoutExtension, newFirstName, newLastName)}>Submit</button>
            </div>
          </div>
          )}
  
          <button className="right-gallery-button" onClick={handleNext}>
          {"\u2192"} {/* Right arrow symbol */}
          </button>
  
          {/* {learnedFaceEvent && <canvas ref={canvasRef} width={learnedFaceEvent.faceFrame.width} height={learnedFaceEvent.faceFrame.height}></canvas>} */}
  
        </div>
      </div>
      
    )

}

export default ChangeFaces
