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
    post: (parent: any, args: { name: string, description: string, index: number, status: string }, context: {prisma: PrismaClient}) => {
      const newTask = context.prisma.task.create({
        data: {
          name: args.name,
          description: args.description,
          index: args.index,
          status: args.status
        }
      })
      return newTask
    },
    deleteTask: async (parent: any, args: {id: number}, context: {prisma: PrismaClient}) => {
      const task = await prisma.task.findUnique({
        where: {
          id: args.id
        },
      })

      if (!task) {
        return {
          errors: [
            {
              message: "削除対象のタスクがありません",
            }
          ],
          task: null,
        }
      }

      await context.prisma.task.delete({
        where: {
          id: args.id
        }
      });

      return {
        errors: [],
        task,
      }
    },
    updateTask:async (parent: any, args: {id: number,status: string, index: number}, context: {prisma: PrismaClient}) => {
      const updateTask = await prisma.task.update({
      data: {
        status: args.status,
        index: args.index
      },
      where: {
        id: args.id
      }
    });

    return {
      errors: [],
      task: updateTask,
    };
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
