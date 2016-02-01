var _ = require('lodash-node');
var fivecard = require('./fivecard');
var utils = require('./poker-utils');

module.exports.states = {
    NEW_GAME: 'newGame',
    DISCARDING: 'discarding',
};

module.exports.getWinnerTexts = function (playerHand, dealerHand) {
    var text = "";
    var cardText = "";
    var heading = "";

    playerHandSpeech = utils.convertHandToSpeech(playerHand);
    playerEvalSpeech = utils.evaluateHandToSpeech(playerHand);
    dealerHandSpeech = utils.convertHandToSpeech(dealerHand)
    dealerEvalSpeech = utils.evaluateHandToSpeech(dealerHand)

    text += "You have " + playerEvalSpeech + ". ";
    
    text += "I draw ";
    var draws;
    if (dealerHand[0].slice(0,1) === "A") {
        draws = Math.floor(Math.random() * 3) + 1;
    } else {
        draws = Math.floor(Math.random() * 2) + 1;
    }
    if (draws === 1) {
        text += "1 card. ";
    } else {
        text += draws + " cards. ";
    }
    text += "My hand is " + dealerHandSpeech + ". ";
    text += "I have " + dealerEvalSpeech + ". ";

    var winner = fivecard.determineWinner(playerHand, dealerHand).winner;

    if (winner === 1) {
        text += "You win! ";
    } else if (winner === 2) {
        text += "I win! ";
    } else {
        text += "It's a tie! ";
    }

    text += "Do you want to play again?";

    cardText += "Your hand is " + utils.convertHandToEmoji(playerHand) + "\n";
    cardText += "You have " + playerEvalSpeech + "\n";
    cardText += "I draw ";
    if (draws === 1) {
        cardText += "1 card.\n";
    } else {
        cardText += draws + " cards.\n";
    }
    cardText += "My hand is " + utils.convertHandToEmoji(dealerHand) + "\n";
    cardText += "I have " + dealerEvalSpeech + ".\n";
    if (winner === 1) {
        cardText += "You win!\n";
    } else if (winner === 2) {
        cardText += "I win!\n";
    } else {
        cardText += "It's a tie!\n";
    }
    cardText += "Do you want to play again?";

    if (winner === 1) {
        heading = "You win! Good Hand!";
    } else if (winner === 2) {
        heading = "I win! Well played.";
    } else {
        heading = "It's a tie. Good game."
    }

    return {
        text: text,
        cardText: cardText,
        heading: heading,
    };
};

module.exports.translateCard = function (rank, suit) {
    switch(rank) {
        case 'Ace':
        case 'ace':
            rank = 'A';
            break;
        case 'Duece':
        case 'duece':
        case 'Two':
        case 'two':
        case '2':
        case 2:
            rank = '2';
            break;
        case 'Three':
        case 'three':
        case 'Trey':
        case 'trey':
        case '3':
        case 3:
            rank = '3';
            break;
        case 'Four':
        case 'four':
        case '4':
        case 4:
            rank = '4';
            break;
        case 'Five':
        case 'five':
        case '5':
        case 5:
            rank = '5';
            break;
        case 'Six':
        case 'six':
        case '6':
        case 6:
            rank = '6';
            break;
        case 'Seven':
        case 'seven':
        case '7':
        case 7:
            rank = '7';
            break;
        case 'Eight':
        case 'eight':
        case '8':
        case 8:
            rank = '8';
            break;
        case 'Nine':
        case 'nine':
        case '9':
        case 9:
            rank = '9';
            break;
        case 'Ten':
        case 'ten':
        case '10':
        case 10:
            rank = 'T';
            break;
        case 'Jack':
        case 'jack':
            rank = 'J';
            break;
        case 'Queen':
        case 'queen':
        case 'Bitch':
        case 'bitch':
            rank = 'Q';
            break;
        case 'King':
        case 'king':
            rank = 'K';
            break;
    }
    switch (suit) {
        case 'Spades':
        case 'spades':
            suit = 's';
            break;
        case 'Diamonds':
        case 'diamonds':
            suit = 'd';
            break;
        case 'Clubs':
        case 'clubs':
            suit = 'c';
            break;
        case 'Hearts':
        case 'hearts':
            suit = 'h';
            break;
    }

    return rank + suit;
};