//  STARTING THE GAME LOGIC
//  GOT THE SELECTION() WORKING



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
    
    
    // firebase.database.enableLogging(true, true);
    
    
    var player1Name;
    var player2Name;
    var player1Active = false;
    var player2Active = false;
    var player1Select = false;
    var player2Select = false;
    var player1Turn = false;
    var player2Turn = false;
    
   
    

    database.ref().on("value", function(snapshot) {
  
        if ((snapshot.child("player1").exists()) && (snapshot.child("player2").exists())) {
            // console.log("both players exist");
            $(".name").text("Name: " + snapshot.val()["player1"].name);
            $(".choice").text("Selected: " + snapshot.val()["player1"].choice)
            $(".wins").text("Wins: " + snapshot.val()["player1"].wins);
            $(".losses").text("Losses: " + snapshot.val()["player1"].losses);
            $(".ties").text("Ties: " + snapshot.val()["player1"].ties);
            player1Active = snapshot.val()["player1"].logged_on;
            player1Select = snapshot.val()["player1"].choice;
            player1Turn = snapshot.val()["player1"].turn;
        
            $(".name2").text("Name: " + snapshot.val()["player2"].name);
            $(".choice2").text("Selected: " + snapshot.val()["player2"].choice)
            $(".wins2").text("Wins: " + snapshot.val()["player2"].wins);
            $(".losses2").text("Losses: " + snapshot.val()["player2"].losses);
            $(".ties2").text("Ties: " + snapshot.val()["player2"].ties);
            player2Active = snapshot.val()["player2"].logged_on;
            player2Select = snapshot.val()["player2"].choice;
            player2Turn = snapshot.val()["player2"].turn;

            if ((snapshot.val()["player1"].readyToCheck)  && (snapshot.val()["player2"].readyToCheck)) { // if both players have made a seleciton
              console.log((snapshot.val()["player1"].readyToCheck) + " and " +   (snapshot.val()["player2"].readyToCheck) );
               setTimeout(compareAnswers, 1000);
                // compareAnswers();

            } else if (snapshot.val()["player1"].turn) { // if true, let player1 select rps
                setTimeout(player1SelectRPS, 1000);
                // player1SelectRPS();
            } else if (snapshot.val()["player2"].turn) {
                setTimeout(player2SelectRPS, 1000);
                // player2SelectRPS();
            };

            //-------------------------------------
            // console.log("this is player1 turn: " + player1Turn);
            // if ()




        } else if ((snapshot.child("player1").exists()) && (!snapshot.child("player2").exists())) {   // should = true
            // console.log("player1 exists only");
            $(".name").text("Name: " + snapshot.val()["player1"].name);
            $(".choice").text("Selected: " + snapshot.val()["player1"].choice)
            $(".wins").text("Wins: " + snapshot.val()["player1"].wins);
            $(".losses").text("Losses: " + snapshot.val()["player1"].losses);
            $(".ties").text("Ties: " + snapshot.val()["player1"].ties);
            player1Active = snapshot.val()["player1"].logged_on;
            player1Select = snapshot.val()["player1"].choice;
           addUser2();
           

        } else if ((!snapshot.child("player1").exists()) && (!snapshot.child("player2").exists())) {
            console.log("no player exists");
            addUser1();


        };

    }, function(errorObject) {
        console.log("Errors handled: " + errorObject.code);
    });

//=========================================================================================

     //---------------- functions -----------------

         
 

        function addUser1() {
            // console.log("adding user1")
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
                    "choice": "",
                    "turn" : true,
                    "readyToCheck": false,
                }); // end of push to database

         
            //  console.log("player1 is ready");
            
            });
        };
    
    
        function addUser2() {
            // console.log("waiting for user2");
            $("#submit-name2").on("click", function (event) {
                event.preventDefault();
    
                player2Name = capitalizeFirstLetter($("#user-name2").val().trim());
                function capitalizeFirstLetter(string) {
                    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
                };
    
                database.ref("player2").update({
                    "name": player2Name,
                    "wins": 0,
                    "losses": 0,
                    "ties": 0,
                    "logged_on": true,
                    "choice": "",
                    "turn" : false,
                    "readyToCheck": false,
                }); // end of push to database
                // console.log("player2 is ready");
                //  gameReady();
            });
        };
    
    
        function player1SelectRPS() {
                console.log("player1's turn to select");
                $(document.body).on("click", ".select", function () {
                    var playerChoice = $(this).attr("value");

                    database.ref("player1").update({
                        "choice": playerChoice,
                        "turn": false,
                        "readyToCheck": true,
                    });

                    database.ref("player2").update({
                        "turn": true,
                    });
                });
        };


        function player2SelectRPS() {
                  console.log("player2's turn to select");
                $(document.body).on("click", ".select2", function () {
                    var playerChoice = $(this).attr("value");
                    database.ref("player2").update({
                        "choice": playerChoice,
                        "turn": false,
                        "readyToCheck": true,
                    });
                    console.log("===========================")
                });
        };
    
    
        function compareAnswers() {
            console.log("inside compareAnsw: ")
            var answer1;
            var answer2;
            var wins1;
            var losses1;
            var ties1;
            var wins2;
            var losses2;
            var ties2;

            database.ref().once("value", function(snapshot) {
                answer1 = snapshot.val()["player1"].choice;
                answer2 = snapshot.val()["player2"].choice;

                wins1 = snapshot.val()["player1"].wins;
                losses1 = snapshot.val()["player1"].losses;
                ties1 = snapshot.val()["player1"].ties;
                wins2 = snapshot.val()["player2"].wins;
                losses2 = snapshot.val()["player2"].losses;
                ties2 = snapshot.val()["player2"].ties;
            });

            console.log("this is the score")
            console.log("player1:w " +wins1+" l: " + losses1 + " t: " + ties1)
            console.log("player2:w " +wins2+" l: " + losses2 + " t: " + ties2)
            
            
           
            if (answer1 === "r" && answer2 === "s") {
              
                wins1++;
                losses2++;
                console.log("is this getting hit");
                database.ref("player2").update({
                   
                    "losses": losses2,
                    "turn": false,
                    "choice": "",
                    "readyToCheck": false,

                }); // end of push to database

                database.ref("player1").update({
                    "wins": wins1,
                    "turn": true,
                    "choice": "",
                    "readyToCheck": false,

                }); // end of push to database
                
    
            } else if (answer1 === "r" && answer2 === "p") {
                losses1++;
                wins2++;

                database.ref("player1").update({
                    "losses": losses1,
                    "turn": true,
                    "choice": "",
                    "readyToCheck": false,
                }); // end of push to database
          
                database.ref("player2").update({
                    "wins": wins2,
                    "turn": false,
                    "choice": "",
                    "readyToCheck": false,
                }); // end of push to database
    
            } else if (answer1 === "s" && answer2 === "p") {
                wins1++;
                losses2++;

                database.ref("player1").update({
                    "wins": wins1,
                    "turn": true,
                    "choice": "",
                    "readyToCheck": false,
                }); // end of push to database
                
                database.ref("player2").update({
                    "losses": losses2,
                    "turn": false,
                    "choice": "",
                    "readyToCheck": false,
                }); // end of push to database
    
            } else if (answer1 === "s" && answer2 === "r") {
                losses1++;
                wins2++;

                database.ref("player1").update({
                    "losses": losses1,
                    "turn": true,
                    "choice": "",
                    "readyToCheck": false,
                }); // end of push to database
              
                database.ref("player2").update({
                    "wins": wins2,
                    "turn": false,
                    "choice": "",
                    "readyToCheck": false,
                }); // end of push to database
    
            } else if (answer1 === "p" && answer2 === "r") {
                wins1++;
                losses2++;

                database.ref("player1").update({
                    "wins": wins1,
                    "turn": true,
                    "choice": "",
                    "readyToCheck": false,
                }); // end of push to database
         
                database.ref("player2").update({
                    "losses": losses2,
                    "turn": false,
                    "choice": "",
                    "readyToCheck": false,
                }); // end of push to database
    
            } else if (answer1 === "p" && answer2 === "r") {
                losses1++;
                wins2++;

                database.ref("player1").update({
                    "losses": losses1,
                    "turn": true,
                    "choice": "",
                    "readyToCheck": false,
                }); // end of push to database
              
                database.ref("player2").update({
                    "wins": wins2,
                    "turn": false,
                    "choice": "",
                    "readyToCheck": false,
                }); // end of push to database
    
    
            } else if (answer1 === answer2) {
                ties1++;
                ties2++;

                database.ref("player1").update({
                    "ties": ties1,
                    "turn": false,
                    "choice": "",
                    "readyToCheck": false,
                }); // end of push to database
              
                database.ref("player2").update({
                    "ties": ties2,
                    "turn": false,
                    "choice": "",
                    "readyToCheck": false,
                }); // end of push to database
            };

 
    //============================================================
            // update the player turn status
            // console.log("reseting user turn status")
            // database.ref("player1").update({
            //     "turn": true,
            //     "choice": "",
            // }); // end of push to database
            
            // database.ref("player2").update({
            //     "turn": false,
            //     "choice": "",
            // }); // end of push to database
            // // nextRound();
        };
    
    
    
    
        // function nextRound() {
        //     gameReady();
        // };
    
    
    });  // end of document ready
    
    
    
    
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
    
    
    
    