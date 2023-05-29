import React, { useState, useEffect } from 'react';
import { useLocation } from "react-router-dom";
import { SeeRequest, sendSeeRequest } from './utils/seeRequest';

function ObjectDetectionSettings({
    socket, 
    onSettingsChange,
    onVoiceCommandError
}) {

    const newVoiceSettings = useLocation().state;

    const [settings, setSettings] = useState({
        isHapticOn: localStorage.getItem('isHapticOn') ? JSON.parse(localStorage.getItem('isHapticOn')) : true,
        nearCutoff: localStorage.getItem('nearCutoff') ? parseInt(localStorage.getItem('nearCutoff')) : 100,
        midCutoff: localStorage.getItem('midCutoff') ? parseInt(localStorage.getItem('midCutoff')) : 200,
        farCutoff: localStorage.getItem('farCutoff') ? parseInt(localStorage.getItem('farCutoff')) : 450
      });


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
          const {nearCutoff = null, midCutoff = null, farCutoff = null, isHapticOn = null} = newVoiceSettings ?? {};
    
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
              console.log("WHYY");
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
        const newNearValue = parseInt(event.target.value);

        setSettings(prevSettings => ({
            ...prevSettings,
            nearCutoff: newNearValue,
        }));
        // Store the value in local storage when it changes
        localStorage.setItem('nearCutoff', newNearValue);
    };

    const handleObjDistanceMidChange = (event) => {
        const newMidValue = parseInt(event.target.value);

        setSettings(prevSettings => ({
            ...prevSettings,
            midCutoff: newMidValue,
        }));
        // Store the value in local storage when it changes
        localStorage.setItem('midCutOff', newMidValue);
    };

    const handleObjDistanceFarChange = (event) => {
        const newFarValue = parseInt(event.target.value);
        // const newNearValue = value < settings.nearCutoff ? value - 1 : settings.midCutoff;
        // const newFarValue = value > settings.newMidValue ? value + 1 : settings.farCutoff;
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
        // if (objDetectionDistanceNear > objDetectionDistanceMid) {
        //     objDetectionDistanceMid = objDetectionDistanceNear + 1
        //     objDetectionDistanceMid = Math.min(objDetectionDistanceMid, 400)
        //     setObjDetectionDistanceMid(objDetectionDistanceMid);
        // }
        // if (objDetectionDistanceMid > objDetectionDistanceFar) {
        //     objDetectionDistanceFar = objDetectionDistanceMid + 1
        //     objDetectionDistanceFar = Math.min(objDetectionDistanceFar, 400)
        //     setObjDetectionDistanceFar(objDetectionDistanceFar);
        // }
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
            <label htmlFor="objDetectionDistanceNear">Minimum Distance for Object Detection (Near)</label>
            <input
                type="range"
                id="objDetectionDistanceNear"
                min={0}
                max={400}
                value={settings.nearCutoff}
                onChange={handleObjDistanceNearChange}
            />
            <span>{settings.nearCutoff}</span>
        </div>
        <div>
            <label htmlFor="objDetectionDistanceMid">Minimum Distance for Object Detection (Middle)</label>
            <input
                type="range"
                id="objDetectionDistanceMid"
                min={0}
                max={400}
                value={settings.midCutoff}
                onChange={handleObjDistanceMidChange}
            />
            <span>{settings.midCutoff}</span>
        </div>
        <div>
            <label htmlFor="objDetectionDistanceFar">Minimum Distance for Object Detection (Far)</label>
            <input
                type="range"
                id="objDetectionDistanceFar"
                min={0}
                max={400}
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
                .then(res => console.log("sucessfully submited and updated settings"))
                .catch(err => console.log("Could not submit and update settings"));
            }}>Submit</button>
        </div>
    );
}

export default ObjectDetectionSettings;
