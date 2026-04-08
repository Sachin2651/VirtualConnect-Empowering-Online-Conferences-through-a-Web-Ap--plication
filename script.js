// script.js - Frontend logic for Virtual Connect

const socket = io("/");
const videoGrid = document.getElementById("video-grid");
const myVideo = document.createElement("video");
myVideo.muted = true;

const peers = {};

// Initialize PeerJS
const myPeer = new Peer(undefined, {
  host: "0.peerjs.com",
  port: 443,
  secure: true,
  config: {
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" },
      { urls: "stun:stun1.l.google.com:19302" },
      {
        urls: "turn:openrelay.metered.ca:80",
        username: "openrelayproject",
        credential: "openrelayproject"
      }
    ]
  }
});

let myVideoStream;

// Get camera & mic
navigator.mediaDevices
  .getUserMedia({ video: true, audio: true })
  .then((stream) => {
    myVideoStream = stream;
    addVideoStream(myVideo, stream);

    // Answer incoming calls
    myPeer.on("call", (call) => {
      call.answer(stream);
      const video = document.createElement("video");
      call.on("stream", (userVideoStream) => {
        addVideoStream(video, userVideoStream);
      });
    });

    // When new user connects
    socket.on("user-connected", (userId, username) => {
      connectToNewUser(userId, stream);
    });
  })
  .catch((err) => {
    alert("Camera/Microphone access denied");
    console.error(err);
  });

// When peer is ready
myPeer.on("open", (id) => {
  socket.emit("join-room", ROOM_ID, id, USERNAME);
});

// Connect to new user
function connectToNewUser(userId, stream) {
  const call = myPeer.call(userId, stream);
  const video = document.createElement("video");

  call.on("stream", (userVideoStream) => {
    addVideoStream(video, userVideoStream);
  });

  call.on("close", () => {
    video.remove();
  });

  peers[userId] = call;
}

// Handle user disconnect
socket.on("user-disconnected", (userId) => {
  if (peers[userId]) peers[userId].close();
});

// Add video to grid
function addVideoStream(video, stream) {
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
  });
  videoGrid.append(video);
}

// Chat functionality
const text = document.getElementById("chat_message");

text.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && text.value.trim().length !== 0) {
    socket.emit("message", text.value);
    text.value = "";
  }
});

socket.on("createMessage", (message, username) => {
  const ul = document.querySelector(".messages");
  const li = document.createElement("li");
  li.innerHTML = `<b>${username}:</b> ${message}`;
  ul.append(li);
});

// Mute / Unmute
function muteUnmute() {
  const enabled = myVideoStream.getAudioTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getAudioTracks()[0].enabled = false;
  } else {
    myVideoStream.getAudioTracks()[0].enabled = true;
  }
}

// Start / Stop Video
function playStop() {
  const enabled = myVideoStream.getVideoTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getVideoTracks()[0].enabled = false;
  } else {
    myVideoStream.getVideoTracks()[0].enabled = true;
  }
}

// Copy meeting link
function copyMeetCode() {
  const link = window.location.href;
  navigator.clipboard.writeText(link).then(() => {
    alert("Meeting link copied!");
  });
}

// Leave meeting
function leaveMeeting() {
  window.location.href = "/";
}
let screenStream;

async function shareScreen() {
  try {
    screenStream = await navigator.mediaDevices.getDisplayMedia({
      video: true
    });

    const screenTrack = screenStream.getVideoTracks()[0];

    // Replace video track for all peers
    for (let userId in peers) {
      const sender = peers[userId].peerConnection
        .getSenders()
        .find((s) => s.track.kind === "video");

      if (sender) {
        sender.replaceTrack(screenTrack);
      }
    }

    // Replace own video
    const videoTrack = screenTrack;
    myVideo.srcObject = new MediaStream([videoTrack]);

    // When user stops sharing
    screenTrack.onended = () => {
      stopScreenShare();
    };

  } catch (err) {
    console.error("Error sharing screen:", err);
  }
}
function stopScreenShare() {
  const videoTrack = myVideoStream.getVideoTracks()[0];

  for (let userId in peers) {
    const sender = peers[userId].peerConnection
      .getSenders()
      .find((s) => s.track.kind === "video");

    if (sender) {
      sender.replaceTrack(videoTrack);
    }
  }

  myVideo.srcObject = myVideoStream;
}
