// Variable to store the logged-in user object
let loggedInUser;

// Function to log in and activate user
function loginAndActivate() {
  // Get user input values
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  let urlApi = document.getElementById("urlApi").value;

  // Add "/api/v1/" to the urlApi if it doesn't already contain it
  if (!urlApi.endsWith("/api/v1/")) {
    urlApi += "/api/v1/";
  }

  // Set request headers
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  // Create JSON data for the request
  const raw = JSON.stringify({
    "email": email,
    "password": password,
    "urlApi": `https://${urlApi}`
  });

  // Set fetch request options
  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  // Make a fetch request to get user data
  fetch("https://n8n.integracao.cloud/webhook/getUser", requestOptions)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(user => {
      // Store the logged-in user object
      loggedInUser = user;
      // Display user roles
      displayRoles(user.roles);
      // Hide login button and show activation buttons
      document.getElementById('login').style.display = 'none';
      document.getElementById('activationButtons').style.display = 'block';
    })
    .catch(error => {
      console.error('Error:', error.message);
      Swal.fire({
        icon: "error",
        title: "Error...",
        text: "Senha incorreta, ou erro do servidor. Tente novamente."
      });
      // alert('Error: Senha incorreta, ou erro do servidor. Tente novamente.');
    });
}

// Function to display user roles
function displayRoles(roles) {
  const rolesList = document.getElementById('rolesList');
  rolesList.style.display = 'block';

  if (roles.length > 0) {
    // Generate HTML for each role
    const html = roles.map(role => `<div class="role">${role}</div>`).join('');
    rolesList.innerHTML = 'Distribuição está ativa para:' + html;
  } else {
    rolesList.innerHTML = 'Nenhuma Distribuição ativa';
  }
}

// Function to activate user account
function activateAccount() {
  if (loggedInUser) {
    // Show the department modal for activation
    document.getElementById('departmentModal').style.display = 'block';
  } else {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Something went wrong!"
    });
  }
}

// Function to deactivate user account
function deactivateAccount() {
  if (loggedInUser) {
    // Show the deactivate modal
    document.getElementById('deactivateModal').style.display = 'block';
  } else {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Something went wrong!"
    });
  }
}

// Function to confirm deactivation of user account
function confirmDeactivation(modal) {
  let reason = document.getElementById('reason').value;

  if (reason === 'Outros') {
    // Prompt user for custom reason if "Outros" selected
    const customReason = prompt('Por favor informe o motivo:');
    if (customReason === null || customReason.trim() === '') {
      alert('Por favor informe o motivo');
      return;
    }
    reason = customReason;
  }

  // Set request headers
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  // Create JSON data for deactivation request
  const userBody = JSON.stringify({
    "user": loggedInUser,
    "reason": reason,
    "department": document.getElementById('selector1').value
  });

  // Set fetch request options for deactivation
  const deactivateOptions = {
    method: 'POST',
    headers: myHeaders,
    body: userBody,
    redirect: 'follow'
  };

  // Make a fetch request to deactivate user
  fetch("https://n8n.integracao.cloud/webhook/deactivateUser", deactivateOptions)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      // Refresh and display updated user data
      loginAndActivate();
      Swal.fire({
        title: "Deactivation response",
        text: JSON.stringify(data),
        icon: "success"
      });
    })
    .catch(error => {
      console.error('Error:', error.message);
      Swal.fire({
        icon: "error",
        title: "Error...",
        text: "Unable to activate account. Please try again."
      });
    });

  // Close the deactivate modal after processing
  document.getElementById('deactivateModal').style.display = 'none';
}

// Function to confirm activation of user account
function confirmActivation() {
  // Set request headers
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  // Create JSON data for activation request
  const userBody = JSON.stringify({
    "user": loggedInUser,
    "department": document.getElementById('selector2').value
  });

  // Set fetch request options for activation
  const activateOptions = {
    method: 'POST',
    headers: myHeaders,
    body: userBody,
    redirect: 'follow'
  };

  // Make a fetch request to activate user
  fetch("https://n8n.integracao.cloud/webhook/activateUser", activateOptions)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      // Refresh and display updated user data
      loginAndActivate();
      Swal.fire({
        title: "Activation response",
        text: JSON.stringify(data),
        icon: "success"
      });
      // alert('Activation response:\n' + JSON.stringify(data));
    })
    .catch(error => {
      console.error('Error:', error.message);
      Swal.fire({
        icon: "error",
        title: "Error...",
        text: "Unable to activate account. Please try again."
      });
    });

  // Close the department modal after processing
  document.getElementById('departmentModal').style.display = 'none';
}

// Function to close modal by ID
function closeModal(modalId) {
  document.getElementById(modalId).style.display = 'none';
}

// Get the deactivate and department modals
const deactivateModal = document.getElementById('deactivateModal');
const departmentModal = document.getElementById('departmentModal');

// Close the modals if clicked outside
document.addEventListener('click', function (event) {
  if (event.target == deactivateModal || event.target == departmentModal) {
    closeModal(deactivateModal);
    closeModal(departmentModal);
  }
});