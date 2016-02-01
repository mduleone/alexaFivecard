"use strict";

var poker = require('./poker');
var utils = require('./poker-utils');

function newGame() {
    var game = utils.drawCards(5, utils.newDeck());

    return {
        deck: game.deck,
        hand: game.draw,
    };
}

function discard(discard, hand, deck) {
    for (var card in discard) {
         if (!utils.existInHand(discard[card], hand)) {
            return {
                error: {
                    message: 'Card \'' + discard[card] + '\' is not in the hand.',
                    card: discard[card],
                },
                game: {
                    deck: deck,
                    hand: hand,
                    draw: [],
                },
            };
        }
    }

    for (var card in discard) {
         hand.splice(hand.indexOf(discard[card]), 1);
    }

    var newDraw = utils.drawCards(discard.length, deck);

    return {
        error: null,
        game: {
            deck: newDraw.deck,
            hand: utils.sortHand(hand.concat(newDraw.draw)),
            draw: utils.sortHand(newDraw.draw),
        },
    };
}

function determineWinner(hand1, hand2) {
    var hand1 = poker.convertCards(hand1.join(''));
    var hand2 = poker.convertCards(hand2.join(''));

    var hands = hand1.concat(hand2);

    // var ret = poker.compareHands(hand1, hand2);
    // callback(ret.err, ret.winner, ret.handVal, ret.hand);
    return poker.compareHands(hand1, hand2);
}

function test() {
    console.log('starting test');
    var game = newGame();

    console.log('Your hand is:', game.hand);
    // console.log('Discarding', game.hand.slice(0,2));
    // game = discard(game.hand.slice(0,2), game.hand, game.deck);
    console.log('Discarding', ['As']);
    game = discard(['As'], game.hand, game.deck);

    if (game.error) {
        return console.log(game.error.message);
    }

    console.log('Your hand is now:', game.game.hand);
}

module.exports = {
    newGame: newGame,
    discard: discard,
    test: test,
    determineWinner: determineWinner,
}
