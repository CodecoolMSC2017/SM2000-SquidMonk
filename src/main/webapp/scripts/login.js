let loginDivEl;
let loginFormEl;
let loginFirstLoad = true;

function onLoad() {
    if (!loginFirstLoad) {
        loginDivEl.style.display = 'block';
        registerDivEl.style.display = 'none';
    } else {
        loginFirstLoad = false;
        const loginH1El = document.createElement('h1');
        loginH1El.textContent = 'Login';

        const loginEmailInput = document.createElement('input');
        loginEmailInput.name = 'email';
        loginEmailInput.required = true;
        loginEmailInput.placeholder = 'E-mail';

        const loginPassInput = document.createElement('input');
        loginPassInput.name = 'password';
        loginPassInput.type = 'password';
        loginPassInput.required = true;
        loginPassInput.placeholder = 'Password';

        const loginSubmit = document.createElement('button');
        loginSubmit.textContent = 'Login';
        loginSubmit.addEventListener('click', onLoginClick);

        const registerButton = document.createElement('button');
        registerButton.textContent = 'Register';
        registerButton.type = 'button';
        registerButton.addEventListener('click', onRegisterClick);

        loginFormEl.appendChild(loginEmailInput);
        loginFormEl.appendChild(document.createElement('br'));
        loginFormEl.appendChild(loginPassInput);
        loginFormEl.appendChild(document.createElement('br'));
        loginFormEl.appendChild(loginSubmit);
        loginFormEl.appendChild(registerButton);

        loginDivEl.appendChild(loginH1El);
        loginDivEl.appendChild(loginFormEl);
    }
}

function onLoginClick() {
    const emailInputEl = loginFormEl.querySelector('input[name="email"]');
    const passwordInputEl = loginFormEl.querySelector('input[name="password"]');

    const email = emailInputEl.value;
    const password = passwordInputEl.value;
}

document.addEventListener('DOMContentLoaded', (event) => {
    loginDivEl = document.getElementById("login-content");
    loginFormEl = document.forms['login-form'];
    onLoad();
});