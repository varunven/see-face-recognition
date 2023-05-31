import { useState, useEffect, useRef } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { useLocation, useNavigate, useRoutes } from "react-router-dom";
import { SeeRequest, sendSeeRequest } from "../utils/seeRequest";
import { wordToNum, recognizableObjects } from "../constants/recognizableObjects";

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
            command: "change volume to :newVolume",
            callback: (newVolume) => changeObjRecogVolume(newVolume)
        },

        {
            command: "change voice to :gender",
            callback: (gender) => changeVoice(gender)
        },


        {
            command: "set priority of :object to :newPriority",
            callback: (object, newPriority) => changeObjectPriority(object, newPriority)
        },

        {
            command: "set audio playback time to :newAudioInterval",
            callback: (newAudioInterval) => changeAudioPlaybackInterval(newAudioInterval)
        },

        {
            command: "set max distance for :proximity proximity to :newDistance",
            callback: (proximity, newDistance) => changeProximityThresholds(proximity, newDistance)
        },

        {
            command: ":action haptic feedback",
            callback: (action) => handleToggleHapticFeedback(action)
        },


    ]

    const {
        transcript,
        listening,
        isMicrophoneAvailable,
        resetTranscript,
        browserSupportsSpeechRecognition
      } = useSpeechRecognition({ commands });

    
    useEffect(() => {
        let speechRecog;
        console.log(isMicrophoneAvailable);
        const startListening = async() => {
            const x = await SpeechRecognition.startListening({ continuous: true });
            console.log(x);
        }

<<<<<<< HEAD
        speechRecog = startListening();
        changeProximityThresholds("close", 480)
=======
        const x = startListening();
>>>>>>> d6f31125319a1d7e5bd5f20537b97d61d42e2e92

    }, []);

    useEffect(() => {
        if (transcript) {
            console.log(transcript);
            handleOnSpeech();
        }

    }, [transcript]);


    const activateListener = () => {
        setIsListening(true);
    }

    // reads out contents of a page
    const handleReadPage = () => {
        let readText = "";
        if (location == "/") {
            readText = 
            `You are in the home page. 
                Pages: 
                    Home
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
                change volume to [value].
                change voice to male/female.
                list my objects.
                set priority of [object] to [value] (from 1 to 10)
                set audio playback time to [value]
            `
        } else if (commandGroup.includes("detection")) {
            textToSpeak = 
            `
                enable/disable haptic feedback.
                set max distance for close proximity to [value].
                set max distance for medium proximity to [value].
                set max distance for distant proximity to [value].
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
        if (action == 'enable' || action == 'disable') {
            handleSpeak(`Turning audio ${action == "enable" ? "on" : "off"}`);
            navigate("/object-recognition", {
                state: {
                    isAudioOn: action == "enable"
                }
            });
        } else {
            handleSpeak("Say enable or disable haptic feedback to configure haptic feedback");
        }
    }

    const changeObjRecogVolume = (newVolume) => {
        const vol = parseInt(newVolume);
        if (vol >= 0 && vol <= 100) {
            handleSpeak(`Setting volume to ${vol}`);
            navigate("/object-recognition", {
                state: {
                    volumeControl: vol
                }
            });
        } else {
            handleSpeak("Volume must be between 0 and 100");
        }
    }

    const changeVoice = (newGender) => {
        if (newGender == "male" || newGender == "female") {
            handleSpeak(`Changing audio voice to ${newGender}`);
            navigate("/object-recognition", {
                state: {
                    voiceGender: newGender
                }
            });
        } else {
            handleSpeak("Supported text to speech voices are male and female")
        }
    }

    const changeObjRecogMinDist = () => {
        console.log("changing obj recog min distance");
    }

    const changeObjectPriority = (object, newPriority) => {
        const prio = parseNumberFromText(newPriority);
        if (!prio) {

        }
        if (recognizableObjects.includes(object)) {
            if (prio >= 0 && prio <= 10) {
                handleSpeak(`Setting priority of ${object} to ${prio}`);
                navigate("/object-recognition", {
                    state: {
                        object: object,
                        newPriority: prio
                    }
                });
            } else {
                handleSpeak("Priority must be between 0 and 10");
            }
        } else {
            handleSpeak(`${object} is not a recognizable object. For a list of recognizable objects, say: list my objects`);
        }
    }

    const changeAudioPlaybackInterval = (newAudioInterval) => {
        const interval = parseNumberFromText(newAudioInterval);
        if (interval >= 0 && interval <= 30) {
            handleSpeak(`Setting audio playback time to ${newAudioInterval} seconds`);
            navigate("/object-recognition", {
                state: {
                    audioPlaybackTime: interval
                }
            });
        } else {
            handleSpeak("Playback time must be between 0 and 30 seconds");
        }
    }

    const changeProximityThresholds = (proximity, newDistance) => {
        let thresh = parseNumberFromText(newDistance);
        let newState = {

        };

        if (proximity == "close" || proximity == "medium" || proximity == "distant") {
            if (thresh >=0 && thresh <= 450){
              handleSpeak(`Setting minimum distance for ${proximity} proximity to ${thresh}`);
              if (proximity == "close") {
                  newState.nearCutoff = thresh;
              } else if (proximity == "medium") {
                  newState.midCutoff = thresh;
              } else {
                  newState.farCutoff = thresh;
              }
              navigate("/object-detection", {
                  state: newState
              });
            } else {
              handleSpeak("Distances supported are between 0 and 450 cm");
            }

        } else {
            handleSpeak(`Supported proximities are close, medium, and distant.`);
        }
    }

     const handleToggleHapticFeedback = (action) => {
        if (action == 'enable' || action == 'disable') {
            handleSpeak(`Turning haptic feedback ${action == "enable" ? "on" : "off"}`);
            navigate("/object-detection", {
                state: {
                    isHapticOn: action == "enable"
                }
            });
        } else {
            handleSpeak("Say enable or disable haptic feedback to configure haptic feedback");
        }
     }







    // attempts to parse a string to a number
    const parseNumberFromText = (number) => {
        let num = parseInt(number);
        if (!num) {
            num = wordToNum[number.toLowerCase()]
        }
        return num;
    }



    if (!browserSupportsSpeechRecognition) {
        return <p className="error-msg">Browser doesn't support speech recognition</p>
    } else {
        return null;
    }



}

export default SpeechListener;