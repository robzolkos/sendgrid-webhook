var SendGrid = require('../index');
var request = require('request');
var assert = require('assert');
var sgevents = new SendGrid();

describe('SendGrid Webhook Server',function(){

  before(function() {
  });

  it("returns pong on GET /ping", function(done) {
    request.get('http://localhost:3000/ping', function(err, res, body) {
      assert.equal(res.body, "pong");
      done();
    });
  })

  describe("on GET requests", function() {
    it("emits a 'request_error' event", function(done) {
      request.get('http://localhost:3000/foo', function(req, res) {
        sgevents.on("request_error", function(err) {
          assert.equal(err, "Only POST requests allowed.");
        });
        done();
      });
    });

    it("responds with a 500 status", function(done) {
      request.get('http://localhost:3000/foo', function(req, res) {
        assert.equal(res.statusCode, 500);
        done();
      });
    });
  });

  describe("on POST requests", function() {
    it("emits a 'processed' event", function(done) {
      sgevents.on("processed", function(email, payload) {
        assert.equal(email, "test@example.com");
        assert.equal(payload.event, "processed");
      });
      request.post('http://localhost:3000?event=processed&email=test@example.com', function(req, res) {
        done();
      });
    });

    it("emits a 'dropped' event", function(done) {
      sgevents.on("dropped", function(email, payload) {
        assert.equal(email, "test@example.com");
        assert.equal(payload.event, "dropped");
      });
      request.post('http://localhost:3000?event=dropped&email=test@example.com', function(req, res) {
        done();
      });
    });

    it("emits a 'delivered' event", function(done) {
      sgevents.on("delivered", function(email, payload) {
        assert.equal(email, "test@example.com");
        assert.equal(payload.event, "delivered");
      });
      request.post('http://localhost:3000?event=delivered&email=test@example.com', function(req, res) {
        done();
      });
    });

    it("emits a 'deferred' event", function(done) {
      sgevents.on("deferred", function(email, payload) {
        assert.equal(email, "test@example.com");
        assert.equal(payload.event, "deferred");
      });
      request.post('http://localhost:3000?event=deferred&email=test@example.com', function(req, res) {
        done();
      });
    });

    it("emits a 'bounce' event", function(done) {
      sgevents.on("bounce", function(email, payload) {
        assert.equal(email, "test@example.com");
        assert.equal(payload.event, "bounce");
      });
      request.post('http://localhost:3000?event=bounce&email=test@example.com', function(req, res) {
        done();
      });
    });

    it("emits a 'open' event", function(done) {
      sgevents.on("open", function(email, payload) {
        assert.equal(email, "test@example.com");
        assert.equal(payload.event, "open");
      });
      request.post('http://localhost:3000?event=open&email=test@example.com', function(req, res) {
        done();
      });
    });

    it("emits a 'click' event", function(done) {
      sgevents.on("click", function(email, payload) {
        assert.equal(email, "test@example.com");
        assert.equal(payload.event, "click");
      });
      request.post('http://localhost:3000?event=click&email=test@example.com', function(req, res) {
        done();
      });
    });

    it("emits a 'spamreport' event", function(done) {
      sgevents.on("spamreport", function(email, payload) {
        assert.equal(email, "test@example.com");
        assert.equal(payload.event, "spamreport");
      });
      request.post('http://localhost:3000?event=spamreport&email=test@example.com', function(req, res) {
        done();
      });
    });

    it("emits a 'unsubscribe' event", function(done) {
      sgevents.on("unsubscribe", function(email, payload) {
        assert.equal(email, "test@example.com");
        assert.equal(payload.event, "unsubscribe");
      });
      request.post('http://localhost:3000?event=unsubscribe&email=test@example.com', function(req, res) {
        done();
      });
    });

    it("emits a 'event_error' event on an unknown event", function(done) {
      sgevents.on("event_error", function(err) {
        assert.equal(err, "Unknown SendGrid event.");
      });
      request.post('http://localhost:3000?event=foo&email=test@example.com', function(req, res) {
        done();
      });
    });

  });

});

