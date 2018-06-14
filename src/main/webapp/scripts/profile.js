function onMenuProfileClick() {
    showContents(['topnav-content', 'main-content', 'logout-content']);
    mainContentEl = document.getElementById('main-content');

    mainContentEl.textContent = '';
    const user = JSON.parse(localStorage.getItem('user'));

    const divEl = document.createElement('div');
    divEl.id = 'welcome-text';
    divEl.textContent = "Welcome, " + user.name + "!";

    mainContentEl.appendChild(divEl);

    receiveProfile();
}

function receiveProfile() {
    const user = JSON.parse(localStorage.getItem('user'));

    const params = new URLSearchParams();
    params.append('userId', user.id);

    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', onProfileReceived);
    xhr.addEventListener('error', onNetworkError);
    xhr.open('GET', 'protected/profile/user/' + user.id);
    xhr.send(params);
}

function onProfileReceived() {
    if (this.status == OK) {
        const user = JSON.parse(this.responseText);
        setupProfileContentEl(user);
        localStorage.setItem('user', this.responseText);
    } else {
        console.log(this);
    }
}

function receiveUpdateProfile() {
    const user = JSON.parse(localStorage.getItem('user'));

    const mainDiv = document.getElementById('main-content');
    removeAllChildren(mainDiv);

    const params = new URLSearchParams();
    params.append('userId', user.id);

    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', onProfileReceived);
    xhr.addEventListener('error', onNetworkError);
    xhr.open('GET', 'protected/profile/user/' + user.id);
    xhr.send();
}

function googleImg() {

    const x = document.createElement('img');
    x.setAttribute('src', profileImgUrl);
    x.setAttribute('alt', 'Profile img');
    x.className = 'prof-img';

    const mainDiv = document.getElementById('main-content');
    mainDiv.appendChild(x);
}

function setupProfileContentEl(user) {

    const userDiv = document.createElement('div');
    userDiv.className = 'prof-table';
    userDiv.id = 'userDiv';
    userDiv.style.float = 'center';

    if (isGoogle) {
        googleImg();
    }

    const profileTable = document.createElement('table');
    profileTable.className = 'profboard-table';

    profileTable.appendChild(firstTableRow('My Data'));

    profileTable.appendChild(quantityTableRow(user));

    profileTable.appendChild(nameProfileRow(user));

    profileTable.appendChild(emailProfileRow(user));

    profileTable.appendChild(roleProfileRow(user));

    userDiv.appendChild(profileTable)
    mainContentEl.appendChild(userDiv);
}

function firstTableRow(text) {
    const tableHeadTr = document.createElement('tr');
    const tableHeadTh = document.createElement('th');
    tableHeadTh.colSpan = '4';
    tableHeadTh.textContent = text;
    tableHeadTr.appendChild(tableHeadTh);
    tableHeadTh.className = 'table-head';
    return tableHeadTr;
}

function quantityTableRow(user) {
    const profTableQuantityTr = document.createElement('tr');

    const scheduleQuantityTd = document.createElement('td');
    scheduleQuantityTd.textContent = 'Schedules: ' + user.scheduleCounter;
    scheduleQuantityTd.colSpan = '2';
    scheduleQuantityTd.className = 'sched-counter-td';

    const taskQuantityTd = document.createElement('td');
    taskQuantityTd.textContent = 'Tasks: ' + user.taskCounter;
    taskQuantityTd.colSpan = '2';

    profTableQuantityTr.appendChild(scheduleQuantityTd);
    profTableQuantityTr.appendChild(taskQuantityTd);

    return profTableQuantityTr;
}

function nameProfileRow(user) {
    const profTableNameTr = document.createElement('tr');
    profTableNameTr.id = 'profile-name-row';
    const profTableNameTd = document.createElement('td');
    profTableNameTd.textContent = 'Name';
    profTableNameTd.id = 'prof-name-title';
    profTableNameTd.className = 'first-td';

    const profEntryNameTd = document.createElement('td');
    profEntryNameTd.id = 'prof-name';
    profEntryNameTd.textContent = user.name;
    profEntryNameTd.colSpan = '2';

    const profUpdateNameTd = document.createElement('td');
    profUpdateNameTd.addEventListener('click', onChangeProfileNameClicked);
    profUpdateNameTd.id = 'profile-name-change-button-td';
    profUpdateNameTd.textContent = 'Change';
    profUpdateNameTd.className = 'change-button';

    profTableNameTr.appendChild(profTableNameTd);
    profTableNameTr.appendChild(profEntryNameTd);
    profTableNameTr.appendChild(profUpdateNameTd);

    return profTableNameTr;
}

function onProfileBadRequestClick() {
    const createChangesRow = document.getElementById('profile-name-row');

    const profNameRowTitle = document.getElementById('prof-name-title');
    const profName = document.getElementById('prof-name');
    const profNameRowButton = document.getElementById('profile-name-change-button-td');

    createChangesRow.appendChild(profNameRowTitle);
    createChangesRow.appendChild(profName);
    createChangesRow.appendChild(profNameRowButton);
}

function onChangeProfileNameClicked() {
    const createChangesRow = document.getElementById('profile-name-row');
    createChangesRow.removeEventListener('click', onChangeProfileNameClicked);
    createChangesRow.id = 'change-name-row';
    createChangesRow.innerHTML = '';


    const profTableChangeNameTd = document.createElement('td');
    profTableChangeNameTd.textContent = 'Name';

    const inputTdEl = document.createElement('td');

    const buttonTdEl = document.createElement('td');

    const inputNameEl = document.createElement('input');
    inputNameEl.id = 'new-profile-name-input';
    inputNameEl.setAttribute('placeholder', 'New profile name');
    inputTdEl.appendChild(inputNameEl);

    const buttonEl = document.createElement('button');
    buttonEl.textContent = 'Submit';
    buttonEl.addEventListener('click', onChangeProfileSubmitClicked);
    //buttonEl.setAttribute('class', 'task-button');
    buttonTdEl.appendChild(buttonEl);

    createChangesRow.appendChild(profTableChangeNameTd);
    createChangesRow.appendChild(inputTdEl);
    createChangesRow.appendChild(buttonTdEl);
}

function emailProfileRow(user) {
    const profTableEmailTr = document.createElement('tr');
    profTableEmailTr.id = 'profile-email-row';
    const profTableEmailTd = document.createElement('td');
    profTableEmailTd.textContent = 'Email';
    profTableEmailTd.id = 'profile-email-title';
    profTableEmailTd.className = 'first-td';

    const profEntryEmailTd = document.createElement('td');
    profEntryEmailTd.id = 'profile-email';
    profEntryEmailTd.textContent = user.email;
    profEntryEmailTd.colSpan = '2';

    const profUpdateEmailTd = document.createElement('td');
    if (!isGoogle) {
        profUpdateEmailTd.addEventListener('click', onChangeProfileEmailClicked);
        profUpdateEmailTd.id = 'profile-email-change-button-td';
        profUpdateEmailTd.textContent = 'Change';
        profUpdateEmailTd.className = 'change-button';
    } else {
        profUpdateEmailTd.textContent = 'Can not change';
    }

    profTableEmailTr.appendChild(profTableEmailTd);
    profTableEmailTr.appendChild(profEntryEmailTd);
    profTableEmailTr.appendChild(profUpdateEmailTd);

    return profTableEmailTr;
}

function onChangeProfileEmailClicked() {
    const createChangesRow = document.getElementById('profile-email-row');
    createChangesRow.removeEventListener('click', onChangeProfileEmailClicked);
    createChangesRow.id = 'change-email-row';
    createChangesRow.innerHTML = '';


    const profTableChangeEmailTd = document.createElement('td');
    profTableChangeEmailTd.textContent = 'Email';

    const inputTdEl = document.createElement('td');

    const buttonTdEl = document.createElement('td');

    const inputEmailEl = document.createElement('input');
    inputEmailEl.id = 'new-profile-email-input';
    inputEmailEl.setAttribute('placeholder', 'New profile email');
    inputTdEl.appendChild(inputEmailEl);

    const buttonEl = document.createElement('button');
    buttonEl.textContent = 'Submit';
    buttonEl.addEventListener('click', onChangeProfileSubmitClicked);
    //buttonEl.setAttribute('class', 'task-button');
    buttonTdEl.appendChild(buttonEl);

    createChangesRow.appendChild(profTableChangeEmailTd);
    createChangesRow.appendChild(inputTdEl);
    createChangesRow.appendChild(buttonTdEl);
}

function roleProfileRow(user) {
    const profTableRoleTr = document.createElement('tr');
    const profTableRoleTd = document.createElement('td');
    profTableRoleTd.textContent = 'Role';
    profTableRoleTd.className = 'first-td';

    const profEntryRoleTd = document.createElement('td');
    profEntryRoleTd.id = user.id;
    profEntryRoleTd.colSpan = '2';
    if (user.admin === true) {
        profEntryRoleTd.innerHTML = 'Admin';
    } else {
        profEntryRoleTd.innerHTML = 'User';
    }

    const profUpdateRoleTd = document.createElement('td');
    profUpdateRoleTd.textContent = 'Can not change';

    profTableRoleTr.appendChild(profTableRoleTd);
    profTableRoleTr.appendChild(profEntryRoleTd);
    profTableRoleTr.appendChild(profUpdateRoleTd);

    return profTableRoleTr;
}

function onCreateProfileResponse() {
    let elementId;

    if (this.status == OK) {
        receiveUpdateProfile();
    } else if (this.status == BAD_REQUEST) {

        if (document.getElementById('new-profile-name-input')) {
            elementId = 'change-name-row';
        }
        if (document.getElementById('new-profile-email-input')) {
            elementId = 'change-email-row';
        }
        const createButtonRow = document.getElementById(elementId);
        createButtonRow.innerHTML = '';

        const user = JSON.parse(localStorage.getItem('user'));
        const message = JSON.parse(this.responseText);

        const newTdEl = document.createElement('td');
        newTdEl.colSpan = '3';
        newTdEl.textContent = message.message + ' (click here to continue)';
        createButtonRow.appendChild(newTdEl);
        createButtonRow.addEventListener('click', onMenuProfileClick);
    } else if (this.status == INTERNAL_SERVER_ERROR) {
        const mainDiv = document.getElementById('main-content');
        const inputEmailEl = document.getElementById('new-profile-email-input');

        const user = JSON.parse(localStorage.getItem('user'));
        const message = JSON.parse(this.responseText);

        const createExceptionMessageEl = document.createElement('p');
        createExceptionMessageEl.textContent = 'This email (' + inputEmailEl.value + ') already exists! Please enter an other email!';
        createExceptionMessageEl.className = 'exception-message';
        mainDiv.appendChild(createExceptionMessageEl);
    }
}

function onChangeProfileSubmitClicked() {

    const user = JSON.parse(localStorage.getItem('user'));
    const inputNameEl = document.getElementById('new-profile-name-input');
    const inputEmailEl = document.getElementById('new-profile-email-input');

    const params = new URLSearchParams();
    if (inputNameEl != null) {
        params.append('name', inputNameEl.value);
    }
    if (inputEmailEl != null) {
        params.append('email', inputEmailEl.value);
    }

    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', onCreateProfileResponse);
    xhr.open('PUT', 'protected/profile/user/' + user.id + '?' + params.toString());
    xhr.send();
}