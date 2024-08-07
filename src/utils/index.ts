import { keys } from 'ts-transformer-keys';

export function extractProperties<T extends object>(source: any): Partial<T> {
  // Get the keys of the class prototype
  const classKeys = keys<T>();

  console.log(classKeys, ' here');
  // Extract only the properties that exist in both the source object and the class prototype
  const result: Partial<T> = {};

  for (const key of classKeys) {
    if (key in source) {
      result[key as keyof T] = source[key];
    }
  }

  return result;
}
