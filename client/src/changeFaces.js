import React, { useState, useEffect, useRef } from 'react'
import { images, audio_files } from './face_files'
import { useLocation, useNavigate } from "react-router-dom";
import { Carousel } from "react-responsive-carousel";
import { sendYoloRequest } from './utils/seeRequest';
import './changeFaces.css';
import { delay } from './utils/delay';
import { all } from 'axios';
import ReactLoading from 'react-loading';

const ChangeFaces = ({
  socket,
  learnedFaceEvent,
  clearFaceEvent
}) => {

  const navigate = useNavigate(); 

  const [currentIndex, setCurrentIndex] = useState(0)
  const [showOverlay, setShowOverlay] = useState(false)
  const [newFirstName, setFirstName] = useState("")
  const [newLastName, setLastName] = useState("")


  const [learnFaceView, setLearnFaceView] = useState();
  const [learnedFaceName, setLearnedFaceName] = useState("");
  const [learnedFaceImageData, setLearnedFaceImageData] = useState();

  const [allFaces, setAllFaces] = useState([]);

  const canvasRef = useRef();
  // const { images, audio_files} = { images, audio_files} // normally would use api to get images

  // person name is name of file separated by _ --> "jason_statham" --> Jason Stathamf
  const [learnedFaceObj, setLearnedFaceObj] = useState();
  const [isLoadingImages, setIsLoadingImages] = useState(true);

  useEffect(() => {
    
    const getImages = async() => {
      await delay(1000);
      console.log("getting images");
      sendYoloRequest(socket)
      .then(res => {
        setIsLoadingImages(false);
        setAllFaces(res);
      })
      .catch(async(err) => {
        await delay(2000);
        getImages();
      })
    }

    getImages();



  }, [socket])

  useEffect(() => {
    if (learnedFaceEvent) {
      const {faceFrame, callback} = learnedFaceEvent;
      console.log("new face incoming")
      setLearnedFaceObj(learnedFaceEvent);
      setLearnFaceView(true);
      clearFaceEvent();

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


  const getCarouselItems = () => {
    if (allFaces.length > 0) {
      return allFaces.map(face => (
        <div className="carousel-face-container">
          <img className="carousel-face-img" src={`${process.env.REACT_APP_SERVER_URL}/faces/${face}`}></img>
          <p className='carousel-face-name'>{face.substring(face.indexOf("_"), face.indexOf("."))}</p>
        </div>
      ));
    }

  }


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


  const renderCarousel = () => {

    if (allFaces.length > 0) {

      return (
        <>
          <button className="left-gallery-button" onClick={handlePrev}>
          {"\u2190"} {/* Left arrow symbol */}
          </button>
          <div className='carousel-item'>
            <img src={`${process.env.REACT_APP_SERVER_URL}/faces/${allFaces[currentIndex]}`} className="scaled-image" />
            <p className='face-text'>{allFaces[currentIndex].substring(allFaces[currentIndex].indexOf("_") + 1, allFaces[currentIndex].indexOf("."))}</p> 
          </div>

          <button className="right-gallery-button" onClick={handleNext}>
          {"\u2192"} {/* Right arrow symbol */}
          </button>
        </>
      )
    } else {
      return <p>No faces learned yet...</p>
    }
  }

  // Move to prev/next photo
  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? allFaces.length - 1 : prevIndex - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === allFaces.length - 1 ? 0 : prevIndex + 1))
  }

  // When button is pressed do action
  // const handleFaceClick = () => {
  //   const audioElement = document.getElementById(newNameWithoutExtension);
  //   if (audioElement) {
  //     audioElement.play();
  //   }
  //   setShowOverlay(true)
  // }

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
    learnedFaceObj.callback(learnedFaceName, 200);
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

  if (learnFaceView) {
    return(
      <div className='learn-face-container'>
        <div className='learn-face-header'>
          <p className='learn-face-header-title'>New Face Detected!</p>
        </div>

        <div className='learn-face-body'>
          {learnedFaceObj && <canvas ref={canvasRef} width={learnedFaceObj.faceFrame.width} height={learnedFaceObj.faceFrame.height}></canvas>}
          <input
          type="text"
          value={learnedFaceName}
          onChange={handleLearnedFaceNameChange}
        />
        <button className='' onClick={handleSaveFace}>
          Save Face
        </button>
        </div>
        <div className='padding'></div>
        <div className='padding'></div>
        <div className='padding'></div>

      </div>
    )
  } else {    
    return (
      <div className="gallery">
        <div className="image-container">
          {!isLoadingImages && renderCarousel()}
          {isLoadingImages && <ReactLoading type={"spin"} color={"gray"} height={64} width={64} />
          }
        </div>
        <div className='padding'></div>
    </div>
    
  )}

}

export default ChangeFaces
