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

    var newSession = _.assign({}, session);

    switch (newSession.attributes.state) {
        case fcUtils.states.NEW_GAME:
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
            console.log(
                '\n\n!!!!!!!!!!!!!!playerHand',
                newSession.attributes.playerHand
            );
            console.log(
                '\n\n!!!!!!!!!!!!!!toDiscard',
                newSession.attributes.toDiscard
            );
            var nextStage = fivecard.discard(
                newSession.attributes.toDiscard,
                newSession.attributes.playerHand,
                newSession.attributes.deck
            );
            
            console.log('\n\n!!!!!!!!!!!!!!postDiscrd', nextStage);
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

            console.log('\n\n!!!!!!!!!!texts.cardText', texts.cardText);

            text += texts.text;
            cardText += texts.cardText;
            heading += texts.heading;
            repromptText = "Do you want to play again?";
            
            newSession.attributes.state = fcUtils.states.NEW_GAME;
            newSession.attributes.playing = true;


            tell = false;
            withCard = true;
            break;
    }

    console.log(
        '\n\n!!!!!!!!!!!!!!handleNoIntent after newSession',
        newSession
    );
    response._session = newSession;
    console.log(
        '\n\n!!!!!!!!!!!!!!handleNoIntent after cardText\n',
         cardText
     );
    console.log(
        '\n\n!!!!!!!!!!!!!!handleNoIntent after tell',
        tell
    );
    console.log(
        '\n\n!!!!!!!!!!!!!!handleNoIntent after withCard',
        withCard
    );

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