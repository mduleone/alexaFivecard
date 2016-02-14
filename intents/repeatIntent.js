var _ = require('lodash-node');
var utils = require('../poker-utils');
var fcUtils = require('../fivecard-utils.js');

module.exports = function (intent, session, response) {
    var text = "";
    var cardText = "";
    var repromptText = "";
    var heading = "";
    var tell = false;
    var withCard = true;

    var newSession = _.assign({}, session);

    if (typeof newSession.attributes.playing === 'undefined' ||
        typeof newSession.attributes.state === 'undefined' ||
        newSession.attributes.playing === false ||
        newSession.attributes.state === fcUtils.states.NEW_GAME) {
        
        // New Game!
        var deck = utils.newDeck();
        var playerHand = [];
        var dealerHand = [];
        for (var i = 0; i < 5; i++) {
            playerHand.push(deck.shift());
            dealerHand.push(deck.shift());
        }

        playerHand = utils.sortHand(playerHand);
        dealerHand = utils.sortHand(dealerHand);

        newSession = {
            attributes: {
                playing: true,
                deck: deck,
                playerHand: playerHand,
                dealerHand: dealerHand,
                toDiscard: [],
                state: fcUtils.states.DISCARDING,
            }
        };
        
        text += "Let's play a new game. Your hand is ";
        text += utils.convertHandToSpeech(newSession.attributes.playerHand) + ". ";
        text += "Do you want to discard a card?";
        
        cardText += "You have \n";
        cardText += utils.convertHandToEmoji(newSession.attributes.playerHand) + "\n";
        cardText += "Do you want to discard a card?";
        
        heading = "Welcome to Five Card Draw!";

        response._session = newSession;

        return response.askWithCard(text, repromptText, heading, cardText);
    }

    var currentHand = newSession.attributes.playerHand.slice();

    for (var cardIndex in newSession.attributes.toDiscard) {
        var currentCard = newSession.attributes.toDiscard[cardIndex]

        currentHand = currentHand.filter(function(el) {
            return el !== currentCard;
        });
    }

    text += "Your hand is ";
    text += utils.convertHandToSpeech(currentHand) + ". ";
    text += "Do you want to discard a card?";

    repromptText += "Do you want to discard a card?";
    
    cardText += "Your hand is \n";
    cardText += utils.convertHandToEmoji(currentHand) + "\n";

    heading += "Do you want to discard a card?";
    tell = false;
    withCard = true;

    response._session = newSession;

    if (tell && withCard) {
        return response.tellWithCard(text, heading, cardText);
    } else if (tell) {
        return response.tell(text);
    } else if (withCard) {
        return response.askWithCard(text, repromptText, heading, cardText);
    } else {
        return response.ask(text, repromptText);
    }
};