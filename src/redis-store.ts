
import { OpenAIEmbeddings } from 'langchain/embeddings/openai'
import { RedisVectorStore } from 'langchain/vectorstores/redis'
import { createClient } from 'redis'

export const redis = createClient({
  url: 'redis://localhost:6379'
})

export const redisVectorStore = new RedisVectorStore(
  new OpenAIEmbeddings({ openAIApiKey: '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' }),
  {
    indexName: 'gpt-embeddings',
    redisClient: redis,
    keyPrefix: 'gpt-answers',
  }  
)