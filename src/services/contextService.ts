import { createNamespace, getNamespace, Namespace } from 'cls-hooked'

export const getOrCreateContext = (key = 'ctx'): Namespace => {
  const ctx = getNamespace(key)
  if (ctx) return ctx
  return createNamespace(key)
}

export const getCorrelationId = (): string | null => {
  return getOrCreateContext().get('correlationId')
}
