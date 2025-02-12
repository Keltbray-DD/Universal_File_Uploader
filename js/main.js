document.addEventListener('DOMContentLoaded', async function() {
    // Get the full URL of the current webpage
    const fullUrl = window.location.href;
    document.getElementById("appInfo").textContent = `${appName} ${appVersion}`;
    // Split the URL at the "?" and take the first part
    toolURL = fullUrl.split('?')[0];
    await checkLogin()
    loadingScreen = document.getElementById('loadingScreen');
    statusUpdateLoading = document.getElementById('statusUpdateLoading');
    const logoutButton = document.getElementById('logoutBtn');

    // Add an event listener for the button click event
    logoutButton.addEventListener('click', function() {
        signOut()
    })


})
function signOut(){
    localStorage.setItem('user_refresh_token','blank');
    clearUrlParameters();
    signin()
}
let getRate = 0

