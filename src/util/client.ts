
import amqp from 'amqplib';

const startclient = async () => {  
  console.log('client running');
  
  const conn = await amqp.connect(
    "amqps://uwvxzylj:wzSumfPnL--TuRvAH9yaoYMIHZKRP6ie@kangaroo.rmq.cloudamqp.com/uwvxzylj"
  );
  const channel = await conn.createChannel();
  const queue = await channel.assertQueue('', { exclusive: true });
  const correlationId = generateUuid();
  const num = parseInt('2');
  console.log(' [x] Requesting fib(%d)', num);
  channel.consume(queue.queue, (msg) => {
    console.log(msg);
    
    if (msg!.properties.correlationId == correlationId) {
      console.log(' [.] Got %s', msg!.content.toString());
      setTimeout(function() {
        conn.close();
        process.exit(0)
      }, 500);
    }
  }, {
    noAck: true
  });
  channel.sendToQueue('rpc_queue',
        Buffer.from(num.toString()),{
          correlationId: correlationId,
          replyTo: queue.queue });
}

function generateUuid() {
  return Math.random().toString() +
         Math.random().toString() +
         Math.random().toString();
}

export default startclient