#!/usr/bin/env node

var amqp = require('amqplib');
const amqpUrl = 'amqp://root:root@localhost:5672/';
var exchange_name = 'pubsub-topic';

amqp.connect(amqpUrl).then(function (conn) {

  process.once('SIGINT', function () { conn.close(); });

  return conn.createChannel().then(function (channel) {
    var chok = channel.assertExchange(exchange_name, 'topic', {
      durable: true
    });

    const q = 'hello-assertqueue'
    const msg = 'Hello world!'
    const ok = channel.assertQueue(q, { durable: false })
    ok.then(() => {
      channel.sendToQueue(q, Buffer.from(msg))
      console.log('- Sent', msg)
      return channel.close()
    })

    chok.then(function () {
      for (var i = 0; i < 4; i++) {
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