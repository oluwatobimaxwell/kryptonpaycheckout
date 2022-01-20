/* eslint-disable no-undef */
export function shortMoney(value) {
  const num = Number(value);
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1).replace(/\.0$/, "") + "B";
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  }
  return num;
}

export const toMoney = (amount = 0, symbol="₦", formatter) => {
  var money = (Math.abs(amount) || 0).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,");
  if(formatter) return formatter((symbol || "₦"), money);
  return (
    (amount < 0 ? "-" : "") +
    (symbol || "₦") +
    money
  );
};

export function formatSeconds(sec) {
  return parseInt((sec % 3600) / 60) > 0
      ? parseInt((sec % 3600) / 60) +
              "hr " +
              parseInt((sec % 3600) % 60) +
              "min"
      : parseInt((sec % 3600) % 60) + "min";
}

// save data to local storage
export function storeObject(data) {
  var saveData = JSON.parse(localStorage.saveData || null) || {};
  saveData[data.name] = data.value;
  saveData.time = new Date().getTime();
  localStorage.saveData = JSON.stringify(saveData);
  return true;
}

export const getIcon = (icon, attr={}) => {
  try {
      return feather.icons[icon].toSvg(attr)
  } catch (error) {
      return ""
  }
}

// retrieve data from local storage
export function getObject(key) {
  var saveData = JSON.parse(localStorage.saveData || null) || {};
  return saveData[key] || null;
}

// retrieve data from local storage
export function getString(key) {
  var saveData = JSON.parse(localStorage.saveData || null) || "";
  return saveData[key] || null;
}

export function validateEmail(email) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

export function isElementInView(el) {
  var top = el.offsetTop;
  var left = el.offsetLeft;
  var width = el.offsetWidth;
  var height = el.offsetHeight;

  while (el.offsetParent) {
    el = el.offsetParent;
    top += el.offsetTop;
    left += el.offsetLeft;
  }

  return (
    top < window.pageYOffset + window.innerHeight &&
    left < window.pageXOffset + window.innerWidth &&
    top + height > window.pageYOffset &&
    left + width > window.pageXOffset
  );
}


export function openFullscreen(elem) {
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.mozRequestFullScreen) {
    elem.mozRequestFullScreen();
  } else if (elem.webkitRequestFullscreen) {
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) {
    elem.msRequestFullscreen();
  }
}

export function closeFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen();
  }
}


export function removeTags(str) {
  if ((str===null) || (str===''))
      return false;
  else
      str = str.toString();
        
  // Regular expression to identify HTML tags in 
  // the input string. Replacing the identified 
  // HTML tag with a null string.
  return str.replace( /(<([^>]+)>)/ig, '');
}


export const toDataURL = url => fetch(url)
  .then(response => response.blob())
  .then(blob => new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(blob)
  }))


 export function formatPhoneNumber(x) {
  return x.replace(/\D+/g, '')
       .replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
  }


  export const processError = (error) => {
    var d = Object.values(error);
    var message = "";
    d.forEach(e => {
      e.forEach(i => {
        message += i+". "
      })
    })
    return message;
  }
  


// save data to local storage
export function saveToStorage(data) {
  try {
      var saveData = JSON.parse(localStorage.saveData || null) || {};
      saveData[data.name] = data.value;
      saveData.time = new Date().getTime();
      localStorage.saveData = JSON.stringify(saveData);
      return true;
  } catch (error) {
      console.log(error?.message)
  }
}

export function clearStorage() {
  localStorage.saveData = JSON.stringify({});
  return true;
}

// retrieve data from local storage
export function retrieveFromStorage(key) {
  var saveData = JSON.parse(localStorage.saveData || null) || {};
  return saveData[key] || null;
}