import React, { useState, useEffect } from 'react'
import { images, audio_files } from './face_files'

const ChangeFaces = ({socket}) => {

  const [currentIndex, setCurrentIndex] = useState(0)
  const [showOverlay, setShowOverlay] = useState(false)
  const [newFirstName, setFirstName] = useState("")
  const [newLastName, setLastName] = useState("")
  // const { images, audio_files} = { images, audio_files} // normally would use api to get images

  // person name is name of file separated by _ --> "jason_statham" --> Jason Statham
  const nameWithoutExtension = images[currentIndex].split(".")[0]
  const newNameWithoutExtension = nameWithoutExtension.replace('/static/media/', '')
  const nameParams = newNameWithoutExtension.split(".")[0]
  const [faceId, firstName, lastName] = nameParams.split("_")

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

  useEffect(() => {
    // Retrieve the stored value from local storage on component mount
    const name = localStorage.getItem(currentIndex)
    if (name) {
      setFirstName(parseInt(name.split(" ")[0]))
      setLastName(parseInt(name.split(" ")[1]))
    }
  }, [currentIndex])

  //TODO on raspi:
  // Send array of image data through socket
  // for image_path in file_folder:
    // with open(image_path, 'rb') as file:
    //     image_data = file.read()
  //      arr.append((faceId, firstName, lastName, image_data))
  // socket.emit('add-face', arr)

  //TODO on server:
  // io.on('connection', (socket) => {
  //   socket.on('add-face', (fileaudio, faceId, imageData) => {    
  //   io.emit('image-data', { fileaudio, faceId, imageData});
  //   });
  // });

  //TODO on client side:
  // socket.on('add-face', (data) => {
  //   const { fileaudio, faceId, imageUrl } = data;
  //   display arr imagedata and if pressed, then play fileaudio
  // });

  //TODO on server: do the inbetween
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
            <button onClick={() => handleSubmit(faceId, newFirstName, newLastName)}>Submit</button>
          </div>
        </div>
        )}

        <button className="right-gallery-button" onClick={handleNext}>
        {"\u2192"} {/* Right arrow symbol */}
        </button>
      </div>
    </div>
  )
}

export default ChangeFaces
