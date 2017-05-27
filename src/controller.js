const token = require('./twitterKey.js')
const request = require('request')
const watsonKeys = require('./watsonKeys.js')
var PersonalityInsightsV3 = require('watson-developer-cloud/personality-insights/v3')



function email(req, res, next) {
  console.log(req.body);
  request({
    url: `https://api.fullcontact.com/v2/person.json?email=${req.body.email}`,
    headers: {"X-FullContact-APIKey":"7bf3d484dff1e414"}
  },
    function (error, response, body) {

    if(!error && response.statusCode === 200) {
      res.send(body)
    } else {
      res.status(500).send({
        error: 'unknown issue'
      })
    }
  })

}


function tweets(req, res, next) {
  console.log(req.body);
 request({
   url: `https://api.twitter.com/1.1/statuses/user_timeline.json?user_id=${req.body.id}&count=100&include_rts=false`,
   headers: {
     "Authorization": `Bearer ${token.token}`
   }
 },
 function( error, response, body) {
   if(!error && response.statusCode === 200) {
     res.send(body)
   } else {
     console.log(error);
   }
 }
  )
}

function watson(req, res, next) {
  // console.log(req.body)
  var personality_insights = new PersonalityInsightsV3({
    username: watsonKeys.username,
    password: watsonKeys.password,
    version_date: '2017-05-20'
  })

  var params = {
  // Get the content items from the JSON file.
  content_items: req.body.text.contentItems,
  consumption_preferences: true,
  raw_scores: true,
  headers: {
    'accept-language': 'en',
    'accept': 'application/json'
  }
};

personality_insights.profile(params, function(error, response) {
  if (error)
    console.log('Error:', error);
  else
    // console.log(JSON.stringify(response, null, 2));
    res.send(response, null, 2)
  }
);

  // request({
  //   url: `https://gateway.watsonplatform.net/personality-insights/api`,
  //   headers: {
  //     "Content-Type": "application/json",
  //   }
  // },
  //   function (error, response, body) {
  //
  //   if(!error && response.statusCode === 200) {
  //     res.send(body)
  //   } else {
  //     res.status(500).send({
  //       error: 'unknown issue'
  //     })
  //   }
  // })
}


module.exports = {
  email: email,
  tweets: tweets,
  watson: watson
}

// request({
//   url: `https://api.fullcontact.com/v2/address/locationNormalizer.json?place=denver`,
//   headers: {"X-FullContact-APIKey":"7bf3d484dff1e414"},
// },
//   function (error, response, body) {
//     console.log(response);
//     if (!error && response.statusCode == 200) {
//       console.log(body);
//       return (res)
//       // res.send(body)
//     } else {
//       console.log(error);
//     }
// })
