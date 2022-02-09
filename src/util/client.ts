
import amqp from 'amqplib/callback_api';
import { channel } from 'diagnostics_channel';


amqp.connect("amqps://uwvxzylj:wzSumfPnL--TuRvAH9yaoYMIHZKRP6ie@kangaroo.rmq.cloudamqp.com/uwvxzylj"
, function(error0, connection) {
  if (error0) {
    throw error0;
  }
  connection.createChannel(function(error1, channel) {
    if (error1) {
      throw error1;
    }
    channel.assertQueue('', {
      exclusive: true
    }, function(error2, q) {
      if (error2) {
        throw error2;
      }
      const correlationId = generateUuid();
      const num = parseInt('2');

      console.log(' [x] Requesting fib(%d)', num);

      channel.consume(q.queue, function(msg) {
        if (msg!.properties.correlationId == correlationId) {
          console.log(' [.] Got %s', msg!.content.toString());
          setTimeout(function() {
            connection.close();
            process.exit(0)
          }, 500);
        }
      }, {
        noAck: true
      });
    
    });
  });
});

function generateUuid() {
  return Math.random().toString() +
         Math.random().toString() +
         Math.random().toString();
}

export default channel