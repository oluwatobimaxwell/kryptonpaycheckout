import { Api } from "../../classes/Api";
import { retrieveFromStorage, saveToStorage } from "../../utils/Functions";
import { UPDATE } from "./types";

const api = new Api();
const INITIAL_STORED_VALUE = retrieveFromStorage(UPDATE)||{};

export const updateData = (data = {}) => {
	saveToStorage({ name: UPDATE, value: { ...INITIAL_STORED_VALUE, ...data } })
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
		const { data, initialize, validatedMobile, selectedCoin, paymentCoin, transactionId, updatingCoin } = getState().data
		const selectedCoinR = input?.coin || selectedCoin;

		const timeChange = (new Date().getTime() - paymentCoin?.time)/1000/60
	
		if (updatingCoin) return;
		
		

		if(!input?.forceUpdate){

			if(paymentCoin && paymentCoin?.coin === selectedCoinR?.coin && paymentCoin?.address === selectedCoinR?.address && transactionId && timeChange < 5){
				dispatch({ ...getState().data, paymentCoin: selectedCoinR, type: UPDATE })
				callback && callback(true)
				return;
			}
			if(selectedCoinR?.address && transactionId && timeChange < 5){
				dispatch({...getState().data, paymentCoin: selectedCoinR, type: UPDATE })
				callback && callback(true)
				return;
			}

			dispatch({ ...getState().data, info: { message: "Updating transaction, please wait...", status: "processing" }, type: UPDATE })
		}


		const payload = {
			transactionId: transactionId,
			payment_coin: selectedCoinR.coin,
			item_price_fiat: data.amount,
			item_price_crypto: selectedCoinR.amount,
			identifier: initialize?.merchant?.identifier,
			user: {
				email: data?.email,
				name: data?.name,
				phone: (input.validatedMobile || validatedMobile || data?.phone).replace(/ /g, ""),
			}
		};

		dispatch({ updatingCoin: true, type: UPDATE });

		( transactionId ? api.post({ ...payload }, `/transaction/gateway/${transactionId}/refresh_payment/`) : api.post({ ...payload }, `/transaction/gateway/start_payment/`))
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
								rate: res?.data?.rate,
								coin: res?.data?.crypto_currency,
								time: new Date().getTime()
							},
						info: {},
						next_refresh: res?.next_refresh,
						updatingCoin: false,
						type: UPDATE
					});
					callback && callback(true)

				} else {
					dispatch({ updatingCoin: false, info: { message: res?.message || `${selectedCoinR?.coin} network is currenly not available, please try again later or pay with another coin.`, status: "failed" }, type: UPDATE })
				}

			}).catch((err) => {
				console.log(err);
			});
	}
}


export const refreshPayment = (callback) => {
	return async (dispatch, getState) => {
		const { transactionId, initialize, paymentStatus } = getState().data

		const res = await api.post({ }, `/transaction/gateway/${transactionId}/refresh_payment/`);

			api.post({ transactionId }, `/transaction/gateway/${transactionId}/confirm_payment/`)
			.then(res => {
				dispatch({ paymentStatus: res, type: UPDATE });
				callback && callback(res);
			}).catch(err => {
				console.log(err)
			})

	}
}

function getAllSubstrings(str) {
	var i, j, result = [];
  
	for (i = 0; i < str.length; i++) {
		for (j = i + 1; j < str.length + 1; j++) {
			result.push(str.slice(i, j));
		}
	}
	return result;
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
