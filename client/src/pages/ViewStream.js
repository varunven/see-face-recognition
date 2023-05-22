import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import axios from "axios";

const ViewStream = () => {

    const [iceCandidates, setIceCandidates] = useState([]);
    const peerConnection = useRef(null);
    const [viewerSocket, setViewerSocket] = useState(null);
    const [useTurnServers, setUseTurnServers] = useState(false);
    const [intervalId, setIntervalId] = useState("");
    const [hasConnected, setHasConnected] = useState(false);
    const [hasStartedStream, setHasStartedStream] = useState(false);
    const streamVideoRef = useRef(null);
    const streamAudioRef = useRef(null);
    const intervalRef = useRef(null);
    const [connectionState, setConnectionState] = useState("");

    useEffect(() => {

        console.log(process.env.REACT_APP_SERVER_URL);
        const socket = io(process.env.REACT_APP_SERVER_URL, { transports: ['websocket', 'polling', 'flashsocket'] });

        setViewerSocket(socket);

        return () => {
            if (socket.readyState == 1) {
                socket.disconnect();
            }

            //connectionPeer.close();

        };

    }, []);

    useEffect(() => {
        if (viewerSocket) {
            viewerSocket.on('connect', () => {
                console.log('Connected to server');
                viewerSocket.emit("viewer");
            });
              
            viewerSocket.on('disconnect', () => {
                console.log('Disconnected from server');
            });
            
            viewerSocket.on("useTurnServers", (useTurnServers) => {
                console.log(`use turn servers? ${useTurnServers}`);
                setUseTurnServers(useTurnServers);
            });
        }
    }, [viewerSocket]);

    useEffect(() => {
        // if (hasStartedStream) {
        //     if (hasConnected) {
        //         console.log(`clearing interval = ${intervalId}`);
        //         clearInterval(intervalRef.current);
        //     } else {
        //         intervalRef.current = setInterval(() => {
        //             console.log("retrying connection");
        //             retryConnection();
        //         }, 6000);
    
        //     }
        // }

    }, [hasConnected]);


    const handleStreamStart = async() => {
        const peer = startConnection();
        setHasStartedStream(true);
        // await delay(6000);

        // const intervalId = setInterval(() => {
        //     console.log("retrying connection");
        //     retryConnection(peer);
        // }, 6000);
        // setIntervalId(intervalId);
        // console.log(intervalId);



    }

    const startConnection = async() => {
        const peer = createPeer();
        //await delay(1000);
        return peer;
    }

    const retryConnection = () => {
        console.log("retrying connection");
        peerConnection.current.restartIce();

    }

    const handleTrackEvent = (e) => {
        console.log(`received track from server, id = ${e.track.id}, kind = ${e.track.kind}`);
        if (streamVideoRef.current) {
            streamVideoRef.current.srcObject = e.streams[0];
        }

        if (streamAudioRef.current) {
            streamAudioRef.current.srcObject = e.streams[0];
        }
    };

    async function handleNegotiationNeededEvent(peer) {
        console.log("on negotaiont");
        const offer = await peer.createOffer();
        await peer.setLocalDescription(offer);
        const payload = {
            sdp: peer.localDescription.sdp,
            type: peer.localDescription.type,
            client_id: viewerSocket.id
        };
    
        try {
            const { data } = await axios.post(`${process.env.REACT_APP_SERVER_URL}/consumer`, payload);
            const desc = new RTCSessionDescription({sdp: data.sdp, type: data.type});
            peer.setRemoteDescription(desc).catch(e => console.log(e));
            //document.getElementById("err-msg").innerText = "";
        } catch (err) {
            console.log(err);
            //document.getElementById("err-msg").innerText = "Could not open stream. Broadcast not started yet";
        }
    }

    const createPeer = () => {
        const config = {
            sdpSemantics: 'unified-plan'
        };
    
        if (useTurnServers) {
            config.iceServers = process.env.ICE_SERVERS;
        }
    
        const peer = new RTCPeerConnection(config);
        peerConnection.current = peer;

        //Add local audio stream to the Peer connection
        navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            console.log("adding audioooo :D:D:D:")
            const audioTrack = stream.getAudioTracks()[0];
            const transceiver = peer.addTransceiver(audioTrack, { direction: 'sendrecv' });
        })
        .catch(error => {
            console.error('Error accessing local media devices:', error);
        });
    
        peer.addTransceiver("video", { direction: "recvonly" });
        peer.onicecandidate = (e) => {
            if (e.candidate != null) {
                viewerSocket.emit("icecandidate", e.candidate);
            } else {
                console.log("ICE gathering complete");
            }
        }

        peer.onconnectionstatechange = (e) => {
            console.log(`pre ifs, conn state = ${connectionState}`);
            if (peer.connectionState == "connected") {
                //clearInterval(intervalRef.current);
                setConnectionState("connected");
            } else {
                retryConnection();
            }
            // } else if (peer.connectionState == "connecting" && connectionState == "connected") {
            //     setConnectionState("connecting");
            //     retryConnection();
            // } else if (peer.connectionState == "failed") {
            //     retryConnection();
            // } else if (peer.connectionState == "connecting" && connectionState == "connecting") {
            //     retryConnection();
            // }

            // if (peer.connectionState == "connected" && peer.signalingState == "stable") {
            //     setHasConnected(true);
            //     clearInterval(intervalRef.current);
            //     console.log(`Connected! Clearing interval id = ${intervalId}`);
            // }

            console.log(peer.connectionState + " " + peer.iceGatheringState)
        }

        peer.onsignalingstatechange = (e) => {
            // if (peer.connectionState == "connected" && peer.signalingState == "stable") {
            //     setHasConnected(true);
            //     clearInterval(intervalRef.current);
            //     console.log(`Connected! Clearing interval id = ${intervalId}`);
            // }

            console.log(peer.connectionState + " " + peer.iceGatheringState)
        }

    
        viewerSocket.on("icecandidate", (candidate) => {
            console.log(`received ice candidate from server`);

            if (candidate) {

                if (peer.remoteDescription) {
                    try {
                        peer.addIceCandidate(candidate);
                    } catch (e) {
                        console.log(`Error adding ice candidate: ${e}`);
                    }
                } else {
                    setIceCandidates(prevCandidates => [prevCandidates, candidate]);
                }
            } else if (candidate == null) {
                iceCandidates.forEach(cand => {
                    try {
                        peer.addIceCandidate(cand);
                    } catch (e) {
                        console.log(`Error adding ice candidate: ${e}`);
                    }
                });
            }

        })
    
        peer.ontrack = handleTrackEvent;
        peer.onnegotiationneeded = () => handleNegotiationNeededEvent(peer);
    
        return peer;
    }

    // generates a delay of x ms
    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    return (
        <div className="screen-container">
            <div className="video-container">
                <video ref={streamVideoRef} playsInline autoPlay className="stream-video"></video>
                <audio ref={streamAudioRef}></audio>
                <button onClick={handleStreamStart}>View Stream</button>
                <button onClick={() => {peerConnection.current.restartIce()}}>Restart Stream</button>
            </div>
        </div>
    )

}

export default ViewStream;