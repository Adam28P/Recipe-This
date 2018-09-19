// A $( document ).ready() block.
$(document).ready(function () {

    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyArwjeJZ8FrOfyu8Vek5gqFmiTAbuAVn3Q",
        authDomain: "recipe-this-9ec94.firebaseapp.com",
        databaseURL: "https://recipe-this-9ec94.firebaseio.com",
        projectId: "recipe-this-9ec94",
        storageBucket: "",
        messagingSenderId: "111469392247"
    };
    firebase.initializeApp(config);

    var database = firebase.database();

    $("#submitRegister").on("click", function () {
        var userEmail = $("#email").val();
        var userPass = $("#password").val();

        firebase.auth().createUserWithEmailAndPassword(userEmail, userPass).then(function(user) {
            var userInfo = firebase.auth().currentUser;
            database.ref("users").child(userInfo.uid).set({ email: userEmail, password: userPass, favouriteRecipeId: 'none' }).catch(function(error) { console.error(error); });
            window.location.replace("profile.html");
        }).catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // ...
            $("#errorMessage").html(errorMessage);
        });

          return false;
    });

    $("#submitLogin").on("click", function () {
        var userEmail = $("#email").val();
        var userPass = $("#password").val();

        firebase.auth().signInWithEmailAndPassword(userEmail, userPass).then(function(user) {
            window.location.replace("profile.html");
        }).catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // ...
            $("#errorMessage").html(errorMessage);
        });

        return false;
        
    });

    $("#logoutButton").on("click", function () {
        firebase.auth().signOut();
        window.location.replace("index.html");
    });

    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // User is signed in. Show appropriate divs
            $(".loggedOutNav").css("display", "none");
            $("#loggedOutIndex").css("display", "none");
            $("#loggedInIndex").css("display", "block");
            $(".loggedInNav").css("display", "block");
            redirectLogin();
        } else {
            // No user is signed in. Hide appropriate divs
            $(".loggedOutNav").css("display", "block");
            $("#loggedOutIndex").css("display", "block");
            $("#loggedInIndex").css("display", "none");
            $(".loggedInNav").css("display", "none");
        }
    });

});