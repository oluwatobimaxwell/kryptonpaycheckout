import React from 'react'
import { KPLoader } from './KPLoader'

export const ConfimationView = ({ coin, restartProcess, changeViewTitle }) => {
  const defaultMsg = "Processing your payment, please wait..."
  const [status, setStatus] = React.useState('processing')
  const [message, setMessage] = React.useState(defaultMsg)

  React.useEffect(() => {
    setTimeout(() => {

        setStatus('processing')
        setMessage(`You ${coin.coin} has been received, and it’s awaiting confirmation please wait for few minutes...`)
        changeViewTitle('Confirming Payment (1/5)')

        setTimeout(() => {
          setStatus('success')
          setMessage('Payment received, your transaction reference is <strong>P1234567890</strong>')
          changeViewTitle('Completed')
      }, 3000);

    }, 3000);
  },[])

  const onContinue = () => {
    window.parent.postMessage({ action: "successpayment", data: {}, krypton_pay: true }, "*");
  }

  return (
		<div>
			<div className="field">
				<div className="control">
					<div className="l-card">
              <KPLoader
                status={status}
                message={message} 
                image={coin.coin} 
                restartProcess={restartProcess}
                onContinue={onContinue}
              />
					</div>
				</div>
			</div>
		</div>
	);
}