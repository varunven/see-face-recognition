import React, { useEffect, useState } from 'react'
import { io } from "socket.io-client";
import axios from "axios";

function ViewStream() {
  const server_url = process.env.REACT_APP_SERVER_URL;
  const socket = io(server_url, { transports: ['websocket', 'polling', 'flashsocket'] });

// flag indicating whether or not to use TURN servers
let USE_TURN_SERVERS;

socket.on('connect', () => {
    console.log('Connected to server');
    socket.emit("viewer");
});
  
socket.on('disconnect', () => {
    console.log('Disconnected from server');
});

socket.on("useTurnServers", (useTurnServers) => {
    USE_TURN_SERVERS = useTurnServers;
})

async function init() {
    const peer = createPeer();
    peer.addTransceiver("video", { direction: "recvonly" })
}

function createPeer() {

    var config = {
        sdpSemantics: 'unified-plan'
    };

    if (USE_TURN_SERVERS) {
        config.iceServers = [
          {
            urls: "turn:a.relay.metered.ca:80",
            username: "fdd847241ab7b147627153c0",
            credential: "0QPoad1AE+/izw2H",
          },
          {
            urls: "turn:a.relay.metered.ca:80?transport=tcp",
            username: "fdd847241ab7b147627153c0",
            credential: "0QPoad1AE+/izw2H",
          },
          {
            urls: "turn:a.relay.metered.ca:443",
            username: "fdd847241ab7b147627153c0",
            credential: "0QPoad1AE+/izw2H",
          },
          {
            urls: "turn:a.relay.metered.ca:443?transport=tcp",
            username: "fdd847241ab7b147627153c0",
            credential: "0QPoad1AE+/izw2H",
          },
      
            { 
              "urls": "turn:TURN_IP?transport=tcp",
              "username": "TURN_USERNAME",
              "credential": "TURN_CREDENTIALS"
            }
      ]
    }


    const peer = new RTCPeerConnection(config);

    peer.onicecandidate = (e) => {
        if (e.candidate != null) {
            socket.emit("icecandidate", e.candidate);
        } else {
            console.log("ICE gathering complete");
        }
    }

    socket.on("icecandidate", (candidate) => {
        if (peer.remoteDescription) {
          peer.addIceCandidate(candidate);
        }

    })

    peer.oniceconnectionstatechange = (e) => {
      if (peer.connectionState == "disconnected") {
        window.location.reload();
      }
    }

    peer.ontrack = handleTrackEvent;
    peer.onnegotiationneeded = () => handleNegotiationNeededEvent(peer);

    return peer;
}

async function handleNegotiationNeededEvent(peer) {
    const offer = await peer.createOffer();
    await peer.setLocalDescription(offer);
    const payload = {
        sdp: peer.localDescription.sdp,
        type: peer.localDescription.type,
        client_id: socket.id
    };

    try {
        const { data } = await axios.post(`${process.env.REACT_APP_SERVER_URL}/consumer`, payload);
        const desc = new RTCSessionDescription({sdp: data.sdp, type: data.type});
        peer.setRemoteDescription(desc).catch(e => document.getElementById("err-msg").innerText = e);
        document.getElementById("err-msg").innerText = "";
    } catch (err) {
        console.log(err);
        document.getElementById("err-msg").innerText = "Could not open stream. Broadcast not started yet";
    }
}

function handleTrackEvent(e) {
    document.getElementById("video").srcObject = e.streams[0];
};

  return (
    <div>
      <video playsInline autoPlay id='video'></video>
      <p id="err-msg"></p>
      <button id="my-button" onClick={() => init()}>View Stream</button>
    </div>
  )
}

export default ViewStream
