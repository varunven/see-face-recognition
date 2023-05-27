import React, { useState, useEffect } from 'react';

function ObjectRecognitionSettings({socket}) {
  const recognizable_objects = 
    ["person", "bicycle", "car", "motorcycle", "airplane", "bus", "train", "truck", "boat", "traffic light", "fire hydrant", "street sign", "stop sign", "parking meter", "bench", "bird", "cat", "dog", "horse", "sheep", "cow", "elephant", "bear", "zebra", "giraffe", "hat", "backpack", "umbrella", "shoe", "eye glasses", "handbag", "tie", "suitcase", "frisbee", "skis", "snowboard", "sports ball", "kite", "baseball bat", "baseball glove", "skateboard", "surfboard", "tennis racket", "bottle", "plate", "wine glass", "cup", "fork", "knife", "spoon", "bowl", "banana", "apple", "sandwich", "orange", "broccoli", "carrot", "hot dog", "pizza", "donut", "cake", "chair", "couch", "potted plant", "bed", "mirror", "dining table", "window", "desk", "toilet", "door", "tv", "laptop", "mouse", "remote", "keyboard", "cell phone", "microwave", "oven", "toaster", "sink", "refrigerator", "blender", "book", "clock", "vase", "scissors", "teddy bear", "hair drier", "toothbrush", "hair brush"]

  const [VolumeControl, setVolumeControl] = useState(100);
  const [MinimumDistanceForAudio, setMinimumDistanceForAudio] = useState(500);
  const [isObjectRecognitionAudioToggled, setisObjectRecognitionAudioToggled] = useState(
    localStorage.getItem('ObjectRecognitionAudioToggled') === 'true');
  const [menuOpen, setMenuOpen] = useState(false);
  const [rowStates, setRowStates] = useState(Array(recognizable_objects.length).fill(0));
  const [voiceGender, setVoiceGender] = useState('');
  const [audioPlaybackTime, setAudioPlaybackTime] = useState('');
  
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

  // const handleMinimumDistanceForAudio = (event) => {
  //     const value = parseInt(event.target.value);
  //     setMinimumDistanceForAudio(value);
  //     // Store the value in local storage when it changes
  //     localStorage.setItem('MinimumDistanceForAudio', value.toString());
  // };

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

  const handleSliderChange = (index, value) => {
    const newRowStates = [...rowStates];
    newRowStates[index] = value;
    setRowStates(newRowStates);
    localStorage.setItem('rowStates', JSON.stringify(newRowStates));
  };

  function getMapOfStates(rowStates){
    const my_map = new Map()
    for (let i = 0; i < recognizable_objects.length; i++) {
      if (rowStates[i]) {
        my_map[recognizable_objects[i]] = rowStates[i]
      }
      else {
        my_map[recognizable_objects[i]] = 0 // default priority?
      }
    }
    return my_map
  }

  const handleAudioPlayBack = (event) => {
    const value = event.target.value
    setAudioPlaybackTime(value);
    localStorage.setItem('audioPlaybackTime', value);
  };

  const handleSubmit = (newVolume, newDist, audioEnable, objRecognitionVoice, objMap, audioPlaybackTime) => {
    console.log("Submitted object recognition settings")
    socket.emit('see-request', {
      service_name: "object-recognition-settings",
      volume: newVolume,
      dist: newDist,
      audioEnable: audioEnable,
      objRecognitionVoice: objRecognitionVoice,
      objMap: objMap,
      audioPlaybackTime: audioPlaybackTime
    });
  };
  
  return (
    <div>
      <div>
      <label htmlFor="VolumeControl">Volume for Audio Outputs</label>
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
          
    {/* <div>
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
      </div> */}

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
          onClick={() => handleVoiceGenderSelect('Male')}>
          Male Voice
        </div>
        <div
          className={`option ${voiceGender === 'Female' ? 'active' : ''}`}
          onClick={() => handleVoiceGenderSelect('Female')}>
          Female Voice
        </div>
      </div>
    </div>
          
    <div className="ObjectRecognitionMenu">
        <button onClick={toggleObjectRecognitionMenu}>Objects to Recognize</button>
        {menuOpen && (
        <div className="popup-container">
            <div className="menu-content">
            {recognizable_objects.map((object, index) => (
              <div key={index} className="row">
                <span className="label">What priority should {object} have?</span>
                <input
                  type="range"
                  min={0}
                  max={10}
                  value={rowStates[index]}
                  onChange={(event) => handleSliderChange(index, parseInt(event.target.value))}
                />
                <span className="slider-value">{rowStates[index]}</span>
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
        voiceGender, getMapOfStates(rowStates), audioPlaybackTime)}>Submit</button>
    </div>
  );
}

export default ObjectRecognitionSettings;