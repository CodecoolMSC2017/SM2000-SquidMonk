let passwordInputEl;
let mainContentEl;

function onLoginResponse() {
    passwordInputEl.value = '';
    const json = JSON.parse(this.responseText);
    if (this.status === OK) {
        localStorage.setItem('user', JSON.stringify(json));
        showContents(['topnav-content', 'main-content', 'logout-content']);
        mainContentEl = document.getElementById('main-content');
        mainContentEl.textContent = "Welcome " + json.name;
        mainContentEl.appendChild(setupMainContentEl());
    } else {
        const messageEl = document.getElementById('message-content');
        messageEl.innerHTML = json.message;
        showContents(['login-content', 'message-content']);
    }
}

function setupMainContentEl() {
    const taskUl = document.createElement('ul');
    const user = JSON.parse(localStorage.getItem('user'));

    return taskUl;
}

function onNetworkError() {
    console.log('network error');
}

function onLoginClick() {
    const loginFormEl = document.forms['login-form'];
    const emailInputEl = loginFormEl.querySelector('input[name="email"]');
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