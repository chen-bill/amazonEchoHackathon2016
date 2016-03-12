/**
    Copyright 2014-2015 Amazon.com, Inc. or its affiliates. All Rights Reserved.

    Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at

        http://aws.amazon.com/apache2.0/

    or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/

'use strict';
var AWS = require("aws-sdk");

var storage = (function () {
    var dynamodb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

    /*
     * The Game class stores all game states for the user
     */
    function sidekick(session, data) {
        if (data) {
            this.data = data;
        } else {
            this.data = {S};
        }
        this._session = session;
    }

    sidekick.prototype = {
        save: function (callback) {
            //save the game states in the session,
            //so next time we can save a read from dynamoDB

            dynamodb.putItem({
                TableName: this._session.table,
                Item: {
                    key: {
                        S: this._session.key
                    }
                        ,
                    pronoun: {
                        S: this._session.pronoun
                    },
                    Data: {
                        S: JSON.stringify(this.value)

                    }
                }
            }, function (err, data) {
                if (err) {
                    console.log(err, err.stack);
                }
                if (callback) {
                    callback();
                }
            });
        }
    };


    return {
        load: function (session, callback) {
            dynamodb.gtItem({
                TableNaeme: session.table,
                Key: {
                    key: {
                        S: session.key
                    }
                }
            }, function (err, data) {
                if (err){
                    callback(err)
                }
                else{
                    callback(data)
                }
            });
        }
    };
})();
module.exports = storage;
