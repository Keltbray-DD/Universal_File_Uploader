

    async function fetchProjects() {
        const userID = sessionStorage.getItem('userID')
        console.log('userID Request',userID)
        const bodyData = {
            'userID': userID,
            'requestType':'fileUploader'
            };
    
        const headers = {
            'Content-Type':'application/json'
        };
    
        const requestOptions = {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(bodyData)
        };
    
        const apiUrl = "https://prod-09.uksouth.logic.azure.com:443/workflows/30f57be09dd04690be4212eb4ed6df65/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=LTEr0Q1hYKDoLnA5uWkU59tQcrDJn7scIZIiPHTQa2s";
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
    
async function loadProjects() {
    projectsArray = await fetchProjects()
    displayProjects(projectsArray)
}
// Function to display projects in the gallery
function displayProjects(projectList) {
    const gallery = document.getElementById('gallery');
    gallery.innerHTML = ''; // Clear existing projects

    if (projectList.length === 0) {
        gallery.innerHTML = '<p>No projects found.</p>';
        return;
    }

    projectList.forEach(project => {
        const projectCard = document.createElement('div');
        projectCard.className = 'project';
        projectCard.setAttribute('data-project-id', project.id); // Attach project ID as a data attribute

        const projectImage = document.createElement('img');
        projectImage.src = project.image || 'https://via.placeholder.com/80'; // Default image if none provided
        projectImage.alt = project.name;

        const projectInfo = document.createElement('div');
        projectInfo.className = 'project-info';

        const projectName = document.createElement('h2');
        projectName.textContent = project.name;

        const projectCode = document.createElement('p');
        projectCode.textContent = project.code;

        projectInfo.appendChild(projectName);
        projectInfo.appendChild(projectCode);
        projectCard.appendChild(projectImage);
        projectCard.appendChild(projectInfo);
        gallery.appendChild(projectCard);

        // Add click event listener to the project card
        projectCard.addEventListener('click', () => {
            projectID = project.id; // Set global project ID
            sessionStorage.setItem('projectID',projectID);
            sessionStorage.setItem('projectName', project.name)
            console.log('Selected Project ID:', sessionStorage.getItem('projectID'));
            if(legacyProjectList.includes(projectID)){
                window.location.href = 'legacyUploader.html'; // Navigate to the next page
            }else{
                window.location.href = 'uploaderV2.html'; // Navigate to the next page
            }
            
        });
    });
}
    // Filter projects based on search input
    function filterProjects() {
        const searchInput = document.getElementById('searchBar').value.toLowerCase();
    
        const filteredProjects = projectsArray.filter(project => {
            const name = project.name ? project.name.toLowerCase() : '';
            const code = project.code ? project.code.toLowerCase() : '';
            return name.includes(searchInput) || code.includes(searchInput);
        });
    
        displayProjects(filteredProjects);
    }
    // Event listener for the search bar
    document.getElementById('searchBar').addEventListener('input', filterProjects);

