import './SeeAnimated.css';
import outerGray from '../../assets/gray-nbg.gif';
import innerBlack from '../../assets/black-nbg.gif';

const SeeAnimated = ({ gif1, gif2 }) => {
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
