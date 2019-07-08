/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/




var express = require('express')
var bodyParser = require('body-parser')
var awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')

const apikey = process.env.TRANSLATE_KEY;
var translate = require('google-translate')(apikey);


// declare a new express app
var app = express()
app.use(bodyParser.json())
app.use(awsServerlessExpressMiddleware.eventContext())

// Enable CORS for all methods
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  next()
});

const promiseTranslate = (text, lang) => {
  return new Promise((resolve, reject) => {
    translate.translate(text, lang, (err, translation) => {
      if (err) {
        reject(err);
      } else {
        resolve(translation);
      }
    });
  });
}

/****************************
* Example post method *
****************************/

app.post('/translate', async function(req, res) {
  // Add your code here
  const { num, input } = req.body;

  // sanitize, filter out functions and auto lang
  translate.getSupportedLanguages('en', async (err, languages) => {
    const languageMap = languages.reduce((prev, curr) => {
      const { language, name } = curr;
      prev[language] = name;
      return prev;
    }, {});

    const langs = Object.keys(languageMap);

    const plan = Array.apply(null, { length: num }).map(() => langs[Math.floor(langs.length * Math.random())]).reduce(
      (prev, curr) => [ ...prev, curr ],
      []
    );

    console.log("Translation plan:", plan);

    let prev = "en";
    let prevText = input;

    const texts = [{ code: prev, lang: languageMap[prev], text: prevText }];

    for (let step of plan) {
      const translation = await promiseTranslate(prevText, step);
      const { translatedText } = translation;

      prevText = translatedText;
      prev = step;
      console.log(prev, languageMap[prev], prevText);
      texts.push({ code: prev, lang: languageMap[prev], text: prevText });
    }

    res.json(texts);
  });
});

app.listen(3000, function() {
    console.log("App started")
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app
