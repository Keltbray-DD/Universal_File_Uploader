window.addEventListener("load", () => {
    projectID = sessionStorage.getItem('projectID')
    projectName = sessionStorage.getItem('projectName')
    document.title = `${projectName} File Uploader`;
    document.getElementById("titleBox").innerHTML = `<h1>${projectName}</h1><hr class="divider"><br><h3> ACC File Uploader</h3>`;
    toggleStep(1)
    document.getElementById("appInfo").textContent = `${appName} ${appVersion}`;
    
    // Show the loading screen
    function showLoadingScreen() {
        loadingScreen.style.display = 'flex';
    }

    // Hide the loading screen
    async function hideLoadingScreen() {
        loadingScreen.style.display = 'none';
    }

    // Simulate gathering arrays with a delay
    async function gatherArrays() {

        showLoadingScreen(); // Show loading screen before gathering arrays

        accessTokenDataRead = await getAccessToken("data:read");
        await getFolders()
        await getfileslist()
        await getNamingStandardID(deliverableFolders)
        await getNamingStandard()
        await populateFolderDropdown(deliverableFolders)
        await getCustomDetailsData()
        //populateClassificationDropdown()
        populateStatusDropdown()
        hideLoadingScreen();
        //initialStep4SectionHTML = document.getElementById('step4').innerHTML
        //initialStep5SectionHTML = document.getElementById('step5').innerHTML
    }

    gatherArrays();
});
document.addEventListener('DOMContentLoaded', async function() {
    
})
    // Function to toggle visibility of step content
    function toggleStep(stepNumber) {
        const stepContent = document.querySelector(`#step${stepNumber} .step-content`);
        const isVisible = stepContent.style.display === 'block';
        stepContent.style.display = isVisible ? 'none' : 'block';

    }

    // Function to mark a step as complete
    function completeStep(stepNumber) {
        // Mark the step as completed
        const status = document.getElementById(`status${stepNumber}`);
        status.textContent = 'Completed';
        status.classList.add('completed');

        // Minimize the step content
        const stepContent = document.querySelector(`#step${stepNumber} .step-content`);
        stepContent.style.display = 'none';
        if(stepNumber == 2){
            populateFolderDropdown(deliverableFolders);
        }
        // Expand the next step (if it exists)
        const nextStep = document.getElementById(`step${stepNumber + 1}`);
        if (nextStep) {
            const nextContent = nextStep.querySelector('.step-content');
            nextContent.style.display = 'block';
        }
    }