import '../styles/globals.css'
import Link from 'next/link'

function MyApp({ Component, pageProps }) {
  return (
    <div>
      <nav className="border-b p-6">
        <p className="text-4xl font-bold">Freemarket</p>
        <div className="flex mt-4">
          <Link href="/">
            <a className="mr-4 text-pink-500">
              Catalogue
            </a>
          </Link>
          <Link href="/sell">
            <a className="mr-6 text-pink-500">
              Sell
            </a>
          </Link>
          <Link href="/my-shop">
            <a className="mr-6 text-pink-500">
              My shop
            </a>
          </Link>
          <Link href="/my-receipts">
            <a className="mr-6 text-pink-500">
              My receipts
            </a>
          </Link>
        </div>
      </nav>
      <Component {...pageProps} />
    </div>
  )
}

export default MyApp