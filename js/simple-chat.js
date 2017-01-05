function verifyAuth() {
    var user = firebase.auth().currentUser;
    
    if (user !== null) {
        window.location.replace("./home.html");
    } else {
        if (window.location.pathname !== "/index.html") {
            returnToLogin();
        }
    }
}

function login() {
    var email = $("#email").val();
    var pass = $("#password").val();
    
    if (email.length === 0) {
        alert("please enter all information");
    } else if (pass.length === 0) {
        alert("please enter all information");
    } else {
        // Firebase login
    }
    
}

function signup() {
    var name = $("#name").val();
    var email = $("#email").val();
    var pass = $("#password").val();
    var pass_v = $("#password_verification").val();
    
    if (name.length === 0 || email.length === 0 || pass.length === 0 || pass_v.length === 0) {
        alert("please enter all fields");
    } else if (pass !== pass_v) {
        alert("password does not match");
    } else {
        // Firebase signup
    }
}

function loadHome() {
    verifyAuth();
}

function goToSignup() {
    window.location.replace("./signup.html");
}

function returnToLogin() {
    window.location.replace("./index.html");
}

function signOut() {
    firebase.auth().signOut().then(function() {
        returnToLogin();
    }, function(error) {
        console.log(error);
    });
}