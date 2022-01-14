/* eslint-disable no-sequences */
/* eslint-disable no-unused-expressions */
class KryptonPay{
    init(){
        this.wrap = document.createElement('div')
        this.wrap.style = "index: 999999999999999; position: absolute;top: 0;left: 0;right: 0;bottom: 0; min-height: 100vh;  overflow: hidden";
        this.frame = document.createElement('iframe');
        this.frame.src = 'https://kryptonpay.netlify.app';
        this.frame.allowfullscreen = true;
        this.frame.style = 'width: 100%; height: 100%; border: none';    
        this.wrap.appendChild(this.frame)
        document['body'].appendChild(this.wrap)
        window.addEventListener("message", (evt) => {
            this.kryptonPayMessage(evt)
        }, false);    
        
    }
    kryptonPayMessage(event){
        const data = event.data;
        if(data.krypton_pay){
            this.messageHandler(data)
        }   
    }
    
    messageHandler = (msg) => {
        switch (msg.action) {
            case "initialize":
                this.frame.contentWindow.postMessage(this.config, "*")
                break;
            case 'cancelpayment':
                this.onClose(msg.data);
                break;
            case 'successpayment':
                this.onSuccess(msg.data);
                break;
            case 'failedpayment':
                this.onFailed(msg.data);
                break;
            case 'errorpayment':
                this.onError(msg.data);
                break;
            default:
                break;
        }
    }

    pay(config, { onClose, onSuccess, onFailed }){
        this.config = config, this.init();
        this.onCloseEvt = onClose;
        this.onSuccessEvt = onSuccess;
        this.onFailedEvt = onFailed;
    }

    removeKP = () => {
        this.wrap && this.wrap.remove();
        // window.removeEventListener("message", this.kryptonPayMessage);
        this.wrap = null;
    }

    onClose = (data) => {this.removeKP(); this.onCloseEvt && this.onCloseEvt(data)};
    onSuccess = (data) => {this.removeKP(); this.onSuccessEvt && this.onSuccessEvt(data)};
    onFailed = (data) => {this.removeKP(); this.onFailedEvt && this.onFailedEvt(data)};
    onError = (data) => {this.removeKP(); this.onErrorEvt && this.onErrorEvt(data)};

}


class PayWithKryptonPay{
    init(config, evt){
        this.kp = new KryptonPay()
        this.kp.pay(config, evt)
    }
}


function setUpView(){
    const config = { 
            key: "pk_test_cb8daec88491a8021c0dcc48d461a0c49720ce1a", // Required
            amount: 50000, //In Fiat Currency | Required
            ref: "123456789024747", // Not Required
            email: "tobisholanke@gmail.com", // Required
            name: "Tobi Sholanke", // Not Required
            phone: "08064670816", // Not Required
            viewmode: "AUTO"
    }
    
    const kp  = new PayWithKryptonPay()
    kp.init(config, 
        {
        onClose: (e) => {
            alert("Close")
        },
        onSuccess: (e) => {
            alert("Success")
        },
        onFailed: (e) => {
            alert("Failed")
        },
        onError: (e) => {
            alert("Error")
        }
    })    
}