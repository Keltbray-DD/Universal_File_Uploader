window.addEventListener("load", () => {
    projectID = sessionStorage.getItem('projectID')
    projectName = sessionStorage.getItem('projectName')
    document.title = `${projectName} File Uploader`;
    document.getElementById("titleBox").innerHTML = `<h1>${projectName}</h1><hr class="divider">`;
    toggleStep(0,'main')
    document.getElementById("appInfo").textContent = `${appName} ${appVersion}`;
    dropdown = document.getElementById("dropdownMenu");

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
        mappingData = await geMappingData()
        await documentSeachBarLoad(mappingData.files)
        await getFolders()
        await getfileslist()
        await getNamingStandardID(deliverableFolders)
        await getNamingStandard()
        await populateFolderDropdown(deliverableFolders)
        await getCustomDetailsData()
        //populateClassificationDropdown()

        hideLoadingScreen();
        //initialStep4SectionHTML = document.getElementById('step4').innerHTML
        //initialStep5SectionHTML = document.getElementById('step5').innerHTML
    }

    gatherArrays();
});
document.addEventListener('DOMContentLoaded', async function() {
    
})
    // Function to toggle visibility of step content
   async function toggleStep(stepNumber,type) {
        const stepContent = document.querySelector(`#step${stepNumber}_${type} .step-content`);
        const isVisible = stepContent.style.display === 'block';
        stepContent.style.display = isVisible ? 'none' : 'block';
        if(stepNumber == 6){
            await setValues(uploadType)
            await generateUploadSummary()
        }
    }

    // Function to mark a step as complete
    function completeStep(stepNumber,type) {
        // Mark the step as completed
        const status = document.getElementById(`status${stepNumber}_${type}`);
        status.textContent = 'Completed';
        status.classList.add('completed');

        // Minimize the step content
        const stepContent = document.querySelector(`#step${stepNumber}_${type} .step-content`);
        stepContent.style.display = 'none';
        if(stepNumber == 4 && type == 'deliverable'){
            populateFolderDropdown(deliverableFolders);
        }
        // Expand the next step (if it exists)
        const nextStep = document.getElementById(`step${stepNumber + 1}`);
        if (nextStep) {
            const nextContent = nextStep.querySelector('.step-content');
            nextContent.style.display = 'block';
        }

        if((stepNumber == 3 && type == 'non_deliverable') || (stepNumber == 5 && type == 'deliverable')){
            document.getElementById('step6_main').classList.remove('hidden');
            toggleStep(6,'main')
        }

        if(stepNumber == 1 && type == 'main'){
            toggleStep(2,'main')
            return
        }
        toggleStep(stepNumber+1,type)

    }

    async function documentSeachBarLoad(data) {

        selectedFile = "";
      
        searchInput.addEventListener("input", () => {
          const value = searchInput.value.toLowerCase();
          dropdown.innerHTML = "";
      
          if (!value) {
            dropdown.style.display = "none";
            return;
          }
      
          const filtered = data.filter((p) =>
            p["File Type"].toLowerCase().includes(value)
          );
          filtered.forEach((project) => {
            const div = document.createElement("div");
            div.textContent = project["File Type"];
            div.addEventListener("click", () => {
              selectedFile = project;
              console.log(selectedFile)
              searchInput.value = selectedFile["File Type"]
              setDocumentSettings(selectedFile)
              completeStep(2,'main')
            });
            dropdown.appendChild(div);
          });
      
          dropdown.style.display = filtered.length > 0 ? "block" : "none";
          //noResults.style.display = filtered.length > 0 ? "none" : "block";
        });
      
        document.addEventListener("click", (e) => {
          if (!e.target.closest(".search-box")) {
            dropdown.style.display = "none";
          }
        });
      }

      async function geMappingData() {
      
        const headers = {
          "Content-Type": "application/json",
        };
      
        const requestOptions = {
          method: "GET",
          headers: headers,
          //body: JSON.stringify(bodyData),
        };
      
        const apiUrl =
          "https://prod-00.uksouth.logic.azure.com:443/workflows/d4c9c018c4c84c18a8addc3903dbb969/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=VOKHnqDx1hjbyL0c1kjAH56aP2if06udPdmu4X56RwQ";
        //console.log(apiUrl)
        //console.log(requestOptions)
        responseData = await fetch(apiUrl, requestOptions)
          .then((response) => response.json())
          .then((data) => {
            const JSONdata = data;
            console.log(JSONdata);
            //console.log(JSONdata.uploadKey)
            //console.log(JSONdata.urls)
            return JSONdata;
          })
          .catch((error) => console.error("Error fetching data:", error));
        return responseData;
      }

      async function setDocumentSettings(selectedFile) {
        if (selectedFile.Deliverable == "Y") {
            document.getElementById("deliverables").classList.remove('hidden');
            document.getElementById("non_deliverables").classList.add('hidden');
            uploadType = "deliverable"
            toggleStep(3,'deliverable')
        } else {
            document.getElementById("non_deliverables").classList.remove('hidden');
            document.getElementById("deliverables").classList.add('hidden');
            uploadType = "non_deliverable"
            document.getElementById('input_Description_non_deliverable').value = selectedFile['File Description']
            toggleStep(3,'non_deliverable')   
        }
        populateStatusDropdown(uploadType)
      }

      async function generateUploadSummary() {
        const html = `
        <p><strong>File Name: </strong>${fileName}</p>
        <p><strong>Upload Location: </strong>${folderPath}</p>
        <p><strong>File Description: </strong>${fileDescription}</p>
        <p><strong>File Title: </strong>${titleLine1}</p>
        <p><strong>Status: </strong>${fileStatus}</p>
        `
        const summary = document.getElementById('uploadSummary')
        summary.innerHTML =html
      }

      async function setValues(type) {
        if(type == 'non_deliverable'){
            fileName = document.getElementById(`input_fileName_${type}`).value || ''
            folderPath = selectedFile['ACC Folder Path'] || ''
        }else{
            fileName = document.getElementById(`DocNumber_${type}`).value || ''
            folderPath = document.getElementById(`input_folder_${type}`).text || ''
        }
        
        fileDescription = document.getElementById(`input_Description_${type}`).value || ''
        titleLine1 = document.getElementById(`input_title_${type}`).value || ''
        titleLine2 = document.getElementById(`input_title2_${type}`).value || ''
        titleLine3 = document.getElementById(`input_title3_${type}`).value || ''
        titleLine4 = document.getElementById(`input_title4_${type}`).value || ''
        fileStatus = document.getElementById(`input_Status_${type}`).value || ''
        fileRevision = document.getElementById(`input_RevisionsCode_${type}`).value || ''
        fileClassification = document.getElementById(`input_title_${type}`).value || ''
        fileDocumentClassification = document.getElementById(`document_classification_${type}`).value || ''
      }
        