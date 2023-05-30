import React, { useState, useEffect } from 'react';
import { useLocation } from "react-router-dom";
import { SeeRequest, sendSeeRequest } from './utils/seeRequest';
import { recognizableObjects } from './constants/recognizableObjects';

function ObjectRecognitionSettings({
  socket,
  onSettingsChange,
  onVoiceCommandError
}) {

  const newVoiceSettings = useLocation().state;


  const [settings, setSettings] = useState({
    isAudioOn: localStorage.getItem('isAudioOn') ? JSON.parse(localStorage.getItem('isAudioOn')) : true,
    volumeControl: localStorage.getItem('volumeControl') ? parseInt(localStorage.getItem('volumeControl')) : 100,
    objsPriority: localStorage.getItem('rowStates') ? JSON.parse(localStorage.getItem('rowStates')) : Array(recognizableObjects.length).fill(0),
    voiceGender: localStorage.getItem('voiceGender') ? localStorage.getItem('voiceGender') : "male",
    audioPlaybackTime: localStorage.getItem('audioPlaybackTime') ? parseInt(localStorage.getItem('audioPlaybackTime')) : 5
  });


  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    onSettingsChange("objectRecognition",
      `Volume for Audio Outputs: ${settings.volumeControl}. 
      Object recognition audio: ${settings.isAudioOn ? `enabled` : `disabled`}.
      Current audio voice: ${settings.voiceGender},
      Objects to recognize: person, car, bicycle, and more. To list all objects, say: list my objects. 
        You can also set priority for different objects. To set priority, say: set priority of object to number
      Audio playback time interval: ${settings.audioPlaybackTime}`);
  }, [settings]);


  useEffect(() => {

    const updateSettings = async() => {
      window.history.replaceState({}, document.title)
      console.log("receiving new settings via voice commands");
      console.log(newVoiceSettings);
      onVoiceCommandError("");
      console.log("Sending settings to pi");
      const {volumeControl = null, isAudioOn = null, voiceGender = null, object = null, newPriority = null, audioPlaybackTime = null} = newVoiceSettings ?? {};
      let newPrios = [];
      if (object) {
        console.log(object);
        newPrios = [...settings.objsPriority];
        newPrios[recognizableObjects.indexOf(object)] = newPriority
      }

      const newSettings = {
        volumeControl: volumeControl ? volumeControl : settings.volumeControl,
        isAudioOn: isAudioOn != null ? isAudioOn : settings.isAudioOn,
        objsPriority: object ? newPrios : getMapOfStates(settings.objsPriority),
        voiceGender: voiceGender ? voiceGender : settings.voiceGender,
        audioPlaybackTime: audioPlaybackTime ? audioPlaybackTime : settings.audioPlaybackTime
      }
    
      console.log(`new setings`);
      console.log(newSettings);
      // submit request to rasp pi first, and only update u.i on successfully changing settings
      await sendSeeRequest(socket, {
        service_name: "object-recognition-settings",
        newSettings: newSettings
      }).then(res => {
          console.log("received response");
          setSettings(newSettings);
          setAllLocalStorageSettings(newSettings);
          }
        )
        .catch((err) => {
          console.log("WHYY");
          onVoiceCommandError("Could not update object recognition settings. Please try again")});
    }

    if (socket.connected) {
      updateSettings();
    } else {
      setTimeout(() => {
        console.log("retrying");
        updateSettings();
      }, 1000);
    }
    
  }, [newVoiceSettings])

  const handleVolumeControl = (event) => {
    console.log(event.target.value);
    const value = event.target.value;
    setSettings(prevSettings => ({
      ...prevSettings,
      volumeControl: value
    }));
    localStorage.setItem('volumeControl', value);
  };

  const handleobjectRecognitionAudioToggled = () => {
      console.log("setting toggle to " + !settings.isAudioOn);
      localStorage.setItem('isAudioOn', !settings.isAudioOn);
      setSettings(prevSettings => ({
        ...prevSettings,
        isAudioOn: !prevSettings.isAudioOn
      }));
  };

  const handleVoiceGenderSelect = (newGender) => {
    setSettings(prevSettings => ({
      ...prevSettings,
      voiceGender: newGender
    }));
    // Store the value in local storage when it changes
    localStorage.setItem('voiceGender', newGender);
  };

  const toggleObjectRecognitionMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleSliderChange = (index, value) => {
    const newRowStates = [...settings.objsPriority];
    newRowStates[index] = value;
    setSettings(prevSettings => ({
      ...prevSettings,
      objsPriority: newRowStates
    }));
    localStorage.setItem('rowStates', JSON.stringify(newRowStates));
  };

  function getMapOfStates(rowStates){
    const my_map = new Map()
    for (let i = 0; i < recognizableObjects.length; i++) {
      if (rowStates[i]) {
        my_map[recognizableObjects[i]] = rowStates[i]
      }
      else {
        my_map[recognizableObjects[i]] = 0 // default priority?
      }
    }
    return my_map
  }

  const handleAudioPlayBack = (event) => {
    const value = event.target.value;
    setSettings(prevSettings => ({
      ...prevSettings,
      audioPlaybackTime: parseInt(value)
    }));
    localStorage.setItem('audioPlaybackTime', value);
  };


  const submitSettingsUpdateRequest = async (newSettings) => {
    console.log("Submitted object recognition settings")
    return await sendSeeRequest(socket, {
      service_name: "object-recognition-settings",
      newSettings: newSettings
    });
  }

  const setAllLocalStorageSettings = (newSettings) => {
    for (let setting in newSettings) {
      localStorage.setItem(setting, newSettings[setting]);
    }
  }
  
  return (
    <div>
      <div>
      <label htmlFor="VolumeControl">Volume for Audio Outputs</label>
        <input
          type="range"
          id="VolumeControl"
          min={0}
          max={100}
          value={settings.volumeControl}
          onChange={handleVolumeControl}
        />
        <span>{settings.VolumeControl}</span>
    </div>

      <div className="objectRecognitionAudioToggled-container">
      <div className="text-container">
        <p>{settings.isAudioOn ? 'Object recognition audio is enabled' : 'Object recognition audio is disabled'}</p>
      </div>
      <label className="switch">
        <input type="checkbox" checked={settings.isAudioOn} onChange={handleobjectRecognitionAudioToggled} />
        <span className="slider"></span>
      </label>
    </div>
          
    <div>
        <p>Current Audio Voice: {settings.voiceGender}</p>
      <div className="switch-container">
        <div
          className={`option ${settings.voiceGender === 'Male' ? 'active' : ''}`}
          onClick={() => handleVoiceGenderSelect('Male')}>
          Male Voice
        </div>
        <div
          className={`option ${settings.voiceGender === 'Female' ? 'active' : ''}`}
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
            {recognizableObjects.map((object, index) => (
              <div key={index} className="row">
                <span className="label">What priority should {object} have?</span>
                <input
                  type="range"
                  min={0}
                  max={10}
                  value={settings.objsPriority[index]}
                  onChange={(event) => handleSliderChange(index, parseInt(event.target.value))}
                />
                <span className="slider-value">{settings.objsPriority[index]}</span>
              </div>
              ))}
            </div>
        </div>
        )}
    </div>
    <div>
        <label>
          How often should the audio playback for objects recognized be relayed?
          <input type="text" value={settings.audioPlaybackTime} onChange={handleAudioPlayBack} />
        </label>
      </div>
      <button onClick={() => submitSettingsUpdateRequest(settings)}>Submit</button>
    </div>
  );
}

export default ObjectRecognitionSettings;