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
        if (user.admin) {
            onUsersMenu();
        }
    } else {
        const messageEl = document.getElementById('message-content');
        messageEl.innerHTML = json.message;
        showContents(['login-content', 'message-content']);
    }
}

function onUsersMenu() {
    const topDiv = document.getElementById('topnav-content');

    const usersMenuAEl = document.createElement('a');
    usersMenuAEl.href = 'javascript:void(0)';
    usersMenuAEl.id = 'show-users-menu';
    usersMenuAEl.textContent = 'Users';

    const iEl = document.createElement('i');
    iEl.className = 'fa fa-user-circle';
    usersMenuAEl.appendChild(iEl);

    topDiv.appendChild(usersMenuAEl);
    return usersMenuAEl;
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
