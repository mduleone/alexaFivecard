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
    var rank = intent.slots.rank.value;
    var suit = intent.slots.suit.value;

    var card = fcUtils.translateCard(rank, suit);

    var newSession = _.assign({}, session);
    var currentHand = newSession.attributes.playerHand.map(function(el) {
        return el;
    });
    for (var cardIndex in newSession.attributes.toDiscard) {
        var currentCard = newSession.attributes.toDiscard[cardIndex]

        currentHand = currentHand.filter(function(el) {
            return el !== currentCard;
        }, []);
    }

    if (currentHand.indexOf(card) === -1) {
        text += "I'm sorry, but the " + rank + " of " + suit + " ";
        text += "is not in your hand. ";
        text += "Your hand is ";
        text += utils.convertHandToSpeech(newSession.attributes.playerHand) + ". ";
        text += "Do you want to discard a card?"
        
        repromptText += "Do you want to discard a card?"
        return response.ask(text, repromptText);
    }

    newSession.attributes.toDiscard.push(card);

    currentHand = currentHand.filter(function(el) {
        return el !== card;
    }, []);

    text += "You've discarded the " + rank + " of " + suit + ". ";
    if (newSession.attributes.toDiscard.length < 4) {
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
        newSession.attributes.playing = false;
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