
// The name of each response payload should be model name defined in Request model schema.

// The name of each response payload should be  model name defined in Request model schema and should sufix with ResponseModel.

module.exports = {
    SwithcStatus: {
        200: {
            message: {
                type: 'SuccesUser status updated successfully'
            }
        },
        500: {
            internal: {
                type: 'Internal server error!'
            }
        }
    },
    setRole: {
        200: {
            message: {
                type: 'the role was assigned successfully'
            }
        },
        500: {
            internal: {
                type: 'Internal server error!'
            }
        }
    },
    ChangePassword: {
        200: {
            message: {
                type: 'the password was changed successfully'
            }
        },
        500: {
            internal: {
                type: 'Internal server error!'
            }
        }
    },
};