import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';
import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;
let countrySearch = null;

const { countryInput, countryList, countryInfo } = {
  countryInput: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

countryInput.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(evt) {
  countrySearch = evt.target.value.trim();
  if (countrySearch < 1) {
    return;
  }
  countryList.innerHTML = '';
  countryInfo.innerHTML = '';
  fetchCountries(countrySearch).then(data => {
    if (!data) {
      return;
    } else if (data.length > 10) {
      Notify.info('Too many matches found. Please enter a more specific name.');
    } else if (data.length > 1) {
      const markup = data
        .map(
          ({ name, flags }) => `<li class="country__item">
      <img class="country__flag" src="${flags.svg}" alt="${name.official}" width="20"/>
      <p class="country__name">${name.official}</p></li>`
        )
        .join('');
      countryList.innerHTML = markup;
    } else if (data.length === 1) {
      const markup = data.map(
        ({ name, flags, capital, languages, population }) =>
          `<div class="card__title">
          <img class="card__flag" src="${flags.svg}" alt="${
            name.official
          }" width="20" />
          <p class="card__name">${name.official}</p>
        </div>
        <p class="info"><span class="info__title">Capital: </span>${capital}</p>
        <p class="info"><span class="info__title">Population: </span>${population}</p>
        <p class="info"><span class="info__title">Languages: </span>${Object.values(
          languages
        ).join(', ')}</p>`
      );

      countryInfo.innerHTML = markup;
    }
  });
}
