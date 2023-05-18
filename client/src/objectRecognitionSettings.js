import React, { useState, useEffect } from 'react';

function ObjectRecognitionSettings() {
    const [VolumeControl, setVolumeControl] = useState(100);
    const [MinimumDistanceForAudio, setMinimumDistanceForAudio] = useState(5);
    const [isObjectRecognitionAudioToggled, setisObjectRecognitionAudioToggled] = useState(
    localStorage.getItem('ObjectRecognitionAudioToggled') === 'true');
    const [menuOpen, setMenuOpen] = useState(false);
    const [rowStates, setRowStates] = useState(Array(10).fill(false));
    const recognizable_objects = ['People', 'Cars', 'Cell phone', 'Laptop', 'TV', 'Traffic light', 'Dog', 'Stop sign', 'Bicycle']
    const [selectedOption, setSelectedOption] = useState('');

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };
    
    const toggleRowState = (index) => {
        const newRowStates = [...rowStates];
        newRowStates[index] = !newRowStates[index];
        setRowStates(newRowStates);
    };

    useEffect(() => {
        // Retrieve the stored value from local storage on component mount
        const volume = localStorage.getItem('VolumeControl');
        if (volume) {
          setVolumeControl(parseInt(volume));
        }
        const minDistStoredValue = localStorage.getItem('MinimumDistanceForAudio');
        if (minDistStoredValue) {
          setMinimumDistanceForAudio(parseInt(minDistStoredValue));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('ObjectRecognitionAudioToggled', isObjectRecognitionAudioToggled);
      }, [isObjectRecognitionAudioToggled]);
    
    const handleVolumeControl = (event) => {
        const value = parseInt(event.target.value);
        setVolumeControl(value);
        // Store the value in local storage when it changes
        localStorage.setItem('VolumeControl', value.toString());
    };

    const handleMinimumDistanceForAudio = (event) => {
        const value = parseInt(event.target.value);
        setMinimumDistanceForAudio(value);
        // Store the value in local storage when it changes
        localStorage.setItem('MinimumDistanceForAudio', value.toString());
    };

    const handleobjectRecognitionAudioToggled = () => {
        setisObjectRecognitionAudioToggled((isObjectRecognitionAudioToggled) => !isObjectRecognitionAudioToggled);
    };
    
    const handleSubmit = () => {
        // Handle form submission here
        console.log('Form submitted!');
    };
    
    const handleOptionClick = (option) => {
        setSelectedOption(option);
    };
    
  return (
    <div>
      <div>
      <label htmlFor="VolumeControl">Volume for Object Recognition Audio Outputs</label>
        <input
          type="range"
          id="VolumeControl"
          min={0}
          max={100}
          value={VolumeControl}
          onChange={handleVolumeControl}
        />
        <span>{VolumeControl}</span>
    </div>
          
    <div>
      <label htmlFor="MinimumDistanceForAudio">Minimum Distance for Recognized Object Audio Queues</label>
        <input
          type="range"
          id="MinimumDistanceForAudio"
          min={0}
          max={5.0}
          value={MinimumDistanceForAudio}
          onChange={handleMinimumDistanceForAudio}
        />
        <span>{MinimumDistanceForAudio}</span>
      </div>

      <div className="objectRecognitionAudioToggled-container">
      <div className="text-container">
        <p>{isObjectRecognitionAudioToggled ? 'Object recognition audio is enabled' : 'Object recognition audio is disabled'}</p>
      </div>
      <label className="switch">
        <input type="checkbox" checked={isObjectRecognitionAudioToggled} onChange={handleobjectRecognitionAudioToggled} />
        <span className="slider"></span>
      </label>
    </div>
          
    <div>
        <p>Current Audio Voice: {selectedOption}</p>
      <div className="switch-container">
        <div
          className={`option ${selectedOption === 'Male' ? 'active' : ''}`}
          onClick={() => handleOptionClick('Male')}
        >
          Male Voice
        </div>
        <div
          className={`option ${selectedOption === 'Female' ? 'active' : ''}`}
          onClick={() => handleOptionClick('Female')}
        >
          Female Voice
        </div>
      </div>
    </div>
          
    <div className="App">
        <button onClick={toggleMenu}>Objects to Recognize</button>
        {menuOpen && (
        <div className="popup-container">
            <div className="menu-content">
            {[...Array(recognizable_objects.length).keys()].map((index) => (
                <div key={index} className="row" onClick={() => toggleRowState(index)}>
                <span className="label">Recognize {recognizable_objects[index]}?</span>
                <div className={`box ${rowStates[index] ? 'green' : 'white'}`} />
                </div>
            ))}
            </div>
        </div>
        )}
    </div>
    <button onClick={handleSubmit}>Update Object Recognition Settings</button>
    </div>
  );
}

export default ObjectRecognitionSettings;
