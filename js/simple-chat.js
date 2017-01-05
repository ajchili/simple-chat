function verifyAuth() {
    var user = firebase.auth().currentUser;
    
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            if (!window.location.pathname.includes("/home.html")) {
                window.location.replace("./home.html");
            }
        } else {
            if (!window.location.pathname.includes("/index.html")) {
                returnToLogin();
            }
        }
    });
}

function login() {
    var email = $('#email').val();
    var pass = $('#password').val();
    
    if (email.length === 0) {
        alert("please enter all information");
    } else if (pass.length === 0) {
        alert("please enter all information");
    } else {
        firebase.auth().signInWithEmailAndPassword(email, pass).then(function(error) {
            var errorCode = error.code;
            var errorMessage = error.message;
            
            if (errorCode === "auth/wrong-password") {
                alert("incorrect password");
            } else if (errorCode === "auth/invalid-email") {
                alert("account does not exist");
            } 
        });
        
        verifyAuth();
    }
    
}

function signup() {
    var name = $('#name').val();
    var email = $('#email').val();
    var pass = $('#password').val();
    var pass_v = $('#password_verification').val();
    
    if (name.length === 0 || email.length === 0 || pass.length === 0 || pass_v.length === 0) {
        alert("please enter all fields");
    } else if (pass !== pass_v) {
        alert("password does not match");
    } else {
        firebase.auth().createUserWithEmailAndPassword(email, pass_v).then(function(user) {
            var user = firebase.auth().currentUser;

            user.updateProfile({
                displayName: $('#name').val()
            }).then(function() {
                firebase.database().ref('users/' + user.uid).update({
                    username: user.uid
                }).then(function() {
                    verifyAuth();
                });
            }, function(error) {

            });
        }, function(error) {
            var errorCode = error.code;
            var errorMessage = error.message;
            
            if (errorCode === "auth/email-already-in-use") {
                alert("email already in use");
            } else if (errorCode === "auth/invalid-email") {
                alert("account does not exist");
            }
        });
    }
}

function loadHome() {
    verifyAuth();
    
    var user = firebase.auth().currentUser;

    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            $('#welcome').text("hello " + user.displayName);
        }
    });
}

function loadSettings() {
    var user = firebase.auth().currentUser;
    
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            $('#name').val(user.displayName);
            $('#username').val(user.uid);
            $('#email').val(user.email);
            
            firebase.database().ref('users/' + user.uid).once('value').then(function(snapshot) {
                if (snapshot.child('username').val() !== user.uid && snapshot.child('username').val() !== null) {
                    $('#username').val(snapshot.child('username').val());
                }
            });   
        } else {
            returnToLogin();
        }
    });
}

function saveSettings() {
    var user = firebase.auth().currentUser;

    user.updateProfile({
        displayName: $('#name').val()
    }).then(function() {
        
    }, function(error) {
        
    });
    
    if ($('#username').val() !== "") {
        firebase.database().ref('users/' + user.uid).update({
            username: $('#username').val()
        });
    } else {
        firebase.database().ref('users/' + user.uid).update({
            username: user.uid
        });
        $('#username').val(user.uid)
    }
}

function goToSignup() {
    window.location.replace("./signup.html");
}

function returnToLogin() {
    window.location.replace("./index.html");
}

function goToSettings() {
    var user = firebase.auth().currentUser;
    
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            if (!window.location.pathname.includes("/settings.html")) {
                window.location.replace("./settings.html");
            }
        } else {
            if (!window.location.pathname.includes("/index.html")) {
                returnToLogin();
            }
        }
    });
}

function signOut() {
    firebase.auth().signOut().then(function() {
        returnToLogin();
    }, function(error) {
        console.log(error);
    });
}

function deleteUser() {
    var user = firebase.auth().currentUser;

    firebase.auth().onAuthStateChanged(function(user) {
        var confirmation = prompt("please enter your email address to confirm deletion \n(" + user.email + ")", "");
        if (confirmation === user.email) {
            firebase.database().ref('users/' + user.uid).remove().then(function() {
                user.delete().then(function() {
                verifyAuth();
                });
            });
        }
    }).then(function() {
        
    }, function(error) {
        
    });
}