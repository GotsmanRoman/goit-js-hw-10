import './css/styles.css';
import throttle from 'lodash.throttle';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

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
    // showWarning();
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
// function showWarning(valueToFade = '2000') {
//   Notiflix.Notify.warning('Input something, empty field!!', {
//     timeout: valueToFade,
//   });
// }

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
      console.log(response);
      return response.json();
    })
    .then(data => {
      // Data handling
      resetHtmlResult();
      console.log(data);
      if (data.length > 10) {
        showNotify();
        return;
      }
      if (data.length > 1) {
        data.forEach(elem => {
          let html2 = `
          <li class="country__item">
            <img src="${elem.flags.svg}" width=32px> ${elem.name['common']}
          </li>`;
          refs.countryList.insertAdjacentHTML('beforeend', html2);
        });
      } else {
        let html2 = `
        <li class="country__item">
          <img src="${data[0].flags.svg}" width=32px> ${data[0].name['common']}
        </li>`;
        refs.countryList.insertAdjacentHTML('beforeend', html2);

        let html = `
        <ul class="country__list">
        <li class="country__item">Capital: ${data[0].capital}</li>
        <li class="country__item">Population: ${data[0].population}</li>
        <li class="country__item">Language: ${Object.values(
          data[0].languages
        )}</li>`;

        refs.countryInfo.innerHTML = html;
      }

      return data;
    })
    .catch(error => {
      // Error handling
      showError();
    });
}

refs.searchInput.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));
