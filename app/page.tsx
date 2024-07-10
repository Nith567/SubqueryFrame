import styles from './page.module.css'
import { ethers } from 'ethers'
export default function Home() {

  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <h1 className={styles.title}>Welcome to the SubQuery Platform</h1>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <p>
            Head to{' '}
            <a
              href="/api/dev"
              style={{ display: 'inline', fontWeight: 'semibold' }}
            >
              <code className={styles.code}>NEXT_PUBLIC_SITE_URL/api</code>
            </a>{' '}
          for frame endpoint
          </p>
        </div>
      </div>
    </main>
  )
}
