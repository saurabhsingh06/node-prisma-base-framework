const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

prisma.$use(async (params, next) => {
    console.log(params);
    // # PRE SAVE MIDDLEWARE CODE HERE

    // USER model
    if(params.model == 'User' && params.action == 'create') {
        // Hashing password
        const hashedPassword = bcrypt.hashSync(params.args.data.password, 10);
        params.args.data.password = hashedPassword;
    }

    ////////////////////////////////
    const result = await next(params);
    // # POST SAVE MIDDLEWARE CODE HERE

    /////////////////////////////////
    return result
});

// prisma.$extends({
//     model: {
//         user: {
//             async verifyPassword(password, hashedPassword) {
//                 return bcrypt.compareSync(password, hashedPassword);
//             }
//         }
//     }
// })

module.exports = prisma;