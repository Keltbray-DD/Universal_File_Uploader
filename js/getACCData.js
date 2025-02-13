async function updateRevisionTextInput() {
    const dropdown = document.getElementById('input_folder');
    const revisionInput = document.getElementById('input_RevisionsCode');
    const selectedValue = dropdown.value;
    //console.log(selectedValue)

    // Check if a state is selected
    if (selectedValue) {
        // Get the description of the selected state
        const folder = uploadfolders.find(obj => obj.folderID === selectedValue);

        if(folder.folderName === "SHARED"){
            document.getElementById('input_RevisionsCode').value = "P01"
            uploadFolderID = selectedValue.folderID
        }else {
            document.getElementById('input_RevisionsCode').value = "P01.01"
            uploadFolderID = selectedValue.folderID
        }
        // Update the text input with the selected description
        ;
    }
    }

async function updateStatusTextInput() {
    const dropdown = document.getElementById('input_Status');
    const selectedValue = dropdown.value;

    // Check if a state is selected
    if (selectedValue) {
        // Get the description of the selected state
        const description = StatesList.find(obj => obj.code === selectedValue);

    } else {
        // If no state is selected, clear the text input
        document.getElementById('input_StatusDesc').value = '';
    }
    }

async function populateFolderDropdown(folderArray,ProjectPin) {
    console.log(folderArray)
    const dropdown = document.getElementById('input_folder');
    uploadfolders = deliverableFolders.filter(item => {
        return item.folderPath.includes("WIP") || item.folderPath.includes("SHARED");
    });
    if(ProjectPin){
        uploadfolders = uploadfolders.filter(item => {
            return item.folderPath.includes(ProjectPin.value)})
    }
    // Check if dropdown element exists
    if (dropdown) {
        // Clear existing options
        dropdown.innerHTML = '';

        // Add blank option
        const blankOption = document.createElement('option');
        blankOption.value = '';
        blankOption.textContent = 'Select a folder...';
        dropdown.appendChild(blankOption);

        // Add states from iso19650States array
        uploadfolders.forEach(folder => {
            const option = document.createElement('option');
            if(selectedOriginator != null){
                if(folder.folderPath.includes(selectedOriginator)){
                    option.selected = true
                // }else{
                //     alert(`The selected originator ${selectedOriginator} does not have an originator upload loaction on the project`)
                //     return
                }
            }
            option.value = folder.folderID;
            option.textContent = folder.folderPath;
            dropdown.appendChild(option);
        });
        console.log(uploadfolders)
    } else {
        console.error('Dropdown element not found.');
    };
    }

function populateStatusDropdown() {

    const dropdown = document.getElementById('input_Status');
    // Check if dropdown element exists
    if (dropdown) {
        // Clear existing options
        dropdown.innerHTML = '';

        // Add blank option
        const blankOption = document.createElement('option');
        blankOption.value = '';
        blankOption.textContent = 'Select a state...';
        dropdown.appendChild(blankOption);

        // Add states from iso19650States array
        StatesList.forEach(state => {
            const option = document.createElement('option');
            if(state.code == "S0"){
                option.selected = true
            }
            option.value = state.code;
            option.textContent = `${state.code} - ${state.description}`;
            dropdown.appendChild(option);
        });
    } else {
        console.error('Dropdown element not found.');
    }
}

function populateSeriesDropdown() {
    //document.addEventListener('DOMContentLoaded', function() {
    const dropdown = document.getElementById('input_Series');
    // Check if dropdown element exists
    if (dropdown) {
        // Clear existing options
        dropdown.innerHTML = '';

        // Add blank option
        const blankOption = document.createElement('option');
        blankOption.value = '';
        blankOption.textContent = 'Select a series...';
        dropdown.appendChild(blankOption);

        // Add states from iso19650States array
        seriesArray.forEach(series => {
            const option = document.createElement('option');
            option.value = series.value;
            option.textContent = `${series.value} - ${series.description}`;
            dropdown.appendChild(option);
        });
    } else {
        console.error('Dropdown element not found.');
    }//});
}

async function filterByProjectPin(){
    ProjectPin = document.querySelector('#ProjectPin_input')
    document.getElementById('generate_btn').disabled = true
    await getfileslist(ProjectPin.value)
    document.getElementById('generate_btn').disabled = false

}

function generateDocName(){
    ProjectPin = document.querySelector('#ProjectPin_input')
    console.log(ProjectPin.value)
    Originator = document.querySelector("#Originator_input")
    console.log(Originator.value)
    vFunction = document.querySelector('#Function_input')
    console.log(vFunction.value)
    Spatial = document.querySelector("#Spatial_input")
    console.log(Spatial.value)
    Form = document.querySelector('#Form_input')
    console.log(Form.value)
    Discipline = document.querySelector("#Discipline_input")
    console.log(Discipline.value)
    const varDocNumber_noNum = ProjectPin.value+"-"+Originator.value+"-"+vFunction.value+"-"+Spatial.value+"-"+Form.value+"-"+Discipline.value
    console.log(varDocNumber_noNum)

    //console.log(deliverableFolders)
    selectedOriginator = Originator.value
    selectedFunction = arrayfunction.find(item => item.value === vFunction.value)
    selectedForm = arrayForm.find(item => item.value === Form.value)
    //populateFolderDropdown(deliverableFolders,ProjectPin)

    const PartialMatch = filelist.filter(item => item.includes(varDocNumber_noNum));

    if (PartialMatch.length >=1) {
        console.log(`Partial match '${varDocNumber_noNum}' found in the array.`);
        const partialMatchesArray = PartialMatch.map(match => match.replace(/\.[^.]+$/, ''));
        console.log('Partial matches array:', partialMatchesArray);

        // Extract the numbers from the filenames
        const numbers = partialMatchesArray.map(filename => {
            const match = filename.match(/(\d+)$/);
            return match ? parseInt(match[1], 10) : null;
        });

        // Find the maximum number
        const maxNumber = Math.max(...numbers);

        // Calculate the next number
        const nextNumber = maxNumber + 1;

        // Pad the next number with zeros and set the fixed length to 6
        const paddedNextNumber = String(nextNumber).padStart(6, '0');

        console.log('Next number with padded zeros and fixed length 6:', paddedNextNumber);

        newNumber = paddedNextNumber
    } else {
        console.log(`No partial match '${varDocNumber_noNum}' found in the array.`);
        newNumber = "000001"
    }

    varDocNumber_Full = varDocNumber_noNum+"-"+newNumber
    console.log('New Document Number: ', varDocNumber_Full);
    sessionStorage.setItem('generatedName',varDocNumber_Full.toString())
    document.getElementById("DocNumber").value = varDocNumber_Full.toString()

    populateClassificationDropdown()
    }

async function getTemplateFiles(){
    try {
        access_token = await getAccessToken("data:read");
    } catch {
        console.log("Error: Getting Access Token");
    }
    //console.log("Access Token: ", access_token);

    try {
        rawtemplatesList = await getfolderItems(templateFolderID,access_token,projectID)

    } catch (error) {
        console.error("Error iterating through searchFolders:", error);
    }
    console.log("Raw Template List",rawtemplatesList.data)
    // Filter objects with type 'Folder'
    templatesList = rawtemplatesList.data.filter(function(obj) {
        return obj.type === 'items';
    });
    console.log("Template List",templatesList)

    // Get the dropdown container
    const dropdownTemplateList = document.getElementById("input_file_template");

    // Create and append options to the dropdown
    templatesList.forEach(option => {
        const optionElement = document.createElement("option");
        optionElement.value = option.id;
        optionElement.textContent = option.attributes.displayName;
        dropdownTemplateList.appendChild(optionElement);

    });

    }

async function getNamingStandard() {
    try {
        access_token = await getAccessToken("data:read");
    } catch {
        console.log("Error: Getting Access Token");
    }
    //console.log("Access Token: ", access_token);

    try {
        statusUpdateLoading.textContent = "Getting Naming Standard";
        namingstandard = await getNamingStandardforproject(access_token,namingstandardID,projectID)

    } catch (error) {
        console.error("Error iterating through searchFolders:", error);
    }

    console.log(namingstandard)
    arrayprojectPin = namingstandard.find(item => item.name === "Project PIN" || item.name === "Project Pin") // Change back to Project Pin
    arrayprojectPin = arrayprojectPin ? arrayprojectPin.options : [];

    // Get the dropdown container
    const dropdownContainerProjectPin = document.getElementById("ProjectPin_input");

    // Create and append options to the dropdown
    arrayprojectPin.forEach(option => {
        const optionElement = document.createElement("option");

        optionElement.value = option.value;
        optionElement.textContent = `${option.value} - ${option.description}`;
        dropdownContainerProjectPin.appendChild(optionElement);
    });
    arrayOriginator = namingstandard.find(item => item.name === "Originator")
    arrayOriginator = arrayOriginator ? arrayOriginator.options : [];
    // Get the dropdown container
    const dropdownContainerOriginator = document.getElementById("Originator_input");
    // if(isAdmin){
    //     // Create and append options to the dropdown
    //     arrayOriginator.forEach(option => {
    //         const optionElement = document.createElement("option");
    //         if(option.value == "KEL"){
    //             optionElement.selected = true
    //         }
    //         optionElement.value = option.value;
    //         optionElement.textContent = `${option.value} - ${option.description}`;
    //         optionElement.description = option.description;
    //         dropdownContainerOriginator.appendChild(optionElement);
    //     });
    // }else{
        const wipFolders = deliverableFolders.filter(folder => folder.folderEndName === "WIP");
        arrayOriginatorSingle = arrayOriginator.filter(originator => originator.description.includes(userCompany))
        arrayOriginatorSingle.forEach(option => {
            const optionElement = document.createElement("option");
            optionElement.selected = true
            optionElement.value = option.value;
            optionElement.textContent = `${option.value} - ${option.description}`;
            optionElement.description = option.description;
            dropdownContainerOriginator.appendChild(optionElement);
        });
        selectedOriginator = document.querySelector("#Originator_input").value
    //}


    arrayfunction = namingstandard.find(item => item.name === "Function")
    arrayfunction = arrayfunction ? arrayfunction.options : [];

    // Get the dropdown container
    const dropdownContainerfunction = document.getElementById("Function_input");

    // Create and append options to the dropdown
    arrayfunction.forEach(option => {
        const optionElement = document.createElement("option");
        optionElement.value = option.value;
        optionElement.textContent = `${option.value} - ${option.description}`;
        optionElement.description = option.description;
        dropdownContainerfunction.appendChild(optionElement);
    });

    arraySpatial = namingstandard.find(item => item.name === "Spatial")
    arraySpatial = arraySpatial ? arraySpatial.options : [];

    // Get the dropdown container
    const dropdownContainerSpatial = document.getElementById("Spatial_input");

    // Create and append options to the dropdown
    arraySpatial.forEach(option => {
        const optionElement = document.createElement("option");
        optionElement.value = option.value;
        optionElement.textContent = `${option.value} - ${option.description}`;
        optionElement.description = option.description;
        dropdownContainerSpatial.appendChild(optionElement);
    });

    arrayForm = namingstandard.find(item => item.name === "Form")
    arrayForm = arrayForm ? arrayForm.options : [];

    // Get the dropdown container
    const dropdownContainerForm = document.getElementById("Form_input");

    // Create and append options to the dropdown
    arrayForm.forEach(option => {
        const optionElement = document.createElement("option");
        optionElement.value = option.value;
        optionElement.textContent = `${option.value} - ${option.description}`;
        optionElement.description = option.description;
        dropdownContainerForm.appendChild(optionElement);
    });

    arrayDiscipline = namingstandard.find(item => item.name === "Discipline")
    arrayDiscipline = arrayDiscipline ? arrayDiscipline.options : [];

    // Get the dropdown container
    const dropdownContainerDiscipline = document.getElementById("Discipline_input");

    // Create and append options to the dropdown
    arrayDiscipline.forEach(option => {
        const optionElement = document.createElement("option");

        optionElement.value = option.value;
        optionElement.textContent = `${option.value} - ${option.description}`;
        optionElement.description = option.description;
        dropdownContainerDiscipline.appendChild(optionElement);
    });



    //console.log(namingstandard)
    console.log('Project Pin',arrayprojectPin)
    console.log('Originator',arrayOriginator)
    console.log('Function',arrayfunction)
    console.log('Spatial',arraySpatial)
    console.log('Form',arrayForm)
    console.log('Discipline',arrayDiscipline)
    }

async function getfileslist(projectPin) {
    try {
        access_token = await getAccessToken("data:read");
    } catch {
        console.log("Error: Getting Access Token");
    }
    //console.log("Access Token: ", access_token);
    // if(projectPin !== null){
    //     console.log(projectPin)
    //     searchFolders = deliverableFolders.filter(
    //         item => item.folderPath && projectPin && item.folderPath.includes(projectPin)
    //       );
    // }else{
        searchFolders = deliverableFolders
    //}
    
    try {
        for (const folder of searchFolders) {
            try {
                if (getRate >= 290) {
                    console.log("Waiting for 5 Seconds..."); // Displaying the message for a 60-second delay
                    getRate = 0
                    await delay(5000); // Delaying for 60 seconds
                }else{
                    filelist_temp = await getfolderItems(folder.folderID, access_token, projectID);
                
                    console.log("Folder searched",folder.folderPath)
                    statusUpdateLoading.textContent = "Folder searched: "+folder.folderPath+"..."

                }
                
            } catch (error) {
                console.error("Error getting folder items:", error);
            }
            
            filelist = filelist.concat(filelist_temp.data.map(item => item.attributes.displayName))
        }

    } catch (error) {
        console.error("Error iterating through searchFolders:", error);
    }
    console.log("File List",filelist)
    }

async function getAccessToken(scopeInput){

    const bodyData = {
        scope: scopeInput,
        };

    const headers = {
        'Content-Type':'application/json'
    };

    const requestOptions = {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(bodyData)
    };

    const apiUrl = "https://prod-30.uksouth.logic.azure.com:443/workflows/df0aebc4d2324e98bcfa94699154481f/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=jHsW0eISklveK7XAJcG0nhfEnffX62AP0mLqJrtLq9c";
    //console.log(apiUrl)
    //console.log(requestOptions)
    signedURLData = await fetch(apiUrl,requestOptions)
        .then(response => response.json())
        .then(data => {
            const JSONdata = data

        //console.log(JSONdata)

        return JSONdata.access_token
        })
        .catch(error => console.error('Error fetching data:', error));


    return signedURLData
    }

async function getfolderItems(folder_id,AccessToken,project_id){

    const headers = {
        'Authorization':"Bearer "+AccessToken,
    };

    const requestOptions = {
        method: 'GET',
        headers: headers,
    };

    const apiUrl = "https://developer.api.autodesk.com/data/v1/projects/b."+project_id+"/folders/"+folder_id+"/contents";
    //console.log(apiUrl)
    //console.log(requestOptions)
    signedURLData = await fetch(apiUrl,requestOptions)
        .then(response => response.json())
        .then(data => {
            const JSONdata = data
            getRate++
            console.log("getRate",getRate)
        //console.log(JSONdata)
        //console.log(JSONdata.uploadKey)
        //console.log(JSONdata.urls)
        return JSONdata
        })
        .catch(error => console.error('Error fetching data:', error));
    return signedURLData
    }

async function getItemsStorage(AccessToken){
    selectedItem = templateDropdown.value
    const headers = {
        'Authorization':"Bearer "+AccessToken,
    };

    const requestOptions = {
        method: 'GET',
        headers: headers,
    };

    const apiUrl = "https://developer.api.autodesk.com/data/v1/projects/b."+projectID+"/items/"+selectedItem;
    //console.log(apiUrl)
    //console.log(requestOptions)
    signedURLData = await fetch(apiUrl,requestOptions)
        .then(response => response.json())
        .then(data => {
            const JSONdata = data
        //console.log(JSONdata)
        //console.log(JSONdata.uploadKey)
        //console.log(JSONdata.urls)
        return JSONdata
        })
        .catch(error => console.error('Error fetching data:', error));
    return signedURLData
    }

async function getItemStorageS3URL(AccessToken,itemURL){

    const headers = {
        'Authorization':"Bearer "+AccessToken,
    };

    const requestOptions = {
        method: 'GET',
        headers: headers,
    };

    const apiUrl = itemURL+"/signeds3download";
    //console.log(apiUrl)
    //console.log(requestOptions)
    signedURLData = await fetch(apiUrl,requestOptions)
    .then(response => {
        // Check if response is successful
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        // Return the response body as a Blob object
        return response.blob();
      })
      .then(fileBlob => {
        // Process the received file as a generic binary file
        console.log('Received file of type application/octet-stream');
        // Here, you can handle the binary file according to your needs
        // For example, you might want to save it to disk or display a download link
        // Below is just a sample of how you might handle it
        //const downloadUrl = URL.createObjectURL(fileBlob);
        //const downloadLink = document.createElement('a');
        //downloadLink.href = downloadUrl;
        //downloadLink.download = filename; // Set a default filename
        //downloadLink.textContent = 'Download file';
        //document.body.appendChild(downloadLink);
        fileTemplate = fileBlob
      })
      .catch(error => {
        console.error('Error:', error);
      });
        //.catch(error => console.error('Error fetching data:', error));
    return signedURLData
    }

async function downloadItem(downloadURL){
    
    const requestOptions = {
        method: 'GET',
    };

    const apiUrl = downloadURL;
    //console.log(apiUrl)
    //console.log(requestOptions)
    signedURLData = await fetch(apiUrl,requestOptions)
        .then(response => response.json())
        .then(data => {
            const JSONdata = data
        //console.log(JSONdata)
        //console.log(JSONdata.uploadKey)
        //console.log(JSONdata.urls)
        return JSONdata
        })
        .catch(error => console.error('Error fetching data:', error));
    return signedURLData
    }

async function getNamingStandardforproject(access_token,ns_id,project_id){

    const headers = {
        'Authorization':"Bearer "+access_token,
    };

    const requestOptions = {
        method: 'GET',
        headers: headers,
    };

    const apiUrl = "https://developer.api.autodesk.com/bim360/docs/v1/projects/"+project_id+"/naming-standards/"+namingstandardID;
    //console.log(apiUrl)
    //console.log(requestOptions)
    responseData = await fetch(apiUrl,requestOptions)
        .then(response => response.json())
        .then(data => {
            const JSONdata = data
        //console.log(JSONdata)
        //console.log(JSONdata.uploadKey)
        //console.log(JSONdata.urls)
        return JSONdata.definition.fields
        })
        .catch(error => console.error('Error fetching data:', error));
    return responseData
    }

async function getProjectDetailsFromACC(){
    accessTokenDataRead = await getAccessToken("data:read")
    // topFolderData = await getProjectTopFolder(accessTokenDataRead,hubID,projectID)
    // ProjectFiles = topFolderData.data.filter(item => {
    //     return item.attributes.name === "Project Files"
    // })
    // startFolderID = ProjectFiles[0].id
    // console.log("Project Files Folder ID:",startFolderID)
    // startfolder_list = [{folderID: ProjectFiles[0].id,folderName: ProjectFiles[0].attributes.name}]
    // console.log("StartFolder:",startfolder_list)
    await getAllACCFolders()

    }

async function getProjectTopFolder(accessTokenDataRead,hubID,projectID){

    const bodyData = {

        };

    const headers = {
        'Authorization':"Bearer "+accessTokenDataRead,
        //'Content-Type':'application/json'
    };

    const requestOptions = {
        method: 'GET',
        headers: headers,
        //body: JSON.stringify(bodyData)
    };

    const apiUrl = "https://developer.api.autodesk.com/project/v1/hubs/"+hubID+"/projects/b."+projectID+"/topFolders";
    //console.log(apiUrl)
    //console.log(requestOptions)
    responseData = await fetch(apiUrl,requestOptions)
        .then(response => response.json())
        .then(data => {
            const JSONdata = data

            console.log(JSONdata)

        return JSONdata
        })
        .catch(error => console.error('Error fetching data:', error));

    return responseData
    }

async function getAllACCFolders(startfolder_list){

        //statusUpdate = document.getElementById('statusUpdate')

        try {
            await getFolders()

            //statusUpdate.innerHTML = `<p class="extracted-ids"> Template List Extracted</p>`
        } catch {
            console.log("Error: Geting folder list");
        }
        //await convertToExcelTable(nsData,templatesList,deliverableFolders)
        //statusUpdate.innerHTML = `<p class="extracted-ids"> Templae and Options file ready for download</p>`


    }

    async function getFolders() {
        try {
            access_token_create = await getAccessToken("data:write");
        } catch {
            console.log("Error: Getting Create Access Token");
        }
        try {
            access_token_read = await getAccessToken("data:read");
        } catch {
            console.log("Error: Getting Read Access Token");
        }
        getRate = 0;
            
        folderList_Main = []
        statusUpdateLoading.textContent = "Getting Folders..."
        await sortFolderList()
        //statusUpdate.innerHTML = `<p class="extracted-ids"> Start Folder Found</p>`
        //await getFolderList(access_token_read,startfolder_list)
        //statusUpdate.innerHTML = `<p class="extracted-ids"> Folder List Created</p>`
        console.log("Full Folder List",folderList_Main)
        console.log("Deliverable Folders:",deliverableFolders)
        //await getTemplateFolder()
        await getNamingStandardID(deliverableFolders)
        statusUpdateLoading.textContent = "Getting Template files..."
        await getTemplateFiles()
        //statusUpdate.innerHTML = `<p class="extracted-ids"> Naming Standard Extracted</p>`
        
        // uploadfolders = deliverableFolders.filter(item => {
        //     return item.folderPath.includes("WIP") || item.folderPath.includes("SHARED");
        // });
        console.log('Upload Folders',uploadfolders)
        localStorage.setItem('projectId',projectID)
        // localStorage.setItem('mainFolderArray', JSON.stringify(folderList_Main));
        // localStorage.setItem('uploadFolderArray', JSON.stringify(uploadfolders));
        // localStorage.setItem('deliverableFoldersArray', JSON.stringify(deliverableFolders));
        const newTime = new Date().getTime()
        console.log('New Folder Update Time',newTime)
        localStorage.setItem('folderGatheredTimestamp', newTime);
    }

    async function getFolderListFromSP(){
        const bodyData = {
            'project_ID': projectID
        };
        const headers = {
            'Content-Type': 'application/json',
        };
    
        const requestOptions = {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(bodyData)
        };
    
        const apiUrl = "https://prod-29.uksouth.logic.azure.com:443/workflows/aa3b3f6ba93f4901acef15184cd5b8de/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=olW_Pb6Al6jJNptqxPXBc-_YBoqN2YOmYiYYBrqd1C8";
        //console.log(apiUrl)
        //console.log(requestOptions)
        signedURLData = await fetch(apiUrl,requestOptions)
            .then(response => response.json())
            .then(data => {
                console.log('Raw SP Folder Data',data)
                const JSONdata = data;

            //console.log(JSONdata)
            //console.log(JSONdata.uploadKey)
            //console.log(JSONdata.urls)
            return JSONdata
            })
            .catch(error => console.error('Error fetching data:', error));
        return signedURLData
        }
    

    async function sortFolderList() {
        try{
            folderData = await getFolderListFromSP()
            deliverableFolders = JSON.parse(folderData[0].folder_array_deliverables)
            folderList_Main= JSON.parse(folderData[0].folder_array)
            uploadfolders = JSON.parse(folderData[0].upload_folders)
            let templateFolder = JSON.parse(folderData[0].templateFolder)
            console.log('SP_List_templateFolder',templateFolder)
            templateFolderID = templateFolder[0].folderID
            console.log('SP_List_deliverableFolders',deliverableFolders)
            console.log('SP_List_folderList_Main',folderList_Main)
            console.log('SP_List_uploadfolders',uploadfolders)
            console.log('SP_List_templateFolderID',templateFolderID)
        } catch {
            console.log("Error: Geting folder list");
            console.error()
        }

    }
async function getFolderList(AccessToken, startFolderList, parentFolderPath) {

        // Array of folder names to skip
        const foldersToSkip = ["HE565627_A66_PROJECT_LEVEL","0A.INCOMING","Z.PROJECT_ADMIN","ZZ.SHADOW_PROJECT"];
        const deliverableFoldersToAdd = ["APPROVED_TEMPLATES","WIP","0E.SHARED","0F.CLIENT_SHARED","0F.SHARED_TO_CLIENT", "0G.PUBLISHED", "0H.ARCHIVED"]

        for (const startFolder of startFolderList) {
            const folderList = await getfolderItems(startFolder.folderID, AccessToken, projectID);
            if (!folderList || !folderList.data || !Array.isArray(folderList.data)) {
                throw new Error("Error getting folder items: Invalid folderList data");
            }
            if (getRate >= 290) {
                console.log("Waiting for 5 Seconds..."); // Displaying the message for a 60-second delay
                getRate = 0
                await delay(5000); // Delaying for 60 seconds
            } else {
                for (const folder of folderList.data) {
                    if (folder.type === 'folders') {
                        const folderID = "folderID: " + folder.id;
                        folderNameLocal = "folderPath: " + folder.attributes.name;
                        const fullPath = parentFolderPath ? parentFolderPath + '/' + folderNameLocal.split(': ')[1] : folderNameLocal.split(': ')[1];
                        folderList_Main.push({ folderID: folder.id, folderPath: fullPath,folderNameEnd: folderNameLocal });
                        if(deliverableFoldersToAdd.some(AddName => folderNameLocal.includes(AddName))){
                            deliverableFolders.push({ folderID: folder.id, folderPath: fullPath,folderNameEnd: folder.attributes.name });
                            if(folderNameLocal.includes("APPROVED_TEMPLATES")){
                                templateFolderID = folder.id
                            }

                        }
                        
                        if(fullPath.includes("0C.WIP/")){
                            deliverableFolders.push({ folderID: folder.id, folderPath: fullPath,folderNameEnd: folder.attributes.name });
                        }
                        //statusUpdate.innerHTML = `<p class="extracted-ids"> Added folder: ${fullPath}</p>`
                        console.log("Added folder:", folderID, fullPath);
                        statusUpdateLoading.textContent = "Folder found: "+fullPath+"..."
                        // Check if the folderName contains any of the names in foldersToSkip array
                        if (!foldersToSkip.some(skipName => folderNameLocal.includes(skipName))) {
                            await getFolderList(AccessToken, [{ folderID: folder.id, folderPath: fullPath }], fullPath);
                        } else {
                            console.log("Skipping getFolderList for folder:", folderID, fullPath);
                        }
                    }
                }
            }
            }


                //await Promise.all(promises);
            }
        
async function getNamingStandardID(folderArray){
    wipFolderID = folderArray.filter(item => {
        return item.folderPath.includes("WIP")})
    console.log("Keltrbay WIP Folder for NS",wipFolderID[0]);
    defaultFolder = wipFolderID[0].folderID
    returnData = await getFolderDetails(accessTokenDataRead,projectID,wipFolderID[0].folderID)
    
    console.log('Naming Standard Folder Data',returnData)
    namingstandardID = returnData.data.attributes.extension.data.namingStandardIds[0]
    console.log('Naming Standard ID', namingstandardID)
}

// async function getTemplateFolder(folderArray){
//     // templateFolderID = folderArray.find(item => item.folderPath.includes("APPROVED_TEMPLATES")).folderID;

//     console.log('Template Folder ID:',templateFolderID);


    
//     return 
// }
async function getFolderDetails(accessTokenDataRead,projectID,folderID){

    const headers = {
        'Authorization':"Bearer "+accessTokenDataRead,
    };

    const requestOptions = {
        method: 'GET',
        headers: headers,
    };

    const apiUrl = "https://developer.api.autodesk.com/data/v1/projects/b."+projectID+"/folders/"+folderID;
    //console.log(apiUrl)
    //console.log(requestOptions)
    responseData = await fetch(apiUrl,requestOptions)
        .then(response => response.json())
        .then(data => {
            const JSONdata = data
        //console.log(JSONdata)
        //console.log(JSONdata.uploadKey)
        //console.log(JSONdata.urls)
        return JSONdata
        })
        .catch(error => console.error('Error fetching data:', error));
    return responseData
    }
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
    }
    // Load the CSV file
    // JavaScript function to trigger the click event on the file input
    function openFileExplorer() {
        document.getElementById('fileInput').click();
    }

    function handleDragOver(event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
    }

    function handleDrop(event) {
    event.preventDefault();
    var file = event.dataTransfer.files[0];
    console.log(file)
    handleFile(file);
    }

    function handleDragEnter(event) {
    event.preventDefault();
    document.getElementById('drop-area').classList.add('hover');
    }

    function handleDragLeave(event) {
    event.preventDefault();
    document.getElementById('drop-area').classList.remove('hover');
    }

    function handleFileSelect(event) {
    var file = event.target.files[0];
    handleFile(file);
    }

    function handleFile(file) {
    // Display file name
        const fileSizeInBytes = file.size;
        const fileSizeInKb = fileSizeInBytes / 1024;
        const fileSizeText = fileSizeInKb > 1024 ? (fileSizeInKb / 1024).toFixed(2) + ' MB' : fileSizeInKb.toFixed(2) + ' KB';
    document.getElementById('file-info').innerHTML = `<p>File: ${file.name}</p><p>Size: ${fileSizeText}</p>`;
    fileExtension = file.name.split('.').pop();
    // Add 'uploaded' class to indicate file upload
    document.getElementById('drop-area').classList.add('uploaded');
    console.log(file)
    droppedfile = file
    }



// Function to populate dropdown with data
function populateClassificationDropdown() {
    
    //data = uniclassClassificationsArray
    // Sentences you want to split into individual keywords
    const sentences = [selectedFunction.description, selectedForm.description];
    console.log(sentences)
    // Split the sentences into individual keywords
    const keywords = sentences.join(" ").split(" ");
    console.log(keywords)
    data = uniclassClassificationsArray.filter(item => 
        keywords.some(keyword => item.title.includes(keyword))
    );
    // Using filter and map to remove duplicates based on 'id'
    const uniqueArray = data.filter((obj, index, self) =>
        index === self.findIndex((item) => item.code === obj.code)
    );
    console.log('classificationData',uniqueArray)
    const searchInput = document.getElementById('input_Classification');
    const selectOptions = document.getElementById('selectOptions');


    // Function to create the dropdown options
    function populateOptions(items) {
        selectOptions.innerHTML = "";
        items.forEach(item => {
            const div = document.createElement('div');
            div.textContent = item.code+" - "+item.title;
            div.addEventListener('click', () => {
                searchInput.textContent = item.code+" - "+item.title;
                searchInput.value = item.code;
                selectOptions.innerHTML = "";
            });
            selectOptions.appendChild(div);
        });
    }

    // Populate the dropdown with all options initially
    populateOptions(uniqueArray);

    // Add event listener to filter the dropdown based on search input
    searchInput.addEventListener('input', function() {
        const filter = searchInput.value.toLowerCase();
        const filteredOptions = data.filter(option => {
            // Check if any field in the object contains the search term
            return Object.values(option).some(value =>
                value.toString().toLowerCase().includes(filter)
            );
        });
        populateOptions(filteredOptions);
        selectOptions.style.display = 'block'; // Show the dropdown when input is typed
    });

    // Close the dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!searchInput.contains(e.target) && !selectOptions.contains(e.target)) {
            selectOptions.innerHTML = "";
        }
    });

    // Open dropdown on input click
    searchInput.addEventListener('click', function() {
        populateOptions(data);
        selectOptions.style.display = 'block'; // Show the dropdown when input is typed
    });
}

// Usage


    const NBS_ClientID = "43F135AD-454B-41FD-9595-AD5B22043FBF"
    const NBS_ClientSecret = "A3FC7F77-3A1A-4243-B37A-A64FD6B7DD98"

//generateNBSAccessToken(NBS_ClientID,NBS_ClientSecret)

async function generateNBSAccessToken(clientId,clientSecret){
    const bodyData = {
    client_id: clientId,
    client_secret: clientSecret,
    grant_type:'client_credentials',
    scope:'bimtoolkitapi'
    };

    var formBody = [];
    for (var property in bodyData) {
        var encodedKey = encodeURIComponent(property);
        var encodedValue = encodeURIComponent(bodyData[property]);
        formBody.push(encodedKey + "=" + encodedValue);
    };
    formBody = formBody.join("&")

    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
    };

    const requestOptions = {
        method: 'POST',
        headers: headers,
        body: formBody,
    };
    const apiUrl = 'https://identity.thenbs.com/core/connect/token';
    //console.log(requestOptions)
    AccessToken_Local = await fetch(apiUrl,requestOptions)
        .then(response => response.json())
        .then(data => {
        //console.log(data)
        console.log("NBS Access Token",data.access_token)
        return data.access_token
        })
        .catch(error => console.error('Error fetching data:', error));
        return AccessToken_Local
    }