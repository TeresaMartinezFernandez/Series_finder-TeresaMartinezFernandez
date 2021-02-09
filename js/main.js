"use strict";

const inputElement = document.querySelector(".js-input");
const cardElement = document.querySelector(".js-card");
const inputBtnElement = document.querySelector(".js-button");

//variables de datos globales:

let dataSeriesList = [];
let favoriteSeries = [];

//pido la lista de series al API

function getDataFromApi() {
  const inputValue = inputElement.value;
  fetch(`http://api.tvmaze.com/search/shows?q=${inputValue}`)
    .then((response) => response.json())
    .then((shows) => {
      dataSeriesList = [];
      for (const show of shows) {
        dataSeriesList.push(show.show);
      }
      //console.log(dataSeriesList);

      renderCards();
    });
}

//pintar tarjeta

function renderCards() {
  cardElement.innerHTML = "";
  let htmlCode = "";
  for (const show of dataSeriesList) {
    htmlCode += `<li class="js-list card__list">`;
    htmlCode += `<h2 class="card__title js-card__title">${show.name}</h2>`;

    if (show.image === null) {
      htmlCode += `<img
    class="js-image"
    src="https://via.placeholder.com/210x295/ffffff/666666/? text=TV."
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
  cardElement.innerHTML = htmlCode;
  //listen events

  const listElementSeries = document.querySelectorAll(".js-list");
  for (const iterator of listElementSeries) {
    iterator.addEventListener("click", handleAddFavorites);
  }
}

//CAMPO DE BUSQUEDA

function handleSearchBtn(ev) {
  ev.preventDefault();
  getDataFromApi();
}

inputBtnElement.addEventListener("click", handleSearchBtn);

//seleccionar de la lista las favoritas

function handleAddFavorites(ev) {
  const favoriteList = ev.currentTarget;
  favoriteList.classList.toggle("card__list--selected");
  //console.log(favoriteList);
  // añadir a favortios
  // repintar
  //favoriteSeries.push(favoriteList);
  renderCards();
}
