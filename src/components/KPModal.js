/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import { useNavigate } from 'react-router-dom';
import { getIcon } from '../utils/Functions';
import { SvgIcon } from './SvgIcon';
const changeMode = () => {
    const html = document.getElementsByTagName('html')[0]
    const body = document.getElementsByTagName('body')[0]
  
    if(html.classList.contains('is-dark')){
      html.classList.remove('is-dark');
      body.classList.remove('is-dark');
    }else{
      html.classList.add('is-dark');
      body.classList.add('is-dark');
    }
  }
  
  

export const KPModal = ({ children, view = 0, changeCoin, initMode='AUTO', loading, changeTheme, nonIntegrated, businessId }) => {

    const navigate = useNavigate();

    const [mode, setMode] = React.useState(true)
  
    const change = () => {
      changeMode();
      setMode(!mode);
    }
  
    React.useEffect(() => {
      switch (initMode.toUpperCase()) {
        case 'NIGHT':
          change()
          break;
        case 'AUTO':
          const time = new Date().getHours()
          if(time > 15 || time < 7) change()
          break;
        default:
          break;
      }
  
    }, [initMode])

    const cancel = () => {
        window.parent.postMessage({ action: "cancelpayment", data: {}, krypton_pay: true }, "*");
    }
  
    return (
     
    <div id="demo-small-modal" className={`modal h-modal is-small ${!loading ? "is-active":""}`}>
    <div className="modal-background h-modal-close" />
    <div className="modal-content" >
      <div className="modal-card" style={ window.innerWidth < 900  ? { minHeight: window.innerHeight } : {}}>
        <header className="modal-card-head">
          <div className="modal-title-d">
            <SvgIcon name={"cart"} size={30} />
            <div style={{ marginLeft: 10 }}>
            <h3 style={{ fontSize: 16, margin: 0 }}>CHECKOUT</h3>
            <h6 style={{ marginTop: -5 }}>Secure & Easy Checkout</h6>
            </div>
          </div>
          <button className="h-modal-close ml-auto" onClick={change}>
          <a className="code-trigger is-active" onClick={() => changeTheme && changeTheme()}>
           <SvgIcon name={mode?"moon":"sun"} size={15} />
        </a>
          </button>
        </header>
        <div className="modal-card-body">
          <div className="inner-content">
              {children}
          </div>
        <div style={{ height: 10, width: '100%' }} />
        </div>
        <div className="modal-card-foot is-centered">
          <div className="modal-footer-1">
        {view < 2 && (
          <div className="is-centered" style={{ width: 'max-content', margin: 'auto' }}>
            {view > 0 && (
              <button className="button h-button" onClick={() => {
                changeCoin();
  
              }}>
              <span className="icon">
                <SvgIcon name={"chevrons-left"} />
              </span>
              <span>Change Coin</span>
              </button>
            )}
          {!nonIntegrated && (
          <button onClick={cancel} className="button h-button">
          <span className="icon">
            <SvgIcon name={"close"} />
          </span>
          <span>Cancel Payment</span>
          </button>
          )}
          {nonIntegrated && window.location.pathname === "/" && !loading && (
          <button onClick={() => {
            navigate(`/pay/${businessId}`)
          }} className="button h-button">
          <span className="icon" dangerouslySetInnerHTML={{ __html: getIcon("edit") }}/>
          <span>Edit Payment</span>
          </button>
          )}
          
          </div>
        )}
  
  
          <div className="modal-footer-logo">
          {/* <img className="avatar" src={'./images/logo-big.png'}  alt="logo" /> */}
          <img className="avatar" src={require("../assets/images/logo-big.png").default}  alt="logo" />
          </div>
          </div>
        </div>
      </div>
    </div>
  </div>
    )
  }