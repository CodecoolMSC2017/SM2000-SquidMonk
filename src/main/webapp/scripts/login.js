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
        mainContentEl.textContent = '';
        const divEl = document.createElement('div');
        divEl.id = 'welcome-text';
        divEl.textContent = "Welcome " + json.name;
        mainContentEl.appendChild(divEl);
        receiveSchedules();
        receiveTasks();
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

function receiveTasks() {
    const user = JSON.parse(localStorage.getItem('user'));

    const params = new URLSearchParams();
    params.append('userId', user.id);

    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', setupTaskContentEl);
    xhr.addEventListener('error', onNetworkError);
    xhr.open('GET', 'protected/tasks/user/' + user.id);
    xhr.send(params);
}

function setupTaskContentEl() {
    const tasks = JSON.parse(this.responseText);
    const taskDiv = document.createElement('div');
    taskDiv.className = 'sched-list';
    const taskUl = document.createElement('ul');
    taskUl.className = 'schedule-list';
    for (let i = 0; i < tasks.length; i++) {
        const task = tasks[i];

        const anchor = document.createElement('a');
        anchor.href = 'javascript:void(0)';

        const liEl = document.createElement('li');
        liEl.id = task.id;
        liEl.class = 'schedule-list-item';
        liEl.textContent = task.name;
        liEl.addEventListener('click', onTaskMouseClick);

        anchor.appendChild(liEl);
        taskUl.appendChild(anchor);
    }

    const pEl = document.createElement('p');
    pEl.textContent = 'My Tasks';

    taskDiv.appendChild(pEl);
    taskDiv.appendChild(taskUl)
    mainContentEl.appendChild(taskDiv);
}

function setupMainContentEl() {
    const schedules = JSON.parse(this.responseText);
    const scheduleDiv = document.createElement('div');
    scheduleDiv.className = 'sched-list';
    scheduleDiv.style.float = 'left';
    const scheduleUl = document.createElement('ul');
    scheduleUl.className = 'schedule-list';
    for (let i = 0; i < schedules.length; i++) {
        const schedule = schedules[i];

        const anchor = document.createElement('a');
        anchor.href = 'javascript:void(0)';

        const liEl = document.createElement('li');
        liEl.id = schedule.id;
        liEl.class = 'schedule-list-item';
        liEl.textContent = schedule.name;
        liEl.addEventListener('click', onSchedMouseClick);

        anchor.appendChild(liEl);
        scheduleUl.appendChild(anchor);
    }

    const pEl = document.createElement('p');
    pEl.textContent = 'My Schedules';

    scheduleDiv.appendChild(pEl);
    scheduleDiv.appendChild(scheduleUl)
    mainContentEl.appendChild(scheduleDiv);
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