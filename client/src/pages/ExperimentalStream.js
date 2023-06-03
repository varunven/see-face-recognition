import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import axios from "axios";

const ViewStream = () => {

    const [iceCandidates, setIceCandidates] = useState([]);
    const peerConnection = useRef(null);
    const [viewerSocket, setViewerSocket] = useState(null);
    const [useTurnServers, setUseTurnServers] = useState(false);
    const streamVideoRef = useRef(null);
    const streamAudioRef = useRef(null);

    useEffect(() => {
        const socket = io('https://7f46-2601-602-867f-c8d0-a8b4-eee3-ec61-e127.ngrok-free.app', { transports: ['websocket', 'polling', 'flashsocket'] });

        setViewerSocket(socket);

        return () => {
            if (socket.readyState == 1) {
                socket.disconnect();
            }
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
                setUseTurnServers(useTurnServers);
            });
        }
    }, [viewerSocket]);

    const handleStreamStart = async() => {
        const peer = startConnection();
        setHasStartedStream(true);
    }

    const startConnection = async() => {
        const peer = createPeer();
        //await delay(1000);
        return peer;
    }

    const retryConnection = () => {
        peerConnection.current.restartIce();

    }

    const handleTrackEvent = (e) => {
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
            const { data } = await axios.post(`https://7f46-2601-602-867f-c8d0-a8b4-eee3-ec61-e127.ngrok-free.app/consumer`, payload);
            const desc = new RTCSessionDescription({sdp: data.sdp, type: data.type});
            peer.setRemoteDescription(desc).catch(e => console.log(e));
        } catch (err) {
            console.log(err);
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
            if (peer.connectionState == "connected") {
                //clearInterval(intervalRef.current);
                setConnectionState("connected");
            } else {
                retryConnection();
            }
            console.log(peer.connectionState + " " + peer.iceGatheringState)
        }

        peer.onsignalingstatechange = (e) => {
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