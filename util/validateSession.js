const { Session } = require('../models')

const validateSession = async ({id, token}) => {
    const session = await Session.findOne({
        where: {
            userId: id,
            token: token
        }
    })
    if (!session) {
        return false
    }
    return true
}

module.exports = validateSession
