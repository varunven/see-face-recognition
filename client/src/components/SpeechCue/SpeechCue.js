import "./SpeechCue.css";
import { useState, useEffect, useRef } from "react";
import SeeAnimated from "../SeeAnimated/SeeAnimated";

// controls rendering SeeAnimated and resizing it to make speech recognition more interactive
const SpeechCue = ({
    active,
    speechTag
}) => {

    const [sphereActive, setSphereActive] = useState(false);
    const timeoutIdRef = useRef();

    useEffect(() => {
        clearTimeout(timeoutIdRef.current);
        setSphereActive(true);
        timeoutIdRef.current = setTimeout(() => {
            setSphereActive(false);
        }, 275);
    }, [speechTag]);

    return (
        <div className={speechTag == 0 ? `cue-container` : `cue-container-${active ? 'active' : `inactive`}`}>
            <div className={`anim-sphere-${sphereActive ? 'active' : 'inactive'}`}>
                <SeeAnimated></SeeAnimated>
            </div>

        </div>
    )
}

export default SpeechCue;