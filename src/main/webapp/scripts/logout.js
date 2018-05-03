function onLogoutClick() {
    localStorage.removeItem('user');
    console.log('logged out');
    showContents(['login-content']);
}