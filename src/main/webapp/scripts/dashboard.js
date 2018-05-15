function onMenuDashboardClick() {
    showContents(['topnav-content', 'main-content', 'logout-content']);
    mainContentEl = document.getElementById('main-content');
    const user = JSON.parse(localStorage.getItem('user'));
    mainContentEl.textContent = "Welcome " + user.name;
    receiveSchedules();
}