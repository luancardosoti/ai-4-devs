import { redis, redisVectorStore } from "./redis-store"

async function search() {
  await redis.connect()

  const response = await redisVectorStore.similaritySearchWithScore(
    'quais frameworks do mundo javascript a google cuida?',
    4
  )

  await redis.disconnect()
}

search()