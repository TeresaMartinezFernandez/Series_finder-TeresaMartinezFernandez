"use strict";

const inputElement = document.querySelector(".js-input");
const cardSeriesElement = document.querySelector(".js-card-series");
const inputBtnElement = document.querySelector(".js-button");
const cardFavoriteElement = document.querySelector(".js-favorite__series");
const inputLogElement = document.querySelector(".js-log");

//variables de datos globales:

let dataSeriesList = [];
let favoriteSeries = [];
const urlPlaceholder =
  "https://via.placeholder.com/210x295/ffffff/666666/? text=TV.";

//pido la lista de series al API

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

//CAMPO DE BUSQUEDA

function handleSearchBtn(ev) {
  ev.preventDefault();
  getDataFromApi();
  getFromLocalStorage();
}

inputBtnElement.addEventListener("click", handleSearchBtn);

//Pongo en la página las series buscadas

function renderCards() {
  cardSeriesElement.innerHTML = "";
  let htmlCode = "";
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

function isFavoriteSerie(show) {
  const favoriteFound = favoriteSeries.find((favoriteSerie) => {
    return favoriteSerie.id === show.id;
  });
  if (favoriteFound === undefined) {
    return false;
  } else {
    return true;
  }
}

//escucho click de favoritas
function listenSeriesClick() {
  const listElementSeries = document.querySelectorAll(".js-list");
  for (const iterator of listElementSeries) {
    iterator.addEventListener("click", handleAddFavorites);
  }
}

//escucho evento favoritas
function handleAddFavorites(ev) {
  const clickedSerieId = parseInt(ev.currentTarget.id);
  const serieFound = dataSeriesList.find(function (serie) {
    return serie.id === clickedSerieId;
  });
  favoriteSeries.push(serieFound);
  renderCards();
}

//añado mis series favoritas a su sección, no he conseguido que las series favoritas aparezcan pintadas en su sección, he probado a poner la funcion renderFavoriteCards despues de escuchar el evento de favoritas y me sale errores en consola.

function renderFavoriteCards() {
  cardFavoriteElement.innerHTML = "";
  let htmlCode = "";

  htmlCode += `<li class="js-list card__list" id="${favoriteSerie.id}">`;
  htmlCode += `<h2 class="card__title js-card__title">${favoriteSerie.name}</h2>`;

  if (favoriteSerie.image === null) {
    htmlCode += `<img
    class="js-image"
    src= "${urlPlaceholder}"
    alt="serie sin foto"
  />`;
  } else {
    htmlCode += `<img
      class="js-image"
      src="${favoriteSerie.image.medium}"
      alt="${favoriteSerie.name}"
    />`;
  }
  htmlCode += "</li>";
  cardFavoriteElement.innerHTML = htmlCode;
  handleRunFavorites(ev);
}
function handleRunFavorites(ev) {
  ev.preventDefault();
  for (const favoriteSerie of favoriteSeries) {
    console.log(favoriteSerie.name, favoriteSerie.image.medium);
  }
}

inputLogElement.addEventListener("click", handleRunFavorites);
