const OK = 200;
const NO_CONTENT = 204;
const BAD_REQUEST = 400;
const UNAUTHORIZED = 401;
const NOT_FOUND = 404;
const INTERNAL_SERVER_ERROR = 500;

function newMessage(targetEl, classes, message) {
    clearMessages();

    const pEl = document.createElement('p');
    pEl.classList.add(classes);
    pEl.textContent = message;

    targetEl.appendChild(pEl);
}

function onNetWorkError() {
    
}

function clearMessages() {
    const messageEls = document.getElementsByClassName('message');
    for (let i = 0; i < messageEls.length; i++) {
        const messageEl = messageEls[i];
        messageEl.remove();
    }
}

function clearMainContent() {
    const mainDivEl = document.getElementById('main-content');
    mainDivEl.textContent = '';
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
    document.getElementById('register-button').addEventListener('click', onRegisterClick);
    document.getElementById('login-button').addEventListener('click', onLoginClick);
    document.getElementById('logout-button').addEventListener('click', onLogoutClick);
    document.getElementById('menu-dashboard').addEventListener('click', showDashboard);
    document.getElementById('menu-profile').addEventListener('click', onMenuProfileClick);
    document.getElementById('show-users-menu');
    document.getElementById('sound-content').addEventListener('click', onSoundClicked);
}

document.addEventListener('DOMContentLoaded', onLoad);
