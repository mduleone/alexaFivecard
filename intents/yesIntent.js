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

    console.log("!!!!!!!!!!\n\n!!!!!!!!!yesIntent!!!!!!!!!", intent);
    console.log("!!!!!!!!!session!!!!!!!!!", session);
        // deep copy
    var newSession = _.assign({}, session);

    if (typeof newSession === 'undefined' ||
        typeof newSession.attributes === 'undefined' ||
        typeof newSession.attributes.playing === 'undefined' ||
        typeof newSession.attributes.state === 'undefined' ||
        newSession.attributes.playing === false ||
        newSession.attributes.state === fcUtils.states.NEW_GAME) {

        console.log('\n!!!!!!!!!new game!');
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
        text += "Your hand is ";
        text += utils.convertHandToSpeech(newSession.attributes.playerHand) + ". ";
        text += "Do you want to discard a card?";
        
        cardText += "You have \n";
        cardText += utils.convertHandToEmoji(newSession.attributes.playerHand) + "\n";
        cardText += "Do you want to discard a card?";
        
        heading = "Welcome to Five Card Draw!";
        tell = false;
        withCard = true;
    } else if (newSession.attributes.state === fcUtils.states.DISCARDING) {
        console.log('\n!!!!!!!!!new game!');
        var currentHand = newSession.attributes.playerHand.slice(0);
        for (var card in newSession.attributes.toDiscard) {
            currentHand.splice(
                currentHand.indexOf(
                    newSession.attributes.toDiscard[card]
                ),
                1
            );
        }

        text += "Your hand is ";
        text += utils.convertHandToSpeech(currentHand) + ". ";
        text += "What card do you want to discard?";

        repromptText += "Do you want to discard another card?";
        
        cardText += "Your hand is \n";
        cardText += utils.convertHandToEmoji(currentHand) + "\n";

        heading += "What do you want to discard?";
        tell = false;
        withCard = true;
    } else {
        // Should never happen
        console.log('\n!!!!!!!!!Not new game or discarding')
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