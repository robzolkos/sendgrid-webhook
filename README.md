# SendGrid Webhook Server

![Build Status](https://travis-ci.org/robzolkos/sendgrid-webhook.png?branch=master)
![CodeClimate](https://codeclimate.com/github/robzolkos/sendgrid-webhook.png)

A simple server module to capture SendGrids webhooks and emit the relevant events.

The Event API is well documented on SendGrids documentation pages located [here](http://sendgrid.com/docs/API_Reference/Webhooks/event.html)

This module does not (yet) support SendGrids batched events.

## Install

```
npm install sendgrid-webhook
```

## Options

* ```port``` The port the server listens to.  Defaults to 3000

## Events Emitted

The module emits the following events depending on the payload sent by SendGrid - processed, dropped, delivered, deferred, bounce, open, click, spamreport, unsubscribe.

If a non-post event is detected the module emits a 'request_error' event.

If an event not defined from the list above is in the request parameters, a 'event_error' event is emitted.

The server has a /ping GET method to check it is up. It returns a ‘pong’ response if it is up.

## Example Usage

```
var SendGridWebhook = require('sendgrid-webhook');

// create new server listening on port 3001
var sgevents = new SendGridWebhook({port: 3001});

sgevents.on('processed', function(email, payload) {
    // email is the email address that generated the event
    // payload is a json object containing the parameters sent by SendGrid
    console.log("Email has been processed");
});
```

## Tests

There is a test suite in the test directory.  It uses Mocha.

```
npm test
```

## To-Do

* Secret key
* Batch events
* SSL

Contributions welcome.

## License

MIT
