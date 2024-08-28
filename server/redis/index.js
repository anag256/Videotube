import Redis from "ioredis";

const pub = new Redis({
  host: "localhost",
  port: 6379,
});
const sub = new Redis({
  host: "localhost",
  port: 6379,
});

export { pub, sub };
