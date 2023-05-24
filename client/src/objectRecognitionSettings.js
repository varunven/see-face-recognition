import React, { useState, useEffect } from 'react';

function ObjectRecognitionSettings({socket}) {

  const [VolumeControl, setVolumeControl] = useState(100);
  const [MinimumDistanceForAudio, setMinimumDistanceForAudio] = useState(500);
  const [isObjectRecognitionAudioToggled, setisObjectRecognitionAudioToggled] = useState(
    localStorage.getItem('ObjectRecognitionAudioToggled') === 'true');
  const [menuOpen, setMenuOpen] = useState(false);
  const [rowStates, setRowStates] = useState(Array(1));
  const [voiceGender, setVoiceGender] = useState('');
  const [audioPlaybackTime, setAudioPlaybackTime] = useState('');
  const recognizable_objects = ['People', 'Cars', 'Cell phone', 'Laptop', 'TV', 'Traffic light', 'Dog', 'Stop sign', 'Bicycle']
  
  // Volume and Distance Slider Controls
  useEffect(() => {
    const volume = localStorage.getItem('VolumeControl');
    if (volume) {
      setVolumeControl(parseInt(volume));
    }
    const minDistStoredValue = localStorage.getItem('MinimumDistanceForAudio');
    if (minDistStoredValue) {
      setMinimumDistanceForAudio(parseInt(minDistStoredValue));
    }
  }, [VolumeControl, MinimumDistanceForAudio]);

  // Object Recognition Audio Toggle and Gender
  useEffect(() => {
    localStorage.setItem('ObjectRecognitionAudioToggled', isObjectRecognitionAudioToggled);
    const gender = localStorage.getItem('VoiceGender');
    if (gender) {
      setVoiceGender(gender);
    }
  }, [isObjectRecognitionAudioToggled, voiceGender]);
  
  // Object Recognition Menu
  useEffect(() => {
    const storedRowStates = localStorage.getItem('rowStates');
    if (storedRowStates) {
      setRowStates(JSON.parse(storedRowStates));
    }
  }, []);

  // Audio Playback Control
  useEffect(() => {
    const storedAudioPlaybackTime= localStorage.getItem('audioPlaybackTime');
    if (storedAudioPlaybackTime) {
      setAudioPlaybackTime(storedAudioPlaybackTime);
    }
  }, [audioPlaybackTime]);

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

  const handleVoiceGenderSelect = (option) => {
    setVoiceGender(option);
    // Store the value in local storage when it changes
    localStorage.setItem('VoiceGender', option);
  };

  const toggleObjectRecognitionMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const toggleObjectRecognitionRowState = (index) => {
    const newRowStates = [...rowStates];
    newRowStates[index] = !newRowStates[index];
    setRowStates(newRowStates);
    localStorage.setItem('rowStates', JSON.stringify(newRowStates));
  };

  const handleAudioPlayBack = (event) => {
    const value = event.target.value
    setAudioPlaybackTime(value);
    localStorage.setItem('audioPlaybackTime', value);
  };

  const handleSubmit = (newVolumeNum, newDist, audioEnable, objRecognitionVoice, newList, audioPlaybackTime) => {
    console.log("Submitted object recognition settings")
    socket.emit('see_request', {
      service_name: "object-recognition-settings",
      newVolumeNum: newVolumeNum,
      newDist: newDist,
      audioEnable: audioEnable,
      objRecognitionVoice: objRecognitionVoice,
      newList: newList,
      audioPlaybackTime: audioPlaybackTime
    });
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
          max={500.0}
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
        <p>Current Audio Voice: {voiceGender}</p>
      <div className="switch-container">
        <div
          className={`option ${voiceGender === 'Male' ? 'active' : ''}`}
          onClick={() => handleVoiceGenderSelect('Male')}
        >
          Male Voice
        </div>
        <div
          className={`option ${voiceGender === 'Female' ? 'active' : ''}`}
          onClick={() => handleVoiceGenderSelect('Female')}
        >
          Female Voice
        </div>
      </div>
    </div>
          
    <div className="ObjectRecognitionMenu">
        <button onClick={toggleObjectRecognitionMenu}>Objects to Recognize</button>
        {menuOpen && (
        <div className="popup-container">
            <div className="menu-content">
            {[...Array(recognizable_objects.length).keys()].map((index) => (
                <div key={index} className="row" onClick={() => toggleObjectRecognitionRowState(index)}>
                <span className="label">Recognize {recognizable_objects[index]}?</span>
                <div className={`box ${rowStates[index] ? 'green' : 'white'}`} />
                </div>
            ))}
            </div>
        </div>
        )}
    </div>
    <div>
        <label>
          How often should the audio playback for objects recognized be relayed?
          <input type="text" value={audioPlaybackTime} onChange={handleAudioPlayBack} />
        </label>
      </div>
      <button onClick={() => handleSubmit(VolumeControl, MinimumDistanceForAudio, isObjectRecognitionAudioToggled,
        voiceGender, audioPlaybackTime, audioPlaybackTime)}>Submit</button>
    </div>
  );
}

export default ObjectRecognitionSettings;