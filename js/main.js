"use strict";

const inputElement = document.querySelector(".js-input");
const cardSeriesElement = document.querySelector(".js-card-series");
const inputBtnElement = document.querySelector(".js-button");

//variables de datos globales:

let dataSeriesList = []; //Array que guarda la busqueda de las series
let favoriteSeries = []; //Array que guarda los favoritos
const urlPlaceholder =
  "https://via.placeholder.com/210x295/ffffff/666666/? text=TV.";

//Get series from API and access the date we need

function getDataFromApi() {
  const inputValue = inputElement.value;
  fetch(`https://api.tvmaze.com/search/shows?q=${inputValue}`)
    .then((response) => response.json())
    .then((shows) => {
      dataSeriesList = [];
      for (const show of shows) {
        dataSeriesList.push(show.show);
      }

      renderCards();
      setInLocalStorage();
    });
}

//local storage

function setInLocalStorage() {
  const stringSeries = JSON.stringify(dataSeriesList);
  localStorage.setItem("series", stringSeries);
}
function getFromLocalStorage() {
  const localStorageSeries = localStorage.getItem("series");
  if (localStorageSeries === null) {
    getDataFromApi();
  } else {
    const arraySeries = JSON.parse(localStorageSeries);
    dataSeriesList = arraySeries;
    renderCards();
  }
}

//Arrancar la página
getFromLocalStorage();

//prevent the form from refreshing and sending data

function handleSearchBtn(ev) {
  ev.preventDefault();
  getDataFromApi();
  getFromLocalStorage();
  renderCards();
}

inputBtnElement.addEventListener("click", handleSearchBtn);

//paint main series list

function renderCards() {
  cardSeriesElement.innerHTML = "";
  let htmlCode = "";

  // if it is in favourites, it adds a class to the li, so I can give it a different background colour; if it is not, it does not add it.
  for (const show of dataSeriesList) {
    let isFavoriteClass;
    if (isFavoriteSerie(show)) {
      isFavoriteClass = "card__list--selected";
    } else {
      isFavoriteClass = "";
    }
    htmlCode += `<li class="js-list card__list ${isFavoriteClass}" id="${show.id}">`;
    htmlCode += `<h2 class="card__title js-card__title">${show.name}</h2>`;
    htmlCode += `<p>${show.status}</p>`;

    if (show.image === null) {
      htmlCode += `<img
    class="js-image"
    src= "${urlPlaceholder}"
    alt="serie sin foto"
  />`;
    } else {
      htmlCode += `<img
      class="js-image"
      src="${show.image.medium}"
      alt="${show.name}"
    />`;
    }
    htmlCode += "</li>";
  }
  cardSeriesElement.innerHTML = htmlCode;

  listenSeriesClick();
}

// test if the series I receive on the parameter is in the favourite list by linking clicked "li" id in main series list to the "li" id in favourite series list

function isFavoriteSerie(show) {
  const favoriteFound = favoriteSeries.find((favoriteSerie) => {
    return favoriteSerie.id === show.id;
  });

  // if found with "find", it returns undefined.

  if (favoriteFound === undefined) {
    return false;
  } else {
    return true;
  }
}

//listen to the event on each card on the main series list

function listenSeriesClick() {
  const listElementSeries = document.querySelectorAll(".js-list");
  for (const iterator of listElementSeries) {
    iterator.addEventListener("click", handleAddFavorites);
  }
}
//  check if the clicked card (id) on the main list is in favourites array or not. If it is not, push it, if it is, remove it.

function handleAddFavorites(ev) {
  const clickedSerieId = parseInt(ev.currentTarget.id);
  const serieFound = dataSeriesList.find(function (serie) {
    return serie.id === clickedSerieId;
  });

  const serieFoundIndex = favoriteSeries.findIndex(function (favorite) {
    return favorite.id === clickedSerieId;
  });

  if (serieFoundIndex === -1) {
    favoriteSeries.push(serieFound);
  } else {
    favoriteSeries.splice(serieFoundIndex, 1);
  }
  renderCards();
  renderFavoriteCards();
  setInLocalStorage();
}

// paint list with favourite movies

function renderFavoriteCards() {
  const cardFavoriteElement = document.querySelector(".js-favorite__series");
  cardFavoriteElement.innerHTML = "";
  let htmlCode = "";
  for (let favoriteSerie of favoriteSeries) {
    htmlCode += `<li class="js-list card__list--favorite" id="${favoriteSerie.id}">`;
    htmlCode += `<h2 class="favorite__title--card js-card__title">${favoriteSerie.name}</h2><i id="${favoriteSerie.id}"class="far fa-times-circle js-buttonRemove" title="Eliminar serie de favoritos" aria-hidden="true"></i>`;

    if (favoriteSerie.image === null) {
      htmlCode += `<img class="favorite-img"
    src= "${urlPlaceholder}"
    alt="serie sin foto"
  />`;
    } else {
      htmlCode += `<img
      class="js-image favorite-img"
      src="${favoriteSerie.image.medium}"
      alt="${favoriteSerie.name}"
    />`;
    }
    htmlCode += "</li>";
    cardFavoriteElement.innerHTML = htmlCode;

    addListenersToDeleteButtons();
  }

  handleRunFavorites(ev);
  // renderCards();
}
function handleRunFavorites(ev) {
  ev.preventDefault();
  renderFavoriteCards();
}

// listen to individual remove buttons

const addListenersToDeleteButtons = () => {
  const buttonsRemove = document.querySelectorAll(".js-buttonRemove");

  for (const button of buttonsRemove) {
    button.addEventListener("click", removeFavorite);
  }
};

// link clicked element id to id of favourite series array; then remove the clicked element

const removeFavorite = (ev) => {
  const clickedButton = parseInt(ev.currentTarget.id);

  const favElementId = favoriteSeries.findIndex(
    (series) => series.id === clickedButton
  );
  if (favElementId !== -1) {
    favoriteSeries.splice(favElementId, 1);
  }

  renderFavoriteCards();
  renderCards();
};

// inputLogElement.addEventListener("click", handleRunFavorites);

// Remove all favorites series

const buttonRemoveAll = document.querySelector(".js-buttonRemoveAll");

const removeAllFavorites = () => {
  localStorage.clear("favoriteSeries");
  favoriteSeries = [];
  renderFavoriteCards();
  renderCards();
};

buttonRemoveAll.addEventListener("click", removeAllFavorites);
