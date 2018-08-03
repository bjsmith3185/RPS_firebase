
$(document).ready(function () {

var config = {
    apiKey: "AIzaSyCMq10KVdAHPKNC4jpdOMcmfPcRXbpoZMs",
    authDomain: "rps-firebase-40930.firebaseapp.com",
    databaseURL: "https://rps-firebase-40930.firebaseio.com",
    projectId: "rps-firebase-40930",
    storageBucket: "rps-firebase-40930.appspot.com",
    messagingSenderId: "445863158721"
};

firebase.initializeApp(config);
var database = firebase.database();

var player1Name;
var playerName2;
var player1Active = false;
var player2Active = false;
var player1Select = false;
var player2Select = false;


//----------creates two player folders on load ----
database.ref("player1").update({
    "name": "Sign-in",
    "wins": 0,
    "losses": 0,
    "ties": 0,
    "logged_on": false,
    "choice": "-",
}); // end of push to database

database.ref("player2").update({
    "name": "Sign-in",
    "wins": 0,
    "losses": 0,
    "ties": 0,
    "logged_on": false,
    "choice": "-",
}); // end of push to database

//-----------listener to display info to dom --------

    database.ref().on("value", function(snapshot) {

    player1Active = snapshot.val()["player1"].logged_on;
    player2Active = snapshot.val()["player2"].logged_on;

    // Log everything that's coming out of snapshot
    console.log("this is the listener");
    console.log(snapshot.val());
    $(".name").text("Name: " + snapshot.val()["player1"].name);
    $(".choice").text(snapshot.val()["player1"].choice)
    $(".wins").text("Wins: " + snapshot.val()["player1"].wins);
    $(".losses").text("Losses: " + snapshot.val()["player1"].losses);
    $(".ties").text("Ties: " + snapshot.val()["player1"].ties);

    $(".name2").text("Name: " + snapshot.val()["player2"].name);
    $(".choice2").text(snapshot.val()["player2"].choice)
    $(".wins2").text("Wins: " + snapshot.val()["player2"].wins);
    $(".losses2").text("Losses: " + snapshot.val()["player2"].losses);
    $(".ties2").text("Ties: " + snapshot.val()["player2"].ties);

    }, function(errorObject) {
        console.log("Errors handled: " + errorObject.code);
        });

        // var ref = firebase.database().ref("player1");
    // ref.onDisconnect().set("I disconnected!");

    addUser1();


    //---------------- functions -----------------

    function addUser1() {
        $("#submit-name").on("click", function (event) {
            event.preventDefault();

            player1Name = capitalizeFirstLetter($("#user-name").val().trim());
            function capitalizeFirstLetter(string) {
                return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
            };

            database.ref("player1").update({
                "name": player1Name,
                "wins": 0,
                "losses": 0,
                "ties": 0,
                "logged_on": true,
                "choice": "-",
            }); // end of push to database
         
            addUser2();
        });
    };


    function addUser2() {
        $("#submit-name2").on("click", function (event) {
            event.preventDefault();

            playerName2 = capitalizeFirstLetter($("#user-name2").val().trim());
            function capitalizeFirstLetter(string) {
                return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
            };

            database.ref("player2").update({
                "name": playerName2,
                "wins": 0,
                "losses": 0,
                "ties": 0,
                "logged_on": true,
                "choice": "-",
            }); // end of push to database
             gameReady();
        });
    };




    function gameReady() {
        console.log("this is the active state: " + player1Active + "  " + player2Active)
        if (player1Active && player2Active) {
            player1Select = true;
            player2Select = false;

            player1SelectRPS();
        } else {
            console.log("need 2 players");
        };
    };



    function player1SelectRPS() {

        if (player1Select) {
            player1select = false;
            $(document.body).on("click", ".select", function () {
                player2Select = true;
                var playerChoice = $(this).attr("value");
                // console.log(playerChoice);
                database.ref("player1").update({
                    "choice": playerChoice,
                });
              
                player2SelectRPS();
            });

        } else {
            console.log("not ready for player1 to select");
        };
    };




    function player2SelectRPS() {
        console.log("player2: " + player2Select);

        if (player2Select) {
            player2select = false;
            $(document.body).on("click", ".select2", function () {
                var playerChoice = $(this).attr("value");
                database.ref("player2").update({
                    "choice": playerChoice,
                });

                compareAnswers();
            });

        } else {
            console.log("not ready for player2 to select");
        };
    };


    function compareAnswers() {
        var answer1 = $(".choice").text();
        var answer2 = $(".choice2").text();
        console.log(answer1 + "  " + answer2);
        var wins1 = 0;
        var losses1 = 0;
        var ties1 = 0;
        var wins2 = 0;
        var losses2 = 0;
        var ties2 = 0;
       
        if (answer1 === "r" && answer2 === "s") {
            console.log("r and s");
            wins1++;
            database.ref("player1").update({
                "wins": wins1,
            }); // end of push to database
            losses2++;
            database.ref("player2").update({
                "losses": losses2,
            }); // end of push to database

        } else if (answer1 === "r" && answer2 === "p") {
            losses1++;
            database.ref("player1").update({
                "losses": losses1,
            }); // end of push to database
            wins2++;
            database.ref("player2").update({
                "wins": wins2,
            }); // end of push to database

        } else if (answer1 === "s" && answer2 === "p") {
            wins1++;
            database.ref("player1").update({
                "wins": wins1,
            }); // end of push to database
            losses2++;
            database.ref("player2").update({
                "losses": losses2,
            }); // end of push to database

        } else if (answer1 === "s" && answer2 === "r") {
            losses1++;
            database.ref("player1").update({
                "losses": losses1,
            }); // end of push to database
            wins2++;
            database.ref("player2").update({
                "wins": wins2,
            }); // end of push to database

        } else if (answer1 === "p" && answer2 === "r") {
            wins1++;
            database.ref("player1").update({
                "wins": wins1,
            }); // end of push to database
            losses2++;
            database.ref("player2").update({
                "losses": losses2,
            }); // end of push to database

        } else if (answer1 === "p" && answer2 === "r") {
            losses1++;
            database.ref("player1").update({
                "losses": losses1,
            }); // end of push to database
            wins2++;
            database.ref("player2").update({
                "wins": wins2,
            }); // end of push to database


        } else if (answer1 === answer2) {
            ties1++;
            ties2++;
            database.ref("player1").update({
                "ties": ties1,
            }); // end of push to database
            ties2++;
            database.ref("player2").update({
                "ties": ties2,
            }); // end of push to database
        };

        nextRound();
    };




    function nextRound() {
        gameReady();
    };


});




// var ref = firebase.database().ref("users/ada");
// ref.update({
//    onlineState: true,
//    status: "I'm online."
// });
// ref.onDisconnect().update({
//   onlineState: false,
//   status: "I'm offline."
// });


// var ref = firebase.database().ref("player1");
//     ref.onDisconnect().set("I disconnected!");



