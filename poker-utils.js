"use strict";

var poker = require('./poker');
var shuffle = require('./shuffle');
var cards = [
    'As', '2s', '3s', '4s', '5s', '6s', '7s', '8s', '9s', 'Ts', 'Js', 'Qs', 'Ks',
    'Ad', '2d', '3d', '4d', '5d', '6d', '7d', '8d', '9d', 'Td', 'Jd', 'Qd', 'Kd',
    'Ac', '2c', '3c', '4c', '5c', '6c', '7c', '8c', '9c', 'Tc', 'Jc', 'Qc', 'Kc',
    'Ah', '2h', '3h', '4h', '5h', '6h', '7h', '8h', '9h', 'Th', 'Jh', 'Qh', 'Kh',
];

var STRAIGHTFLUSH = 8;
var QUADS = 7;
var FULLHOUSE = 6;
var FLUSH = 5;
var STRAIGHT = 4;
var SET = 3;
var TWOPAIR = 2;
var PAIR = 1;
var HIGHCARD = 0;

function newDeck() {
    return shuffle(cards);
}

function drawCards(numCards, deck) {
    var draw = [];
    for (var i = 0; i < numCards; i++) {
        draw.push(deck.shift());
    }

    return {
        deck: deck,
        draw: draw,
    }
}

function existInHand(card, hand) {
    if (hand.indexOf(card) > -1) {
        return true;
    }

    return false;
}

function convertCardToEmoji(card) {
    var rank = card.slice(0, 1);
    var suit = card.slice(1, 2);

    if (rank === 'T') {
        rank = '10';
    }

    if (suit === 's') {
        suit = '♠️'
    } else if (suit === 'd') {
        suit = '♦️'
    } else if (suit === 'c') {
        suit = '♣️'
    } else if (suit === 'h') {
        suit = '♥️'
    }

    return rank + suit;
}

function convertHandToEmoji(cards) {
    var hand = '';

    for (var card in cards) {
        hand += convertCardToEmoji(cards[card]);
    }

    return hand;
}

function convertCardToSpeech(card) {
    var rank = card.slice(0, 1);
    var suit = card.slice(1, 2);

    if (rank === 'A') {
        rank = 'Ace';
    }
    if (rank === 'K') {
        rank = 'King';
    }
    if (rank === 'Q') {
        rank = 'Queen';
    }
    if (rank === 'J') {
        rank = 'Jack';
    }
    if (rank === 'T') {
        rank = '10';
    }

    if (suit === 's') {
        suit = 'spades'
    } else if (suit === 'd') {
        suit = 'diamonds'
    } else if (suit === 'c') {
        suit = 'clubs'
    } else if (suit === 'h') {
        suit = 'hearts'
    }

    return rank + ' of ' + suit;
}

function convertHandToSpeech(cards) {
    var hand = '';

    for (var card in cards) {
        hand += convertCardToSpeech(cards[card]) + ' ';
    }

    return hand.trim();
}

function evaluateHandToSpeech(hand) {
    console.log('\n!!!!!!!!evaluateHandToSpeech hand', hand);
    var convertedHand = poker.convertCards(sortHand(hand).join(''));
    console.log('\n!!!!!!!!evaluateHandToSpeech convertedHand', convertedHand);
    hand = sortHandDesc(hand);
    var handVal = poker.evalHand(convertedHand);
    switch (handVal) {
        case STRAIGHTFLUSH:
            if (hand[0].slice(0,1) === 'A') {
                return "a Royal Flush";
            }
            return "a Straight Flush, " + cardToRank(hand[0]) + " high";
        case QUADS:
            return "Four of a kind, " + cardToRankPlural(hand[1]);
        case FULLHOUSE:
            var high = cardToRankPlural(hand[2])
            var low = hand[2].slice(0,1) === hand[1].slice(0,1)?cardToRankPlural(hand[3]):cardToRankPlural(hand[1]);
            return "a Full House, " + high + ' over ' + low;
        case FLUSH:
            return "a Flush, " + cardToRank(hand[0]) + " high";
        case STRAIGHT:
            return "a Straight, " + cardToRank(hand[0]) + " high";
        case SET:
            return "a Set of " + cardToRankPlural(hand[2]);
        case TWOPAIR:
            var high = cardToRankPlural(hand[1]);
            var low = cardToRankPlural(hand[3]);
            return "Two pair, " + high + " and " + low;
        case PAIR:
            var pair;
            if (hand[0].slice(0,1) === hand[1].slice(0,1) ||
                hand[1].slice(0,1) === hand[2].slice(0,1)) {
                pair = cardToRankPlural(hand[1]);
            } else if (hand[2].slice(0,1) === hand[3].slice(0,1) ||
                       hand[3].slice(0,1) === hand[4].slice(0,1)) {
                pair = cardToRankPlural(hand[3]);
            }
            return "a pair, " + pair;
        case HIGHCARD:
            return "High card, " + cardToRank(hand[0]);
    }
}

function cardToRankPlural(card) {
    switch (card.slice(0,1)) {
        case 'A':
            return 'Aces';
        case 'K':
            return 'Kings';
        case 'Q':
            return 'Queens';
        case 'J':
            return 'Jacks';
        case 'T':
            return 'Tens';
        case '9':
            return 'Nines';
        case '8':
            return 'Eights';
        case '7':
            return 'Sevens';
        case '6':
            return 'Sixes';
        case '5':
            return 'Fives';
        case '4':
            return 'Fours';
        case '3':
            return 'Threes';
        case '2':
            return 'Twos';
    }
}

function cardToRank(card) {
    switch (card.slice(0,1)) {
        case 'A':
            return 'Ace';
        case 'K':
            return 'King';
        case 'Q':
            return 'Queen';
        case 'J':
            return 'Jack';
        case 'T':
            return 'Ten';
        case '9':
            return 'Nine';
        case '8':
            return 'Eight';
        case '7':
            return 'Seven';
        case '6':
            return 'Six';
        case '5':
            return 'Five';
        case '4':
            return 'Four';
        case '3':
            return 'Three';
        case '2':
            return 'Two';
    }
}

function cardToSuit(card) {
    switch (card.slice(1,1)) {
        case 's':
            return 'Spades';
        case 'd':
            return 'Diamonds';
        case 'c':
            return 'Clubs';
        case 'h':
            return 'Hearts';
    }
}

function sortHand(hand) {
    return hand.sort(function(a, b) {
        return poker.convertCard(a).high - poker.convertCard(b).high;
    });
}

function sortHandDesc(hand) {
    return hand.sort(function(a, b) {
        return poker.convertCard(b).high - poker.convertCard(a).high;
    });
}

module.exports = {
    newDeck: newDeck,
    drawCards: drawCards,
    existInHand: existInHand,
    convertCardToEmoji: convertCardToEmoji,
    convertHandToEmoji: convertHandToEmoji,
    convertCardToSpeech: convertCardToSpeech,
    convertHandToSpeech: convertHandToSpeech,
    evaluateHandToSpeech: evaluateHandToSpeech,
    sortHand: sortHand,
    sortHandDesc: sortHandDesc,
}