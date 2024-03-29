function trimPoints(str) {
  const parts = str.split('.');
  if (parts.length != 2) {
    return str;
  }
  return `${parts[0]}.${parts[1].substr(0, 4)}`;
}

function paddingZero(value) {
  return value < 10 ? `0${value}` : value;
}

function formatDateTime(date) {
  return `${date.getFullYear()}-${paddingZero(date.getMonth() + 1)}-${paddingZero(date.getDate())} ${paddingZero(date.getHours())}:${paddingZero(date.getMinutes())}:${paddingZero(date.getSeconds())}`;
}

function formatTime(date) {
  return `${paddingZero(date.getHours())}:${paddingZero(date.getMinutes())}:${paddingZero(date.getSeconds())}`;
}

function formatTimeW(date) {
  return `${date.getFullYear()}-${paddingZero(date.getMonth()+1)}-${paddingZero(date.getDate())} ${paddingZero(date.getHours())}:${paddingZero(date.getMinutes())}:${paddingZero(date.getSeconds())}`;
}

function requestAccounts() {
  if (conflux.isFluent) {
    return conflux.request({
      method: "cfx_requestAccounts"
    });
  } else {
    return conflux.send("cfx_requestAccounts");
  } 
}

const Units = [{
  name: 'T',
  exp: 30,
}, {
  name: 'G',
  exp: 27,
}, {
  name: 'M',
  exp: 24,
}, {
  name: 'K',
  exp: 21,
}, {
  name: 'CFX',
  exp: 18,
}, {
  name: 'mCFX',
  exp: 15,
}, {
  name: 'uCFX',
  exp: 12,
}, {
  name: 'GDrip',
  exp: 9,
}, {
  name: 'MDrip',
  exp: 6,
}, {
  name: 'KDrip',
  exp: 3,
}, {
  name: 'Drip',
  exp: 0,
}];

const TEN = new Big(10);

// use big.js to format
function prettyFormat(value) {
  const bigValue = new Big(value);
  for (let i = 0; i < Units.length; i++) {
    const toCompare = TEN.pow(Units[i].exp);
    if (bigValue.gte(toCompare)) {
      //let tval = bigValue.div(toCompare).toFixed(3);
      let tval = Math.round(bigValue.div(toCompare)*100)/100;
      return `${tval} ${Units[i].name}`;
    }
  }
}

function formatUnit(value, unitName) {
  const bigValue = new Big(value);
  for (let i = 0; i < Units.length; i++) {
    if (Units[i].name === unitName) {
      return `${bigValue.div(TEN.pow(Units[i].exp)).toFixed(3)} ${unitName}`;
    }
  }
  return value;
}
