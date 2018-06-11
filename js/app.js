const star1 = $("#star1");
const star2 = $("#star2");
const star3 = $("#star3");
const deck = $(".deck");
const time = document.getElementById("timer");
let t; //used in the timer to store the setInterval()
let rating = 3; //the stars rating value
let openedCards = []; // array that holds the 2 opened cards
let matchedCards = []; //array that holds he matched cards
let moveCounter = 0;
let secondTenth = 0; //milliseconds
let seconds = 0;
let minutes = 0;
let hours = 0;
let moves = $(".moves");
//---------------------------------------------

displayOnDeck(); //displays the cards on the page.

//-------set up the event listener for a card. If a card is clicked
$(".card").on('click', function() {
    $(this).addClass("show open flipInY");
    startMatcher(this);
});

//-------set up the event listener for the game repeat icon
$(".fa-repeat").on('click', function() {
    location.reload();
});

//------displayOnDeck -------------------
/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */
function displayOnDeck() { // it will put the cards in an array then suffle them and put the shuffled cards in the ul we already have.
    var cardsList = []; //array that holds the shuffled cards
    var cardsArray = document.getElementsByClassName('card'); //array that hold the cards before shuffling
    for (var i in cardsArray) { //this loop goes through all the objects in the cardsArray and extract the inner HTML of the objects and push them into cardsList array.
        if (cardsArray.hasOwnProperty(i)) {
            cardsList.push(cardsArray[i].innerHTML);
        }
    }
    var shuffledCardsList = shuffle(cardsList); // suffeling the cards
    deck.empty(); // empty the ul where the cards are displayed from its conents to make place for the new shuffled cards.
    for (var i = 0; i < shuffledCardsList.length; i++) { // a loop puts the shuffled cards in li inside the ul that we already have in the page
        deck.append("<li class = 'card' > " + shuffledCardsList[i] + "</li>");
    }
}

//----------The moves counter---------------
function countMoves() {
    moveCounter == moveCounter++;
    moves.text(moveCounter);
    if (moveCounter == 1) { // start the timer when the first move is done
        timer();
    }
    ratingStars(moveCounter); // change the stars rating depending on the moveCounter.
}

//---------Rating stars-----------------------------------------
function ratingStars(moveCounter) {
    if (moveCounter > 0 && moveCounter <= 20) {
        rating = 3;
    } else if (moveCounter > 20 && moveCounter <= 24) {
        rating = 2;
        star3.removeClass("fa-star");
        star3.addClass("fa-star-o");
    } else {
        rating = 1;
        star2.removeClass("fa-star");
        star2.addClass("fa-star-o");
    }
}

//-----This function calls the openCards function that compares the opened cards
// and the win function that checks if the game is ended and all cards are matched ---------------------
function startMatcher(card) {
    openCards(card);
    win();
}

//-----The no matching case sets the class "unmatch" to the opened cards then closes the cards ----------------------------
function noMatch(openedCards) {
    for (var i = 0; i < openedCards.length; i++) {
        openedCards[i].classList.add("unmatch", "shake");
    }
    setTimeout(function() {
        for (var i = 0; i < openedCards.length; i++) {
            openedCards[i].classList.remove("show", "open", "unmatch", "shake", "flipInY");// the class flipInY is already added when the card was opened
        }
    }, 1000);

}

//------apply the class match on the matched cards------------------------
function markAsMatched(openedCards) {
    for (var i = 0; i < openedCards.length; i++) {
        openedCards[i].classList.add("match", "bounceIn");
    }
}

//------check if the opened cards are matching and return true if they match--------------------------------------------------------------------
function checkMatch(openedCards) {
  let a = $(openedCards[0]).is($(openedCards[1])); // the case when the same card is clicked twice we dont want to consider it as a match
  let b = openedCards[0].children[0].className != openedCards[1].children[0].className;
    if (a || b) {
        return false;
    } else {
        return true    }
}

//-------This function puts the opened cards in an array, check the matching and processes the cards depending on the match or no match. at last it increases the move counter -----------------------
function openCards(card) { //put the opened cards in an array that has up to 2 cards only
    if (openedCards.length > 0) {
        openedCards.push(card);
        if (!checkMatch(openedCards)) {
            noMatch(openedCards);
            openedCards = [];
        } else {
            markAsMatched(openedCards);
            matchedCards = matchedCards.concat(openedCards); //we put the matched cards in the array matchedCards
            openedCards = [];
        }
    } else {
        openedCards.push(card);
        countMoves();


    }
}

//-----------timer function made with some help from w3schools.com website where I learned to use setInterval -------------
function timer() {
    t = setInterval(function() {
        secondTenth++;
        if (secondTenth == 10) { //tenth of seconds
            seconds++;
            secondTenth = 0;
        }
        if (seconds == 60) {
            minutes++;
            seconds = 0;
        }
        if (minutes == 60) {
            hours++;
            minutes = 0;
        }
        time.innerHTML = "Time: " + hours + " h " +
            minutes + " m " + seconds + " s " + secondTenth + " ms";
    }, 100);
}

//------the win function checks if the matchCards are 16 then the game is ended , so it stops the timer and an alert pops up -----------------
function win() {
    if (matchedCards.length === 16) {
        clearInterval(t);
        var gameTime = time.innerHTML; //gametime stores the time when the game ends.
        //theAlerFunction() it shows the winning message and checked whether we want to restart the game or not, so if we press ok then the gme will restart .
        setTimeout(function theAlertFunction() {
            var c = confirm("Congratulations! you won! \n Your total moves: " + moveCounter + "moves. " +
                gameTime  + "\n Your stars rating is " + rating  + " out of 3. \n Do you want to play again!");
            if (c == true) {
                location.reload();
            }
        }, 500);
    }
}
//------------- Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length,
        temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}
