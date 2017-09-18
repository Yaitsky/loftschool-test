/**
 * ДЗ 7.2 - Создать редактор cookie с возможностью фильтрации
 *
 * На странице должна быть таблица со списком имеющихся cookie:
 * - имя
 * - значение
 * - удалить (при нажатии на кнопку, выбранная cookie удаляется из браузера и таблицы)
 *
 * На странице должна быть форма для добавления новой cookie:
 * - имя
 * - значение
 * - добавить (при нажатии на кнопку, в браузер и таблицу добавляется новая cookie с указанным именем и значением)
 *
 * Если добавляется cookie с именем уже существующией cookie, то ее значение в браузере и таблице должно быть обновлено
 *
 * На странице должно быть текстовое поле для фильтрации cookie
 * В таблице должны быть только те cookie, в имени или значении которых есть введенное значение
 * Если в поле фильтра пусто, то должны выводиться все доступные cookie
 * Если дабавляемая cookie не соответсвуте фильтру, то она должна быть добавлена только в браузер, но не в таблицу
 * Если добавляется cookie, с именем уже существующией cookie и ее новое значение не соответствует фильтру,
 * то ее значение должно быть обновлено в браузере, а из таблицы cookie должна быть удалена
 *
 * Для более подробной информации можно изучить код тестов
 *
 * Запрещено использовать сторонние библиотеки. Разрешено пользоваться только тем, что встроено в браузер
 */

/**
 * homeworkContainer - это контейнер для всех ваших домашних заданий
 * Если вы создаете новые html-элементы и добавляете их на страницу, то дабавляйте их только в этот контейнер
 *
 * @example
 * homeworkContainer.appendChild(...);
 */
let homeworkContainer = document.querySelector('#homework-container');
let filterNameInput = homeworkContainer.querySelector('#filter-name-input');
let addNameInput = homeworkContainer.querySelector('#add-name-input');
let addValueInput = homeworkContainer.querySelector('#add-value-input');
let addButton = homeworkContainer.querySelector('#add-button');
let listTable = homeworkContainer.querySelector('#list-table tbody');

updateAndShowAllCookies();

function isMatching(full, chunk) {
    let string = full.toLowerCase(),
        substring = chunk.toLowerCase();

    if (string.indexOf(substring) + 1) {
        return true;
    }

    return false;
}

function createCookie(name, value) {
    let date = new Date;
  
    date.setDate(date.getDate() + 1);
    document.cookie = name+'='+value+'; expires='+date;
}

function deleteCookie(name) {
    document.cookie = `${name}=; expires=${new Date(1970, 1, 1)}`;
}

function createCookieTr(name, value) {
    let rowElem = document.createElement('tr'),
        tdName = document.createElement('td'),
        tdValue = document.createElement('td'),
        tdButton = document.createElement('td'),
        deleteButton = document.createElement('button');

    listTable.appendChild(rowElem);
    rowElem.appendChild(tdName);
    rowElem.appendChild(tdValue);
    rowElem.appendChild(tdButton);

    tdName.innerText = name;
    tdName.classList.add('tdName');
    tdValue.innerText = value;
    tdValue.classList.add('tdValue');
    tdButton.appendChild(deleteButton);
    deleteButton.innerText = 'Удалить';

    deleteButton.addEventListener('click', function () {
        deleteCookie(name);
        updateAndShowAllCookies();
    });
}

function deleteCookieTr(name) {
    let rows = listTable.children;

    for (let item of rows) {
        if (item.cells[0].innerText == name) {
            item.remove();
        }
    }
}

function getCookies() {
    var cookies = document.cookie
        .split('; ')
        .filter(Boolean)
        .map(cookie => cookie.match(/^([^=]+)=(.+)/))
        .reduce((obj, [, name, value]) => {
            obj[name] = value;

            return obj;
        }, {});
    console.log(cookies);
    return cookies;
}

function updateAndShowFilteredCookies(array) {
    listTable.innerHTML = '';

    for (let prop in array) {
        createCookieTr(prop, array[prop]);
    }
}

function updateAndShowAllCookies() {
    let allCookiesArray = getCookies();

    listTable.innerHTML = '';

    for (var prop in allCookiesArray) {
        createCookieTr(prop, allCookiesArray[prop]);
    }
}

filterNameInput.addEventListener('keyup', function() {
    var value = filterNameInput.value.trim(),
        cookiesFilteredArray = getCookies();

    for (var prop in cookiesFilteredArray) {
        if (!(isMatching(prop, value) || isMatching(cookiesFilteredArray[prop], value))) {
            delete cookiesFilteredArray[prop];
        }
    }

    if (value === '') {
        updateAndShowAllCookies()
    } else {
        updateAndShowFilteredCookies(cookiesFilteredArray);
    }
});

addButton.addEventListener('click', () => {
    var cookieName = addNameInput.value,
        cookieValue = addValueInput.value,
        filterValue = filterNameInput.value.trim(),
        cookiesFilteredArray = getCookies();

    for (var prop in cookiesFilteredArray) {
        if (!(isMatching(prop, filterValue) || isMatching(cookiesFilteredArray[prop], filterValue))) {
            delete cookiesFilteredArray[prop];
        }
    }

    if (filterValue === '') {
        createCookie(cookieName, cookieValue);
        updateAndShowAllCookies();
    } else if (!(isMatching(cookieName, filterValue)
        || (isMatching(cookieValue, filterValue)))) {
        createCookie(cookieName, cookieValue);
        deleteCookieTr(cookieName);
    } else {
      if ((cookieName in cookiesFilteredArray)
          && !isMatching(cookiesFilteredArray[cookieName], filterValue)) {
          createCookie(cookieName, cookieValue);
          deleteCookieTr(cookieName);
      } else {
          createCookie(cookieName, cookieValue);
          cookiesFilteredArray[cookieName] = cookieValue;
          updateAndShowFilteredCookies(cookiesFilteredArray);
      }
    }

    setTimeout(function () {
        addNameInput.value = '';
        addValueInput.value = '';
    }, 100);
});
