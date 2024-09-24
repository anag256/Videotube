import Redis from "ioredis";
let redisConnection={
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
};
if (process.env.environment === "prod") {
  redisConnection = process.env.REDIS_CONNECTION_STRING;
}
const pub = new Redis(redisConnection);
const sub = new Redis(redisConnection);

export { pub, sub };
