let loggedInUser;

function loginAndActivate() {
    document.getElementById("loading").style.display = "flex";
    let e = document.getElementById("email").value,
        t = document.getElementById("password").value,
        o = new Headers;
    o.append("Content-Type", "application/json");
    let n = JSON.stringify({
        email: e,
        password: t,
        urlApi: "https://condfy.digisac.app/api/v1/"
    });
    fetch("https://app.integracao.cloud/webhook/getUser", {
        method: "POST",
        headers: o,
        body: n,
        redirect: "follow"
    }).then(e => {
        if (!e.ok) throw Error(`HTTP error! Status: ${e.status}`);
        return document.getElementById("loading").style.display = "none", e.json()
    }).then(e => {
        loggedInUser = e, displayRoles(e.roles), document.getElementById("login").style.display = "none", document.getElementById("activationButtons").style.display = "block"
    }).catch(e => {
        console.error("Error:", e.message), document.getElementById("loading").style.display = "none", Swal.fire({
            icon: "error",
            title: "Error...",
            text: "Senha incorreta, ou erro do servidor. Tente novamente."
        })
    })
}

function displayRoles(e) {
    let t = document.getElementById("rolesList");
    if (t.style.display = "block", e.length > 0) {
        let o = e.map(e => `<div class="role">${e}</div>`).join("");
        t.innerHTML = "Distribui\xe7\xe3o est\xe1 ativa para:" + o
    } else t.innerHTML = "Nenhuma Distribui\xe7\xe3o ativa"
}

function activateAccount() {
    loggedInUser ? document.getElementById("departmentModal").style.display = "block" : Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!"
    })
}

function deactivateAccount() {
    loggedInUser ? document.getElementById("deactivateModal").style.display = "block" : Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!"
    })
}

function confirmDeactivation(e) {
    let t = document.getElementById("reason").value;
    if ("Outros" === t) {
        let o = prompt("Por favor informe o motivo:");
        if (null === o || "" === o.trim()) {
            alert("Por favor informe o motivo");
            return
        }
        t = o
    }
    let n = new Headers;
    n.append("Content-Type", "application/json");
    let a = JSON.stringify({
        user: loggedInUser,
        reason: t,
        department: document.getElementById("selector1").value
    });
    document.getElementById("loading").style.display = "flex", fetch("https://app.integracao.cloud/webhook/deactivateUser", {
        method: "POST",
        headers: n,
        body: a,
        redirect: "follow"
    }).then(e => {
        if (!e.ok) throw Error(`HTTP error! Status: ${e.status}`);
        return document.getElementById("loading").style.display = "none", e.json()
    }).then(e => {
        loginAndActivate(), Swal.fire({
            title: "Deactivation response",
            text: JSON.stringify(e),
            icon: "success"
        })
    }).catch(e => {
        console.error("Error:", e.message), document.getElementById("loading").style.display = "none", Swal.fire({
            icon: "error",
            title: "Error...",
            text: "Unable to activate account. Please try again."
        })
    }), document.getElementById("deactivateModal").style.display = "none"
}

function confirmActivation() {
    let e = new Headers;
    e.append("Content-Type", "application/json");
    let t = JSON.stringify({
        user: loggedInUser,
        department: document.getElementById("selector2").value
    });
    document.getElementById("loading").style.display = "flex", fetch("https://app.integracao.cloud/webhook/activateUser", {
        method: "POST",
        headers: e,
        body: t,
        redirect: "follow"
    }).then(e => {
        if (!e.ok) throw Error(`HTTP error! Status: ${e.status}`);
        return document.getElementById("loading").style.display = "none", e.json()
    }).then(e => {
        loginAndActivate(), Swal.fire({
            title: "Activation response",
            text: JSON.stringify(e),
            icon: "success"
        })
    }).catch(e => {
        console.error("Error:", e.message), document.getElementById("loading").style.display = "none", Swal.fire({
            icon: "error",
            title: "Error...",
            text: "Unable to activate account. Please try again."
        })
    }), document.getElementById("departmentModal").style.display = "none"
}

function closeModal(e) {
    document.getElementById(e).style.display = "none"
}
const deactivateModal = document.getElementById("deactivateModal"),
    departmentModal = document.getElementById("departmentModal");
document.addEventListener("click", function(e) {
    (e.target == deactivateModal || e.target == departmentModal) && (closeModal(deactivateModal), closeModal(departmentModal))
});
