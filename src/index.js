import { url } from "./node_env.js";
import "./pages/index.css";
import "./validation.js";
"use strict";

const keyAuthorization = 'ae01fe3c-3e9a-4d54-b1bb-9b4ebe7933cd';
const addButton = document.querySelector('.button');
const closeButton = document.querySelector('.popup__close');
const addEditButton = document.querySelector('.button_edit');
const closeEditButton = document.querySelector('.edit__close');
const userName = document.querySelector('.user-info__name');
const userJob = document.querySelector('.user-info__job');
const imagePopup = document.querySelector('.popup__image');
const imgPopup = document.createElement("img");
const closeImg = document.querySelector('.image__close');
const userAvatar = document.querySelector('.user-info__photo');
export const addUserButton = document.querySelector('.popup__button');
export const saveButton = document.querySelector('.popup__button_edit');
export const editName = document.querySelector('.edit__name');
export const editJob = document.querySelector('.edit__job');
export const inputName = document.querySelector('.popup__input_type_name');
export const inputLink = document.querySelector('.popup__input_type_link-url');
let cardlist;

class Api {
    constructor(options) {
        this.baseUrl = options.baseUrl;
        this.headersAuth = options.headers.authorization;
        this.headers = options.headers;
    }

    getInitialCards() {
        return fetch(`${this.baseUrl}/cards`, {
            headers: {
                authorization: this.headersAuth
            }
        })
            .then(res => {
                if (res.ok) {
                    return res.json();
                }
                return Promise.reject(`Ошибка: ${res.status}`);
            })
            .then((res) => {
                return res;
            })
            .catch((err) => {
                console.log(err);
            });
    }

    getUser() {
        return fetch(`${this.baseUrl}/users/me`, {
            headers: {
                authorization: this.headersAuth
            }
        })
            .then(res => {
                if (res.ok) {
                    return res.json();
                }
                return Promise.reject(`Ошибка: ${res.status}`);
            })
            .then((res) => {
                return res;
            })
            .catch((err) => {
                console.log(err);
            });
    }

    updateUserInfo() {
        fetch(`${this.baseUrl}/users/me`, {
            method: 'PATCH',
            headers: this.headers,
            body: JSON.stringify({
                name: userName.textContent,
                about: userJob.textContent
            })
        })
            .then(res => {
                if (res.ok) {
                    return res.json();
                }
                return Promise.reject(`Ошибка: ${res.status}`);
            })
            .catch((err) => {
                console.log(err);
            });
    }
}

// Создаем класс и передаем параметры
const api = new Api({
    baseUrl: url,
    headers: {
        authorization: keyAuthorization,
        'Content-Type': 'application/json'
    }
});

class Card {
    constructor(name, link) {
        this.element = this.create(name, link);
    }

    static like(e) {
        e.target.classList.toggle('place-card__like-icon_liked');
    }

    static remove() {
        const card = event.target.closest('.place-card');
        card.parentNode.removeChild(card);
    }

    create(name, link) {
        // очень много кода в методе, лучше разнести по разным методам внутри класса
        const cardContainer = document.createElement('div');
        cardContainer.classList.add('place-card');

        const cardImage = document.createElement('div');
        cardImage.classList.add('place-card__image');
        cardImage.style.backgroundImage = `url(${link})`;

        cardImage.addEventListener('click', function () {
            // вынести в отдельный метод
            const imageContentPopup = document.querySelector('.popup__image_content');
            imagePopup.classList.add('popup_is-opened');
            imgPopup.classList.add('img__content');
            imgPopup.src = link;
            imgPopup.style.maxHeight = '80vh';
            imgPopup.style.maxWidth = '80vw';
            imageContentPopup.appendChild(imgPopup);
        });

        const cardButton = document.createElement('button');
        cardButton.classList.add('place-card__delete-icon');
        cardButton.addEventListener('click', function (e) {
            Card.remove();
            e.stopPropagation();
        });

        const cardDescription = document.createElement('div');
        cardDescription.classList.add('place-card__description');

        const cardName = document.createElement('h3');
        cardName.classList.add('place-card__name');
        cardName.textContent = name;

        const likeButton = document.createElement('button');
        likeButton.classList.add('place-card__like-icon');
        likeButton.addEventListener('click', function (e) {
            Card.like(e);
        });

        cardContainer.appendChild(cardImage);
        cardImage.appendChild(cardButton);
        cardContainer.appendChild(cardDescription);
        cardDescription.appendChild(cardName);
        cardDescription.appendChild(likeButton);

        return cardContainer;
    }
}

class CardList {
    constructor(cardsContainer, initialCards) {
        this.cardsContainer = cardsContainer;
        this.initialCards = initialCards;
    }

    addCard() { /* Можно лучше: в метод лучше передавать данные карточки, а не брать из полей ввода, 
        теоретически карточки могут добавляться из разных мест */
        const card = new Card(inputName.value, inputLink.value);
        const cardElement = card.element;
        this.cardsContainer.appendChild(cardElement);

        /* Можно лучше: сброс полей формы не относится к функционалу списка карточек, 
        лучше его вызывать там где происходит отправка формы */
        inputName.value = '';
        inputLink.value = '';
    }

    render() {
        for (let i = 0; i < this.initialCards.length; i++) {
            const card = new Card(this.initialCards[i].name, this.initialCards[i].link);
            const cardElement = card.element;
            this.cardsContainer.appendChild(cardElement);
        }
    }
}

class Popup {
    constructor(popupElement) {
        this.popupElement = popupElement;
    }

     open() {
        this.popupElement.classList.add('popup_is-opened');
    }

    close() {
        this.popupElement.classList.remove('popup_is-opened');
    }
}

const profileEditPopup = new Popup(document.querySelector('.popup__edit'));
const addCardPopup = new Popup(document.querySelector('.popup'));
const addImagePopup = new Popup(document.querySelector('.popup__image'));

// Обновляем инфу об юзере
api.getUser()
    .then((res) => {
        userName.textContent = res.name;
        userJob.textContent = res.about;
        userAvatar.style.backgroundImage = `url(${res.avatar})`;
    });

// Создаем начальные карточки
api.getInitialCards()
    .then((initialCards) => {
        cardlist = new CardList(document.querySelector('.places-list'), initialCards);
        cardlist.render();
    });

// Обновление профиля
function updateProfile() {
    userName.textContent = editName.value;
    userJob.textContent = editJob.value;
}



// Обработчики
// лучше вынести в отдельный класс и вызывать в самом конце, не всегда надо вызывать обработчики
// а только по необходимости на той странице где они необходимы.
addButton.addEventListener('click', function () {
    addCardPopup.open();
});

addUserButton.addEventListener('click', function (e) {
    e.preventDefault();
    cardlist.addCard();
    addCardPopup.close();
});

closeButton.addEventListener('click', function () {
    addCardPopup.close();
});

addEditButton.addEventListener('click', function () {
    profileEditPopup.open();
    editName.value = userName.textContent;
    editJob.value = userJob.textContent;
});

closeEditButton.addEventListener('click', function () {
    profileEditPopup.close();
});

saveButton.addEventListener('click', function (e) {
    e.preventDefault();
    updateProfile();
    profileEditPopup.close();
    api.updateUserInfo();
});

closeImg.addEventListener('click', function () {
    addImagePopup.close();
});

 


/**
 * Хорошо что разобрались с гитом, webpack и babel, уже похвально
 * 
 * Необходимо оформить readmi.mb
* README.md должно быть рассписано как запустить проект, пошагово, что из себя представляет проект.
* Представьте что вы отдедите свой проект своему другу через 5 лет и вы двлжны рассказать что и за чем он, какую несёт цель и так далее
 * 
 * Вы сделали много веток, но они между собой рознятся. Надо вливать из одной ветки в другую. 
 * В мастере работа не ведётся. Одна задача, одна ветка
 * 
 * Рекоммендация по написанию коммитов https://habr.com/ru/post/416887/
 * 
 * Можно лучше: Вынесите все названия в отдельный модуль допустим lang в виде объекта. Представьте, что вас попросили добавить второй язык )
 * 
 * Рефакторинг(можно лучше): Вынесите все классы по разным файлам. Один класс = один файл.
 * Так проще разобраться в коде другим разработчикам 
 * 
 */

