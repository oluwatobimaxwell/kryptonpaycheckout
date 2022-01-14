/* eslint-disable no-undef */

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