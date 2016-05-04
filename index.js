'use strict';

var request = require('request');
var moment = require('moment');

module.exports = function(fqdn, apikey, username, password) {
  return new Cherestjs(fqdn, apikey, username, password);
};

function Cherestjs (fqdn, apikey, username, password) {

  var self = this;

  self.token_endpoint = "/Cher" + "wellAPI/token";
  self.v1_endpoint = "/Cher" + "wellAPI/api/V1";

  self.token = {
    key: null,
    expiration: moment("0000-01-01"),
    url: "https://" + fqdn + token_endpoint,
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

  if ( ! moment().isAfter(self.token.expiration) ) { callback(false, self.token.key); return; }

  request.post({ url: self.token.url, form: self.token.form }, function (err, httpResponse, body) {
    if (err) { return; }

    var data = JSON.parse(body);
    self.token.key = data.access_token;
    self.token.expiration = moment().add(data.expires_in, 's');

    callback(false, self.token.key);
  };

};

Cherestjs.getBusinessObject = function (id, callback) {
  var self = this;

  self.getToken( function (err, token_key) {
    if (err) { return; }

    var busobj_url = 'https://' + fqdn + v1_endpoint + '/getbusinessobject/busobid/'+ busObjId.i +'/publicid/'+ id;

    var busobj_headers = {
      Authorization: "Bearer " + token_key,
      Accept: "application/json"
    };

    request({ url: busobj_url, headers: busobj_headers }, function(err, httpResponse, body) {
      if (err) { return; }

      var fields = {};
      var data = JSON.parse(body);
      for (var i=0; i < data["fields"].length; i++) {
        fields[ data["fields"][i]["name"] ] = data["fields"][i]["value"];
      }

      callback(false, fields);
    });

  });

};
