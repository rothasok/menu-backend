
// The name of each response payload should be model name defined in Request model schema.

// The name of each response payload should be  model name defined in Request model schema and should sufix with ResponseModel.

module.exports = {
    createBook: {
        201: {
            message: {
                type: 'Successfully created book'
            }
        },
        500: {
            internal: {
                type: 'Internal server error!'
            }
        }
    },
    getAllBooks: {
        200: {
            docs: {
                type: 'array',
                items: {
                    type: 'object'
                }
            },
            totalDocs: {
                type: 'number'
            },
            limit: {
                type: 'number'
            },
            totalPages: {
                type: 'number'
            },
            page: {
                type: 'number'
            },
            pagingCounter: {
                type: 'number'
            },
            hasPrevPage: {
                type: 'boolean'
            },
            hasNextPage: {
                type: 'boolean'
            },
            prevPage: {
                type: 'string'
            },
            nextPage: {
                type: 'string'
            }
        }
    }
};