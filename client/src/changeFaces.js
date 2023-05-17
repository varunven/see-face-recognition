import React, { useState } from 'react';

function ChangeFaces(user_id) {
  const [images, setImages] = useState([]);

  const handleButtonClick = async () => {
    try {
      const response = await fetch('/getfaces/{user_id}/images'); // Replace with the appropriate API endpoint to fetch the image filenames
      const data = await response.json();
      setImages(data.images);
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };

  return (
    <div>
      <button onClick={handleButtonClick}>Load Images</button>
      <div className="gallery">
        {images.map((image, index) => (
          <img key={index} src={image} alt={`Image ${index}`} />
        ))}
      </div>
    </div>
  );
}

export default ChangeFaces;
