import { ApolloServer } from "apollo-server"
import fs from 'fs'
import { fileURLToPath } from "node:url";
import path from 'path'
import { Task, PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const resolvers = {
  Query: {
    task: async (parent: any, args: Task[], context: {prisma: PrismaClient}) => {
      return context.prisma.task.findMany()
    },
  },
  Mutation: {
    post: (parent: any, args: { name: string, description: string, status: string }, context: {prisma: PrismaClient}) => {
      const newTask = context.prisma.task.create({
        data: {
          name: args.name,
          description: args.description,
          status: args.status
        }
      })
      return newTask
    }
  }
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const server = new ApolloServer({
  typeDefs: fs.readFileSync(path.join(__dirname, 'schema.graphql'), 'utf-8'),
  resolvers,
  context: {
    prisma
  }
})

server.listen().then((a: {}) => console.log('サーバー起動中'))
