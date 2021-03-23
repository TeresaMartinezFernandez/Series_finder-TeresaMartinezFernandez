"use strict";

const inputElement = document.querySelector(".js-input");
const cardSeriesElement = document.querySelector(".js-card-series");
const inputBtnElement = document.querySelector(".js-button");

//variables de datos globales:

let dataSeriesList = []; //Array que guarda la busqueda de las series
let favoriteSeries = []; //Array que guarda los favoritos
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

//CAMPO DE BUSQUEDA

function handleSearchBtn(ev) {
  ev.preventDefault();
  getDataFromApi();
  getFromLocalStorage();
  renderCards();
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
// funcion que añade al array de favoritos la serie seleccionada y la quita
function handleAddFavorites(ev) {
  const clickedSerieId = parseInt(ev.currentTarget.id);

  const serieFoundIndex = favoriteSeries.findIndex(function (favorite) {
    return favorite.id === clickedSerieId;
  });

  if (serieFoundIndex === -1) {
    const serieFound = dataSeriesList.find(function (serie) {
      return serie.id === clickedSerieId;
    });

    favoriteSeries.push(serieFound);
  } else {
    favoriteSeries.splice(serieFoundIndex, 1);
  }
  renderCards();
  renderFavoriteCards();
}

//funcion que renderiza las series favoritas

function renderFavoriteCards() {
  const cardFavoriteElement = document.querySelector(".js-favorite__series");
  cardFavoriteElement.innerHTML = "";
  let htmlCode = "";
  for (let favoriteSerie of favoriteSeries) {
    htmlCode += `<li class="js-list card__list--favorite" id="${favoriteSerie.id}">`;
    htmlCode += `<h2 class="favorite__title--card js-card__title">${favoriteSerie.name}</h2><i class="far fa-times-circle js-buttonRemove" title="Eliminar serie de favoritos" aria-hidden="true"></i>`;

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
  }

  handleRunFavorites(ev);
  // renderCards();
}
function handleRunFavorites(ev) {
  ev.preventDefault();
  renderFavoriteCards();
}

inputLogElement.addEventListener("click", handleRunFavorites);

//FUNCION PARA ELIMINAR TODOS LOS FAVORITOS A LA VEZ
const buttonRemoveAll = document.querySelector(".js-buttonRemoveAll");

const removeAllFavorites = () => {
  favoriteSeries = [];
  renderFavoriteCards();
};

buttonRemoveAll.addEventListener("click", removeAllFavorites);

//FUNCION PARA ELIMINAR INDIVIDUALMENTE CADA SERIE

const removeFavorite = (ev) => {
  const clickedButton = ev.currentTarget;
  const clickedButtonParentId = parseInt(clickedButton.parentElement.id);
  const favElementId = favoriteSeries.findIndex(
    (favorite) => favorite.id === clickedButtonParentId
  );
  favoriteSeries.splice(favElementId, 1);
  // saveFavoritesOnLocalStorage();
  renderFavoriteCards();
};

const addListenersToDeleteButtons = () => {
  const buttonsRemove = document.querySelectorAll(".js-buttonRemove");
  for (const button of buttonsRemove) {
    button.addEventListener("click", removeFavorite);
  }
};
