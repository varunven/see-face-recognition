import { useState, useEffect, useRef } from "react";

const SpeechSynthesis = ({
    active,
    textToSpeak,
    speechTag,
    setActive
}) => {

    const [isPaused, setIsPaused] = useState(false);
    const [utterance, setUtterance] = useState(null);
    const timeoutRef = useRef();
  
    useEffect(() => {
      const synth = window.speechSynthesis;
      if (textToSpeak) {

        const u = new SpeechSynthesisUtterance(textToSpeak);
        u.onstart = () => {
          clearTimeout(timeoutRef.current);
          setActive(true);
        }
  
        u.onend = () => {
          console.log("setting timeout...");
          timeoutRef.current = setTimeout(() => {
            setActive(false);
          }, 3000);
        }
  
        synth.speak(u);
      }

  
      return () => {
        synth.cancel();
      };
    }, [textToSpeak]);

    useEffect(() => {
      if (active) {
        console.log("keeping it alive");
        clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
          setActive(false);
        }, 3000);
      }

    }, [speechTag])
  
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