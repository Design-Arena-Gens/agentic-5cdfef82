import Providers from '../providers'

export default function RoutesLayout({ children }: { children: React.ReactNode }) {
  return <Providers>{children}</Providers>
}
