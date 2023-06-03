import { useState, useEffect } from "react";
import SpeechListener from "./SpeechListener";
import SpeechSynthesis from "./SpeechSynthesis";
import SpeechCue from "./SpeechCue/SpeechCue";
import AudioPlayer from "./AudioPlayer";

// Spawns a speech listener and speech synthesizer for speech recognition and relays events between them.
const SpeechAssistant = ({
    socket,
    allPagesText,
    voiceError
}) => {

    const [active, setActive] = useState(false);
    const [speechTag, setSpeechTag] = useState(0);
    const [textToSpeak, setTextToSpeak] = useState("");

    const handleOnSpeech = () => {
        setActive(true);
        setSpeechTag(Math.random());
    }

    useEffect(() => {
        if (voiceError) {
            setTextToSpeak(voiceError);
        }
    }, [voiceError])

    return (
        <>
            <SpeechListener socket={socket} handleOnSpeech={handleOnSpeech} allPagesText={allPagesText} handleSpeak={setTextToSpeak}></SpeechListener>
            <SpeechSynthesis active={active} setActive={setActive} textToSpeak={textToSpeak} speechTag={speechTag}></SpeechSynthesis>
            <SpeechCue active={active} speechTag={speechTag}></SpeechCue>
            <AudioPlayer active={active}></AudioPlayer>
        </>
    )
}

export default SpeechAssistant;