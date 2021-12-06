#!/usr/bin/env node

var amqp = require('amqplib');
const amqpUrl = 'amqp://root:root@localhost:5672/';
var exchange_name = 'pubsub';

amqp.connect(amqpUrl).then(function(conn) {

  process.once('SIGINT', function() { conn.close(); });

  return conn.createChannel().then(function(channel) {
    var chok = channel.assertExchange(exchange_name, 'direct', {
      durable: true
    });
    
    chok.then(function() {
      for (var i = 0; i < 2; i++) {
        sender(i);
      }

      return sender('Selesai');
    });

    return chok;

    function sender(i) {
      channel.publish(exchange_name, '', new Buffer(JSON.stringify({
        message: i
      })));
    }

  });

}).then(null, console.warn);