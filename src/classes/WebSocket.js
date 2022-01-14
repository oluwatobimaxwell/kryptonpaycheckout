
const socketUrl = `ws://localhost:8000/ws/krypton-waiting/1`;
// lo = new WebSocket("ws://localhost:8000/ws/live-score/1?token=[YOUR TOKEN]");
export class Socket {

    constructor(props) {
        if (props) {
            const { socket } = props;
            if (socket) this.socket = socket;
        }
    }

    init({ transactionData, callback, messageHandler }) {

        this.socket = new window.WebSocket(socketUrl);
        this.socket.addEventListener("open", async () => {
            this.send({ 
                    message: { channel: "pendingPayment", transactionData }, 
                    callback
            });
        });

        this.socket.addEventListener("message", event => {
            console.log(event?.data)
            const message = JSON.parse(event?.data?.toString());
            messageHandler && messageHandler(message);
        });

        this.socket.onclose = (event) => {
            alert("Connection Closed");
            console.log(event)
        };

        this.socket.addEventListener("disconnected", event => {
            // handle disconnection here
            const message = JSON.parse(event.data.toString());
            console.log(message)
            alert("Disconnected");
        });

        return this.socket;
    }

    send({message, callback}) {
        const json = JSON.stringify(message);
        this.socket.send(json);
        callback && callback()
    }
}