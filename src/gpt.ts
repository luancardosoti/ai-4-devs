import { RetrievalQAChain } from 'langchain/chains'
import { ChatOpenAI } from 'langchain/chat_models/openai'
import { PromptTemplate } from 'langchain/prompts'
import { redis, redisVectorStore } from './redis-store'

const openAiChat = new ChatOpenAI({
  openAIApiKey: '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',
  modelName: 'gpt-3.5-turbo',
  temperature: 0.3
})

const prompt = new PromptTemplate({
  template: `
    Você responde perguntas sobre programação.
    O usuário está assistindo um curso com várias aulas.
    Use o conteúdo das transcrições das aulas abaixo para responder a pergunta do usuário.
    Se a resposta não for encontrada nas transcrições, responda que você não sabe, não tente inventar uma resposta.

    Se possível, inclua exemplo de código em Javascript e Typecript.


    Transcrições:
    {context}

    Pergunta:
    {question}
  `.trim(),
  inputVariables: ['context', 'question']
})

const chain = RetrievalQAChain.fromLLM(openAiChat, redisVectorStore.asRetriever(3), {
  prompt,
  returnSourceDocuments: true,
  verbose: false
})

async function main() {
  await redis.connect()
  
  const response = await chain.call({
    // query: 'Qual é a lib do facebook?'
    // query: 'quais frameworks do mundo javascript a google cuida?'
    // query: 'qual tecnologias o google cuida sem ser o angular?' // FALHA
    // query: 'como fazer café?'
    // query: 'O que é um componente?'
    // query: 'Qual a diferença entre React, Angular e Next.js?'
    query: 'Qual a vantagem de utilizar Java?'
  })
  
  console.log(response)

  await redis.disconnect()
}

main()