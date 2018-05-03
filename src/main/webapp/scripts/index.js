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
    document.getElementById('login-content').classList.remove('hidden');
    document.getElementById('register-content').classList.add('hidden');
    document.getElementById('register-button').addEventListener('click', onRegisterClick);
}

document.addEventListener('DOMContentLoaded', onLoad);
