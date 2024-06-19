import { plainToInstance } from 'class-transformer';

export function plainToInstanceCustom(model: any, response: any): any {
  return plainToInstance(model, response, {
    excludeExtraneousValues: true,
    enableImplicitConversion: true,
    strategy: 'excludeAll',
  });
}

export function removeSpaces(input: string): string {
  return input.replace(/\s+/g, '');
}
