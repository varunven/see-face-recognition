import './SeeAnimated.css';
import outerGray from '../../assets/gray-nbg.gif';
import innerBlack from '../../assets/black-nbg.gif';

// renders the animated see logo indicator for speech recognition
const SeeAnimated = () => {
  return (
    <div className='animation-container'>
      <img
        src={outerGray}
        alt="gif1"
        className='outer-gray'
      />
      <img
        src={innerBlack}
        alt="gif2"
        className='inner-black'
      />
    </div>
  );
};

export default SeeAnimated;
