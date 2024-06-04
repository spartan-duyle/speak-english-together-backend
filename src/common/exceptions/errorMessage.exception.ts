export const ErrorMessages = {
  AUTH: {
    USER_INACTIVE: 'This user has been deactivated',
    CREDENTIALS_INCORRECT: 'Credentials incorrect',
    INVALID_TOKEN: 'Invalid token',
  },
  USER: {
    USER_NOT_FOUND: 'User not found',
    USER_INVALID: 'User invalid',
    USER_INACTIVE: 'Please activate this user first',
    EMAIL_ALREADY_EXISTS: 'Email already exists',
    PASSWORD_MISMATCH: 'Password does not match',
    EMAIL_ALREADY_CONFIRMED: 'Email already confirmed',
    CURRENT_PASSWORD_INCORRECT: 'Current password is incorrect',
    PASSWORD_SAME: 'New password can not be the same as the current password',
  },

  TOPIC: {
    ALREADY_EXISTS: 'Topic already exists',
    NOT_FOUND: 'Topic not found',
  },

  ROOM: {
    PASSWORD_IS_REQUIRED: 'Password is required for the private room',
    NOT_FOUND: 'Room not found',
    INCORRECT_PASSWORD: 'Password is incorrect',
    FULL_ROOM: 'Room is full',
    USER_ALREADY_IN_ROOM: 'User already in the room',
    CAN_NOT_JOIN_ROOM: 'Can not join this room',
    USER_NOT_IN_ROOM: 'User not in the room',
    USER_IS_JOINING_ANOTHER_ROOM: 'You are joining another room',
  },

  FOLLOWER: {
    CANNOT_FOLLOW_YOURSELF: 'You cannot follow yourself',
    USER_NOT_FOLLOWED: 'User not followed',
  },

  VOCABULARY: {
    NOT_FOUND: 'Vocabulary not found',
  },

  COLLECTION: {
    ALREADY_EXISTS: 'Collection already exists',
    NOT_FOUND: 'Collection not found',
  },

  PARAGRAPH: {
    NOT_FOUND: 'Paragraph not found',
  },
};
