/**
 Copyright 2014-2015 Amazon.com, Inc. or its affiliates. All Rights Reserved.

 Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at

 http://aws.amazon.com/apache2.0/

 or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */

/**
 * This sample shows how to create a simple Trivia skill with a multiple choice format. The skill
 * supports 1 player at a time, and does not support games across sessions.
 */



'use strict';

var storage = require('./storage');

exports.handler = function (event, context) {
  try {
    if (event.session.application.applicationId !== "amzn1.echo-sdk-ams.app.977c26da-f6bf-4be2-9ee1-8b88564a41f9") {
      context.fail("Invalid Application ID");
    }
    if (event.session.new) {
      onSessionStarted({requestId: event.request.requestId}, event.session);
    }
    if (event.request.type === "LaunchRequest") {
      onLaunch(event.request,
        event.session,
        function callback(sessionAttributes, speechletResponse) {
          context.succeed(buildResponse(sessionAttributes, speechletResponse));
        });
    } else if (event.request.type === "IntentRequest") {
      onIntent(event.request,
        event.session,
        function callback(sessionAttributes, speechletResponse) {
          context.succeed(buildResponse(sessionAttributes, speechletResponse));
        });
    } else if (event.request.type === "SessionEndedRequest") {
      onSessionEnded(event.request, event.session);
      context.succeed();
    }
  } catch (e) {
    context.fail("Exception: " + e);
  }
};

//Called when the session starts.
function onSessionStarted(sessionStartedRequest, session) {
}

//Called when the user invokes the skill without specifying what they want.
function onLaunch(launchRequest, session, callback) {
  getWelcomeResponse(callback);
}

//Called when the user specifies an intent for this skill.
function onIntent(intentRequest, session, callback) {
  var intent = intentRequest.intent,
  intentName = intentRequest.intent.name;

  if ("WhatPostIntent" === intentName) {
    whatPost(intent, session, callback);
  } else if ("WhatGetIntent" === intentName) {
    whatGet(intent, session, callback);
  } else if ("WherePostIntent" === intentName) {
    wherePost(intent, session, callback);
  } else if ("WhereGetIntent" === intentName) {
    whereGet(intent, session, callback);
  } else if ("WhenPostIntent" === intentName) {
    whenPost(intent, session, callback);
  } else if ("WhenGetIntent" === intentName) {
    whenGet(intent, session, callback);
  } else if ("AMAZON.StartOverIntent" === intentName) {
    getWelcomeResponse(callback);
  } else if ("AMAZON.RepeatIntent" === intentName) {
    handleRepeatRequest(intent, session, callback);
  } else if ("AMAZON.StopIntent" === intentName) {
    handleFinishSessionRequest(intent, session, callback);
  } else if ("AMAZON.CancelIntent" === intentName) {
    handleFinishSessionRequest(intent, session, callback);
  } else {
    throw "Invalid intent";
  }
}

/**
 * Called when the user ends the session.
 * Is not called when the skill returns shouldEndSession=true.
 */
 function onSessionEnded(sessionEndedRequest, session) {
  console.log("onSessionEnded requestId=" + sessionEndedRequest.requestId
    + ", sessionId=" + session.sessionId);
}

// ------- Skill specific business logic -------

function getWelcomeResponse(callback) {
  var sessionAttributes = {},
  speechOutput = "Hello",
  repromptText = "Tell me something";

  sessionAttributes = {
    "speechOutput": speechOutput,
    "repromptText": repromptText
  };
  callback(sessionAttributes,
    buildSpeechletResponse(speechOutput, repromptText, false));
}

function whatPost(intent, session, callback){
  var speechOutput;
  var repromptText;
  var slotPronoun = intent.slots.Pronoun.value;
  var slotKey = intent.slots.WhatKey.value;
  var slotValue = intent.slots.WhatValue.value;

  console.log("what post", slotPronoun, slotKey, slotValue);

  if(!slotKey || !slotValue){
    console.log(slotPronoun, slotKey, slotValue);
    speechOutput = "Error saving data, please try again";
    repromptText = "Please try again";

    var sessionAttributes = {
      "speechOutput": speechOutput,
      "repromptText": repromptText
    };

    callback(sessionAttributes,
        buildSpeechletResponse(speechOutput, repromptText, false));
  } else {
    if(!slotPronoun){
      slotPronoun = "pseudo";
    }

    var dataObject = {
      table: 'what',
      pronoun: slotPronoun,
      key: slotKey,
      value: slotValue
    }

    storage.whatSave(dataObject, function(res){
      speechOutput = "Saved " + slotPronoun + " " + slotKey;
      repromptText = speechOutput;

      var sessionAttributes = {
        "speechOutput": speechOutput,
        "repromptText": repromptText
      };

      callback(sessionAttributes,
        buildSpeechletResponse(speechOutput, repromptText, false));
    });
  }
}

function whatGet(intent, session, callback){
  var speechOutput;
  var repromptText;
  var slotPronoun = intent.slots.Pronoun.value;
  var slotKey = intent.slots.WhatKey.value;

  console.log("what get", slotPronoun, slotKey);

  if(!slotPronoun){
    slotPronoun = "pseudo";
  }

  var dataObject = {
    table: 'what',
    pronoun: slotPronoun,
    key: slotKey
  }

  storage.whatLoad(dataObject, function(data){
    console.log('success get');
    console.log(data);

    if(slotPronoun == "pseudo"){
      slotPronoun = "";
    }

    if(!data){
      speechOutput = "You didn't tell me what " + slotPronoun + " " + slotKey + " is yet"
      repromptText = "Try again?"
    } else {
      if(slotPronoun == 'my'){
        slotPronoun = 'your';
      }
      if(!isNaN(data)){
        speechOutput = slotPronoun + " " + slotKey + " is " +  "<say-as interpret-as='digits'>" + data +"</say-as>";
      } else {
        speechOutput = slotPronoun + " " + slotKey + " is " + data;  
      }
    }

    var sessionAttributes = {
      "speechOutput": speechOutput,
      "repromptText": repromptText
    };

    callback(sessionAttributes,
      buildSpeechletResponse(speechOutput, repromptText, false));
  });
}

function wherePost(intent, session, callback){
  var speechOutput;
  var repromptText;
  var slotPronoun = intent.slots.Pronoun.value;
  var slotKey = intent.slots.WhereKey.value;
  var slotValue = intent.slots.WhereValue.value;

  console.log("where post",slotPronoun, slotKey, slotValue);

  if(!slotKey || !slotValue){
    console.log(slotPronoun, slotKey, slotValue);
    speechOutput = "Error saving data, please try again";
    // speechOutput = "Error saving data " + "pronoun " + slotPronoun + "key " + slotKey + "value " + slotValue;
    repromptText = "Please try again";

    var sessionAttributes = {
      "speechOutput": speechOutput,
      "repromptText": repromptText
    };

    callback(sessionAttributes,
        buildSpeechletResponse(speechOutput, repromptText, false));
  } else {
    if(!slotPronoun){
      slotPronoun = "pseudo";
    }

    var dataObject = {
      table: 'where',
      pronoun: slotPronoun,
      key: slotKey,
      value: slotValue
    }

    storage.whereSave(dataObject, function(res){
      speechOutput = "Saved " + slotKey + " location";
      repromptText = speechOutput;

      var sessionAttributes = {
        "speechOutput": speechOutput,
        "repromptText": repromptText
      };

      callback(sessionAttributes,
        buildSpeechletResponse(speechOutput, repromptText, false));
    });
  }
}

function whereGet(intent, session, callback){
  var speechOutput;
  var repromptText;
  var slotPronoun = intent.slots.Pronoun.value;
  var slotKey = intent.slots.WhereKey.value;

  console.log("where get",slotPronoun, slotKey);

  if(!slotPronoun){
    slotPronoun = "pseudo";
  }

  var dataObject = {
    table: 'where',
    pronoun: slotPronoun,
    key: slotKey
  }

  storage.whereLoad(dataObject, function(data){
    console.log('success get');
    console.log(data);

    if(slotPronoun == "pseudo"){
      slotPronoun = "";
    }

    if(!data){
      speechOutput = "Could not find record for " + slotKey
      repromptText = "Try again?"
    } else {
      if(slotPronoun == 'my'){
        slotPronoun = 'your';
      }
      speechOutput = slotPronoun + " " + slotKey + " is " + data;
    }

    var sessionAttributes = {
      "speechOutput": speechOutput,
      "repromptText": repromptText
    };

    callback(sessionAttributes,
      buildSpeechletResponse(speechOutput, repromptText, false));
  });
}

function whenPost(intent, session, callback){
  var speechOutput;
  var repromptText;
  var slotPronoun = intent.slots.Pronoun.value;
  var slotKey = intent.slots.WhenKey.value;
  var slotEvent = intent.slots.Event.value;
  var slotDate = intent.slots.Date.value;
  var slotTime = intent.slots.Time.value;
  var timestamp;

  console.log("when post", slotPronoun, slotKey, slotEvent, slotDate, slotTime);

  if(!slotTime && !slotDate || !slotEvent || !slotKey){
    console.log(slotKey, slotEvent, slotDate, slotTime);
    speechOutput = "Error saving data, please try again";
    repromptText = "Please try again";

    var sessionAttributes = {
      "speechOutput": speechOutput,
      "repromptText": repromptText
    };

    callback(sessionAttributes,
        buildSpeechletResponse(speechOutput, repromptText, false));
  } else {
    if(!slotPronoun){
      slotPronoun = "pseudo";
    }

    if(slotTime){
      timestamp = slotTime;
    } else {
      timestamp = slotDate;
    }

    var dataObject = {
      table: 'when',
      pronoun: slotPronoun,
      key: slotKey,
      event: slotEvent,
      timestamp: timestamp
    }

    storage.whenSave(dataObject, function(res){
      speechOutput = "Saved Event.";
      repromptText = speechOutput;

      var sessionAttributes = {
        "speechOutput": speechOutput,
        "repromptText": repromptText
      };

      callback(sessionAttributes,
        buildSpeechletResponse(speechOutput, repromptText, false));
    });
  }
}

function whenGet(intent, session, callback){
  var speechOutput;
  var repromptText;
  var slotPronoun = intent.slots.Pronoun.value;
  var slotKey = intent.slots.WhenKey.value;
  var slotEvent = intent.slots.Event.value;

  console.log("When get", slotPronoun, slotKey, slotEvent);

  if(!slotPronoun){
    slotPronoun = "pseudo";
  }

  var dataObject = {
    table: 'when',
    pronoun: slotPronoun,
    key: slotKey,
    event: slotEvent,
  }

  storage.whenLoad(dataObject, function(data){
    console.log('success get');
    console.log(data);

    if(slotPronoun == "pseudo"){
      slotPronoun = "";
    }

    if(!data){
      speechOutput = "Could not find record for " + slotKey
      repromptText = "Try again?"
    } else {
      if(slotPronoun == 'my'){
        slotPronoun = 'your';
      }
      if(slotKey == 'I'){
        slotKey = 'you';
      }
      var currentDate = new Date();
      var newDate = new Date(data);
      var word;

      if(currentDate > newDate){
        word = "was"
      } else {
        word = "is"
      }

      var firstWord = slotEvent.split(" ")[0];
      // console.log(firstWord);
      // console.log(firstWord.slice(-2));
      if(firstWord.slice(-2) == "ed"){
        word = "";
      }

      speechOutput = slotPronoun + " " + slotKey + " " + word + " " + slotEvent + " on " + data;
    }

    var sessionAttributes = {
      "speechOutput": speechOutput,
      "repromptText": repromptText
    };

    callback(sessionAttributes,
      buildSpeechletResponse(speechOutput, repromptText, false));
  });
}

function handleRepeatRequest(intent, session, callback) {
  var speechOutput = session.speechOutput;
  var repromptText = "Continue?"

  callback(null, 
    buildSpeechletResponse(speechOutput, repromptText, false));
}

function handleFinishSessionRequest(intent, session, callback) {
  callback(null,
    buildSpeechletResponse("Good bye!", "", true));
}

// ------- Helper functions to build responses -------
function buildSpeechletResponse(output, repromptText, shouldEndSession) {
  return {
    outputSpeech: {
      type: "PlainText",
      text: output
    },
    reprompt: {
      outputSpeech: {
        type: "PlainText",
        text: repromptText
      }
    },
    shouldEndSession: shouldEndSession
  };
}

function buildResponse(sessionAttributes, speechletResponse) {
  return {
    version: "1.0",
    sessionAttributes: sessionAttributes,
    response: speechletResponse
  };
}