import { ApolloServer } from "apollo-server";
import fs from 'fs';
import { fileURLToPath } from "node:url";
import path from 'path';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const resolvers = {
    Query: {
        task: async (parent, args, context) => {
            return context.prisma.task.findMany();
        },
    },
    Mutation: {
        post: (parent, args, context) => {
            const newTask = context.prisma.task.create({
                data: {
                    name: args.name,
                    description: args.description,
                    status: args.status
                }
            });
            return newTask;
        },
        deleteTask: async (parent, args, context) => {
            console.log(args.id);
            await context.prisma.task.delete({
                where: {
                    id: args.id
                }
            });
            return true;
        }
    }
};
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const server = new ApolloServer({
    typeDefs: fs.readFileSync(path.join(__dirname, 'schema.graphql'), 'utf-8'),
    resolvers,
    context: {
        prisma
    }
});
server.listen().then((a) => console.log('サーバー起動中'));
