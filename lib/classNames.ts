export const classNames = (...args: any[]) => {
  const classes = args.filter(Boolean).join(' ')
  return classes
}
