import * as Amqp from "amqp-ts";
import dotenv from "dotenv"

dotenv.config()
const createConnection = (x: string, q:string): Amqp.Exchange => {

  const connection = new Amqp.Connection(
    process.env.RMQ
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