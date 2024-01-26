const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

exports.updateInfo = async ({
    profile,
    phone,
    userId,
    authenticate,
}) => {
    try {
        const exist = await prisma.account.findUnique({
            where: {
                id: authenticate?.role === 'admin' ? userId : authenticate?.id
            }
        });

        if(!exist) throw({
            status: 404,
            message: 'User does not exist!'
        });

        await prisma.account.update({
            where: {
                id:  authenticate?.role === 'admin' ? userId : authenticate?.id
            }, 
            data: {
                phone: phone,
                information: {
                    connect: {
                        accountId:  authenticate?.role === 'admin' ? userId : authenticate?.id,
                    },
                    update: {
                        profile: profile
                    }
                }
            },
            include: {
                information: true
            }
        });
    } catch (error) {
        throw (error)
    }
}