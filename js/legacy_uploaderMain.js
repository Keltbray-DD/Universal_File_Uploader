window.addEventListener("load", () => {
    projectID = sessionStorage.getItem('projectID')
    projectName = sessionStorage.getItem('projectName')
    document.title = `${projectName} File Uploader`;
    document.getElementById("titleBox").innerHTML = `<h1>${projectName}</h1><hr class="divider"><br><h3> ACC File Uploader</h3>`;
    // toggleStep(0)
    document.getElementById("appInfo").textContent = `${appName} ${appVersion}`;
    fileLookup_Input = document.getElementById('fileLookup_Input')
    existingCheckModal= document.getElementById("existingCheckModal")
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
    fileLookup_Input.addEventListener("input", async function () {
      const fileLookup_Result = document.getElementById(
        "fileLookup_Result_Text"
      );
      let fileLookup_fileName = fileLookup_Input.value;
      console.log(fileLookup_fileName);
      fileLookup_fileName = fileLookup_fileName.split(".");
      console.log(fileLookup_fileName[0]);
      const result = filelist.filter(
        (file) => file.name.split(".")[0] === fileLookup_fileName[0]
      );
      console.log(result);
      if (result[0]) {
        document.getElementById(
          "fileLookup_Result_Text_Existing"
        ).textContent = `File Found on ACC in folder ${result[0].folderPath}`;
        document.getElementById("fileLookup_Result_existing").style.display =
          "block";
        document.getElementById("fileLookup_Result_new").style.display = "none";
      } else {
        document.getElementById(
          "fileLookup_Result_Text_New"
        ).textContent = `File is not on ACC`;
        document.getElementById("fileLookup_Result_new").style.display =
          "block";
        document.getElementById("fileLookup_Result_existing").style.display =
          "none";
      }
    });
    existingCheckModal.addEventListener("click", async function () {
      const fileLookup_Modal = document.getElementById("fileLookup");
      fileLookup_Modal.style.display = "block";
    });

    document.getElementById("fileLookup_closeModal").onclick = function (
      event
    ) {
      event.preventDefault(); // prevent the jump
      document.getElementById("fileLookup").style.display = "none";
    };
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