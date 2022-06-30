/**
 * Format the time as hh:mm:ss, dropping the hour part if it is zero.
 * @param seconds - the number of seconds in the duration
 * @returns the duration in a human-friendly format
 */
export const timeFmt = (seconds: number): string => {
  const date = new Date(0)
  date.setSeconds(Number.isFinite(seconds) ? seconds : 0)
  return date.toISOString().substr(11, 8).replace(/^00:/, '')
}
