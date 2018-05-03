function onRegisterClick() {
    showContents(['register-content']);
    document.getElementById('back-to-login-button').addEventListener('click', (event) => {
        showContents(['login-content']);
    });
    document.getElementById('reg-button').addEventListener('click', onRegButtonClick);
}

function onRegisterResponse() {
    if (this.status === 200) {
        const resp = JSON.parse(this.responseText);
        const text = resp.message;
        showContents(['login-content', 'message-content']);
        document.getElementById('message-content').textContent = text;
    }
}

function onNetworkError() {
    console.log('Network Error');
}

function onRegButtonClick() {
    const registerFormEl = document.forms['register-form'];
    const nameInputEl = registerFormEl.querySelector('input[name="name"]');
    const emailInputEl = registerFormEl.querySelector('input[name="email"]');
    const passwordInputEl = registerFormEl.querySelector('input[name="password"]');
    const passwordConfEl = registerFormEl.querySelector('input[name="passconf"]');

    const name = nameInputEl.value;
    const email = emailInputEl.value;
    const password = passwordInputEl.value;
    const passconf = passwordConfEl.value;

    if (password != passconf) {
        document.getElementById('message-content').textContent = 'Passwords do not match';
        showContents(['message-content', 'register-content']);
        return;
    }

    const params = new URLSearchParams();
    params.append('name', name);
    params.append('email', email);
    params.append('password', password);
    params.append('passconf', passconf);

    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', onRegisterResponse);
    xhr.addEventListener('error', onNetworkError);
    xhr.open('POST', 'register');
    xhr.send(params);
}