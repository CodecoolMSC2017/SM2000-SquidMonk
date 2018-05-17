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
    xhr.addEventListener('load', setupProfileContentEl);
    xhr.addEventListener('error', onNetworkError);
    xhr.open('GET', 'protected/profile/user/' + user.id);
    xhr.send(params);
}

function setupProfileContentEl() {
    const user = JSON.parse(this.responseText);
    const userDiv = document.createElement('div');
    userDiv.className = 'prof-table';
    userDiv.id = 'userDiv';
    userDiv.style.float = 'center';

    const profileTable = document.createElement('table');
    profileTable.className = 'profboard-table';

    profileTable.appendChild(firstTableRow('My Data'));

    profileTable.appendChild(nameProfileRow(user));

    profileTable.appendChild(emailProfileRow(user));

    profileTable.appendChild(roleProfileRow(user));

    userDiv.appendChild(profileTable)
    mainContentEl.appendChild(userDiv);
}

function firstTableRow(text) {
    const tableHeadTr = document.createElement('tr');
    const tableHeadTh = document.createElement('th');
    tableHeadTh.colSpan = '3';
    tableHeadTh.textContent = text;
    tableHeadTr.appendChild(tableHeadTh);
    tableHeadTh.className = 'table-head';
    return tableHeadTr;
}

function nameProfileRow(user) {
    const profTableNameTr = document.createElement('tr');
    profTableNameTr.id = 'profile-name-row';
    const profTableNameTd = document.createElement('td');
    profTableNameTd.textContent = 'Name';
    profTableNameTd.id = 'prof-name-title';

    const profEntryNameTd = document.createElement('td');
    profEntryNameTd.id = 'prof-name';
    profEntryNameTd.textContent = user.name;

    const profUpdateNameTd = document.createElement('td');
    profUpdateNameTd.addEventListener('click', onChangeProfileNameClicked);
    profUpdateNameTd.id = 'profile-change-button-td';
    profUpdateNameTd.textContent = 'Change';

    profTableNameTr.appendChild(profTableNameTd);
    profTableNameTr.appendChild(profEntryNameTd);
    profTableNameTr.appendChild(profUpdateNameTd);

    return profTableNameTr;
}

function onProfileBadRequestClick() {
    const createChangesRow = document.getElementById('profile-name-row');

    const profNameRowTitle = document.getElementById('prof-name-title');
    const profName = document.getElementById('prof-name');
    const profNameRowButton = document.getElementById('profile-change-button-td');

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
    inputNameEl.id = 'new-profile-name-input'
    inputNameEl.setAttribute('placeholder', 'New profile name');
    inputTdEl.appendChild(inputNameEl);

    const buttonEl = document.createElement('button');
    buttonEl.textContent = 'Submit';
    //buttonEl.addEventListener('click', onChangeProfileNameSubmitClicked);
    buttonTdEl.appendChild(buttonEl);

    createChangesRow.appendChild(profTableChangeNameTd);
    createChangesRow.appendChild(inputTdEl);
    createChangesRow.appendChild(buttonTdEl);
}

function emailProfileRow(user) {
    const profTableEmailTr = document.createElement('tr');
    const profTableEmailTd = document.createElement('td');
    profTableEmailTd.textContent = 'Email';

    const profEntryEmailTd = document.createElement('td');
    profEntryEmailTd.id = user.id;
    profEntryEmailTd.textContent = user.email;

    const profUpdateEmailTd = document.createElement('td');
    profUpdateEmailTd.textContent = 'Change';

    profTableEmailTr.appendChild(profTableEmailTd);
    profTableEmailTr.appendChild(profEntryEmailTd);
    profTableEmailTr.appendChild(profUpdateEmailTd);

    return profTableEmailTr;
}

function roleProfileRow(user) {
    const profTableRoleTr = document.createElement('tr');
    const profTableRoleTd = document.createElement('td');
    profTableRoleTd.textContent = 'Role';

    const profEntryRoleTd = document.createElement('td');
    profEntryRoleTd.id = user.id;
    if (user.admin === true) {
        profEntryRoleTd.innerHTML = 'Admin';
    } else {
        profEntryRoleTd.innerHTML = 'User';
    }

    const profUpdateRoleTd = document.createElement('td');
    profUpdateRoleTd.textContent = 'Change';

    profTableRoleTr.appendChild(profTableRoleTd);
    profTableRoleTr.appendChild(profEntryRoleTd);
    profTableRoleTr.appendChild(profUpdateRoleTd);

    return profTableRoleTr;
}

function onCreateProfileResponse() {
    if (this.status == OK) {
        receiveProfile();
    } else if (this.status == BAD_REQUEST) {
        const createButtonRow = document.getElementById('change-name-row');
        createButtonRow.innerHTML = '';

        const user = JSON.parse(localStorage.getItem('user'));
        const message = JSON.parse(this.responseText);

        const newTdEl = document.createElement('td');
        newTdEl.colSpan = '3';
        newTdEl.textContent = message.message + ' (click here to continue)';
        createButtonRow.appendChild(newTdEl);
        createButtonRow.addEventListener('click', nameProfileRow);
    }
}

function onChangeProfileNameSubmitClicked() {

    const user = JSON.parse(localStorage.getItem('user'));
    const inputEl = document.getElementById('new-profile-name-input');

    const params = new URLSearchParams();
    params.append('name', inputEl.value);

    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', receiveProfile);
    xhr.open('PUT', 'protected/profile/user/' + user.id);
    xhr.send(params);
}