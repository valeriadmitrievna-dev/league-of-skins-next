export const register = async () => {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { initScheduler } = await import('./lib/init-scheduler')
    initScheduler()
  }
}