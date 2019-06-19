// Code we copied and pasted from our app page
console.log(moment())

var firebaseConfig = {
    apiKey: "AIzaSyDnx-cRErJpHJC78_QbSBaOrkQg04J-4wI",
    authDomain: "traintimes-cdc4d.firebaseapp.com",
    databaseURL: "https://traintimes-cdc4d.firebaseio.com",
    projectId: "traintimes-cdc4d",
    storageBucket: "",
    messagingSenderId: "690617641989",
    appId: "1:690617641989:web:4c0b53cdb5ec926c"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var database = firebase.database();

// Button for adding Trains
$("#add-train-btn").on("click", function (event) {
    event.preventDefault();

    // Grabs user input
    var trnName = $("#name-input").val().trim();
    var trnDestination = $("#destination-input").val().trim();
    var trnFirst = $("#time-input").val().trim();
    var trnFrequency = $("#frequency-input").val().trim();


    // Creates local "temporary" object for holding train data
    var newTrain = {
        name: trnName,
        destination: trnDestination,
        time: trnFirst,
        frequency: trnFrequency
    };

    // Uploads train data to the database
    database.ref().push(newTrain);

    // Logs everything to console
    console.log(newTrain.name);
    console.log(newTrain.destination);
    console.log(newTrain.time);
    console.log(newTrain.frequency);

    alert("Train successfully added");

    // Clears all of the text-boxes
    $("#name-input").val("");
    $("#destination-input").val("");
    $("#time-input").val("");
    $("#frequency-input").val("");

});

// Create Firebase event for adding train to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function (childSnapshot) {
    // console.log(childSnapshot.val());

    // Store everything into a variable
    var trnName = childSnapshot.val().name;
    var trnDestination = childSnapshot.val().destination;
    var trnFirst = childSnapshot.val().time;
    var trnFrequency = childSnapshot.val().frequency;

    var firstTrainTimeArray = trnFirst.split(':');
    trnFirst = moment().hours(firstTrainTimeArray[0]).minutes(firstTrainTimeArray[1]).seconds('0');
    var maxMoment = moment().max(moment(), trnFirst)
    console.log(maxMoment)
    console.log(trnFirst)
    if (maxMoment === trnFirst) {
        console.log("train has arrived at least one time on this day")

    } else {
        console.log("!train has not come for the day")
        //Train Info

        // console.log(trnName);
        // console.log(trnDestination);
        // console.log(trnFirst);
        // console.log(trnFrequency);

        // First Time (pushed back 1 year to make sure it comes before current time)
        var trnFirstConverted = moment(trnFirst, "HH:mm A").subtract(1, "years");
        // console.log(trnFirstConverted);

        // Current Time
        var currentTime = moment();
        console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

        // Difference between the times
        var diffTime = moment().diff(moment(trnFirstConverted), "minutes");
        // console.log("DIFFERENCE IN TIME: " + diffTime);

        // Time apart (remainder)
        var tRemainder = diffTime % trnFrequency;
        // console.log(tRemainder);

        // Minute Until Train
        var tMinutesTillTrain = trnFrequency - tRemainder;
        // console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

        // Next Train
        var nextTrain = moment().add(tMinutesTillTrain, "minutes");
        // console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));

    }

    // Create the new row
    var newRow = $("<tr>").append(
        $("<td>").text(trnName),
        $("<td>").text(trnDestination),
        $("<td>").text(trnFirst.format("hh:mm A")),
        $("<td>").text(trnFrequency),
        $("<td>").text(nextTrain.format("hh:mm A")),
        $("<td>").text(tMinutesTillTrain),
    );

    // Append the new row to the table
    $("#train-table > tbody").append(newRow);
});