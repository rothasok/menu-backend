
// The name of each response payload should be model name defined in Request model schema.

// The name of each response payload should be  model name defined in Request model schema and should sufix with ResponseModel.

module.exports = {
    Login: {
        201: {
            message: {
                type: 'Successfully login'
            }
        },
        500: {
            internal: {
                type: 'Internal server error!'
            }
        },
        404:{
            message:{
                type:'User not found!'
            }
        },
        403:{
            message:{
                type:'Account is inactive'
            }
        },
        401:{
            message:{
                type:'Incorrect email or password'
            }
        }
    },
   
};