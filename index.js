var http = require('http'),
    util = require('util'),
    url = require('url'),
    EventEmitter = require('events').EventEmitter;

function SendGridWebhook (options) {

    var self = this;

    if (!options) {
      options = {};
    }

    EventEmitter.call(this);

    this.httpPort = options.port || 3000;

    this.allowedTypes = [
                         'processed',
                         'dropped',
                         'delivered',
                         'deferred',
                         'bounce',
                         'open',
                         'click',
                         'spamreport',
                         'unsubscribe'
                        ];

    var server = http.createServer(function (request, response) {

        var requestBody = '';
        var requestUrl = url.parse(request.url, true);

        if (request.method === 'GET' && request.url === '/ping') {
            response.writeHead(200, { 'Content-Type' : 'text/plain' });
            response.end("pong");
            return;
        }

        if (request.method !== 'POST') {
            self.emit('request_error', 'Only POST requests allowed.');
            response.writeHead(500, { 'Content-Type' : 'text/plain' });
            response.end();
            return;
        }

        request.on('data', function (chunk) {
            requestBody += chunk;
        });

        request.on('end', function () {
            var payload   = requestUrl.query;
            var eventType = payload.event;
            var email     = payload.email;

            if (eventType && ~self.allowedTypes.indexOf(eventType)) {
                self.emit(eventType, email, payload);
                response.writeHead(200, { 'Content-Type' : 'text/plain' });
                response.end();
            } else {
                self.emit('event_error', 'Unknown SendGrid event.');
                response.writeHead(500, { 'Content-Type' : 'text/plain' });
                response.end();
            }

        });

    });
    server.listen(this.httpPort);
}

util.inherits(SendGridWebhook, EventEmitter);
module.exports = SendGridWebhook;
