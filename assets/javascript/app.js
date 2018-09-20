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
        $(".recipe-results").html("");
        $("#errorIngredients").html("");
        var ingredientList = $("#ingredients").val();
        var replacedList = ingredientList.replace(/,/g, '%20');

        if (ingredientList == "") {
            $("#errorIngredients").html("You must enter at least 1 ingredient.")
        } else {

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

                var recipeCount = response.count;

                if(recipeCount === 0){
                $("#errorIngredients").html("There are no recipes available with these ingredients. Please modify your ingredients and try again.");
                } else if (recipeCount === 1){
                    $("#errorIngredients").html("There is 1 recipe available with this ingredient.");
                } else {
                    $("#errorIngredients").html("There are " + recipeCount + " recipes available with these ingredients.");
                }

                var table = $("<table>");

                for (var i = 0; i < response.hits.length; i++) {
                    // Retrieving the URL for the image
                    var imgURL = response.hits[i].recipe.image;

                    // Creating an element to hold the image
                    var image = $("<img>").attr("src", imgURL).css("width", "20%");

                    var recipeLabel = response.hits[i].recipe.label;
                    var recipeSource = response.hits[i].recipe.source;
                    var recipeUrl = response.hits[i].recipe.url;

                    var table = $("<table>");
                    var row = $("<tr><td><img src='" + response.hits[i].recipe.image + "' /></td><td style='padding-left:15px;'><h3>" + recipeLabel + "</h3><br /><strong>Recipe Source Website:</strong> " + recipeSource + "<br /><strong>Recipe URL:</strong> <a href='" + recipeUrl + "' target='_blank'>Go to website</a><br /></td></tr>")

                    table.append(row);
                    $(".recipe-results").append(table);
                }

            }).catch(function (error) {
                console.log(error);
            });

        }



    });

    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            $("#userProfileEmail").html("<strong>User Email:</strong> " + user.email);
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
            redirectProfile();
        }
    });

});