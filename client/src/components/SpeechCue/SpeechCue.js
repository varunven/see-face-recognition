import "./SpeechCue.css";
import siri from "../../assets/see-anim.gif"

const SpeechCue = ({
    active,
    speechTag
}) => {

    return (
        <div className={speechTag == 0 ? `cue-container` : `cue-container-${active ? 'active' : `inactive`}`}>
            <img className="anim-sphere" src={siri}></img>
        </div>
    )


    return null;

}

export default SpeechCue;