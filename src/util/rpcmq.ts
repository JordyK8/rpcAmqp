
import amqp from 'amqplib/callback_api'
amqp.connect("amqps://uwvxzylj:wzSumfPnL--TuRvAH9yaoYMIHZKRP6ie@kangaroo.rmq.cloudamqp.com/uwvxzylj"
, function(error0, connection) {
    if (error0) {
        throw error0;
    }
    connection.createChannel(function(error1, channel) {
        if (error1) {
            throw error1;
        }
        const queue = 'rpc_queue';

        channel.assertQueue(queue, {
            durable: false
        });
        channel.prefetch(1);
        console.log(' [x] Awaiting RPC requests');
        channel.consume(queue, function reply(msg) {
            
            const n = parseInt(msg!.content.toString());

            console.log(" [.] fib(%d)", n);

            const r = fibonacci(n);

            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            channel.sendToQueue(msg!.properties.replyTo,
                Buffer.from(r.toString()), {
                    correlationId: msg!.properties.correlationId
                });

            channel.ack(msg!);
        });
    });
});

function fibonacci(n: number):number {
    if (n === 0 || n === 1)
        return n;
    else
        return fibonacci(n - 1) + fibonacci(n - 2);
}
import './client';
