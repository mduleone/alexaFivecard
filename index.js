var AlexaSkill = require('./AlexaSkill');
var _ = require('lodash-node/compat');
var poker = require('./poker');
var utils = require('./poker-utils');
var fivecard = require('./fivecard');
var APP_ID = "NEED_TO_GET";

var states = {
    NEW_GAME: 'newGame',
    DISCARDING: 'discarding',
    DETERMINE_WINNER: 'determineWinner',
}

var handleYesIntent = function (intent, session, response) {
    var text = "";
    var cardText = "";
    var repromptText = "";
    var heading = "";
    var tell = false;
    var withCard = true;

    // deep copy
    var session = _.assign({}, session);

    if (!session.playing) {
        // New Game!
        var deck = utils.newDeck();
        var playerHand = [];
        var dealerHand = [];
        for (var i = 0; i < 5; i++) {
            playerHand.push(deck.shift());
            dealerHand.push(deck.shift());
        }

        session = {
            playing: true,
            deck: deck,
            playerHand: playerHand,
            dealerHand: dealerHand,
            state: states.DISCARDING,
        }
        text += "Your hand is ";
        text += utils.convertHandToSpeech(session.playerHand);
        text += "Do you want to discard a card?";
        
        cardText += "You have \n";
        cardText += utils.convertHandToEmoji(session.playerHand) + "\m";
        
        heading = "Welcome to Five Card Draw!";

    } else if (session.state == states.DISCARDING) {
    } else if (session.state == states.DETERMINE_WINNER) {
    } else if (session.state == states.NEW_GAME) {
    }

    response._session = session;

    if (tell && withCard) {
        return response.tellWithCard(text, heading, cardText);
    } else if (tell) {
        return response.tell(text);
    } else if (withCard) {
        return response.askWithCard(text, repromptText, heading, cardText);
    } else {
        return response.ask(text, repromptText);
    }
}

var handleNoIntent = function (intent, session, response) {
    var text = "";
    var cardText = "";
    var heading = "";    

}

var handleStartGameIntent = function (intent, session, response) {
    var text = "";
    var cardText = "";
    var heading = "";

}

var handleDiscardCardIntent = function (intent, session, response) {
    var card = intent.slots.card.value;
    var text = "";
    var cardText = "";
    var heading = "";

}

var handleDetermineWinnerIntent = function (intent, session, response) {
    var text = "";
    var cardText = "";
    var heading = "";

}

var FiveCard = function() {
    AlexaSkill.call(this, APP_ID);
};

FiveCard.prototype = Object.create(AlexaSkill.prototype);
FiveCard.prototype.constructor = FiveCard;

FiveCard.prototype.eventHandlers.onLaunch = function (launchRequest, session, response){
  var output = '';
  output += 'Welcome to Five Card Draw. Would you like to play a round?';

  var reprompt = 'Would you like to play a round of Five Card Draw?';

  response.ask(output, reprompt);
};

FiveCard.prototype.intentHandlers = {
    YesIntent: function (intent, session, response) {
        handleYesIntent(intent, session, response);
    },
    NoIntent: function (intent, session, response) {
        handleNoIntent(intent, session, response);
    },
    StartGame: function(intent, session, response){
        handleStartGameRequest(intent, session, response);
    },
    DiscardCard: function(intent, session, response){
        handleDiscardCardRequest(intent, session, response);
    },
    DetermineWinner: function(intent, session, response){
        handleDetermineWinnerRequest(intent, session, response);
    },
};

exports.handler = function (event, context) {
    var skill = new FiveCard();
    skill.execute(event, context); 
}