import { useEffect, useRef } from "react";

// Configures the app's text to speech. Is called on-command by the 
// speech listener to relay text via audio
const SpeechSynthesis = ({
    active,
    textToSpeak,
    speechTag,
    setActive
}) => {

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
        clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
          setActive(false);
        }, 3000);
      }

    }, [speechTag]);
  
    return (
      null
    );
    
}

export default SpeechSynthesis;