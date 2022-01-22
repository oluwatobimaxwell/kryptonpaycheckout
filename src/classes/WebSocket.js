
const apiBase = window.location.hostname === "localhost" ? "ws://172.20.10.4:8000" : "wss://krypton-pay.herokuapp.com";
const socketUrl = `${apiBase}/ws/transactions/`;
export class Socket {

    init({ identifier, callback, messageHandler }) {
        this.identifier = identifier;
        this.messageHandler = messageHandler;
        this.reconnect();
        return this.socket;
    }

    close = () => {
        this.socket && this.socket.close()
    }

    reconnect = () => {
        this.socket = new window.WebSocket(`${socketUrl}${this.identifier}`);
        this.socket.addEventListener("open", async () => {
            this.messageHandler({ message: "connected" })
        });

        this.socket.addEventListener("message", event => {
            const message = JSON.parse(event?.data?.toString());
            this.messageHandler && this.messageHandler(message);
        });

        this.socket.onclose = (event) => {
            this.reconnect()
        };

        this.socket.addEventListener("disconnected", event => {
            this.reconnect()
        });
    }

    send({message, callback}) {
        const json = JSON.stringify(message);
        this.socket.send(json);
        callback && callback()
    }
}