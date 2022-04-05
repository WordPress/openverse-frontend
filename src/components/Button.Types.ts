export const buttonVariants = [
  'primary',
  'secondary',
  'tertiary',
  'action-menu',
  'action-menu-secondary',
  'action-menu-muted',
  'plain',
  'plain-dangerous',
  'full',
] as const
export type ButtonVariant = typeof buttonVariants[number]
export const buttonTypes = ['button', 'submit', 'reset'] as const
export type ButtonType = typeof buttonTypes[number]
