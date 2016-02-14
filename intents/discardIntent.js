var _ = require('lodash-node');
var fivecard = require('../fivecard');
var utils = require('../poker-utils');
var fcUtils = require('../fivecard-utils.js');

module.exports = function (intent, session, response) {
    var text = "";
    var cardText = "";
    var repromptText = "";
    var heading = "";
    var tell = false;
    var withCard = true;
    
    console.log("!!!!!!!!!!\n\n!!!!!!!!!discardIntent!!!!!!!!!", intent);
    console.log("!!!!!!!!!session!!!!!!!!!", session);
    var newSession = _.assign({}, session);

    if (typeof newSession.attributes.playing === 'undefined' ||
        typeof newSession.attributes.state === 'undefined' ||
        newSession.attributes.playing === false ||
        newSession.attributes.state === fcUtils.states.NEW_GAME) {
        
        console.log('\n!!!!!!!!!new game');
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
        
        text += "You can't discard if we haven't started playing yet! ";
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

    console.log('\n!!!!!!!!!not new game');
    var rank = intent.slots.rank.value;
    var suit = intent.slots.suit.value;

    var currentHand = newSession.attributes.playerHand.slice();

    for (var cardIndex in newSession.attributes.toDiscard) {
        var currentCard = newSession.attributes.toDiscard[cardIndex]

        currentHand = currentHand.filter(function(el) {
            return el !== currentCard;
        });
    }

    if (typeof rank === 'undefined' || typeof suit === 'undefined') {
        console.log('\n!!!!!!!!!rank or suit undefined');
        console.log('\n!!!!!!!!!rank', rank);
        console.log('\n!!!!!!!!!suit', suit);
        text += "I'm sorry, but I didn't understand the card. ";
        text += "Please say the rank and suit. Your hand is ";
        text += utils.convertHandToSpeech(currentHand) + ". ";
        text += "Do you want to discard a card?"
        
        repromptText += "Do you want to discard a card?"

        return response.ask(text, repromptText);
    }

    var card = fcUtils.translateCard(rank, suit);

    if (currentHand.indexOf(card) === -1) {
        console.log('\n!!!!!!!!!card not found');
        text += "I'm sorry, but the " + rank + " of " + suit + " ";
        text += "is not in your hand. ";
        text += "Your hand is ";
        text += utils.convertHandToSpeech(currentHand) + ". ";
        text += "Do you want to discard a card?"
        
        repromptText += "Do you want to discard a card?"
        return response.ask(text, repromptText);
    }

    newSession.attributes.toDiscard.push(card);

    currentHand = currentHand.filter(function(el) {
        return el !== card;
    });

    text += "You've discarded the " + rank + " of " + suit + ". ";
    if (newSession.attributes.toDiscard.length < 4) {
        console.log('\n!!!!!!!!!discarded, less than 4 total');
        heading = "Do you want to discard another card?";

        text += "Your hand is now ";
        text += utils.convertHandToSpeech(currentHand) + ". ";
        text += "Do you want to discard another card?"

        cardText += "You've discarded ";
        cardText += utils.convertCardToEmoji(card) + "\n";
        cardText += "Your hand is now ";
        cardText += utils.convertHandToEmoji(currentHand) + "\n";
        cardText += "Do you want to discard another card?"

        repromptText += "Your hand is now ";
        repromptText += utils.convertHandToSpeech(currentHand);
        repromptText += "Do you want to discard another card?"
    } else {
        console.log('\n!!!!!!!!!discarded, 4 total');
        var nextStage = fivecard.discard(
            newSession.attributes.toDiscard,
            newSession.attributes.playerHand,
            newSession.attributes.deck
        );
        
        newSession.attributes.playerHand = nextStage.game.hand;

        var texts = fcUtils.getWinnerTexts(
            newSession.attributes.playerHand,
            newSession.attributes.dealerHand
        );

        text += "You draw 4 cards: ";
        text += utils.convertHandToSpeech(nextStage.game.draw) + ". ";

        cardText += "You've discarded ";
        cardText += utils.convertCardToEmoji(card) + "\n";
        cardText += "You draw 4 cards: ";
        cardText += utils.convertHandToEmoji(nextStage.game.draw) + "\n";

        heading = texts.heading;
        text += texts.text;
        cardText += texts.cardText;
        repromptText = "Do you want to play again?";
        
        newSession.attributes.state = fcUtils.states.NEW_GAME;
        newSession.attributes.playing = true;
    }

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