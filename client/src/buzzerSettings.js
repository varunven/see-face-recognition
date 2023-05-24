import React, { useState, useEffect } from 'react';

function BuzzerSettings({socket}) {
    const [objDetectionDistanceNear, setObjDetectionDistanceNear] = useState(30);
    const [objDetectionDistanceMid, setObjDetectionDistanceMid] = useState(100);
    const [objDetectionDistanceFar, setObjDetectionDistanceFar] = useState(300);
    const [isHapticFeedbackToggled, setHapticFeedbackToggle] = useState(
        localStorage.getItem('HapticFeedbackToggled') === 'true');
    
    useEffect(() => {
        // Retrieve the stored value from local storage on component mount
        const distNear = localStorage.getItem('objDetectionDistanceNear');
        if (distNear) {
            setObjDetectionDistanceNear(parseInt(distNear));
        }
        const distMid = localStorage.getItem('objDetectionDistanceMid');
        if (distMid) {
            setObjDetectionDistanceMid(parseInt(distMid));
        }
        const distFar = localStorage.getItem('objDetectionDistanceFar');
        if (distFar) {
            setObjDetectionDistanceFar(parseInt(distFar));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('HapticFeedbackToggled', isHapticFeedbackToggled);
      }, [isHapticFeedbackToggled]);
    
    const handleObjDistanceNearChange = (event) => {
        const value = parseInt(event.target.value);
        setObjDetectionDistanceNear(value);
        // Store the value in local storage when it changes
        localStorage.setItem('objDetectionDistanceNear', value.toString());
    };

    const handleObjDistanceMidChange = (event) => {
        const value = parseInt(event.target.value);
        setObjDetectionDistanceMid(value);
        // Store the value in local storage when it changes
        localStorage.setItem('objDetectionDistanceMid', value.toString());
    };

    const handleObjDistanceFarChange = (event) => {
        const value = parseInt(event.target.value);
        setObjDetectionDistanceFar(value);
        // Store the value in local storage when it changes
        localStorage.setItem('objDetectionDistanceFar', value.toString());
    };

    const handlehapticFeedbackToggle = () => {
        setHapticFeedbackToggle((isHapticFeedbackToggled) => !isHapticFeedbackToggled);
    };
    
    const handleSubmit = (objDetectionDistanceNear, objDetectionDistanceMid, objDetectionDistanceFar, isHapticFeedbackToggled) => {
        console.log("Submitted buzzer settings")
        socket.emit('see-request', {
            service_name: "buzzer-settings",
            objDetectionDistanceNear: objDetectionDistanceNear,
            objDetectionDistanceMid: objDetectionDistanceMid,
            objDetectionDistanceFar : objDetectionDistanceFar,
            hapticFeedbackState : isHapticFeedbackToggled
        });
    };

    return (
        <div>
        <div>
            <label htmlFor="objDetectionDistanceNear">Minimum Distance for Object Detection (Near)</label>
            <input
                type="range"
                id="objDetectionDistanceNear"
                min={0}
                max={400}
                value={objDetectionDistanceNear}
                onChange={handleObjDistanceNearChange}
            />
            <span>{objDetectionDistanceNear}</span>
        </div>
        <div>
            <label htmlFor="objDetectionDistanceMid">Minimum Distance for Object Detection (Middle)</label>
            <input
                type="range"
                id="objDetectionDistanceMid"
                min={0}
                max={400}
                value={objDetectionDistanceMid}
                onChange={handleObjDistanceMidChange}
            />
            <span>{objDetectionDistanceMid}</span>
        </div>
        <div>
            <label htmlFor="objDetectionDistanceFar">Minimum Distance for Object Detection (Far)</label>
            <input
                type="range"
                id="objDetectionDistanceFar"
                min={0}
                max={400}
                value={objDetectionDistanceFar}
                onChange={handleObjDistanceFarChange}
            />
            <span>{objDetectionDistanceFar}</span>
        </div>
            
        <div className="hapticFeedbackToggle-container">
            <div className="text-container">
            <p>{isHapticFeedbackToggled ? 'Haptic feedback is enabled' : 'Haptic feedback is disabled'}</p>
            </div>
            <label className="switch">
            <input type="checkbox" checked={isHapticFeedbackToggled} onChange={handlehapticFeedbackToggle} />
            <span className="slider"></span>
            </label>
        </div>
        <button onClick={() => handleSubmit(objDetectionDistanceNear, objDetectionDistanceMid, objDetectionDistanceFar, isHapticFeedbackToggled)}>Submit</button>
        </div>
    );
}

export default BuzzerSettings;
