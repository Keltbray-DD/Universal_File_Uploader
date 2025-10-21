document.addEventListener('DOMContentLoaded', async function() {
  projectID = sessionStorage.getItem('projectID')
    if(!projectID){
      const urlParams = new URLSearchParams(window.location.search);
      projectID = urlParams.get('projectID');
      accessToken = await getAccessToken('account:read')
      const projectData = await getProjectDetails(accessToken,projectID)
      await populateTitles(projectData.name)
    }else{
      projectName = sessionStorage.getItem('projectName')
      await populateTitles(projectName)
    }
    
    async function populateTitles(projectName) {
      document.title = `${projectName} File Uploader`;
      document.getElementById("titleBox").innerHTML = `<h1>${projectName}</h1><hr class="divider">`;
      project_Name = projectName
    }

    document.getElementById("appInfo").textContent = `${appName} ${appVersion}`;
    doc_search_dropdown = document.getElementById("doc_search_dropdown");
    
    await gatherArrays();
    await toggleStep(1,'main')

    deliverable_yes_radio = document.getElementById('deliverable_yes')
    deliverable_no_radio = document.getElementById('deliverable_no')
    // Add event listeners to radio buttons
    
    deliverable_yes_radio.addEventListener('change', function() {
      if(deliverable_yes_radio.checked) {
        handleDeliverableRadioChange('deliverable_yes');
      }

    });

    deliverable_no_radio.addEventListener('change', function() {
      if(deliverable_no_radio.checked) {
        handleDeliverableRadioChange('deliverable_no');
      }  
    });



  const input_ManualFileName = document.getElementById('input_fileName_non_deliverable');
  const warning_ManualFileName = document.getElementById('warning');
  const fileNameNext_btn = document.getElementById('step3_next_btn');

  // Regex for invalid filename characters
  const invalidChars = /[\\\/:*?"<>|]/;

  input_ManualFileName.addEventListener('input', () => {
    const value = input_ManualFileName.value;

    if (invalidChars.test(value) || value.length === 0) {
      warning_ManualFileName.style.display = invalidChars.test(value) ? 'block' : 'none';
      input_ManualFileName.style.borderColor = invalidChars.test(value) ? 'red' : '';
      fileNameNext_btn.disabled = true;
    } else {
      warning_ManualFileName.style.display = 'none';
      input_ManualFileName.style.borderColor = '';
      fileNameNext_btn.disabled = false;
    }
  });
});

    // Show the loading screen
    async function showLoadingScreen() {
        loadingScreen.style.display = 'flex';
    }

    // Hide the loading screen
    async function hideLoadingScreen() {
        loadingScreen.style.display = 'none';
    }

    // Simulate gathering arrays with a delay
    async function gatherArrays() {

        await showLoadingScreen(); // Show loading screen before gathering arrays

        accessTokenDataRead = await getAccessToken("data:read");
        mappingData = await geMappingData()
        mappingData_files_Single = await filterDuplicatesByField(mappingData.files, 'File Type')
        await documentSeachBarLoad(mappingData_files_Single)
        await getFolders()
        await getfileslist()
        await getNamingStandardID(deliverableFolders)
        await getNamingStandard()
        await populateFolderDropdown(deliverableFolders)
        await getCustomDetailsData()
        //populateClassificationDropdown()
        
        await hideLoadingScreen();
        //initialStep4SectionHTML = document.getElementById('step4').innerHTML
        //initialStep5SectionHTML = document.getElementById('step5').innerHTML
    }

    async function filterDuplicatesByField(arr, field) {
      const seen = new Set();
      return arr.filter(obj => {
        const value = obj[field];
        if (seen.has(value)) {
          return false; // Skip duplicates
        }
        seen.add(value);
        return true; // Keep first occurrence
      });
    }

    function handleDeliverableRadioChange(input) {
      console.log('input',input)
      const step3_btn = document.getElementById('step3_next_btn')
      const DocNumber_deliverable = document.getElementById("DocNumber_deliverable")
      const DocNumber_non_deliverable = document.getElementById("input_fileName_non_deliverable")
      const fileName_generate = document.getElementById('fileName_generate')
      const fileName_manual = document.getElementById('fileName_manual')

      step3_btn.disabled = true

      if (input === 'deliverable_yes') {
      // Action when 'Yes' is selected
        console.log('Yes selected');
        fileName_generate.style.display = 'block'
        fileName_manual.style.display = 'none'
        uploadType = "deliverable"
        if(DocNumber_deliverable.length > 0){
          step3_btn.disabled = false
        }
      } 
      
      if (input === 'deliverable_no') {
        // Action when 'No' is selected
        console.log('No selected');
        fileName_manual.style.display = 'block'
        fileName_generate.style.display = 'none'
        uploadType = "non_deliverable"
        if(DocNumber_non_deliverable.length > 0){
          step3_btn.disabled = false
        }
      }
      populateStatusDropdown(uploadType)
      populateDocClassDropdown()
    }
    // Function to toggle visibility of step content
   async function toggleStep(stepNumber,type) {
  
      const steps = document.querySelectorAll('.step-content');

      steps.forEach(step => {
        step.style.display = 'none';
      });

      const stepContent = document.querySelector(`#step${stepNumber}_${type} .step-content`);
      const isVisible = stepContent.style.display === 'block';
      stepContent.style.display = isVisible ? 'none' : 'block';
      if(stepNumber == 5){
          await setValues(uploadType)
          await generateUploadSummary()
      }
      const item = stepsArray.find(obj => obj.step === stepNumber);

      if (item) {
        item.status = "open";
      }
      document.getElementById(`step${stepNumber}_main`).classList.remove('locked');
    }

    // Function to mark a step as complete
    function completeStep(stepNumber,type,deliverable) {
        // Mark the step as completed
        const status = document.getElementById(`status${stepNumber}_${type}`);
        status.textContent = 'Completed';
        status.classList.add('completed');
        console.log(deliverable)
        if (stepNumber == 2 && deliverable == "Y") {
          const yesRadio = document.getElementById("deliverable_yes");
          yesRadio.checked = true;
          handleDeliverableRadioChange('deliverable_yes')
        } else if(stepNumber == 2) {
          const noRadio = document.getElementById("deliverable_no");
          noRadio.checked = true;
          handleDeliverableRadioChange('deliverable_no')
        }

        // Minimize the step content
        const stepContent = document.querySelector(`#step${stepNumber}_${type} .step-content`);
        stepContent.style.display = 'none';
        // if(stepNumber == 4 && type == 'deliverable'){
        //     populateFolderDropdown(deliverableFolders);
        // }
        // Expand the next step (if it exists)
        const targetStep = stepNumber + 1;
        const nextStep = document.getElementById(`step${targetStep}`);
        if (nextStep) {
          

            const nextContent = nextStep.querySelector('.step-content');
            nextContent.style.display = 'block';
        }

        if((stepNumber == 3 && type == 'main')){
          document.getElementById(`input_title_main`).value = document.getElementById(`input_fileName_non_deliverable`).value
        }

        // if(stepNumber == 1 && type == 'main'){
        //     toggleStep(2,'main')
        //     return
        // }
        toggleStep(stepNumber+1,type)

    }

    async function documentSeachBarLoad(data) {

        selectedFile = "";
      
        searchInput.addEventListener("input", () => {
          const value = searchInput.value.toLowerCase();
          doc_search_dropdown.innerHTML = "";
      
          if (!value) {
            doc_search_dropdown.style.display = "none";
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
              // setDocumentSettings(selectedFile)
              completeStep(2,'main',selectedFile.Deliverable)

              document.getElementById('input_Description_main').value = selectedFile['File Type']

              // if (selectedFile.Deliverable == "Y") {
              //   document.getElementById("deliverable_yes").checked  = true;
              //   handleDeliverableRadioChange(null,'deliverable_yes')
              // } else {
              //   document.getElementById("deliverable_no").checked  = true;
              //   handleDeliverableRadioChange(null,'deliverable_no')
              // }
              
            });
            doc_search_dropdown.appendChild(div);
          });
      
          doc_search_dropdown.style.display = filtered.length > 0 ? "block" : "none";
          //noResults.style.display = filtered.length > 0 ? "none" : "block";
        });
      
        document.addEventListener("click", (e) => {
          if (!e.target.closest(".search-box")) {
            doc_search_dropdown.style.display = "none";
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
        
        console.log('working here')
        // if (selectedFile.Deliverable == "Y") {
        //     document.getElementById("deliverables").classList.remove('hidden');
        //     document.getElementById("non_deliverables").classList.add('hidden');
            
        //     toggleStep(3,'main')
        // } else {
        //     document.getElementById("non_deliverables").classList.remove('hidden');
        //     document.getElementById("deliverables").classList.add('hidden');
            
            
        // }
        
        console.log('working here')
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
            fileName = document.getElementById(`input_fileName_non_deliverable`).value || ''
            folderPath = selectedFile['ACC Folder Path'] || ''
        }else{
            const dropdown = document.getElementById('input_folder_main');
            const selectedText = dropdown.options[dropdown.selectedIndex].text;

            fileName = document.getElementById(`DocNumber_deliverable`).value || ''
            folderPath = selectedText || ''
        }
        
        fileDescription = document.getElementById(`input_Description_main`).value || ''
        titleLine1 = document.getElementById(`input_title_main`).value || ''
        titleLine2 = document.getElementById(`input_title2_main`).value || ''
        titleLine3 = document.getElementById(`input_title3_main`).value || ''
        titleLine4 = document.getElementById(`input_title4_main`).value || ''
        fileStatus = document.getElementById(`input_Status_main`).value || ''
        fileRevision = document.getElementById(`input_RevisionsCode_main`).value || ''
        // fileClassification = document.getElementById(`input_title_main`).value || ''
        fileDocumentClassification = document.getElementById(`document_classification_main`).value || ''
      }
        