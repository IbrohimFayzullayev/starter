'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP
// console.log(new Date().toISOString());
// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  movementsDate: [
    '2022-03-9T11:28:33.503Z',
    '2022-03-10T11:28:33.503Z',
    '2022-03-11T11:28:33.503Z',
    '2022-03-12T11:28:33.503Z',
    '2022-03-13T11:28:33.503Z',
    '2022-03-14T11:28:33.503Z',
    '2022-03-15T11:28:33.503Z',
    '2022-03-16T11:28:33.503Z',
  ],
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

accounts.forEach(function (val) {
  val.username = val.owner
    .toLowerCase()
    .split(' ')
    .map(function (val) {
      return val[0];
    })
    .join('');
});

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
/////////////////////////////////////////////////
//// FUNCTIONS

const ekrangaChiqarish = function (obj) {
  containerMovements.innerHTML = '';
  obj.movements.forEach(function (val, key) {
    let sanalar = new Date(obj.movementsDate[key]);
    let tekshir = val > 0 ? 'deposit' : 'withdrawal';
    let qalay = `<div class="movements__row">
    <div class="movements__type movements__type--${tekshir}">${
      key + 1
    } ${tekshir}</div>
    <div class="movements__date">${obj.movementsDate[key]}</div>
    <div class="movements__value">${val}???</div>
  </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', qalay);
  });
};

const sumAmount = function (obj) {
  let summa = obj.movements.reduce(function (sum, val) {
    return sum + val;
  }, 0);
  return summa;
};
let sumIn = 0;
let sumOut = 0;
let komissiya = 0;

const summary = function (obj) {
  let sumIn = obj.movements.reduce(function (sum, val) {
    if (val > 0) {
      return sum + val;
    } else {
      return sum;
    }
  }, 0);
  return sumIn;
};
const summaryOut = function (obj) {
  let sumOut = obj.movements.reduce(function (sum, val) {
    if (val < 0) {
      return sum + val;
    } else {
      return sum;
    }
  }, 0);
  return sumOut;
};
const inter = function (obj) {
  let inter = summary(obj) / 100;
  return inter;
};

const all = function (kirganUser) {
  ekrangaChiqarish(kirganUser);
  labelBalance.textContent = sumAmount(kirganUser) + '???';
  labelSumIn.textContent = `${summary(kirganUser)}???`;
  labelSumOut.textContent = `${summaryOut(kirganUser)}???`;
  labelSumInterest.textContent = `${inter(kirganUser)}???`;
};

let kirganUser;

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  let login = inputLoginUsername.value;
  let parol = Number(inputLoginPin.value);

  kirganUser = accounts.find(function (val) {
    return val.username === login;
  });
  if (kirganUser?.pin == parol) {
    labelWelcome.textContent = `Welcome ${kirganUser.owner}`;
    containerApp.style.opacity = '1';
    labelWelcome.style.color = '#333';
  } else {
    labelWelcome.textContent = `Try Again!`;
    labelWelcome.style.color = 'red';
    containerApp.style.opacity = '0';
  }
  inputLoginUsername.value = inputLoginPin.value = '';
  all(kirganUser);
});

let oluvchiUser;

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  let loginName = inputTransferTo.value;
  let amountSum = Number(inputTransferAmount.value);

  oluvchiUser = accounts.find(function (val) {
    return val.username === loginName && loginName !== kirganUser.username;
  });
  inputTransferTo.value = inputTransferAmount.value = '';
  if (
    amountSum > 0 &&
    amountSum < sumAmount(kirganUser) &&
    oluvchiUser.username !== kirganUser.username
  ) {
    oluvchiUser.movements.push(amountSum);
    kirganUser.movements.push(-amountSum);
    all(kirganUser);
  } else {
    alert('Login yoki pinkod xato bolishi mumkin');
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  let giveSum = Number(inputLoanAmount.value);
  inputLoanAmount.value = '';
  labelBalance.textContent = sumAmount(kirganUser) + '???';
  if (giveSum < Number(sumAmount(kirganUser)) * 0.1 && giveSum > 0) {
    kirganUser.movements.push(giveSum);
    all(kirganUser);
  } else {
    alert('siz bunday summa qarzga ololmaysiz');
  }
});
let findUserKey;
btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  let userName = inputCloseUsername.value;
  let userPin = Number(inputClosePin.value);
  inputClosePin.value = inputCloseUsername.value = '';
  if (userName === kirganUser.username && userPin === kirganUser.pin) {
    let index = accounts.indexOf(kirganUser);
    containerApp.style.opacity = '0';
    accounts.splice(index, 1);
    labelWelcome.textContent = `Log in to get started`;
  } else {
    alert('Login yoki pinkod xato bolishi mumkin');
  }
});
let checker = 1;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  if (checker) {
    movements = [...kirganUser.movements];
    kirganUser.movements.sort((a, b) => a - b);
    checker = 0;
    ekrangaChiqarish(kirganUser);
  } else {
    kirganUser.movements = [...movements];
    checker = 1;
    ekrangaChiqarish(kirganUser);
  }
});

function timerEnd() {
  if (labelTimer.textContent === '00:00') {
    containerApp.style.opacity = '0';
    timerLand();
  }
}
let vaqt = 4;
let sekund = 59;
function timerLand() {
  sekund = sekund - 1;
  if (sekund == 0) {
    vaqt = vaqt - 1;
    sekund = 59;
  }
  if (sekund < 10) {
    sekund = `0${sekund}`;
  }

  labelTimer.textContent = `0${vaqt}:${sekund}`;
  timerEnd();
}

setInterval(timerLand, 1000);

function dateLand() {
  // let soat = String(new Date().getHours()).padStart(2, 0);
  // let minut = String(new Date().getMinutes()).padStart(2, 0);
  // let sek = String(new Date().getSeconds()).padStart(2, 0);
  // let kun = String(new Date().getDate()).padStart(2, 0);
  // let oy = String(new Date().getMonth() + 1).padStart(2, 0);
  // let yil = String(new Date().getFullYear());
  // labelDate.textContent = `${kun}/${oy}/${yil} ${soat}:${minut}:${sek}`;
  let hozir = new Date();
  let options = {
    day: 'numeric',
    year: 'numeric',
    month: 'long',
    weekday: 'long',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  };
  let nav = navigator.language;
  let date = new Intl.DateTimeFormat('nav', options).format(hozir);
  labelDate.textContent = date;
}
setInterval(dateLand, 1000);

let rang = 1;
labelBalance.addEventListener('click', function () {
  if (rang) {
    [...document.querySelectorAll('.movements__row')].forEach(function (
      val,
      key
    ) {
      if (key % 2 == 0) {
        val.style.backgroundColor = 'blue';
      } else {
        val.style.backgroundColor = 'green';
      }
    });
    rang = 0;
  } else {
    [...document.querySelectorAll('.movements__row')].forEach(function (
      val,
      key
    ) {
      val.style.backgroundColor = 'white';
    });
    rang = 1;
  }
});

// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

let movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////
