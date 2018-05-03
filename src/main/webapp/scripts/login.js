let loginDivEl;
let loginFormEl;
let loginFirstLoad = true;

function createLoginH1Th(h1) {
    const loginH1Th = document.createElement('th');
    loginH1Th.colSpan = '2';
    loginH1Th.textContent = h1;
    return loginH1Th;
}

function createEmailTd() {
    const emailTd = document.createElement('td');
    emailTd.colSpan = "2";
    const loginEmailInput = document.createElement('input');
    loginEmailInput.name = 'email';
    loginEmailInput.required = true;
    loginEmailInput.placeholder = 'E-mail';
    emailTd.appendChild(loginEmailInput);
    return emailTd;
}

function createPasswordTd(name, placeholder) {
    const passwordTd = document.createElement('td');
    passwordTd.colSpan = "2";
    const loginPassInput = document.createElement('input');
    loginPassInput.name = name;
    loginPassInput.type = 'password';
    loginPassInput.required = true;
    loginPassInput.placeholder = placeholder;
    passwordTd.appendChild(loginPassInput);
    return passwordTd;
}

function createLoginTd() {
    const loginTd = document.createElement('td');
    loginTd.style.width = '50%';
    const loginSubmit = document.createElement('button');
    loginSubmit.textContent = 'Login';
    loginSubmit.style.width = '100%';
    loginSubmit.addEventListener('click', onLoginClick);
    loginTd.appendChild(loginSubmit);
    return loginTd;
}

function createRegisterTd() {
    const regTd = document.createElement('td');
    regTd.style.width = '50%';
    const registerButton = document.createElement('button');
    registerButton.textContent = 'Register';
    registerButton.type = 'button';
    registerButton.style.width = '100%';
    registerButton.addEventListener('click', onRegisterClick);
    regTd.appendChild(registerButton);
    return regTd;
}

function setupLoginTable() {
    const loginTable = document.createElement('table');
    loginTable.className = 'form-table';
    const loginTBody = document.createElement('tbody');

    const loginH1Tr = document.createElement('tr');
    loginH1Tr.appendChild(createLoginH1Th('Login'));

    const emailTr = document.createElement('tr');
    emailTr.appendChild(createEmailTd());

    const passwordTr = document.createElement('tr');
    passwordTr.appendChild(createPasswordTd('password', 'Password'));

    const buttonTr = document.createElement('tr');
    buttonTr.appendChild(createLoginTd());
    buttonTr.appendChild(createRegisterTd());

    loginTBody.appendChild(loginH1Tr);
    loginTBody.appendChild(emailTr);
    loginTBody.appendChild(passwordTr);
    loginTBody.appendChild(buttonTr);
    loginTable.appendChild(loginTBody);
    return loginTable;
}

function onLoginClick() {
    const emailInputEl = loginFormEl.querySelector('input[name="email"]');
    const passwordInputEl = loginFormEl.querySelector('input[name="password"]');

    const email = emailInputEl.value;
    const password = passwordInputEl.value;
}

function onLoad() {
    loginDivEl = document.getElementById("login-content");
    loginFormEl = document.forms['login-form'];

    if (!loginFirstLoad) {
        document.getElementById('message-content').textContent = '';
        loginDivEl.style.display = 'block';
        registerDivEl.style.display = 'none';
    } else {
        loginFirstLoad = false;
        loginFormEl.appendChild(setupLoginTable());
        loginDivEl.appendChild(loginFormEl);
    }
}

document.addEventListener('DOMContentLoaded', onLoad);
