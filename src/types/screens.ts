export type Breakpoint = '2xl' | 'xl' | 'lg' | 'md' | 'sm' | 'xs'
export type RealBreakpoint = Exclude<Breakpoint, 'xs'>
export type Viewport = {
  name: string
  styles: { width: string; height: string }
}
