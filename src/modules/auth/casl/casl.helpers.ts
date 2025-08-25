import { Action, Subject } from './casl.enum';
import { CaslActionMessage, CaslMessage } from './casl.constants';

export function getUserTypeName(userType: unknown): string {
  if (!userType) return '';
  if (typeof userType === 'string') return userType;
  if (typeof userType === 'number') return String(userType);
  if (typeof userType === 'object' && (userType as any).typeName) {
    return String((userType as any).typeName);
  }
  return '';
}

export function isValidAction(action: Action): boolean {
  return Object.values(Action).includes(action);
}

export function isValidSubject(subject: Subject): boolean {
  return Object.values(Subject).includes(subject);
}

export function resolveForbiddenMessage(action: Action): string {
  const key = (
    action as unknown as string
  ).toUpperCase() as keyof typeof CaslActionMessage;
  return CaslActionMessage[key] ?? CaslMessage.FORBIDDEN;
}
