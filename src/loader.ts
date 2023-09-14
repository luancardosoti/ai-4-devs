import path from 'node:path'

import { DirectoryLoader } from 'langchain/document_loaders/fs/directory'
import { JSONLoader } from 'langchain/document_loaders/fs/json'
import { OpenAIEmbeddings } from 'langchain/embeddings/openai'
import { TokenTextSplitter } from 'langchain/text_splitter'
import { RedisVectorStore } from 'langchain/vectorstores/redis'

import { createClient } from 'redis'

const loader = new DirectoryLoader(
  path.resolve(__dirname, '../tmp'),
  {
    '.json': path => new JSONLoader(path, '/text'),
  }
)

async function load() {
  const docs = await loader.load()
  
  const splitter = new TokenTextSplitter({
    encodingName: 'cl100k_base',
    chunkSize: 400,
    chunkOverlap: 0
  })

  const splittedDocuments = await splitter.splitDocuments(docs)

  const redis = createClient({
    url: 'redis://localhost:6379'
  })

  await redis.connect()
  
  await RedisVectorStore.fromDocuments(
    splittedDocuments,
    new OpenAIEmbeddings({ openAIApiKey: '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' }),
    {
      indexName: 'gpt-embeddings',
      redisClient: redis,
      keyPrefix: 'gpt-answers',
    }  
  )

  await redis.disconnect()
}

load()