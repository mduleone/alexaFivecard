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

    if (typeof newSession === 'undefined' ||
        typeof newSession.attributes === 'undefined' ||
        typeof newSession.attributes.playing === 'undefined' ||
        typeof newSession.attributes.state === 'undefined' ||
        newSession.attributes.playing === false ||
        newSession.attributes.state === fcUtils.states.NEW_GAME) {
        text += "You can say new game, and I will deal a ";
        text += "round of five card draw for us!";

        repromptText += "Do you want to play a round of five card draw?";
        tell = false;
        withCard = false;
    } else {
        var currentHand = newSession.attributes.playerHand.slice();

        for (var cardIndex in newSession.attributes.toDiscard) {
            var currentCard = newSession.attributes.toDiscard[cardIndex]

            currentHand = currentHand.filter(function(el) {
                return el !== currentCard;
            });
        }

        text += "Your hand is " + utils.convertHandToSpeech(currentHand) + ". ";
        text += "Do you want to discard a card? If you do, say the rank and suit. ";
        text += "If you do not, say no.";

        repromptText += "Do you want to discard a card? If you do, say the rank and suit. ";
        repromptText += "If you do not, say no.";
        tell = false;
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