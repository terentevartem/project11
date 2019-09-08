import { inputName, addUserButton, editName, saveButton, editJob, inputLink } from "./index.js";

window.check = function check() {
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
};