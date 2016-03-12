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
  var pronoun = intent.slots.Pronoun.value;
  var whatKey = intent.slots.WhatKey.value;
  var whatValue = intent.slots.WhatValue.value;

  var speechOutput = pronoun + " " + whatKey + " " + whatValue;
  var repromptText = speechOutput;

  /*
  storage.postWhatValue(pronoun, key, value, function(res){
    var sessionAttributes = {
      "speechOutput": speechOutput,
      "repromptText": repromptText
    };

    callback(sessionAttributes,
      buildSpeechletResponse(speechOutput, repromptText, false));
  });
  */
 
}

function whatGet(intent, session, callback){
  var pronoun = intent.slots.Pronoun.value;
  var whatKey = intent.slots.WhatKey.value;
  var whatValue = intent.slots.WhatValue.value;

  var speechOutput = pronoun + " " + whatKey + " " + whatValue;
  var repromptText = speechOutput;

  /*
  storage.getWhatValue(pronoun, key, function(){
    var sessionAttributes = {
      "speechOutput": speechOutput,
      "repromptText": repromptText
    };

    callback(sessionAttributes,
      buildSpeechletResponse(speechOutput, repromptText, false));
  });
  */
}

function handleRepeatRequest(intent, session, callback) {
  var speechOutput = "repeating";
  var repromptText = "repeating";

  console.log(session);

  callback(null, 
    buildSpeechletResponse(speechOutput, "", false));
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