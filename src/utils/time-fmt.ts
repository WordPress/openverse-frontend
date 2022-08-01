/**
 * Format the time as hh:mm:ss, dropping the hour part if it is zero.
 * @param seconds - the number of seconds in the duration
 * @returns the duration in a human-friendly format
 */
export const timeFmt = (seconds: number): string => {
  const hrs = ~~(seconds / 3600)
  let mins = (~~((seconds % 3600) / 60)).toString()
  const secs = (~~seconds % 60).toString().padStart(2, '0') // always padded

  const parts = []
  if (hrs > 0) {
    parts.push(hrs)
    mins = mins.padStart(2, '0') // padded only if hours present
  }
  parts.push(mins, secs)
  return parts.join(':')
}
