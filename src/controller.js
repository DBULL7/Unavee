const token = require('./twitterKey.js')
const request = require('request')


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
   url: `https://api.twitter.com/1.1/statuses/user_timeline.json?user_id=${req.body.id}&count=2&include_rts=false`,
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


module.exports = {
  email: email,
  tweets: tweets
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
