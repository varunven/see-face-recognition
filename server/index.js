const { handleBuzzerObjectDetection, handleBuzzerSidewalk, handleHapticFeedbackEnable } = require("./buzzerSettings");
const changeFaces = require("./changeFaces");
const forgetFaces = require("./forgetFaces");
const {
  handleObjRecognitionVolume,
  handleObjRecognitionMinDist,
  handleObjRecognitionAudioEnable,
  handleObjRecognitionVoice,
  handleObjRecognitionList,
  handleAudioPlayBack
} = require("./objectRecognitionSettings");

const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
  }
});

const PORT = process.env.PORT || 3001;

app.get("/api", (req, res) => {
  res.json({ message: "Hello from server!" });
});

io.on("connection", (socket) => {
  console.log("A client connected");

  socket.on("forgetFace", (data) => {
    const toForget = data.toForget;
    const forgetFaceResponse = forgetFaces.handleForgetFace(toForget);
    console.log('Received data:', data);
    socket.emit("forgetFaceResponse", forgetFaceResponse);
  });  

  socket.on("changeFaces", (data) => {
    const origFileName = data.origName;
    const newFileName = data.newName;
    console.log('Received data:', data);
    const handlechangeFacesResponse = changeFaces.handlechangeFaces(origFileName, newFileName);
    socket.emit("changeFacesResponse", handlechangeFacesResponse);
  });

  socket.on("objectRecognitionSettings", (data) => {
    const newVolumeNum = data.newVolumeNum;
    const newDist = data.newDist;
    const audioEnable = data.audioEnable;
    const objRecognitionVoice = data.objRecognitionVoice;
    const newList = data.newList;
    const audioPlaybackTime = data.audioPlaybackTime;
    
    const handleObjRecognitionVolumeResponse = handleObjRecognitionVolume(newVolumeNum)
    const handleObjRecognitionMinDistResponse = handleObjRecognitionMinDist(newDist);
    const handleObjRecognitionAudioEnableResponse = handleObjRecognitionAudioEnable(audioEnable);
    const handleObjRecognitionVoiceResponse = handleObjRecognitionVoice(objRecognitionVoice);
    const handleObjRecognitionListResponse = handleObjRecognitionList(newList);
    const handleAudioPlayBackResponse = handleAudioPlayBack(audioPlaybackTime);

    console.log('Received data:', data);  
    socket.emit("objectRecognitionSettingsResponse",
      {
        handleObjRecognitionVolumeResponse,
        handleObjRecognitionMinDistResponse,
        handleObjRecognitionAudioEnableResponse,
        handleObjRecognitionVoiceResponse,
        handleObjRecognitionListResponse,
        handleAudioPlayBackResponse
      });
  });  

  socket.on("buzzerSettings", (data) => {
    const sidewalkDetection = data.sidewalkDetection
    const objectDetection = data.objectDetection
    const hapticFeedbackState= data.hapticFeedbackState
    const handleBuzzerSidewalkResponse = handleBuzzerSidewalk(sidewalkDetection);
    const handleBuzzerObjectDetectionResponse = handleBuzzerObjectDetection(objectDetection);
    const handleHapticFeedbackEnableResponse = handleHapticFeedbackEnable(hapticFeedbackState);
    console.log('Received data:', data);  
    socket.emit("buzzerSettingsResponse",
      {
        handleBuzzerSidewalkResponse,
        handleBuzzerObjectDetectionResponse,
        handleHapticFeedbackEnableResponse
      });
  });

  // Handle client disconnect
  socket.on("disconnect", () => {
    console.log("A client disconnected");
  });
});

server.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
