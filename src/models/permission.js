const { permission } = require('../middlewares');

const actions = {
  DELETE_CHAT: 'DELETE_CHAT',
  DELETE_BOOK: 'DELETE_BOOK',
  DELETE_FILE: 'DELETE_FILE',
  DELETE_USER: 'DELETE_USER',
  EDIT_CHAT: 'EDIT_CHAT',
  EDIT_BOOK: 'EDIT_BOOK',
  EDIT_FILE: 'EDIT_FILE',
  EDIT_USER: 'EDIT_USER',
  CREATE_CHAT: 'CREATE_CHAT',
  CREATE_BOOK: 'CREATE_BOOK',
  CREATE_FILE: 'CREATE_FILE',
  CREATE_USER: 'CREATE_USER',
  READ_CHAT: 'READ_CHAT',
  READ_BOOK: 'READ_BOOK',
  READ_FILE: 'READ_FILE',
  READ_USER: 'READ_USER',
};

const roles = {
  ADMIN: {
    role: 'ADMIN',
    permissions: Object.keys(actions),
  },
  USER: {
    role: 'USER',
    permissions: [
      actions.READ_BOOK,
      actions.READ_USER,
      actions.READ_FILE,
      actions.READ_CHAT,
      actions.CREATE_CHAT,
      actions.CREATE_FILE,
      actions.CREATE_BOOK,
    ],
  },
  GUESS: {
    role: 'GUESS',
    permissions: [actions.READ_FILE],
  },
};

module.exports = { actions, roles };