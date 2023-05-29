import { useState, useEffect } from "react";
import startSound from "../assets/see-onstart.mp3";
import endSound from "../assets/see-onend.mp3";
import useSound from "use-sound";

const AudioPlayer = ({
    active
}) => {

    const [startAudio, setStartAudio] = useState();
    const [endAudio, setEndAudio] = useState();

    const [playStart] = useSound(startSound);
    const [playEnd] = useSound(endSound);

    useEffect(() => {

        const handleAudio = async() => {
            if (active) {
                playStart();
            } else {
                playEnd();
            }
        }

        handleAudio();


    }, [active])
}

export default AudioPlayer;