import "./pages/index.css";
"use strict";

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

let url;
if (NODE_ENV === 'production') {
    url = 'https://praktikum.tk/cohort1';
} else {
    url = 'http://praktikum.tk/cohort1';
}

console.log(NODE_ENV);

// Создаем класс и передаем параметры
const api = new Api({
    baseUrl: url,
    headers: {
        // Можно лучше: Ключи авторизации лучше выносить хотябы в константы в начало документа
        authorization: 'ae01fe3c-3e9a-4d54-b1bb-9b4ebe7933cd',
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
        const cardContainer = document.createElement('div');
        cardContainer.classList.add('place-card');

        const cardImage = document.createElement('div');
        cardImage.classList.add('place-card__image');
        cardImage.style.backgroundImage = `url(${link})`;

        cardImage.addEventListener('click', function () {
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

const addButton = document.querySelector('.button');
const addUserButton = document.querySelector('.popup__button');
const closeButton = document.querySelector('.popup__close');
const addEditButton = document.querySelector('.button_edit');
const closeEditButton = document.querySelector('.edit__close');
const saveButton = document.querySelector('.popup__button_edit');
const userName = document.querySelector('.user-info__name');
const userJob = document.querySelector('.user-info__job');
const editName = document.querySelector('.edit__name');
const editJob = document.querySelector('.edit__job');
const imagePopup = document.querySelector('.popup__image');
const imgPopup = document.createElement("img");
const closeImg = document.querySelector('.image__close');
const inputName = document.querySelector('.popup__input_type_name');
const inputLink = document.querySelector('.popup__input_type_link-url');
const profileEditPopup = new Popup(document.querySelector('.popup__edit'));
const addCardPopup = new Popup(document.querySelector('.popup'));
const addImagePopup = new Popup(document.querySelector('.popup__image'));
const userAvatar = document.querySelector('.user-info__photo');
let cardlist;

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

// Валидация (кнопки/пустая форма/ограничение по символам)
function check() {
    const errorField1 = document.querySelector('.error__1');
    const errorField2 = document.querySelector('.error__2');
    const errorField3 = document.querySelector('.error__3');
    const errorField4 = document.querySelector('.error__4');

    /* Можно лучше: дублирование кода задания активности кнопку, оучше вынести ег ов отдельную функцию */
    if (inputName.value.length > 1 && inputLink.value.length > 0 && inputName.value.length < 31) {
        addUserButton.removeAttribute('disabled', true);
        addUserButton.classList.add('popup__button_disabled');
    } else {
        addUserButton.setAttribute('disabled', true);
        addUserButton.classList.remove('popup__button_disabled');
    }

    if (editName.value.length > 1 && editJob.value.length > 1 && editName.value.length < 31 && editJob.value.length < 31) {
        saveButton.removeAttribute('disabled', true);
        saveButton.classList.add('popup__button_edit_disabled');
    } else {
        saveButton.setAttribute('disabled', true);
        saveButton.classList.remove('popup__button_edit_disabled');
    }

    /* Можно лучше: много дублирования кода валидации, лучше вынести его в отдельную
    функцию и передавать в неё ссылки на DOM элементы поля ввода и сообщения об ошибке */
    if (inputName.value.length === 0) {
        errorField1.textContent = 'Это обязательное поле';
    } else if (inputName.value.length > 1 && inputName.value.length < 31) {
        errorField1.textContent = '';
    } else {
        errorField1.textContent = 'Должно быть от 2 до 30 символов';
    }
    
    if (inputLink.value.length === 0) {
        errorField2.textContent = 'Это обязательное поле';
    } else if (inputLink.value.length > 1 && inputLink.value.length < 31) {
        errorField2.textContent = '';
    } else {
        errorField2.textContent = '';
    }

    if (editName.value.length === 0) {
        errorField3.textContent = 'Это обязательное поле';
    } else if (editName.value.length > 1 && editName.value.length < 31) {
        errorField3.textContent = '';
    } else {
        errorField3.textContent = 'Должно быть от 2 до 30 символов';
    }

    if (editJob.value.length === 0) {
        errorField4.textContent = 'Это обязательное поле';
    } else if (editJob.value.length > 1 && editJob.value.length < 31) {
        errorField4.textContent = '';
    } else {
        errorField4.textContent = 'Должно быть от 2 до 30 символов';
    }
}


// Обработчики
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

/*
Отлично!

    Ваши запросы отправляются правильными методами
    Вы верно обрабатываете коды ответа
    У вас присутствует обработка ошибок
    Весь функционал работает корректно

    Принято

 */