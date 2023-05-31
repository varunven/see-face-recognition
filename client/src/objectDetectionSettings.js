import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { SeeRequest, sendSeeRequest } from './utils/seeRequest';

function ObjectDetectionSettings({
    socket, 
    onSettingsChange,
    onVoiceCommandError,
    learnedFaceEvent
}) {

    const newVoiceSettings = useLocation().state;
    const navigate = useNavigate();

    const [settings, setSettings] = useState({
        isHapticOn: localStorage.getItem('isHapticOn') ? JSON.parse(localStorage.getItem('isHapticOn')) : true,
        nearCutoff: localStorage.getItem('nearCutoff') ? parseInt(localStorage.getItem('nearCutoff')) : 100,
        midCutoff: localStorage.getItem('midCutoff') ? parseInt(localStorage.getItem('midCutoff')) : 200,
        farCutoff: localStorage.getItem('farCutoff') ? parseInt(localStorage.getItem('farCutoff')) : 450
      });

      useEffect(() => {
        if (learnedFaceEvent) {
          navigate('/change-faces');
        }
      }, [learnedFaceEvent]);


    useEffect(() => {
        onSettingsChange("objectDetection",
        `Minimum distances for object detection: 
            close proximity: ${settings.nearCutoff / 100} meters. 
            medium proximity: ${settings.midCutoff / 100} meters. 
            distant proximity ${settings.farCutoff / 100} meters.
        Haptic Feedback: ${settings.isHapticOn ? "enabled" : "disabled"}`)
    }, [settings])


    useEffect(() => {

        const updateSettings = async() => {
          window.history.replaceState({}, document.title)
          console.log("receiving new settings via voice commands");
          console.log(newVoiceSettings);
          onVoiceCommandError("");
          console.log("Sending settings to pi");
          let {nearCutoff = null, midCutoff = null, farCutoff = null, isHapticOn = null} = newVoiceSettings ?? {};
          console.log(nearCutoff);
          console.log(midCutoff);
          console.log(farCutoff);

          if (nearCutoff) {

            if (nearCutoff > 448) {
              nearCutoff = 448;
            }

            if (nearCutoff >= settings.midCutoff) {
              console.log("in");
              midCutoff = Math.ceil((nearCutoff + settings.farCutoff + 1) / 2);
              if (midCutoff == 450) {
                midCutoff--;
              }
              farCutoff = nearCutoff >= settings.farCutoff ? Math.ceil((midCutoff + 1 + 450) / 2) : settings.farCutoff;
              if (midCutoff == 449) {
                farCutoff = 450;
              }
            }
          } else if (midCutoff) {
            if (midCutoff >= settings.farCutoff) {
              farCutoff = midCutoff >= settings.farCutoff ? Math.ceil((settings.midCutoff + 1 + 450) / 2) : settings.farCutoff;
            } else if (midCutoff <= settings.nearCutoff) {
              onVoiceCommandError("Could not set max distance for medium proximity: distance less than threshold of close proximity");
              return;
            }
          } else if (farCutoff) {
            if (farCutoff <= settings.midCutoff) {
              onVoiceCommandError("Could not set max distance for medium proximity: distance less than threshold of close proximity");
              return;
            }
          }
    
          const newSettings = {
            isHapticOn: isHapticOn != null ? isHapticOn : settings.isHapticOn,
            nearCutoff: nearCutoff ? nearCutoff : settings.nearCutoff,
            midCutoff: midCutoff ? midCutoff : settings.midCutoff,
            farCutoff: farCutoff ? farCutoff : settings.farCutoff
          }
        
          console.log(`new setings`);
          console.log(newSettings);
          // submit request to rasp pi first, and only update u.i on successfully changing settings
          await sendSeeRequest(socket, {
            service_name: "object-detection-settings",
            newSettings: newSettings
          }).then(res => {
              console.log("received response");
              setSettings(newSettings);
              setAllLocalStorageSettings(newSettings);
              }
            )
            .catch((err) => {
              onVoiceCommandError("Could not update object detection settings. Please try again")});
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
    

    const handleObjDistanceNearChange = (event) => {
        let newNearValue = parseInt(event.target.value);
        if (newNearValue > 448) {
          newNearValue = 448;
        }
        let newMidValue = newNearValue >= settings.midCutoff ? Math.ceil((settings.midCutoff + settings.farCutoff + 1) / 2) : settings.midCutoff;
        if (newMidValue == 450) {
          newMidValue--;
        }
        let newFarValue = newNearValue >= settings.farCutoff ? Math.ceil((newMidValue + 1 + 450) / 2) : settings.farCutoff;
        if (newMidValue == 449) {
          newFarValue = 450;
        }

        setSettings(prevSettings => ({
            ...prevSettings,
            nearCutoff: newNearValue,
            midCutoff: newMidValue,
            farCutoff: newFarValue
        }));
        // Store the value in local storage when it changes
    };

    const handleObjDistanceMidChange = (event) => {
        let newMidValue = parseInt(event.target.value);
        if (newMidValue <= settings.nearCutoff) {
          newMidValue = settings.nearCutoff + 1;
        } else if (newMidValue == 450) {
          newMidValue = 449;
        }
        const newFarValue = newMidValue >= settings.farCutoff ? Math.ceil((settings.midCutoff + 1 + 450) / 2) : settings.farCutoff;

        setSettings(prevSettings => ({
            ...prevSettings,
            midCutoff: newMidValue,
            farCutoff: newFarValue
        }));
        // Store the value in local storage when it changes
        localStorage.setItem('midCutOff', newMidValue);
        localStorage.setItem('farCutoff', newFarValue);
    };

    const handleObjDistanceFarChange = (event) => {
        let newFarValue = parseInt(event.target.value);
        if (newFarValue <= settings.midCutoff) {
          newFarValue = settings.midCutoff + 1;
        }
        setSettings(prevSettings => ({
            ...prevSettings,
            farCutoff: newFarValue
        }));
        // Store the value in local storage when it changes
        localStorage.setItem('objDetectionDistanceFar', newFarValue);
    };

    const handlehapticFeedbackToggle = () => {
        localStorage.setItem("isHapticOn", settings.isHapticOn);
        setSettings(prevSettings => ({
            ...prevSettings,
            isHapticOn: !prevSettings.isHapticOn
        }));
    };

    const submitSettingsUpdateRequest = async(newSettings) => {
        return await sendSeeRequest(socket, {
          service_name: "object-detection-settings",
          newSettings: newSettings
        });
      }
    
    const handleSubmit = async(newSettings) => {
        console.log("Submitted object detection settings")
        return await submitSettingsUpdateRequest(newSettings);
    };

    const setAllLocalStorageSettings = (newSettings) => {
        for (let setting in newSettings) {
          localStorage.setItem(setting, newSettings[setting]);
        }
      }

    return (
        <div>
        <div>
            <label htmlFor="objDetectionDistanceNear">Maximum Distance for Object Detection (Near)</label>
            <input
                type="range"
                id="objDetectionDistanceNear"
                min={0}
                max={450}
                value={settings.nearCutoff}
                onChange={handleObjDistanceNearChange}
            />
            <span>{settings.nearCutoff}</span>
        </div>
        <div>
            <label htmlFor="objDetectionDistanceMid">Maximum Distance for Object Detection (Middle)</label>
            <input
                type="range"
                id="objDetectionDistanceMid"
                min={0}
                max={450}
                value={settings.midCutoff}
                onChange={handleObjDistanceMidChange}
            />
            <span>{settings.midCutoff}</span>
        </div>
        <div>
            <label htmlFor="objDetectionDistanceFar">Maximum Distance for Object Detection (Far)</label>
            <input
                type="range"
                id="objDetectionDistanceFar"
                min={0}
                max={450}
                value={settings.farCutoff}
                onChange={handleObjDistanceFarChange}
            />
            <span>{settings.farCutoff}</span>
        </div>
            
        <div className="hapticFeedbackToggle-container">
            <div className="text-container">
            <p>{settings.isHapticOn ? 'Haptic feedback is enabled' : 'Haptic feedback is disabled'}</p>
            </div>
            <label className="switch">
            <input type="checkbox" checked={settings.isHapticOn} onChange={handlehapticFeedbackToggle} />
            <span className="slider"></span>
            </label>
        </div>
        <button onClick={async() => {
            await handleSubmit(settings)
                .then(res => {
                  console.log("sucessfully submited and updated settings");
                  setAllLocalStorageSettings(settings);
              })
                .catch(err => {console.log("Could not submit and update settings")});
            }}>Submit</button>
        </div>
    );
}

export default ObjectDetectionSettings;
