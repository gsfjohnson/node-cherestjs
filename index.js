/*jslint node: true */
/*jslint indent: 2 */
'use strict';

var needle = require('needle');
var moment = require('moment');

function Cherestjs(host, apikey, username, password) {

  var self = this;

  self.token_endpoint = "/Cher" + "wellAPI/token";
  self.v1_endpoint = "/Cher" + "wellAPI/api/V1";
  self.host = host;

  self.token = {
    key: null,
    expiration: moment("0000-01-01"),
    url: "https://" + host + self.token_endpoint,
    form: {
      grant_type: 'password',
      client_id: apikey,
      username: username,
      password: password
    }
  };
  self.busObjId = {
    i: "6dd53665c0c24cab86870a21cf6434ae", // incident
    c: "934ec7a1701c451ce57f2c43bfbbe2e46fe4843f81" // change
  };
}

Cherestjs.prototype.getToken = function (callback) {
  var self = this;

  if (!moment().isAfter(self.token.expiration)) { callback(false, self.token.key); return; }

  needle.post(self.token.url, self.token.form, {}, function (err, res) {
    if (err) { callback(err, null); return; }
    if (res.parser!='json') { callback('invalid response parser', null); return; }

    self.token.key = res.body.access_token;
    self.token.expiration = moment().add(res.body.expires_in, 's');

    callback(false, self.token.key);
  });

};

Cherestjs.prototype.getBusinessObject = function (id, callback) {
  var self = this;

  self.getToken(function (err, token_key) {
    if (err) { callback(err, null); return; }

    var url = 'https://' + self.host + self.v1_endpoint + '/getbusinessobject/busobid/' + self.busObjId.i + '/publicid/' + id;

    var opts = {
      timeout: 300000, // 5 minutes as Cherwell SaaS is slooooooooooooow to start sometimes.
      accept: "application/json",
      headers: { Authorization: "Bearer " + token_key }
    };

    needle.get(url, opts, function (err, res) {
      if (err) { callback(err, null); return; }
      if (res.parser!='json') { callback('invalid response parser', null); return; }

      var fields = {};
      var data = res.body.fields;
      for (var i=0; i < data.length; i++) {
        fields[ data[i]["name"] ] = data[i]["value"];
      }

      callback(false, fields);
    });

  });

};

module.exports = function (host, apikey, username, password) {
  return new Cherestjs(host, apikey, username, password);
};
