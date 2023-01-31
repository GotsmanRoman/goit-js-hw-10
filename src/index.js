import './css/styles.css';
import throttle from 'lodash.throttle';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import countryListTpl from './templates/countryList.hbs';
import countryInfoTpl from './templates//countryInfo.hbs';

const DEBOUNCE_DELAY = 300;
const refs = {
  searchInput: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

function resetHtmlResult() {
  refs.countryList.innerHTML = '';
  refs.countryInfo.innerHTML = '';
}
function onSearch(e) {
  e.preventDefault();

  const query = refs.searchInput.value.trim();
  if (query.length === 0) {
    resetHtmlResult();
    return;
  }
  fetchCountryName(query);
}
Notiflix.Notify.init({
  width: '280px',
  position: 'center-top', // 'right-top' - 'right-bottom' - 'left-top' - 'left-bottom' - 'center-top' - 'center-bottom' - 'center-center'
  distance: '100px',
  clickToClose: true,
});
function showNotify(valueToFade = '2000') {
  Notiflix.Notify.info(
    'Too many matches found. Please enter a more specific name',
    {
      timeout: valueToFade,
    }
  );
}
function showError(valueToFade = '2000') {
  Notiflix.Notify.failure('Oops, there is no country with that name', {
    timeout: valueToFade,
  });
}
function isResponseOk(response) {
  if (response.status !== 200) {
    throw new Error(response.status);
  }
}

function fetchCountryName(searchQuery) {
  const searchBy = 'name';
  const searchOptions = [
    'fullText=true',
    'name',
    'capital',
    'population',
    'flags',
    'languages',
  ];
  return fetch(
    `https://restcountries.com/v3.1/${searchBy}/${searchQuery}?fields=${searchOptions.join(
      ','
    )}`
  )
    .then(response => {
      // Response handling
      isResponseOk(response);
      return response.json();
    })
    .then(data => {
      // Data handling
      resetHtmlResult();
      if (data.length > 10) {
        showNotify();
        return;
      }
      if (data.length > 1) {
        refs.countryList.innerHTML = countryListTpl(data);
      } else {
        refs.countryInfo.innerHTML = countryInfoTpl(data);
      }

      return data;
    })
    .catch(error => {
      // Error handling
      showError();
    });
}

refs.searchInput.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));
