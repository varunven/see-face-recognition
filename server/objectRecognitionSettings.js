// adjust volume for obj recognition audio

function handleObjRecognitionVolume(newVolumeNum) {
  const result = { message: `New object recognition volume is ${newVolumeNum}` };
  return result;
}

// minimum distnace in M for object recognition
function handleObjRecognitionMinDist(newDist) {
  const result = { message: `New object recognition minimum distance is ${newDist}` };
  return result;
}

// turn obj recognition on/off
function handleObjRecognitionAudioEnable(state) {
  curr_state = "Off"
  if (state) {
      curr_state = "On"
  }
  const result = { message: `Object recognition audio is now ${curr_state}` };
  return result;
}

// turn obj recognition male/female
function handleObjRecognitionVoice(state) {
  const result = { message: `Object recognition voice is now set to ${state}` };
  return result;
}

// control enabled objects
function handleObjRecognitionList(newList) {
  if (!Array.isArray(newList)) {
    return { message: `The provided input is not a list` }
  }
  if (newList.length == 0) {
    return { message: `The provided list is empty` }
  }
  for (var i = 0; i < newList.length; i++) {
    console.log(newList[i]);
  }
  const result = { message: `The list has been updated` };
  return result;
}

// Playback Sound Time
function handleAudioPlayBack(seconds) {
  const result = { message: `Object recognition audio will play every ${seconds} seconds` };
  return result;
}

module.exports.handleObjRecognitionVolume = handleObjRecognitionVolume;
module.exports.handleObjRecognitionMinDist = handleObjRecognitionMinDist;
module.exports.handleObjRecognitionAudioEnable = handleObjRecognitionAudioEnable;
module.exports.handleObjRecognitionVoice = handleObjRecognitionVoice;
module.exports.handleObjRecognitionList = handleObjRecognitionList;
module.exports.handleAudioPlayBack = handleAudioPlayBack;