import { useEffect } from "react";
import startSound from "../assets/see-onstart.mp3";
import endSound from "../assets/see-onend.mp3";
import useSound from "use-sound";

// audio player that handles playing the speech recognition start/end audio
const AudioPlayer = ({
    active
}) => {
    
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