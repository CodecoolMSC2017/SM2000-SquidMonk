let passwordInputEl;
let mainContentEl;
let emailInputEl;
let isGoogle = false;
let profileImgUrl;

function handleLoginResponse(xhr) {
    if (xhr.status === OK) {
        localStorage.setItem('user', xhr.responseText);

        showDashboard();

        const user = JSON.parse(xhr.responseText);
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
        const userImgEl = document.getElementById('user-img');
        if (isGoogle) {
            userImgEl.style.display = 'block';
            userImgEl.src = profileImgUrl;
            userImgEl.className = 'top-user-img';
        } else {
            userImgEl.style.display = 'none';
        }
    } else {
        const message = JSON.parse(xhr.responseText);
        // error message when failed login
    }
}

function onLoginResponse() {
    const xhr = this;
    isGoogle = false;
    passwordInputEl.value = '';
    handleLoginResponse(xhr);
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

function onGoogleSignInResponse() {
    const xhr = this;
    isGoogle = true;
    handleLoginResponse(xhr);
}

function onSignIn(googleUser) {
    const params = new URLSearchParams();
    const id_token = googleUser.getAuthResponse().id_token;
    params.append('idToken', id_token);

    const profile = googleUser.getBasicProfile();
    profile.id = 'google-profile';
    const profileImg = profile.getImageUrl();
    profileImgUrl = profileImg;

    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', onGoogleSignInResponse);
    xhr.open('POST', 'googleLogin');
    xhr.send(params);
};
