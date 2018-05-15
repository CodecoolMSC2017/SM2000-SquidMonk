let passwordInputEl;
let mainContentEl;
let emailInputEl;

function onLoginResponse() {
    passwordInputEl.value = '';
    emailInputEl.value = '';
    const json = JSON.parse(this.responseText);
    if (this.status === OK) {
        localStorage.setItem('user', JSON.stringify(json));
        showContents(['topnav-content', 'main-content', 'logout-content']);
        mainContentEl = document.getElementById('main-content');
        mainContentEl.textContent = "Welcome " + json.name;
        receiveSchedules();
    } else {
        const messageEl = document.getElementById('message-content');
        messageEl.innerHTML = json.message;
        showContents(['login-content', 'message-content']);
    }
}

function receiveSchedules() {
    const user = JSON.parse(localStorage.getItem('user'));

    const params = new URLSearchParams();
    params.append('userId', user.id);

    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', setupMainContentEl);
    xhr.addEventListener('error', onNetworkError);
    xhr.open('GET', 'protected/schedules/user/' + user.id);
    xhr.send(params);
}

function setupMainContentEl() {
    const schedules = JSON.parse(this.responseText);

    const taskUl = document.createElement('ul');

    for (let i = 0; i < schedules.length; i++) {
        const schedule = schedules[i];
        const liEl = document.createElement('li');
        liEl.id = schedule.id;
        liEl.textContent = schedule.name;
        liEl.addEventListener('mouseover', onSchedMouseOver);
        liEl.addEventListener('mouseout', onSchedMouseOut);
        liEl.addEventListener('click', onSchedMouseClick);
        taskUl.appendChild(liEl);
    }

    mainContentEl.appendChild(taskUl);
}

function onSchedMouseOver() {
    this.style.textShadow = '0 0 5px #999999';
    this.style.cursor = 'pointer';
}

function onSchedMouseOut() {
    this.removeAttribute('style');
}

function onSchedMouseClick() {
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