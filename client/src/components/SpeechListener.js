import { useState, useEffect, useRef } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { useLocation, useNavigate, useRoutes } from "react-router-dom";
import { SeeRequest, sendSeeRequest } from "../utils/seeRequest";

const SpeechListener = ({
    socket,
    handleSpeak,
    handleOnSpeech,
    allPagesText
}) => {

    const [isListening, setIsListening] = useState(false);
    const location = useLocation().pathname;
    const navigate = useNavigate();
    const routes = ['/', '/objectRecognition', '/objectDetection', '/changeFaces', '/forgetFaces', '/viewStream'];

    const commands = [

        {
            command: ["hey see", "hey C", "hey c", "ac", "Casey"],
            matchInterim: true,
            isFuzzyMatch: true,
            callback: () => activateListener()
        },

        {
            command: "read page",
            callback: () => handleReadPage()
        },

        {
            command: "go to *",
            callback: (page) => handleNavigation(page.toLowerCase())
        },

        {
            command: "help *",
            matchInterim: true,
            callback: () => handleTTS()
        },

        {
            command: "learn *",
            callback: (commandGroup) => handleGetCommands(commandGroup.toLowerCase())
        },

        {
            command: ":action audio recognition",
            callback: (action) => handleToggleRecognitionAudio(action)
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

        // return () => {
        //     SpeechRecognition.abortListening();
        // };

    }, []);

    useEffect(() => {
        if (transcript) {
            console.log(transcript);
            handleOnSpeech();
        }

    }, [transcript]);


    const activateListener = () => {
        console.log("Starting to Listen!");
        setIsListening(true);
    }

    // reads out contents of a page
    const handleReadPage = () => {
        let readText = "";
        if (location == "/") {
            readText = 
            `You are in the home page. 
                Pages: 
                    Object Recognition Settings. 
                    Object Detection Settings. 
                    Change Faces. 
                    Forget Faces.
            `
        }
        else if (location == "/object-recognition") {
            readText = allPagesText.objectRecognition;
        } else if (location == "/object-detection") {
            readText = allPagesText.objectDetection
        }
        handleSpeak(readText);
    }

    const handleTTS = () => {
        let textToSpeak = 
        `
        Learn about the different supported commands to personalize your experience. The different command groups are:
        General
        Object Recognition
        Object Detection
        Change Faces
        Forget Faces
        
        To learn a command group, say learn followed by the command group name`;
        handleSpeak(textToSpeak);
    }

    const handleGetCommands = (commandGroup) => {
        let textToSpeak = "";
        if (commandGroup.includes("general")) {
            textToSpeak = 
            `
                read page: Reads out the contents of a page.
                go to page: Redirects you to a specific page.
            `
        } else if (commandGroup.includes("recognition")) {
            textToSpeak = 
            `
                enable/disable recognition audio.
                change recognition audio volume to [value].
                change recognition audio voice to male/female.
                list my objects.
                set priority of [object] to [value] (from 1 to 10)
                set recognition audio playback time interval to [value]
            `
        } else if (commandGroup.includes("detection")) {
            textToSpeak = 
            `
                enable/disable haptic feedback.
                set minimum distance for close proximity to [value].
                set minimum distance for medium proximity to [value].
                set minimum distance for distant proximity to [value].
            `
        }
        handleSpeak(textToSpeak);
    }

    const handleNavigation = (page) => {

        if (page.includes('home')) {
            handleSpeak('Going to home.');
            navigate('/');
        } else if (page.includes('recognition')) {
            handleSpeak('Going to Object Recognition Settings.');
            navigate('/object-recognition');
        } else if (page.includes('detection')) {
            handleSpeak('Going to Object Detection Settings.');
            navigate('/object-detection');
        } else if (page == 'change faces') {
            handleSpeak('Going to Change Faces');
            navigate('/change-faces');
        } else if (page == 'forget faces') {
            handleSpeak('Going to Forget Faces');
            navigate('/forget-faces');
        } else {
            handleSpeak('Page not found');
        }
    }

    const handleToggleRecognitionAudio = async(action) => {
        handleSpeak(`Turning audio ${action == "enable" ? "on" : "off"}`);
        await sendSeeRequest(socket, new SeeRequest("audio-settings", "toggleAudio", action == "enable"))
            .then(res => console.log(res))
            .catch(error => handleSpeak(error));
    }

    const changeObjRecogVolume = () => {
        console.log("changing obj recog volume");
    }

    const changeObjRecogMinDist = () => {
        console.log("changing obj recog min distance");
    }

    const disableObjRecogAudio = () => {

    }

    const changeVoice = () => {

    }



    if (!browserSupportsSpeechRecognition) {
        return <p className="error-msg">Browser doesn't support speech recognition</p>
    } else {
        return null;
    }



}

export default SpeechListener;