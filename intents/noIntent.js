var _ = require('lodash-node');
var utils = require('../poker-utils');
var fivecard = require('../fivecard.js');
var fcUtils = require('../fivecard-utils.js');

module.exports = function (intent, session, response) {
    var text = "";
    var cardText = "";
    var repromptText = "";
    var heading = "";
    var tell = false;
    var withCard = true;

    console.log("!!!!!!!!!!\n\n!!!!!!!!!noIntent!!!!!!!!!", intent);
    console.log("!!!!!!!!!session!!!!!!!!!", session);
    var newSession = _.assign({}, session);
    if (typeof newSession === 'undefined' ||
        typeof newSession.attributes === 'undefined' ||
        typeof newSession.attributes.state === 'undefined') {
        newSession = {
            attributes: {
                state: null,
            }
        }
    }

    switch (newSession.attributes.state) {
        case fcUtils.states.NEW_GAME:
            console.log('\n!!!!!!!!!new game');
            if (newSession.attributes.playing) {
                text += "Thank you for playing Five Card Draw. Play again soon!";
                cardText += "Thank you for playing Five Card Draw. Play again soon!";
                heading += "Thanks for playing!";
                tell = true;
                withCard = true;
            } else {
                text += "Please play again soon!";
                tell = true;
                withCard = false;
            }
            break;
        case fcUtils.states.DISCARDING:
            console.log('\n!!!!!!!!!discarding');
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

            text += "You draw ";
            if (newSession.attributes.toDiscard.length === 1) {
                text += newSession.attributes.toDiscard.length + " card: ";
            } else {
                text += newSession.attributes.toDiscard.length + " cards: ";
            }

            text += utils.convertHandToSpeech(nextStage.game.draw) + ". ";

            cardText += "You draw ";
            if (newSession.attributes.toDiscard.length === 1) {
                cardText += newSession.attributes.toDiscard.length + " card: ";
            } else {
                cardText += newSession.attributes.toDiscard.length + " cards: ";
            }
            cardText += utils.convertHandToEmoji(nextStage.game.draw) + "\n";

            text += texts.text;
            cardText += texts.cardText;
            heading += texts.heading;
            repromptText = "Do you want to play again?";
            
            newSession.attributes.state = fcUtils.states.NEW_GAME;
            newSession.attributes.playing = true;

            tell = false;
            withCard = true;
            break;
        default:
            console.log('\n!!!!!!!!!default');
            text += "Please play again soon!";
            tell = true;
            withCard = false;
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