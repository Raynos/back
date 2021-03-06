var http = require('http');
var test = require('tape');

var back = require('../');

test('wooo does exponential backoff work as expected?', function (t) {
  t.plan(3);
  var count = 0,
      timeouts = [1000, 4000, 9000];
  //
  // Options to use for backoff
  //
  // Remark: This object is modified so it should be cloned if you are dealing
  // with independent backoff attempts and want to use these values as a base.
  //
  var backoff = {
    retries: 3,
    minDelay: 1000, // Defaults to 500ms
    maxDelay: 10000, // Defaults to infinity
    // The following option is shown with its default value
    // but you will most likely never define it.
    factor: 2,
  };

  function retry(err) {
    return back(function (fail) {
      if (fail) {
        // Oh noez we never reconnect :(
        return t.end();
      }
      t.ok(backoff.timeout >= timeouts[count++], 'Successful backoff with timeout ' +
           backoff.timeout);
    request();
    }, backoff);
  }

  function request() {
    http.get('http://localhost:9000', function (res) {
      console.log('Successful Response that will not happen!');
    }).on('error', retry);
  }

  request();
});

