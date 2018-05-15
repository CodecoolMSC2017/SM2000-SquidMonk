const OK = 200;
const BAD_REQUEST = 400;
const UNAUTHORIZED = 401;
const NOT_FOUND = 404;
const INTERNAL_SERVER_ERROR = 500;

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
    document.getElementById('menu-dashboard').addEventListener('click', onMenuDashboardClick);
}

document.addEventListener('DOMContentLoaded', onLoad);
