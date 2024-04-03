const { Prisma, PrismaClient } =require('@prisma/client');
const prisma = new PrismaClient();

module.exports = { Prisma, prisma };