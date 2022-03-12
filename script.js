'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
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
    let tekshir = val > 0 ? 'deposit' : 'withdrawal';
    let qalay = `<div class="movements__row">
    <div class="movements__type movements__type--${tekshir}">${
      key + 1
    } ${tekshir}</div>
    <div class="movements__date">3 days ago</div>
    <div class="movements__value">${val}€</div>
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
  ekrangaChiqarish(kirganUser);
  labelBalance.textContent = sumAmount(kirganUser) + '€';
  labelSumIn.textContent = `${summary(kirganUser)}€`;
  labelSumOut.textContent = `${summaryOut(kirganUser)}€`;
  labelSumInterest.textContent = `${inter(kirganUser)}€`;
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
  oluvchiUser.movements.push(amountSum);
  kirganUser.movements.push(-amountSum);
  ekrangaChiqarish(kirganUser);
  labelSumOut.textContent = `${summaryOut(kirganUser)}€`;
  labelBalance.textContent = sumAmount(kirganUser) + '€';
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  let giveSum = Number(inputLoanAmount.value);
  inputLoanAmount.value = '';
  labelBalance.textContent = sumAmount(kirganUser) + '€';
  if (giveSum < sumAmount / 10) {
    kirganUser.movements.push(giveSum);
  }

  ekrangaChiqarish(kirganUser);

  labelSumIn.textContent = `${summary(kirganUser)}€`;
  labelSumInterest.textContent = `${inter(kirganUser)}€`;
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
  }
});

btnSort.addEventListener('click', function (e) {
  let arr = [];
  kirganUser.movements.forEach(function (val) {
    if (val > 0) {
      arr.push(val);
    } else {
      arr.unshift(val);
    }
  });
  kirganUser.movements = [...arr];

  ekrangaChiqarish(kirganUser);
  labelBalance.textContent = sumAmount(kirganUser) + '€';
  labelSumIn.textContent = `${summary(kirganUser)}€`;
  labelSumOut.textContent = `${summaryOut(kirganUser)}€`;
  labelSumInterest.textContent = `${inter(kirganUser)}€`;
});

// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////
