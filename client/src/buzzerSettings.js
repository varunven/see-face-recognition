import React, { useState } from 'react';

function BuzzerSettings() {
  const [value1, setValue1] = useState(100);
  const [value2, setValue2] = useState(100);
  const [value3, setValue3] = useState(100);
  const [isSwitchOn, setSwitchOn] = useState(false);

  const handleSlider1Change = (event) => {
    setValue1(parseInt(event.target.value));
  };

  const handleSlider2Change = (event) => {
    setValue2(parseInt(event.target.value));
  };

  const handleSwitchChange = () => {
    setSwitchOn(!isSwitchOn);
  };

  const handleSubmit = () => {
    // Handle form submission here
    console.log('Form submitted!');
    console.log('Slider 1:', value1);
    console.log('Slider 2:', value2);
    console.log('Switch:', isSwitchOn);
  };
    
  return (
    <div>
      <div>
        <label htmlFor="slider1">Haptic Feedback Buzzers for Object Detection</label>
        <input
          type="range"
          id="slider1"
          min={0}
          max={100}
          value={value1}
          onChange={handleSlider1Change}
        />
        <span>{value1}</span>
      </div>
      <div>
      <label htmlFor="slider2">Haptic Feedback Buzzers for Sidewalk Tracking</label>
        <input
          type="range"
          id="slider2"
          min={0}
          max={100}
          value={value2}
          onChange={handleSlider2Change}
        />
        <span>{value2}</span>
      </div>
      <div>
        <button
          className={`switch ${isSwitchOn ? 'on' : 'off'}`}
          onClick={handleSwitchChange}
        >
          <span className="knob"></span>
        </button>
        <span>{isSwitchOn ? 'Yes' : 'No'}</span>
      </div>
    <button onClick={handleSubmit}>Update Buzzer Settings</button>
    </div>
  );
}

export default BuzzerSettings;
