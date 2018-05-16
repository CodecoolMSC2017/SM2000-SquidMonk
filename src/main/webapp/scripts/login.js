let passwordInputEl;
let mainContentEl;
let emailInputEl;

function onLoginResponse() {
    passwordInputEl.value = '';
    emailInputEl.value = '';
    const json = JSON.parse(this.responseText);
    if (this.status === OK) {
        localStorage.setItem('user', JSON.stringify(json));
        showContents(['topnav-content', 'main-content', 'logout-content']);
        mainContentEl = document.getElementById('main-content');
        mainContentEl.textContent = '';
        const divEl = document.createElement('div');
        divEl.id = 'welcome-text';
        divEl.textContent = "Welcome, " + json.name + "!";
        mainContentEl.appendChild(divEl);
        showDashboard();
    } else {
        const messageEl = document.getElementById('message-content');
        messageEl.innerHTML = json.message;
        showContents(['login-content', 'message-content']);
    }
}

function onSchedMouseClick() {
    const currId = this.id;
    console.log(currId);
}

function onTaskMouseClick() {
    const currId = this.id;
    console.log(currId);
}

function onNetworkError() {
    console.log('network error');
}

function onLoginClick() {
    const loginFormEl = document.forms['login-form'];
    emailInputEl = loginFormEl.querySelector('input[name="email"]');
    passwordInputEl = loginFormEl.querySelector('input[name="password"]');

    const email = emailInputEl.value;
    const password = passwordInputEl.value;

    const params = new URLSearchParams();
    params.append('email', email);
    params.append('password', password);

    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', onLoginResponse);
    xhr.addEventListener('error', onNetworkError);
    xhr.open('POST', 'login');
    xhr.send(params);
}
