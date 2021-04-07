declare interface Window {
  Mtu: {
    toast(msg: string, time?: number): void
    dialog(option?: {
      title?: string
      message?: string
      positive?: string
      onPositive?(): void
      negative?: string
      onNegative?(): void
      onClose?(): void
      size?: 'none' | 'medium' | 'full'
    }): void
  }
}