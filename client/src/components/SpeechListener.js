import { useState, useEffect, useRef } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";


const SpeechListener = ({
    changeVoice
}) => {

    const commands = [
        {
            command: "help",
            callback: () => handleTTS("help")
        },
        
        {
            command: "go to *",
            callback: (page) => handleNav("nav")
        },

        {
            command: "disable voice assistant",
            callback: () => disableTTS()
        },

        {
            command: "change voice to :gender",
            callback: (gender) => changeVoice(gender)
        },

        {
            command: "change object recognition volume",
            callback: () => changeObjRecogVolume()
        },

        {
            command: "change object recognition minimum distance",
            callback: () => changeObjRecogMinDist()
        }


    ]

    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition
      } = useSpeechRecognition({ commands });


    useEffect(() => {
        SpeechRecognition.startListening({ continuous: true });

        return () => {
            SpeechRecognition.abortListening();
        };

    }, []);

    useEffect(() => {
        console.log(`transcript = ${transcript}`);
    }, [transcript]);



    const handleTTS = () => {
        console.log("handling TTS");
    }

    const handleNav = (nav) => {
        console.log("handling NAV");
    }

    const disableTTS = () => {
        console.log("disabling TTS");
    }

    const changeObjRecogVolume = () => {
        console.log("changing obj recog volume");
    }

    const changeObjRecogMinDist = () => {
        console.log("changing obj recog min distance");
    }

    const disableObjRecogAudio = () => {

    }



    if (!browserSupportsSpeechRecognition) {
        return <p className="error-msg">Browser doesn't support speech recognition</p>
    } else {
        return null;
    }



}

export default SpeechListener;