import { useState, useEffect } from "react";

const SpeechSynthesis = ({
    text,
    isPlaying
}) => {

    const [isPaused, setIsPaused] = useState(false);
    const [utterance, setUtterance] = useState(null);
  
    useEffect(() => {
      const synth = window.speechSynthesis;
      const u = new SpeechSynthesisUtterance(text);
      synth.speak(u);
  
      return () => {
        synth.cancel();
      };
    }, [text]);
  
    const handleStop = () => {
      const synth = window.speechSynthesis;
  
      synth.cancel();
  
      setIsPaused(false);
    };
  
    return (
      null
    );
    
}

export default SpeechSynthesis;