import React, { useState, useEffect } from 'react';

function BuzzerSettings() {
    const [ObjectDetection, setObjectDetection] = useState(100);
    const [SidewalkDetection, setSidewalkDetection] = useState(100);
    const [isHapticFeedbackToggled, setHapticFeedbackToggle] = useState(
        localStorage.getItem('HapticFeedbackToggled') === 'true');
    
    useEffect(() => {
        // Retrieve the stored value from local storage on component mount
        const volume = localStorage.getItem('SidewalkDetection');
        if (volume) {
            setSidewalkDetection(parseInt(volume));
        }
        const minDistStoredValue = localStorage.getItem('ObjectDetection');
        if (minDistStoredValue) {
            setObjectDetection(parseInt(minDistStoredValue));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('HapticFeedbackToggled', isHapticFeedbackToggled);
      }, [isHapticFeedbackToggled]);
    
    const handleSidewalkTrackingChange = (event) => {
        const value = parseInt(event.target.value);
        setSidewalkDetection(value);
        // Store the value in local storage when it changes
        localStorage.setItem('SidewalkDetection', value.toString());
    };

    const handleObjectDetectionChange = (event) => {
        const value = parseInt(event.target.value);
        setObjectDetection(value);
        // Store the value in local storage when it changes
        localStorage.setItem('ObjectDetection', value.toString());
    };

    const handlehapticFeedbackToggle = () => {
        setHapticFeedbackToggle((isHapticFeedbackToggled) => !isHapticFeedbackToggled);
    };
    
    return (
        <div>
        <div>
            <label htmlFor="ObjectDetection">Haptic Feedback Buzzers for Sidewalk Tracking</label>
            <input
                type="range"
                id="ObjectDetection"
                min={0}
                max={100}
                value={ObjectDetection}
                onChange={handleObjectDetectionChange}
            />
            <span>{ObjectDetection}</span>
            </div>
            <div>
            <label htmlFor="SidewalkTracking">Haptic Feedback Buzzers for Object Detection</label>
            <input
                type="range"
                id="SidewalkTracking"
                min={0}
                max={100}
                value={SidewalkDetection}
                onChange={handleSidewalkTrackingChange}
            />
            <span>{SidewalkDetection}</span>
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
        </div>
    );
}

export default BuzzerSettings;
