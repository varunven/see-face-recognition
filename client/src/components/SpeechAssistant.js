import { useState, useEffect, useRef } from "react";
import SpeechListener from "./SpeechListener";
import SpeechSynthesis from "./SpeechSynthesis";
import SpeechCue from "./SpeechCue/SpeechCue";

const SpeechAssistant = ({
    socket,
    allPagesText
}) => {

    const [active, setActive] = useState(false);
    const [speechTag, setSpeechTag] = useState(0);
    const [textToSpeak, setTextToSpeak] = useState("");

    console.log(active);


    const handleOnSpeech = () => {
        setActive(true);
        setSpeechTag(Math.random());
    }

    return (
        <>
            <SpeechListener socket={socket} handleOnSpeech={handleOnSpeech} allPagesText={allPagesText} handleSpeak={setTextToSpeak}></SpeechListener>
            <SpeechSynthesis active={active} setActive={setActive} textToSpeak={textToSpeak} speechTag={speechTag}></SpeechSynthesis>
            <SpeechCue active={active} speechTag={speechTag}></SpeechCue>
        </>
    )
}

export default SpeechAssistant;