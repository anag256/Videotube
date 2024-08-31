import Redis from "ioredis";

console.log("redis host",process.env.REDIS_HOST);
const pub = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
});
const sub = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
});

export { pub, sub };
