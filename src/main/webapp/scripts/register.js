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
        registerFormEl.appendChild(createRegisterTable());
        registerDivEl.appendChild(registerFormEl);
    }
}

function createNameTd() {
    const nameTd = document.createElement('td');
    nameTd.colSpan = '2';
    const nameInput = document.createElement('input');
    nameInput.placeholder = 'Name';
    nameInput.name = 'name';
    nameInput.required = true;
    nameTd.appendChild(nameInput);
    return nameTd;
}

function createRegButtonTd() {
    const regButtonTd = document.createElement('td');
    regButtonTd.style.width = '50%';
    const registerButtonEl = document.createElement('button');
    registerButtonEl.textContent = 'Register';
    registerButtonEl.style.width = '100%';
    registerButtonEl.addEventListener('click', onRegButtonClick);
    regButtonTd.appendChild(registerButtonEl);
    return regButtonTd;
}

function createBackButtonTd() {
    const backButtonTd = document.createElement('td');
    backButtonTd.style.width = '50%';
    const backButtonEl = document.createElement('button');
    backButtonEl.textContent = 'Back';
    backButtonEl.style.width = '100%';
    backButtonEl.type = 'button';
    backButtonEl.addEventListener('click', onLoad);
    backButtonTd.appendChild(backButtonEl);
    return backButtonTd;
}

function createRegisterTable() {
    const regTable = document.createElement('table');
    regTable.className = "form-table";
    const regTBody = document.createElement('tbody');

    const regH1Tr = document.createElement('tr');
    regH1Tr.appendChild(createLoginH1Th('Register'));

    const nameTr = document.createElement('tr');
    nameTr.appendChild(createNameTd());

    const emailTr = document.createElement('tr');
    emailTr.appendChild(createEmailTd());

    const passwordTr = document.createElement('tr');
    passwordTr.appendChild(createPasswordTd('password', 'Password'));

    const passconfTr = document.createElement('tr');
    passconfTr.appendChild(createPasswordTd('passconf', 'Confirm Password'));

    const buttonTr = document.createElement('tr');
    buttonTr.appendChild(createRegButtonTd());

    buttonTr.appendChild(createBackButtonTd());

    regTBody.appendChild(regH1Tr);
    regTBody.appendChild(nameTr);
    regTBody.appendChild(emailTr);
    regTBody.appendChild(passwordTr);
    regTBody.appendChild(passconfTr);
    regTBody.appendChild(buttonTr);

    regTable.appendChild(regTBody);

    return regTable;
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