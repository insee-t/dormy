import { createClient } from 'redis';

export const redisClient = createClient({
    username: 'default',
    password: 'e40WhQKJdvGwlgtdHTxet8SKIR9m2Jve',
    socket: {
        host: 'redis-19520.crce194.ap-seast-1-1.ec2.redns.redis-cloud.com',
        port: 19520
    }
});

redisClient.on('error', err => console.log('Redis Client Error', err));

await redisClient.connect();

await redisClient.set('foo', 'bar');
const result = await redisClient.get('foo');
console.log(result)  // >>> bar
