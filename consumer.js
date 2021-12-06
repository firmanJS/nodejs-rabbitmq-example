const amqplib = require('amqplib');
const amqpUrl = 'amqp://root:root@localhost:5672/';

// direct
// async function processMessage(msg) {
//   console.log(msg.content.toString(), 'Call email API here');
//   //call your email service here to send the email
// }

// (async () => {
//     const connection = await amqplib.connect(amqpUrl, "heartbeat=60");
//     const channel = await connection.createChannel();
//     channel.prefetch(10);
//     const queue = 'user.sign_up_email';
//     process.once('SIGINT', async () => { 
//       console.log('got sigint, closing connection');
//       await channel.close();
//       await connection.close(); 
//       process.exit(0);
//     });

//     await channel.assertQueue(queue, {durable: true});
//     await channel.consume(queue, async (msg) => {
//       console.log('processing messages');      
//       await processMessage(msg);
//       await channel.ack(msg);
//     }, 
//     {
//       noAck: false,
//       consumerTag: 'email_consumer'
//     });
//     console.log(" [*] Waiting for messages. To exit press CTRL+C");
// })();

// fanout type
(async () => {
    const connection = await amqplib.connect(amqpUrl, "heartbeat=60");
    try {
        // Create/Bind a consumer queue for an exchange broker
        const channel = await connection.createChannel()
        await channel.assertExchange('multiple', 'fanout', { durable: false });
        const queue = await channel.assertQueue('', {exclusive: true})
        channel.bindQueue(queue.queue, 'multiple', '')
  
        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C");
        channel.consume('', consumeMessage, {noAck: true});
      } catch(error) {
        console.error(error)
      }
})();