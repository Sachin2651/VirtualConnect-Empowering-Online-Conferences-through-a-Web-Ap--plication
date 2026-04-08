// script.js - Frontend logic for Virtual Connect

const socket = io("/");
const videoGrid = document.getElementById("video-grid");
const myVideo = document.createElement("video");
myVideo.muted = true;

const peers = {};

// Initialize PeerJS
const myPeer = new Peer(undefined, {
  host: "peerjs-server.herokuapp.com",
  secure: true,
  port: 443
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
