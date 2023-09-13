class WebRTCApp {
   constructor() {
       this.stream = null;
       this.localVideo = document.getElementById('localVideo');
       this.initializeUserMedia();
       this.setupEventListeners();
   }

   async initializeUserMedia() {
       try {
           if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
               throw new Error("WebRTC is not supported");
           }
           this.stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
           this.localVideo.srcObject = this.stream;
       } catch (error) {
           console.error("Error accessing the webcam:", error.message);
       }
   }

   setupEventListeners() {
       document.getElementById("btnGetAudioTracks").addEventListener("click", () => {
           console.log("getAudioTracks");
           console.log(this.stream.getAudioTracks());
       });

       document.getElementById("btnGetTrackById").addEventListener("click", () => {
           console.log("getTrackById");
           console.log(this.stream.getTrackById(this.stream.getAudioTracks()[0].id));
       });

       document.getElementById("btnGetTracks").addEventListener("click", () => {
           console.log("getTracks()");
           console.log(this.stream.getTracks());
       });

       document.getElementById("btnGetVideoTracks").addEventListener("click", () => {
           console.log("getVideoTracks()");
           console.log(this.stream.getVideoTracks());
       });

       document.getElementById("btnRemoveAudioTrack").addEventListener("click", () => {
           console.log("removeAudioTrack()");
           this.stream.removeTrack(this.stream.getAudioTracks()[0]);
       });

       document.getElementById("btnRemoveVideoTrack").addEventListener("click", () => {
           console.log("removeVideoTrack()");
           this.stream.removeTrack(this.stream.getVideoTracks()[0]);
       });
   }
}

// Create an instance of the WebRTCApp class when the page loads
window.addEventListener('load', () => {
   const webRTCApp = new WebRTCApp();
});