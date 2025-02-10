window.onload = async function () {
    userID = sessionStorage.getItem('userID')
    access_token = await getAccessToken("account:read data:read");
    projectID = sessionStorage.getItem('projectID')
    await getUserProjectDetails(access_token, userID);
    userCompany = userProjectDetails.companyName;
    console.log(userCompany);
    console.log("userProjectRoles", userProjectRoles);
    await setToolMode();
};


async function getUserProjectDetails(accessToken, userId) {
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`, // Make sure this is securely handled
    };
    const requestOptions = {
      method: "GET",
      headers: headers,
    };
    const apiUrl = `https://developer.api.autodesk.com/construction/admin/v1/projects/b.${projectID}/users/${userId}`;
    response = await fetch(apiUrl, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        if(data.status == '404'){
          showCustomAlert()
          // alert(`You are not permitted to access this project please request access via the Access Request Form`)
          // location.reload();
        }
        console.log(data);
        userProjectDetails = data;
        userProjectRoles = data.roles;
        return data;
      })
      .catch((error) => console.error("Error fetching data:", error));
    return response;
  }

  async function setToolMode() {
    const rolesToCheck = [
      "System Administrator",
      "Document Controller",
      "Information Manager",
    ];
  
    // Check if any roles in rolesToCheck are present in userProjectRoles
    isAdmin = rolesToCheck.some((role) =>
      userProjectRoles.some((userRole) => userRole.name === role)
    );
  
    if (isAdmin) {
      activateAdminMode();
    }
  
    function activateAdminMode() {
      document.getElementById("Originator_input").disabled = false;
      document.getElementById("input_folder").disabled = false;
      document.getElementById("input_Status").disabled = false;
  
      console.log("Admin mode activated");
    }
  }