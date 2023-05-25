import React, { useState, useEffect } from 'react';
import face_images from './face_images'

const ChangeFaces = ({socket}) => {

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showOverlay, setShowOverlay] = useState(false);
  const [newFirstName, setFirstName] = useState("");
  const [newLastName, setLastName] = useState("");
  const images = face_images // normally would use api to get images

  // person name is name of file separated by _ --> "jason_statham" --> Jason Statham
  const nameWithoutExtension = images[currentIndex].split(".")[0];
  const newNameWithoutExtension = nameWithoutExtension.replace('/static/media/', '');
  const [firstName, lastName] = newNameWithoutExtension.split("_");

  // Move to prev/next photo
  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
  };

  // When button is pressed do action
  const handleFaceClick = () => {
    setShowOverlay(true);
  };

  const handleSubmit = (firstName, lastName, newFirstName, newLastName) => {
    console.log(images[currentIndex])
    const origFileName = firstName + "_" + lastName + ".png"
    const newFileName = newFirstName + "_" + newLastName + ".png"
    socket.emit('see-request', {
      service_name: "change-faces",
      origFileName: origFileName,
      newFileName: newFileName
     });
    setShowOverlay(false);
  };

  useEffect(() => {
    // Retrieve the stored value from local storage on component mount
    const name = localStorage.getItem(currentIndex);
    if (name) {
      setFirstName(parseInt(name.split(" ")[0]));
      setLastName(parseInt(name.split(" ")[1]));
    }
  }, [currentIndex]);

  return (
    <div className="gallery">
      <div className="image-container">
        <button className="left-gallery-button" onClick={handlePrev}>
          &lt; {/* Left arrow symbol */}
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
              <h2>This person is {firstName} {lastName}. What should they be renamed?</h2>
            <input
              type="text"
              placeholder={firstName}
              value={newFirstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <input
              type="text"
              placeholder={lastName}
              value={newLastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            <button onClick={() => handleSubmit(firstName, lastName, newFirstName, newLastName)}>Submit</button>
          </div>
        </div>
      )}

        <button className="right-gallery-button" onClick={handleNext}>
          &gt; {/* Right arrow symbol */}
        </button>
      </div>
    </div>
  );
};

export default ChangeFaces;
