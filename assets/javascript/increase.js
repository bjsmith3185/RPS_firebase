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
    

    database.ref("player1").update({
       
        "wins": 0,
       
        
    }); // end of push to database


    $("#submit-name").on("click", function (event) {
        event.preventDefault();
        database.ref().on("value", function(snapshot) {
            console.log(snapshot.val()["player1"].wins)
        });
       
        var newNumber = 0;
        console.log("number before increase: " + newNumber);
        newNumber++;
        console.log("number after increase: " + newNumber);
        database.ref("player1").update({
          

            "wins": newNumber,
          
            
        }); // end of push to database

        // database.ref().on("value", function(snapshot) {
        //     console.log("new number: " +snapshot.val()["player1"].wins)
        // });
    //  console.log("player1 is ready");
    
    });


});