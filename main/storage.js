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
        whatLoad: function (dataObject, callback) {
            console.log('load');
            console.log(dataObject);
            var params = {
                TableName: dataObject.table,
                Key: {
                    key: {
                        S: dataObject.key
                    }
                }
            };
            dynamodb.getItem(params, function (err, data) {
                if (err) {
                    callback(err);
                }
                else {
                    // console.log("DATA RETREIVED");
                    // console.log(data);
                    if (data.Item.pronoun.M[dataObject.pronoun]) {
                        console.log(data.Item.pronoun.M[dataObject.pronoun].S);
                        callback(data.Item.pronoun.M[dataObject.pronoun].S);    
                    }
                    else {
                        callback(null);
                    }    
                    
                }
            });
        },

        whatSave: function (dataObject, callback) {
            console.log('save');
            console.log(dataObject);
            var pronoun = dataObject.pronoun;
            var key = dataObject.key;
            var object = JSON.stringify(dataObject.value);

            // var params = {
            //     TableName: dataObject.table,
            //     Item: {
            //       "key": {
            //         "S": "phone"
            //       },
            //       "pronoun": {
            //         "M": {
            //           "Bill's": {
            //             "S": "12345"
            //           }
            //         }
            //       }
            //     }
            // }

            var params = {
                TableName: dataObject.table,
                Key: {
                    key: {
                        S: key
                    }
                }
            };
            dynamodb.getItem(params, function (err, data) {
                if (err) {
                    callback(err);
                }
                else {
                    console.log("Succesfully retreived old data:");
                    // console.log(data.Item.pronoun.M[dataObject.pronoun].S);
                    console.log(data);

                    var previousValue = data;

                    //Post
                    //  var params = {
                    //     TableName: dataObject.table,
                    //     Item: {
                    //         "key": {},
                    //         "pronoun": {
                    //             "M": {}
                    //         }
                    //     }
                    // };


                    // params.Item.key.S = key;
                    // params.Item.pronoun.M[pronoun] = {
                    //         "S": object
                    // };

                    previousValue.Item.key.S = key;
                    previousValue.Item.pronoun.M[pronoun] = {
                            "S": object
                    };
                    previousValue.TableName = dataObject.table;
                    console.log("Posting new data:");
                    console.log(JSON.stringify(previousValue));

                    dynamodb.putItem(previousValue, function (err, data) {
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
            });
        },

        whenLoad: function (dataObject, callback) {
            // console.log('load');
            // console.log(dataObject);
            // dynamodb.getItem({
            //     TableName: dataObject.table,
            //     Key: {
            //         Pronoun: {
            //             Event: {
            //                 S: dataObject.event
            //             }
            //         }
            //     }
            // }, function (err, data) {
            //     if (err){
            //         callback(err);
            //     }
            //     else{
            //         callback(data);
            //     }
            // });
        },

        whenSave: function (dataObject, callback) {
            // console.log('Saving when object');
            // console.log(dataObject);
            // dynamodb.putItem({
            //     TableName: dataObject.table,
            //     Item: {
            //         key: {
            //             S: dataObject.key,
            //         },
            //         pronoun: {
            //             S: dataObject.pronoun
            //         },
            //         event: {
            //             S: JSON.stringify(dataObject.event)
            //         }
            //     }
            // }, function (err, data) {
            //     if (err) {
            //         console.log('error');
            //         console.log(err);
            //     }
            //     if (callback) {
            //         console.log('success');
            //         callback(data);
            //     }
            // });
        },

        whereLoad: function (dataObject, callback) {
            console.log('load');
            console.log(dataObject);
            var params = {
                TableName: dataObject.table,
                Key: {
                    key: {
                        S: dataObject.key
                    }
                }
            };
            dynamodb.getItem(params, function (err, data) {
                if (err) {
                    callback(err);
                }
                else {
                    // console.log("DATA RETREIVED");
                    // console.log(data);
                    if (data.Item.pronoun.M[dataObject.pronoun]) {
                        console.log(data.Item.pronoun.M[dataObject.pronoun].S);
                        callback(data.Item.pronoun.M[dataObject.pronoun].S);    
                    }
                    else {
                        callback(null);
                    }    
                    
                }
            });
            // console.log('load');
            // console.log(dataObject);
            // dynamodb.getItem({
            //     TableName: dataObject.table,
            //     Key: {
            //         key: {
            //             S: dataObject.key
            //         }
            //     }
            // }, function (err, data) {
            //     if (err){
            //         callback(err);
            //     }
            //     else{
            //         callback(data);
            //     }
            // });
        },

        whereSave: function (dataObject, callback) {
            console.log('save');
            console.log(dataObject);
            var pronoun = dataObject.pronoun;
            var key = dataObject.key;
            var object = JSON.stringify(dataObject.value);

            var params = {
                TableName: dataObject.table,
                Key: {
                    key: {
                        S: key
                    }
                }
            };
            dynamodb.getItem(params, function (err, data) {
                if (err) {
                    callback(err);
                }
                else {
                    console.log("Succesfully retreived old data:");
                    // console.log(data.Item.pronoun.M[dataObject.pronoun].S);
                    console.log(data);

                    var previousValue = data;

                    previousValue.Item.key.S = key;
                    previousValue.Item.pronoun.M[pronoun] = {
                            "S": object
                    };
                    previousValue.TableName = dataObject.table;
                    console.log("Posting new data:");
                    console.log(JSON.stringify(previousValue));

                    dynamodb.putItem(previousValue, function (err, data) {
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
            });
        }
    };
})();

module.exports = storage;