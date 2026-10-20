export const withBase = (path?: string) => {
  if (!path) return path
  const clean = path.startsWith('/') ? path.slice(1) : path
  const baseEnv = import.meta.env.BASE_URL
  const base = baseEnv && baseEnv !== '' ? baseEnv : '/'
  const normalized = base.endsWith('/') ? base : base + '/'
  return normalized + clean
}
