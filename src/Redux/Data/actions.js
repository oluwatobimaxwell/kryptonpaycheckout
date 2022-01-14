import { Api } from "../../classes/Api";
import { UPDATE } from "./types";

const api = new Api();

export const updateData = (data = {}) => {
	return { ...data, type: UPDATE };
};

export const updatePrices = (data = null, callback) => {
	return async (dispatch, getState) => {
		const _data = data || getState().data?.data;
		api.post({ ..._data }, `/business/${_data?.key}/initialize`)
			.then((res) => {
				if (res?.error) {
					dispatch({ info: { noControls: false, message: res?.data?.detail || res?.message, status: "unknown" }, type: UPDATE })
					callback && callback(res)
				} else {
					dispatch({ data: _data, initialize: res, info: {}, type: UPDATE });
					callback && callback(res)
				}
			}).catch((err) => {
				console.log(err);
			});
	}
}


// data: {
// 	key: 'pk_test_cb8daec88491a8021c0dcc48d461a0c49720ce1a',
// 	amount: 50000,
// 	ref: '123456789024747',
// 	email: 'tobisholanke@gmail.com',
// 	name: 'Tobi Sholanke',
// 	phone: '08064670816',
// 	viewmode: 'AUTO'
//   },

export const updateValidatedPhone = (input = {}, callback) => {
	return async (dispatch, getState) => {
		// const _data = data || getState().data?.data;
		const { data, initialize, validatedMobile, selectedCoin, paymentCoin, transactionId } = getState().data
		const selectedCoinR = input?.coin || selectedCoin;

		if(paymentCoin && paymentCoin?.coin === selectedCoinR?.coin && paymentCoin?.address === selectedCoinR?.address && transactionId){
			dispatch({ paymentCoin: selectedCoinR, type: UPDATE })
			callback && callback(true)
			return;
		}
		if(selectedCoinR?.address && transactionId){
			dispatch({ paymentCoin: selectedCoinR, type: UPDATE })
			callback && callback(true)
			return;
		}

		dispatch({ info: { message: "Updating transaction, please wait...", status: "processing" }, type: UPDATE })

		const payload = {
			transactionId: transactionId,
			payment_coin: selectedCoinR.coin,
			item_price_fiat: data.amount,
			item_price_crypto: selectedCoinR.amount,
			identifier: initialize?.merchant?.identifier,
			user: {
				email: data?.email,
				name: data?.name,
				phone: (input.validatedMobile || validatedMobile).replace(/ /g, ""),
			},
			// reference: data?.ref,
		};

		api.post({ ...payload }, `/transaction/gateway/start_payment/`)
			.then((res) => {
				
				if (res?.data?.address) {
					const coins = initialize?.coins || [];

					dispatch({
						initialize: {
							...initialize,
							coins: coins.map((coin) => {
								if (coin.coin === selectedCoinR.coin) return { ...coin, address: res?.data?.address }
								return coin;
							}),
						},

						transactionId: res?.data?.identifier,
						paymentCoin: { 
									...selectedCoinR, 
									address: res?.data?.address,  
									amount: res?.data?.amount_crypto,
									coin: res?.data?.crypto_currency
							},
						info: {},
						type: UPDATE
					});
					callback && callback(true)
				} else {
					alert(
						"Unable to generate deposit address for this transaction, please try again later or contact us.",
					);
				}
				dispatch({ info: {}, type: UPDATE })

			}).catch((err) => {
				console.log(err);
			});
	}
}


export const continuousConfirmation = (callback) => {
	return async (dispatch, getState) => {
		const { transactionId, initialize, paymentStatus } = getState().data
		const interval = setInterval(() => {
			if (!paymentStatus?.terminate){
				api.post({ transactionId }, `/transaction/gateway/${initialize?.merchant?.identifier}/confirm_payment/`)
				.then(res => {
					dispatch({ paymentStatus: res, type: UPDATE });
					callback && callback(res);
					if(res?.tarminate){
						clearInterval(interval)
					}
				}).catch(err => {
					console.log(err)
				})
			}else {
				clearInterval(interval)
			}
		}, 1000 * 60);
	}
}

export const updatePaymentAddress = (
	{ index = -1, selectedCoin = null, pageTitle = "" },
	callback,
) => {
	// return { ...data, type: UPDATE };
	return async (dispatch, getState) => {
		const { data, initialize, paymentCoin } = getState().data;

		if(paymentCoin && paymentCoin?.coin === selectedCoin?.coin && paymentCoin?.address === selectedCoin?.address){
			dispatch({ paymentCoin: selectedCoin, type: UPDATE })
			callback && callback(true)
			return;
		}
		if(selectedCoin?.address){
			dispatch({ paymentCoin: selectedCoin, type: UPDATE })
			callback && callback(true)
			return;
		}

		api
			.post(
				{ ...data, coin: selectedCoin.coin },
				`/business/${data?.key}/generate_payment_address`,
			)
			.then((res) => {
				if (res?.data?.address) {
					const coins = initialize?.coins || [];

					dispatch({
						initialize: {
							...initialize,
							coins: coins.map((coin) => {
								if (coin.coin === selectedCoin.coin) return { ...coin, address: res?.address }
								return coin;
							}),
						},
						paymentCoin: { ...selectedCoin, address: res?.address },
						type: UPDATE
					});
					callback && callback(true)
				} else {
					alert(
						"Unable to generate deposit address for this transaction, please try again later or contact us.",
					);
				}
			})
			.catch((err) => {
				console.log(err);
			});
	};
};
