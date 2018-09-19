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

        firebase.auth().createUserWithEmailAndPassword(userEmail, userPass).then(function (user) {
            var userInfo = firebase.auth().currentUser;
            database.ref("users").child(userInfo.uid).set({
                email: userEmail,
                password: userPass,
                favouriteRecipeId: 'none'
            }).catch(function (error) {
                console.error(error);
            });
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

        firebase.auth().signInWithEmailAndPassword(userEmail, userPass).then(function (user) {
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

    $("#submitIngredients").on("click", function () {
        $(".recipe-image").html(" ");
            var ingredientList = $("#ingredients").val();
            var replacedList = ingredientList.replace(/,/g, '%20');

            var queryURL = "https://api.edamam.com/search?q=" + replacedList + "&app_id=c7fb9130&app_key=77f5b40a85cd387b14fd6066951c8009";


            // Creating an AJAX call for the specific movie button being clicked
            $.ajax({
                url: queryURL,
                method: "GET"
            }).then(function (response) {
                    console.log(response);
                    if (response.Error) {
                        console.log("Error: " + response.Error);
                        return
                    }

                  var resultCount = response.count;

                  $(".recipe-count").html(resultCount);

                    for (var i = 0; i < response.hits.length; i++) {
                    // Retrieving the URL for the image
                    var imgURL = response.hits[i].recipe.image;
                    console.log(imgURL);
                    // Creating an element to hold the image
                    var image = $("<img>").attr("src", imgURL).css("width", "20%");

                    // Displaying the image
                    $(".recipe-image").append(image);
                }

            }).catch(function (error) {
            console.log(error);
        });

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