// adjust buzzer number for sidewalk

function handleBuzzerSidewalk(newFeedbackNum) {
    // Process input and return data
    const result = { message: `New haptic feedback for sidewalk is ${newFeedbackNum}` };
    return result;
}

// adjust buzzer number for obj detection
function handleBuzzerObjectDetection(newFeedbackNum) {
    // Process input and return data
    const result = { message: `New haptic feedback for sidewalk is ${newFeedbackNum}` };
    return result;
}

// turn haptic on/off
function handleHapticFeedbackEnable(state) {
    // Process input and return data
    curr_state = "False"
    if (state) {
        curr_state = "True"
    }
    const result = { message: `Haptic feedback is now ${curr_state}` };
    return result;
}

module.exports.handleBuzzerObjectDetection = handleBuzzerObjectDetection;
module.exports.handleBuzzerSidewalk = handleBuzzerSidewalk;
module.exports.handleHapticFeedbackEnable = handleHapticFeedbackEnable;