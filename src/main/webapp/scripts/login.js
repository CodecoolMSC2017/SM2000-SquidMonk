let passwordInputEl;
let mainContentEl;
let emailInputEl;

function onLoginResponse() {
    passwordInputEl.value = '';
    emailInputEl.value = '';
    const json = JSON.parse(this.responseText);
    if (this.status === OK) {
        localStorage.setItem('user', JSON.stringify(json));
        showContents(['topnav-content', 'main-content', 'sound-content']);
        mainContentEl = document.getElementById('main-content');
        mainContentEl.textContent = '';
        const divEl = document.createElement('div');
        divEl.id = 'welcome-text';
        divEl.textContent = "Welcome, " + json.name + "!";
        mainContentEl.appendChild(divEl);
        showDashboard();

        const user = JSON.parse(localStorage.getItem('user'));
        const usersButtonEl = document.getElementById('menu-users');
        const logButtonEl = document.getElementById('menu-log');
        if (user.admin) {
            usersButtonEl.style.display = 'block';
            usersButtonEl.addEventListener('click', onUsersMenuClick);

            logButtonEl.style.display = 'block';
            logButtonEl.addEventListener('click', onMenuLogClick);
        } else {
            usersButtonEl.style.display = 'none';
            logButtonEl.style.display = 'none';
        }
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

function onSignIn(googleUser) {
    // Useful data for your client-side scripts:
    var profile = googleUser.getBasicProfile();
    console.log("ID: " + profile.getId()); // Don't send this directly to your server!
    console.log('Full Name: ' + profile.getName());
    console.log('Given Name: ' + profile.getGivenName());
    console.log('Family Name: ' + profile.getFamilyName());
    console.log("Image URL: " + profile.getImageUrl());
    console.log("Email: " + profile.getEmail());

    // The ID token you need to pass to your backend:
    var id_token = googleUser.getAuthResponse().id_token;
    console.log("ID Token: " + id_token);
};
