import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import Navbar from '@/components/Navbar'
import { AuthProvider } from '@/context/auth'

// ここにNavbarを入れると全てのページに反映される
export default function App({ Component, pageProps }: AppProps) {
  return (
    <div>
      {/* Authproviderでラップすることにより間に挟まれた部分がchirdrenとして認識され
      どのコンポーネントでもvalueがglobalで使えるようになる */}
      <AuthProvider>
        <Navbar />
        <Component {...pageProps} />
      </AuthProvider>
    </div>
  )
}
