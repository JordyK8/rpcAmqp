import * as Amqp from "amqp-ts";
const createConnection = (x: string, q:string): Amqp.Exchange => {

  const connection = new Amqp.Connection(
    "amqps://uwvxzylj:wzSumfPnL--TuRvAH9yaoYMIHZKRP6ie@kangaroo.rmq.cloudamqp.com/uwvxzylj"
  );
  
  const exchange = connection.declareExchange(x);
  const queue = connection.declareQueue(q);
  queue.bind(exchange);
  queue.activateConsumer((message) => {
    console.log("Message received: " + message.getContent());
    message.ack();
  });
  return exchange;
}

const generateMessage = (data: string, x: Amqp.Exchange) => {
  x.send(new Amqp.Message(data));
}
export default {
  generateMessage,
  createConnection,
}