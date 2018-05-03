let registerDivEl;
let registerFormEl;
let registerFirstLoad = true;

function onRegisterClick() {
    if (!registerFirstLoad) {
        loginDivEl.style.display = 'none';
        registerDivEl.style.display = 'block';
    } else {
        loginDivEl.style.display = 'none';
        registerDivEl.style.display = 'block';
        registerFirstLoad = false;
        const registerH1El = document.createElement('h1');
        registerH1El.textContent = 'Register';

        const nameInput = document.createElement('input');
        nameInput.placeholder = 'Name';
        nameInput.name = 'name';
        nameInput.required = true;

        const emailInput = document.createElement('input');
        emailInput.placeholder = 'E-mail';
        emailInput.name = 'email';
        emailInput.required = true;

        const passInput = document.createElement('input');
        passInput.type = 'password';
        passInput.name = 'password';
        passInput.placeholder = 'Password';
        passInput.required = true;

        const passInputConf = document.createElement('input');
        passInputConf.type = 'password';
        passInputConf.name = 'passconf';
        passInputConf.placeholder = 'Password Confirmation';
        passInputConf.required = true;

        const registerButtonEl = document.createElement('button');
        registerButtonEl.textContent = 'Register';
        registerButtonEl.addEventListener('click', onRegButtonClick);

        const backButtonEl = document.createElement('button');
        backButtonEl.textContent = 'Back';
        backButtonEl.type = 'button';
        backButtonEl.addEventListener('click', onLoad);

        registerFormEl.appendChild(nameInput);
        registerFormEl.appendChild(document.createElement('br'));
        registerFormEl.appendChild(emailInput);
        registerFormEl.appendChild(document.createElement('br'));
        registerFormEl.appendChild(passInput);
        registerFormEl.appendChild(document.createElement('br'));
        registerFormEl.appendChild(passInputConf);
        registerFormEl.appendChild(document.createElement('br'));
        registerFormEl.appendChild(registerButtonEl);
        registerFormEl.appendChild(backButtonEl);

        registerDivEl.appendChild(registerH1El);
        registerDivEl.appendChild(registerFormEl);
    }
}

function onRegButtonClick() {
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
    } else {
        document.getElementById('message-content').textContent = '';
    }
}

document.addEventListener('DOMContentLoaded', (event) => {
    registerDivEl = document.getElementById('register-content');
    registerDivEl.style.display = 'none';
    registerFormEl = document.forms['register-form'];
});