
import amqp from 'amqplib';
import dotenv from "dotenv"

dotenv.config()
const startserver = async () => {  
  console.log('server running');
  
  try {
    const conn = await amqp.connect(
      process.env.RMQ || ''
    );
    const channel =  await conn.createChannel();
    await channel.assertQueue('rpc_queue', { durable: false });
    channel.prefetch(1);
    console.log('[x] Awaiting RPC req.');
    channel.consume('rpc_queue', (msg) => {
        console.log('reply: ', msg);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        channel.sendToQueue(msg!.properties.replyTo,
            Buffer.from('joehoew'), {
                correlationId: msg!.properties.correlationId
            });
            channel.ack(msg!);
        })
  } catch (e) {
    console.log(e);
  }
}
export default startserver
