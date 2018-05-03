function onRegisterClick() {
    document.getElementById('login-content').classList.add('hidden');
    document.getElementById('register-content').classList.remove('hidden');
    document.getElementById('back-to-login-button').addEventListener('click', onLoad);
    document.getElementById('reg-button').addEventListener('click', onRegButtonClick);
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
    } else {
        document.getElementById('message-content').textContent = '';
    }
}