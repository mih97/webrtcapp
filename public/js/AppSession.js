class AppSession {
    constructor() {
        this.webSocket = new WebSocket('ws://localhost:9090');  
        this.name = "";
        this.peerConnection = null;

        this.loginInput = document.querySelector('#loginInput');
        this.loginBtn = document.querySelector('#loginBtn');
        this.otherUsernameInput = document.querySelector('#otherUsernameInput');
        this.connectToOtherUsernameBtn = document.querySelector('#connectToOtherUsernameBtn');

        this.initialize();
    }

    initialize() {
        this.loginBtn.addEventListener("click", () => this.onLoginClick());
        this.connectToOtherUsernameBtn.addEventListener("click", () => this.onConnectToUserClick());

        this.webSocket.onmessage = (message) => this.handleMessage(message);
        this.webSocket.onopen = () => console.log("Connected");
        this.webSocket.onerror = (err) => console.log("Got error", err);
    }

    onLoginClick() {
        this.name = this.loginInput.value;
        if (this.name.length > 0) {
            this.send({ type: "login", name: this.name });
        }
    }

    async onConnectToUserClick() {
        const otherUsername = this.otherUsernameInput.value;
        if (otherUsername.length > 0) {
            this.peerConnection = otherUsername;

            try {
                const offer = await this.localPeer.createOffer();
                console.log(offer);
                await this.localPeer.setLocalDescription(offer);

                this.send({ type: "offer", offer });
            } catch (error) {
                alert("An error has occurred.");
            }
        }
    }

    handleMessage(message) {
        console.log("Got message", message.data);
        const data = JSON.parse(message.data);

        switch (data.type) {
            case "login":
                this.onLogin(data.success);
                break;
            case "offer":
                this.onOffer(data.offer, data.name);
                break;
            case "answer":
                this.onAnswer(data.answer);
                break;
            case "candidate":
                this.onCandidate(data.candidate);
                break;
            default:
                break;
        }
    }

    onLogin(success) {
        if (success === false) {
            alert("Oops...try a different username");
        } else {
            const configuration = { iceServers: [{ urls: "stun:stun.1.google.com:19302" }] };
            this.localPeer = new RTCPeerConnection(configuration);
            console.log("RTCPeerConnection object was created");
            console.log(this.localPeer);

            this.localPeer.onicecandidate = (event) => {
                if (event.candidate) {
                    this.send({ type: "candidate", candidate: event.candidate });
                }
            };
        }
    }

    async onOffer(offer, name) {
        this.peerConnection = name;
        this.localPeer.setRemoteDescription(new RTCSessionDescription(offer));

        try {
            const answer = await this.localPeer.createAnswer();
            await this.localPeer.setLocalDescription(answer);

            this.send({ type: "answer", answer });
        } catch (error) {
            alert("Oops...error");
        }
    }

    onAnswer(answer) {
        this.localPeer.setRemoteDescription(new RTCSessionDescription(answer));
    }

    onCandidate(candidate) {
        this.localPeer.addIceCandidate(new RTCIceCandidate(candidate));
    }

    send(message) {
        if (this.peerConnection) {
            message.name = this.peerConnection;
        }
        if (this.webSocket.readyState === WebSocket.OPEN) {
            // Send the message
            this.webSocket.send(JSON.stringify(message));
        }
    }
}

// Create an instance of the AppSession class when the page loads
window.addEventListener('load', () => {
    const appSession = new AppSession();
});
// sugestion : one client makes the call, the other receives the offer, c