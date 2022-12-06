const bodyEl = document.querySelector('body');

// 当前时间和采样时间
const currentDatetimeEl = document.querySelector('.current-datetime');
const testingMonthEl = document.querySelector('.testing-month');
const testingDayEl = document.querySelector('.testing-day');
const testingHourEl = document.querySelector('.testing-hour');
const testingMinuteEl = document.querySelector('.testing-minute');

const peopleNameEl = document.querySelector('.people-name');
const peopleIdentityCardEl = document.querySelector('.people-identity-card');
const peoplePhoneEl = document.querySelector('.people-phone');

const placeNameEl = document.querySelector('.place-name');
const placeDateEl = document.querySelector('.place-date');
const placeLocationEl = document.querySelector('.place-location');

const peopleLSKey = '__hc__peoples';
const peopleSelectClassName = 'people-select';
const peopleDialogClassName = 'people-select-dialog';
const placeLSKey = '__hc__places';
const placeSelectClassName = 'place-select';
const placeDialogClassName = 'place-select-dialog';

let peopleSelectDialog = document.querySelector(`.${peopleSelectClassName}`);
let placeSelectDialog = document.querySelector(`.${placeDialogClassName}`);

let qrcodeEl = document.querySelector('.health-card-qr-inner');
let qrcode = null;

setInterval(() => {
  currentDatetimeEl.innerText = getCurrentDatetime();
}, 1000);

function getCurrentDatetime(format = 'YYYY-MM-DD HH:mm:ss') {
  return dayjs().format(format);
}

function setTestingDatetime() {
  const result = dayjs(dayjs().subtract(1, 'day').format('YYYY-MM-DD'));
  testingMonthEl.innerText = result.month() + 1;
  testingDayEl.innerText = result.date();
  testingHourEl.innerText = result.hour() + _.random(14, 17);
  testingMinuteEl.innerText = result.minute() + _.random(1, 59);
}

// document.querySelector('.submit').addEventListener('click', () => {
//   let fileReader = new FileReader();
//   fileReader.onload = function () {
//     let parsedJSON = JSON.parse(fileReader.result);
//     handler(parsedJSON);
//   };
//   fileReader.readAsText(document.querySelector('.file').files[0]);
// });
// function handler(json) {
//   console.log(json);
// }

function listener(event) {
  const el = event.target;
  const type = _.get(el, 'dataset.event');

  switch (type) {
    case 'storage-people':
      storagePeople();
      break;
    case 'storage-place':
      storagePlace();
      break;
    case 'select-people':
      selectPeople();
      break;
    case 'select-place':
      selectPlace();
      break;
    case 'clean-storage':
      cleanStorage();
      break;
    default:
      break;
  }
}

function storagePeople() {
  const result = prompt('Please enter your peoples');
  if (result) {
    localStorage.setItem('__hc__peoples', result);
    initPeople();
  }
}

function storagePlace() {
  let result = prompt('Please enter your places');
  if (result) {
    localStorage.setItem('__hc__places', result);
    initPlace();
  }
}

function cleanStorage() {
  localStorage.removeItem('__hc__title');
  localStorage.removeItem('__hc__encrypted');
  localStorage.removeItem('__hc__template');
}

function initSelect({
  lsKey,
  selectClassName,
  dialogClassName,
  textPropertyName,
  valuePropertyName,
  selectChangeHandler,
}) {
  const selectWrapperClassName = `${selectClassName}-wrapper`;
  const selectWrapperSelector = `.${selectWrapperClassName}`;
  let selectWrapperEl = document.querySelector(selectWrapperSelector);

  const result = localStorage.getItem(lsKey);
  const list = JSON.parse(result);

  if (_.isArray(list)) {
    const newSelectEl = document.createElement('select');
    newSelectEl.classList.add(selectClassName);

    list.forEach((item) => {
      const option = document.createElement('option');
      option.text = item[textPropertyName];
      option.value = item[valuePropertyName];
      newSelectEl.add(option);
    });

    if (selectWrapperEl) {
      selectWrapperEl.replaceChildren(newSelectEl);
    } else {
      const dialogEl = document.createElement('div');
      dialogEl.classList.add('dialog', dialogClassName, 'hidden');
      selectWrapperEl = document.createElement('div');
      selectWrapperEl.classList.add(selectWrapperClassName);
      selectWrapperEl.append(newSelectEl);
      const closeEl = document.createElement('img');
      closeEl.src = 'assets/images/close.svg';
      closeEl.classList.add('dialog-close');
      closeEl.addEventListener('click', () => dialogEl.classList.add('hidden'));

      dialogEl.append(selectWrapperEl, closeEl);
      bodyEl.append(dialogEl);
    }

    newSelectEl.addEventListener('change', (event) => {
      const value = event.target.value;
      const item = list.find((item) => item[valuePropertyName] === value);
      selectChangeHandler(item);
    });

    return list;
  }

  return [];
}

function setPeopleSelectDialog() {
  if (!peopleSelectDialog) {
    peopleSelectDialog = document.querySelector(`.${peopleSelectClassName}`);
  }
}

function setPlaceSelectDialog() {
  if (!placeSelectDialog) {
    placeSelectDialog = document.querySelector(`.${placeDialogClassName}`);
  }
}

function initPeople() {
  const list = initSelect({
    lsKey: peopleLSKey,
    selectClassName: peopleSelectClassName,
    dialogClassName: peopleDialogClassName,
    textPropertyName: 'name',
    valuePropertyName: 'identity_card',
    selectChangeHandler: peopleChange,
  });

  peopleSelectDialog = document.querySelector(`.${peopleDialogClassName}`);

  if (_.isArray(list) && list.length > 0) {
    peopleChange(list[0]);
  }
}

function peopleChange({ id, name, identity_card, phone, vaccine }) {
  peopleNameEl.innerText = name;
  peopleIdentityCardEl.innerText = identity_card;
  peoplePhoneEl.innerText = phone;
  setVaccine(vaccine);
  createQrcode(id);
  peopleSelectDialog.classList.add('hidden');
}

function selectPeople() {
  peopleSelectDialog.classList.remove('hidden');
}

function setVaccine(vaccine) {
  const vaccineWrapperEl = document.querySelector('.vaccine-list-wrapper');
  const vaccineListEl = document.createElement('ul');
  vaccineListEl.classList.add('vaccine-list');

  // prettier-ignore
  vaccine.forEach(({ vaccination_date, vaccination_status, vaccination_order, vendor }) => {
      const liEl = document.createElement('li');
      liEl.classList.add('vaccine-item');
      const vaccinationDateEl = document.createElement('span');
      vaccinationDateEl.classList.add('vaccination-date');
      const vaccinationStatusEl = document.createElement('span');
      vaccinationStatusEl.classList.add('vaccination-status');
      const vaccinationOrderEl = document.createElement('span');
      vaccinationOrderEl.classList.add('vaccination-order');
      const vendorEl = document.createElement('span');
      vendorEl.classList.add('vendor');

      vaccinationDateEl.append(document.createTextNode(vaccination_date));
      vaccinationStatusEl.append(document.createTextNode(vaccination_status));
      vaccinationOrderEl.append(document.createTextNode(vaccination_order));
      vendorEl.append(document.createTextNode(`(${vendor})`));
      liEl.append(
        vaccinationDateEl,
        vaccinationStatusEl,
        vaccinationOrderEl,
        vendorEl
      );
      vaccineListEl.append(liEl);
    }
  );

  vaccineWrapperEl.replaceChildren(vaccineListEl);
}

function initPlace() {
  const list = initSelect({
    lsKey: placeLSKey,
    selectClassName: placeSelectClassName,
    dialogClassName: placeDialogClassName,
    textPropertyName: 'name',
    valuePropertyName: 'name',
    selectChangeHandler: placeChange,
  });

  placeSelectDialog = document.querySelector(`.${placeDialogClassName}`);

  if (_.isArray(list) && list.length > 0) {
    placeChange(list[0]);
  }
}

function placeChange({ name, address }) {
  placeNameEl.innerText = name;
  placeLocationEl.innerText = address;
  placeDateEl.innerText = getCurrentDatetime('YYYY-MM-DD HH:mm');
  placeSelectDialog.classList.add('hidden');
}

function selectPlace() {
  placeSelectDialog.classList.remove('hidden');
}

function createQrcode(value = '', colorDark = '#256a0a', colorLight = '#fff') {
  if (_.isNil(qrcode)) {
    qrcode = new QRCode(qrcodeEl, {
      text: value,
      colorDark,
      colorLight,
      correctLevel: QRCode.CorrectLevel.H,
    });
    return;
  }
  qrcode.makeCode(value);
}

setTestingDatetime();

initPeople();
initPlace();

document.addEventListener('click', listener);
