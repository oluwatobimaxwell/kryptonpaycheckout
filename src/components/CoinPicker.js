import React from 'react'

export const CoinPicker = ( { coins=[], setCoin } ) => {
    return (
      <div className="columns is-multiline" style={{ display: 'flex' }}>
  
          {coins.map((coin, i) => {
            return (
              <div className={'crypto-button h-button column '} key={'coin-list-'+i} 
                  style={{ 
                      paddingBottom: 0, 
                      paddingRight: i%2 === 0 && `${0.75/2}rem`,
                      paddingLeft: i%2 !== 0 && `${0.75/2}rem`,
                      width: '50%',
                    }}
                    onClick={() => setCoin(coin)}
                >
                <div className="l-card" style={{ padding: 10, borderRadius: 5 }}>
                <div className="media-flex-center">
            <div className="h-icon is-info is-rounded" style={{ minWidth: 35, width: 35, height: 35 }}>
              <img 
                    className="crypto-icon"
                    style={{ width: 35, height: 35 }} 
                    src={`images/coins/${(coin.coin || "").toLowerCase()}.png`} alt="img" />
              <img 
                    className="crypto-icon-black"
                    style={{ width: 35, height: 35 }} 
                    src={`images/coins/${(coin.coin || "").toLowerCase()}-b.png`} alt="img" />
            </div>
            <div className="flex-meta">
                <span>{coin.coin}</span>
                <span>{coin.amount_8}</span>
            </div>
            <div className="flex-end">
  
            </div>
        </div>
                </div>
                </div>
            )
          })}
  
      </div>
    )
  }