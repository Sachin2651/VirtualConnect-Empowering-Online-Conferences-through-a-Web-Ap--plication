# VirtualConnect-Empowering-Online-Conferences-through-a-Web-Ap--plication
Virtual Connect is a comprehensive web application designed to facilitate seamless online conferences, enabling participants to engage in dynamic virtual gatherings regardless of geographical constraints
### LIVE:  https://vmeet-video-conferencing.onrender.com/


# Features
✔ Create & Join Meetings – Generate a meeting link and share it with others.

✔ WebRTC-Powered Video Calls – Real-time video and audio communication.

✔ Peer-to-Peer Connection – Uses PeerJS for direct media streaming.

✔ Live Chat – Send and receive messages during a meeting.

✔ Mute/Unmute Audio – Toggle microphone on/off.

✔ Start/Stop Video – Turn the camera on/off.

✔ User Labels – Display participant names under their video.

✔ Auto-Scroll Chat – Chat window automatically scrolls to the latest messages.

✔ Responsive UI – Works on desktops, tablets, and mobile devices.


# Tech Stack: 
Peer, EJS, Javascript, Socket.io, WebRTC, Node.js, Express.js, 


![image](https://github.com/user-attachments/assets/56e48573-e17b-409a-9e69-73e1f5767fd2)


![image](https://github.com/user-attachments/assets/6c4912f6-e047-4634-8778-3ca827877bf7)


# Known Issues & Fixes
## Extra Blank Video Appearing

✔ Fix: Added a check in addVideoStream() to ensure a user’s video is added only once.

✔ Fix: Used data-userid attributes to prevent duplicate entries.

## User Disconnect Not Removing Video

✔ Fix: Implemented removeVideo(userId) function to clean up UI on disconnection.

✔ Fix: Ensured peers[userId] is properly deleted when a user leaves.

# Future Improvements
✅ Screen Sharing – Allow users to share their screen.

✅ Recording Feature – Record meetings and save them.

✅ Authentication System – User login with Google/Auth.

✅ Breakout Rooms – Create smaller discussion rooms.

Thanks for visiting! Would appreciate any suggestions and PR. ❤

💬 Questions or Issues?
Feel free to raise an issue or submit a pull request!

Let's build something awesome together.

