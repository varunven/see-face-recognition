import "./SpeechCue.css";
import siri from "../../assets/see-anim.gif";
import { useState, useEffect, useRef } from "react";
import SeeAnimated from "../SeeAnimated/SeeAnimated";

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
            {/* <img className={`anim-sphere-${sphereActive ? 'active' : 'inactive'}`}src={siri}></img> */}
            <div className={`anim-sphere-${sphereActive ? 'active' : 'inactive'}`}>
                <SeeAnimated></SeeAnimated>
            </div>

        </div>
    )


    return null;

}

export default SpeechCue;