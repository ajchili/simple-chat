function verifyAuth() {
    var user = firebase.auth().currentUser;
    
    if (user != null) {
        window.location.replace("./home.html");
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
        firebase.auth().signInWithEmailAndPassword(email, pass).catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
            
        if (errorCode === 'auth/wrong-password') {
            alert("incorrect password");
        } else if (errorCode === 'auth/invalid-email') {
            alert("invalid email");
        } else {
            console.log(errorMessage);
        }});
        
        verifyAuth();
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
        firebase.auth().createUserWithEmailAndPassword(email, pass_v).then(function(user) {
            var user = firebase.auth().currentUser;

            user.updateProfile({
                displayName: name
            });
        }.catch(function(error) {
            var errorCode = error.code;
            var errorMessage = error.message;
            if (errorCode === "auth/email-already-in-use") {
                
            } else {
                firebase.database().ref('users/' + userId).set({
                    name: name
                });
                verifyAuth();
            }
        });
    }
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