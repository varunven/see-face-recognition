import socketio
import time

socket = socketio.Client()

# connect/disconnect


@socket.event
def connect():
    print('Connected to server')


@socket.event
def disconnect():
    print('Disconnected from server')

# Forget Face


@socket.on('forgetFaceResponse')
def handle_forget_face_Response(Response):
    print('Received forgetFaceResponse:', Response['message'])

# Change Faces


@socket.on('changeFacesResponse')
def handle_change_faces_assigned(Response):
    print('Received changeFaces:', Response['message'])

# Object Recognition Volume


@socket.on('objRecognitionVolumeResponse')
def handle_buzzer_object_detection_volume_Response(Response):
    print('Received objRecognitionVolumeResponse:', Response['message'])

# Object Recognition Min Dist


@socket.on('objRecognitionMinDistResponse')
def handle_obj_recognition_min_dist_Response(Response):
    print('Received objRecognitionMinDistResponse:', Response['message'])

# Object Recognition Audio Enable


@socket.on('objRecognitionAudioEnableResponse')
def handle_obj_recognition_audio_enable_Response(Response):
    print('Received objRecognitionAudioEnableResponse:', Response['message'])

# Object Recognition Voice


@socket.on('objRecognitionVoiceResponse')
def handle_obj_recognition_voice_Response(Response):
    print('Received objRecognitionVoiceResponse:', Response['message'])

# Object Recognition List


@socket.on('objRecognitionListResponse')
def handle_obj_recognition_list_Response(Response):
    print('Received objRecognitionListResponse:', Response['message'])

# Buzzer Sidewalk


@socket.on('buzzerSidewalkResponse')
def handle_buzzer_sidewalk_Response(Response):
    print('Received buzzerSidewalkResponse:', Response['message'])

# Buzzer Object Detection


@socket.on('buzzerObjectDetectionResponse')
def handle_buzzer_object_detection_Response(Response):
    print('Received buzzerObjectDetectionResponse:', Response['message'])

# Buzzer Enable


@socket.on('hapticFeedbackEnableResponse')
def handle_haptic_feedback_enable_Response(Response):
    print('Received hapticFeedbackEnableResponse:', Response['message'])

# Audio Playback Time


@socket.on('audioPlayBackResponse')
def handle_audio_playback_Response(Response):
    print('Received audioPlayBackResponse:', Response['message'])


# Connect to the server
socket.connect('http://localhost:3001')
# Forget Face
forgetFaceInput = {
    'input': True
}
socket.emit('forgetFace', forgetFaceInput)

# Change Face
handlechangeFacesInput = {
    'origFileName': 'Bob',
    'newFileName': 'Jones'
}
socket.emit('changeFaces', handlechangeFacesInput)

# Object Recognition Volume
setObjRecognitionVolumeInput = {
    'newVolumeNum': 83,
}
socket.emit('setObjRecognitionVolume', setObjRecognitionVolumeInput)

# Object Recognition Min Dist
setObjRecognitionMinDistInput = {
    'newDist': 300
}
socket.emit('setObjRecognitionMinDist', setObjRecognitionMinDistInput)

# Object Recognition Audio Enable
setObjRecognitionAudioEnableInput = {
    'state': True
}
socket.emit('setObjRecognitionAudioEnable', setObjRecognitionAudioEnableInput)

# Object Recognition Audio Gender
setObjRecognitionVoiceInput = {
    'state': "Male"
}
socket.emit('setObjRecognitionVoice', setObjRecognitionVoiceInput)

# Object Recognition List
new_list = [True, False, True, False]  # Example list of item states
setObjRecognitionListInput = {
    'newList': new_list
}
socket.emit('setObjRecognitionList', setObjRecognitionListInput)

# Buzzer Settings Sidewalk
setBuzzerSidewalkInput = {
    'newFeedbackNum': 36,
}
socket.emit('setBuzzerSidewalk', setBuzzerSidewalkInput)

# Buzzer Settings Object Detection
setBuzzerObjectDetectionInput = {
    'newFeedbackNum': 83,
}
socket.emit('setBuzzerObjectDetection',
            setBuzzerObjectDetectionInput)

# Haptic Feedback Enable
setHapticFeedbackEnableInput = {
    'state': True
}
socket.emit('setHapticFeedbackEnable', setHapticFeedbackEnableInput)

# Haptic Feedback Enable
setAudioPlayBackInput = {
    'seconds': 250
}
socket.emit('setAudioPlayBack', setAudioPlayBackInput)

# Keep the client running
socket.wait()
