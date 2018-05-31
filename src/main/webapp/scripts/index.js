const OK = 200;
const NO_CONTENT = 204;
const BAD_REQUEST = 400;
const UNAUTHORIZED = 401;
const NOT_FOUND = 404;
const CONFLICT = 409;
const INTERNAL_SERVER_ERROR = 500;

let mainDiv;

function newMessage(targetEl, classes, message) {
    clearMessages();

    const pEl = document.createElement('p');
    pEl.classList.add(classes);
    pEl.textContent = message;

    targetEl.appendChild(pEl);
}

function onNetWorkError() {
    console.log(this);
}

function clearMessages() {
    const messageEls = document.getElementsByClassName('message');
    for (let i = 0; i < messageEls.length; i++) {
        const messageEl = messageEls[i];
        messageEl.remove();
    }
}

function clearMainContent() {
    mainDiv.textContent = '';
}

function showContents(ids) {
    const contentEls = document.getElementsByClassName('content');
    for (let i = 0; i < contentEls.length; i++) {
        const contentEl = contentEls[i];
        if (ids.includes(contentEl.id)) {
            contentEl.classList.remove('hidden');
        } else {
            contentEl.classList.add('hidden');
        }
    }
    const topnav = document.getElementById('topnav-content');
    const spacer = document.getElementById('topnav-spacer');
    spacer.classList = topnav.classList;
}

function removeAllChildren(el) {
    while (el.firstChild) {
        el.removeChild(el.firstChild);
    }
}

function onLoad() {
    mainDiv = document.getElementById('main-content');

    document.getElementById('register-button').addEventListener('click', onRegisterClick);
    document.getElementById('login-button').addEventListener('click', onLoginClick);
    document.getElementById('logout-button').addEventListener('click', onLogoutClick);
    document.getElementById('menu-dashboard').addEventListener('click', showDashboard);
    document.getElementById('menu-profile').addEventListener('click', onMenuProfileClick);
    document.getElementById('menu-log').addEventListener('click', onMenuLogClick);
    document.getElementById('sound-content').addEventListener('click', onSoundClicked);
}

document.addEventListener('DOMContentLoaded', onLoad);
