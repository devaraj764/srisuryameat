const data = require('./replicate.json')
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

const insertProducts = async () => {
    try {
        await prisma.product.deleteMany();
        await prisma.product.createMany({ data });
        console.log("products seeded successfully");
    } catch (error) {
        console.log(error)
    }
};

const replicateProducts = async () => {
    try {
        const result = await prisma.product.findMany({
            select: {
                name: true,
                category: true,
                thumbnail: true,
                inStock: true,
                description:true,
                prices:true
            }
        });
        console.log("products replicated successfully successfully");
        const jsonData = JSON.stringify(result, null, 2);
        fs.writeFileSync('seed/replicate.json', jsonData);
    } catch (error) {
        console.log(error)
    }
};

insertProducts();
// replicateProducts();
