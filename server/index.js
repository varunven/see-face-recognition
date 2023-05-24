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

  socket.on("setObjRecognitionVolume", (data) => {
    const newVolumeNum = data.newVolumeNum;
    const handleobjRecognitionVolumeResponse = handleObjRecognitionVolume(newVolumeNum);
    socket.emit("objRecognitionVolumeResponse", handleobjRecognitionVolumeResponse);
  });

  socket.on("setObjRecognitionMinDist", (data) => {
    const newDist = data.newDist;
    const handleObjRecognitionMinDistResponse = handleObjRecognitionMinDist(newDist);
    socket.emit("objRecognitionMinDistResponse", handleObjRecognitionMinDistResponse);
  });

  socket.on("setObjRecognitionAudioEnable", (data) => {
    const state = data.state;
    const handleObjRecognitionAudioEnableResponse = handleObjRecognitionAudioEnable(state);
    socket.emit("objRecognitionAudioEnableResponse", handleObjRecognitionAudioEnableResponse);
  });

  socket.on("setObjRecognitionVoice", (data) => {
    const state = data.state;
    const handleObjRecognitionVoiceResponse = handleObjRecognitionVoice(state);
    socket.emit("objRecognitionVoiceResponse", handleObjRecognitionVoiceResponse);
  });

  socket.on("setObjRecognitionList", (data) => {
    const newList = data.newList;
    const handleObjRecognitionListResponse = handleObjRecognitionList(newList);
    socket.emit("objRecognitionListResponse", handleObjRecognitionListResponse);
  });

  socket.on("setBuzzerSidewalk", (data) => {
    const newFeedbackNum = data.newFeedbackNum;
    const handleBuzzerSidewalkResponse = handleBuzzerSidewalk(newFeedbackNum);
    socket.emit("buzzerSidewalkResponse", handleBuzzerSidewalkResponse);
  });

  socket.on("setBuzzerObjectDetection", (data) => {
    const newFeedbackNum = data.newFeedbackNum;
    const handleBuzzerObjectDetectionResponse = handleBuzzerObjectDetection(newFeedbackNum);
    socket.emit("buzzerObjectDetectionResponse", handleBuzzerObjectDetectionResponse);
  });

  socket.on("setHapticFeedbackEnable", (data) => {
    const state = data.state;
    const handleHapticFeedbackEnableResponse = handleHapticFeedbackEnable(state);
    socket.emit("hapticFeedbackEnableResponse", handleHapticFeedbackEnableResponse);
  });

  socket.on("setAudioPlayBack", (data) => {
    const seconds = data.seconds;
    const handleAudioPlayBackResponse = handleAudioPlayBack(seconds);
    socket.emit("audioPlayBackResponse", handleAudioPlayBackResponse);
  });

  // Handle client disconnect
  socket.on("disconnect", () => {
    console.log("A client disconnected");
  });
});

server.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
