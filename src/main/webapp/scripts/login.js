function onLoginResponse() {
    if (this.status === 200) {
        const resp = JSON.parse(this.responseText);
        const name = resp.name;
        showContents(['main-content']);
        document.getElementById('message-content').textContent = '';
        document.getElementById('main-content').textContent = "Welcome "+name;
    }
}

function onNetworkError() {
    console.log('onNetworkError()');
}

function onLoginClick() {
    const loginFormEl = document.forms['login-form'];
    const emailInputEl = loginFormEl.querySelector('input[name="email"]');
    const passwordInputEl = loginFormEl.querySelector('input[name="password"]');

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