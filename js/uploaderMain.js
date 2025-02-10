window.addEventListener("load", () => {
    projectID = sessionStorage.getItem('projectID')
    projectName = sessionStorage.getItem('projectName')
    document.title = `${projectName} File Uploader`;
    document.getElementById("titleBox").innerHTML = `<h1>${projectName}</h1><hr class="divider"><br><h3> ACC File Uploader</h3>`;
    toggleStep(1)

    
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
        // localStorage.setItem('mainFolderArray', []);
        // localStorage.setItem('uploadFolderArray', []);
        // localStorage.setItem('deliverableFoldersArray', []);
        showLoadingScreen(); // Show loading screen before gathering arrays
        // Check if data should be refreshed
        if (shouldRefreshData()) {
            await getProjectDetailsFromACC()
        } else {
            // Get the array from localStorage
            //storedFolderArray = JSON.parse(localStorage.getItem('folderArray'));
            folderList_Main = JSON.parse(localStorage.getItem('mainFolderArray'));
            uploadfolders = JSON.parse(localStorage.getItem('uploadfolderArray'));
            deliverableFolders = JSON.parse(localStorage.getItem('deliverableFoldersArray'));
            console.log('Using folder stored data:', folderList_Main, uploadfolders, deliverableFolders);
            
            accessTokenDataRead = await getAccessToken("data:read");
            await getNamingStandardID(deliverableFolders)
            //await getFolders()
        }
        await getfileslist()
        await getNamingStandard()
        await getTemplateFolder(deliverableFolders)
        await populateFolderDropdown(deliverableFolders)
        await getCustomDetailsData()
        //populateClassificationDropdown()
        populateStatusDropdown()
        hideLoadingScreen();
        //initialStep4SectionHTML = document.getElementById('step4').innerHTML
        //initialStep5SectionHTML = document.getElementById('step5').innerHTML
    }
    // Function to check if data needs to be refreshed based on the defined interval
function shouldRefreshData() {
    const storedTime = localStorage.getItem('folderGatheredTimestamp');
    const storedProjectId = localStorage.getItem('projectID')
    // If there's no timestamp, we need to refresh
    if (!storedTime || storedProjectId != projectID) return true;

    // Get current time and stored time in milliseconds
    const currentTime = new Date().getTime();
    const storedTimeMillis = parseInt(storedTime, 10);

    // Calculate the difference in milliseconds
    const timeDifferenceMillis = currentTime - storedTimeMillis;

    // Convert milliseconds difference to days
    const timeDifferenceDays = timeDifferenceMillis / (1000 * 60 * 60 * 24); // 1000 ms/s * 60 s/min * 60 min/hr * 24 hr/day

    // Check if the time difference in days is greater than or equal to the refresh interval
    return timeDifferenceDays >= REFRESH_INTERVAL_DAYS;
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

        // Expand the next step (if it exists)
        const nextStep = document.getElementById(`step${stepNumber + 1}`);
        if (nextStep) {
            const nextContent = nextStep.querySelector('.step-content');
            nextContent.style.display = 'block';
        }
    }
