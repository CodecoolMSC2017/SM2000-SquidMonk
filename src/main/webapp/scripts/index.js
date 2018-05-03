function onLoad() {
    document.getElementById('login-content').classList.remove('hidden');
    document.getElementById('register-content').classList.add('hidden');
    document.getElementById('register-button').addEventListener('click', onRegisterClick);
}

document.addEventListener('DOMContentLoaded', onLoad);
