const { PrismaClient } = require('@prisma/client');
const { sendLog } = require('../../third_party/rabbit_mq/services');
const { sendNotification } = require('../../third_party/firebase/services');

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
            },
            include: {
                information: true,
            }
        });

        if(!exist) throw({
            status: 404,
            message: 'User does not exist!'
        });

        const res = await prisma.account.update({
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

        await sendLog({
            data: {
                method: 'UPDATE',
                oldData: exist,
                newData: res,
                sender: authenticate,
            }
        });

        console.log('sini');

        await sendNotification({ authenticate });
    } catch (error) {
        throw (error)
    }
}