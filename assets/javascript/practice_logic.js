
var config = {
    apiKey: "AIzaSyCMq10KVdAHPKNC4jpdOMcmfPcRXbpoZMs",
    authDomain: "rps-firebase-40930.firebaseapp.com",
    databaseURL: "https://rps-firebase-40930.firebaseio.com",
    projectId: "rps-firebase-40930",
    storageBucket: "rps-firebase-40930.appspot.com",
    messagingSenderId: "445863158721"
};

firebase.initializeApp(config);



$(document).ready(function () {

    var database = firebase.database();

    var userName;
    var userName2;
    var user1Active = false;
    var user2Active = false;
    var user1Select = false;
    var user2Select = false;


    var ref = firebase.database().ref(userName);
    ref.onDisconnect().set("I disconnected!");

    addUser1();







//---------------- functions -----------------

function addUser1() {
    $("#submit-name").on("click", function (event) {
        event.preventDefault();

        userName = capitalizeFirstLetter($("#user-name").val().trim());
        function capitalizeFirstLetter(string) {
            return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
        };

        database.ref(userName).update({
            "name": userName,
            "wins": 1,
            "losses": 2,
            "ties": 3,
            "logged_on": true,
        }); // end of push to database

        database.ref().once("value", function (snapshot) {
            // console.log(snapshot.val()[userName]);
            // console.log(snapshot.val()[userName].name);
            // console.log(snapshot.val()[userName].wins);
            // console.log(snapshot.val()[userName].losses);
            // console.log(snapshot.val()[userName].ties);

            $(".name").text(snapshot.val()[userName].name);
            $(".wins").text(snapshot.val()[userName].wins);
            $(".losses").text(snapshot.val()[userName].losses);
            $(".ties").text(snapshot.val()[userName].ties);

            user1Active = snapshot.val()[userName].logged_on;
            console.log("status of user1: " + user1Active);
           

        });
        addUser2();
    });

};


function addUser2() {
    $("#submit-name2").on("click", function (event) {
        event.preventDefault();

        userName2 = capitalizeFirstLetter($("#user-name2").val().trim());
        console.log(userName2)
        function capitalizeFirstLetter(string) {
            return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
        };

        database.ref(userName2).update({
            "name": userName2,
            "wins": 1,
            "losses": 2,
            "ties": 3,
            "logged_on": true,
        }); // end of push to database

        database.ref().once("value", function (snapshot) {
            // console.log(snapshot.val()[userName]);
            // console.log(snapshot.val()[userName].name);
            // console.log(snapshot.val()[userName].wins);
            // console.log(snapshot.val()[userName].losses);
            // console.log(snapshot.val()[userName].ties);

            $(".name2").text(snapshot.val()[userName2].name);
            $(".wins2").text(snapshot.val()[userName2].wins);
            $(".losses2").text(snapshot.val()[userName2].losses);
            $(".ties2").text(snapshot.val()[userName2].ties);

            user2Active = snapshot.val()[userName].logged_on;
            console.log("status of user2: " + user2Active);
             gameReady();
        });
        // setTimeout(gameReady, 4000);
     
    });
};





    function gameReady() {
        if (user1Active && user2Active) {
            user1Select = true;
            user2Select = false;

            user1SelectRPS();
        } else {
           console.log("need 2 players");
        }

    };

    function user1SelectRPS() {

        if (user1Select) {
            user1select = false;
            $(document.body).on("click", ".select", function () {
                user2Select = true;
                var userChoice = $(this).attr("value");
                // console.log(userChoice);
                database.ref(userName).update({
                    "choice": userChoice,
                });

                database.ref().on("value", function (snapshot) {
                    // console.log(userName)
                    // console.log(snapshot.val()[userName]);
                    $(".name").text(snapshot.val()[userName].name);
                    $(".choice").text(snapshot.val()[userName].choice)
                    $(".wins").text(snapshot.val()[userName].wins);
                    $(".losses").text(snapshot.val()[userName].losses);
                    $(".ties").text(snapshot.val()[userName].ties);

                });
                    user2SelectRPS();
            });

        } else {
            console.log("not ready for user1 to select");
        }
       
    };

    function user2SelectRPS() {
        console.log("user2: " + user2Select);

        if (user2Select) {
            user2select = false;
            $(document.body).on("click", ".select2", function () {
                var userChoice = $(this).attr("value");
                // console.log(userChoice);
                database.ref(userName2).update({
                    "choice": userChoice,
                });

                database.ref().on("value", function (snapshot) {
                    // console.log(userName)
                    // console.log(snapshot.val()[userName]);
                    $(".name2").text(snapshot.val()[userName2].name);
                    $(".choice2").text(snapshot.val()[userName2].choice)
                    $(".wins2").text(snapshot.val()[userName2].wins);
                    $(".losses2").text(snapshot.val()[userName2].losses);
                    $(".ties2").text(snapshot.val()[userName2].ties);

                });

            });

        } else {
            console.log("not ready for user2 to select");
        }

    };


   


  


}); // end of document ready 