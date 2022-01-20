
const apiBase = window.location.hostname === "localhost" ? "ws://localhost:8000" : "wss://krypton-pay.herokuapp.com";
const socketUrl = `${apiBase}/ws/transactions/`;
export class Socket {

    init({ identifier, callback, messageHandler }) {
        this.identifier = identifier;
        this.reconnect(identifier);

        this.socket.addEventListener("open", async () => {
            messageHandler({ message: "connected" })
        });

        this.socket.addEventListener("message", event => {
            const message = JSON.parse(event?.data?.toString());
            messageHandler && messageHandler(message);
        });

        this.socket.onclose = (event) => {
            this.reconnect()
        };

        this.socket.addEventListener("disconnected", event => {
            this.reconnect()
        });

        return this.socket;
    }

    close = () => {
        this.socket && this.socket.close()
    }

    reconnect = (identifier=null) => {
        this.socket = new window.WebSocket(`${socketUrl}${identifier||this.identifier}`);
    }

    send({message, callback}) {
        const json = JSON.stringify(message);
        this.socket.send(json);
        callback && callback()
    }
}