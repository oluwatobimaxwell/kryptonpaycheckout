import React from 'react'
import { connect } from 'react-redux'
import { updateData } from '../Redux/Data/actions'
import { KPLoader } from './KPLoader'
import KryptonPayCheckout from './KryptonPayCheckout'

// { coin = { coin: "usdt" }, restartProcess, changeViewTitle }

const ConfimationView = (props) => {
  const coin = props?.paymentCoin
  const paymentStatus = props?.paymentStatus
  const defaultMsg = "Processing your payment, please wait..."
  const [status, setStatus] = React.useState('processing')
  const [message, setMessage] = React.useState(defaultMsg)


  const onContinue = () => {
    window.parent.postMessage({ action: "successpayment", data: {}, krypton_pay: true }, "*");
  }

  const restartProcess = () => {
    window.parent.postMessage({ action: paymentStatus?.status ? "successpayment" : "failedpayment", data: paymentStatus, krypton_pay: true }, "*");
  }

  return (
		<KryptonPayCheckout>
			<div className="field">
				<div className="control">
					<div className="l-card">
              <KPLoader
                status={paymentStatus?.status ? 'success' : 'failed'}
                message={`${paymentStatus?.message} .Your transaction reference is <strong>${paymentStatus?.data?.reference}</strong>`} 
                image={coin.coin} 
                restartProcess={restartProcess}
                onContinue={onContinue}
              />
					</div>
				</div>
			</div>
		</KryptonPayCheckout>
	);
}


const mapStateToProps = (state) => {
	return { ...state.data };
};

const mapDispatchToProps = (dispatch) => {
	return {
		updateData: (e) => dispatch(updateData(e)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(ConfimationView);



