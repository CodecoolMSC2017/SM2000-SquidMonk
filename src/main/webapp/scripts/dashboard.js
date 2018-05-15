function onMenuDashboardClick() {
    showContents(['topnav-content', 'main-content', 'logout-content']);
    mainContentEl = document.getElementById('main-content');
    mainContentEl.textContent = '';
    const user = JSON.parse(localStorage.getItem('user'));
    const divEl = document.createElement('div');
    divEl.id = 'welcome-text';
    divEl.textContent = "Welcome, " + user.name + "!";
    mainContentEl.appendChild(divEl);
    receiveSchedules();
}