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

    return {
        load: function (dataObject, callback) {
            console.log('load');
            console.log(dataObject);
            dynamodb.getItem({
                TableName: dataObject.table,
                Key: {
                    key: {
                        S: dataObject.key
                    }
                }
            }, function (err, data) {
                if (err){
                    callback(err);
                }
                else{
                    callback(data);
                }
            });
        },

        save: function (dataObject, callback) {
            console.log('save');
            console.log(dataObject);
            dynamodb.putItem({
                TableName: dataObject.table,
                Item: {
                    key: {
                        S: dataObject.key,
                    },
                    pronoun: {
                        S: dataObject.pronoun
                    },
                    data: {
                        S: JSON.stringify(dataObject.value)
                    }
                }
            }, function (err, data) {
                if (err) {
                    console.log('error');
                    console.log(err);
                }
                if (callback) {
                    console.log('success');
                    callback(data);
                }
            });
        }
    };
})();

module.exports = storage;