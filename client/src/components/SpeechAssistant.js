import { useState, useEffect, useRef } from "react";
import SpeechListener from "./SpeechListener";
import SpeechSynthesis from "./SpeechSynthesis";

const SpeechAssistant = ({
    commands
}) => {

    const changeVoice = (gender) => {
        console.log(gender);
    }


    return (
        <>
            <SpeechListener changeVoice={changeVoice}></SpeechListener>
            <SpeechSynthesis></SpeechSynthesis>
        </>
    )
}

export default SpeechAssistant;