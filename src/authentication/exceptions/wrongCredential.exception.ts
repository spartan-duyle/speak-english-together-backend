import { BadRequestException } from '@nestjs/common';

export default class WrongCredentialException extends BadRequestException {
  constructor() {
    super('Wrong credentials provided');
  }
}
