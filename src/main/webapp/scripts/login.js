let passwordInputEl;

function onLoginResponse() {
    if (this.status === 200) {
        passwordInputEl.value = '';
        const user = JSON.parse(this.responseText);
        localStorage.setItem('user', user);
        showContents(['main-content', 'logout-content']);
        document.getElementById('main-content').textContent = "Welcome " + user.name;
    }
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