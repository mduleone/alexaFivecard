var AlexaSkill = require('./AlexaSkill');
var _ = require('lodash-node');
var poker = require('./poker');
var utils = require('./poker-utils');
var fivecard = require('./fivecard');
var fcUtils = require('./fivecard-utils');
var APP_ID = "amzn1.echo-sdk-ams.app.1b7713b0-bfd0-4831-8506-447384607766";

//Custom Intents
var handleNewGameIntent = require('./intents/newGameIntent');
var handleDiscardCardIntent = require('./intents/discardIntent');

// Amazon Intent Overrides
var handleYesIntent = require('./intents/yesIntent');
var handleNoIntent = require('./intents/noIntent');
var handleStopIntent = require('./intents/stopIntent');
var handleCancelIntent = require('./intents/stopIntent');

var FiveCard = function() {
    AlexaSkill.call(this, APP_ID);
};

FiveCard.prototype = Object.create(AlexaSkill.prototype);
FiveCard.prototype.constructor = FiveCard;

FiveCard.prototype.eventHandlers.onLaunch = function (launchRequest, session, response){
    newSession = {
        playing: false,
        deck: utils.newDeck(),
        playerHand: [],
        dealerHand: [],
        toDiscard: [],
        state: fcUtils.states.NEW_GAME,
    }

    var output = '';
    output += 'Welcome to Five Card Draw. Would you like to play a round?';

    var reprompt = 'Would you like to play a round of Five Card Draw?';
    response._session = newSession;

    response.ask(output, reprompt);
};

FiveCard.prototype.intentHandlers = {
    NewGame: handleNewGameIntent,
    DiscardCard: handleDiscardCardIntent,
    "AMAZON.YesIntent": handleYesIntent,
    "AMAZON.NoIntent": handleNoIntent,
    "AMAZON.StopIntent": handleStopIntent,
    "AMAZON.CancelIntent": handleCancelIntent,
};


exports.handler = function (event, context) {
    var skill = new FiveCard();
    skill.execute(event, context); 
}