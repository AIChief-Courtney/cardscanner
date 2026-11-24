import { ShieldCheck, Wallet } from "lucide-react";
import { formatUsd } from "@/lib/money";
import { ImageConverter } from "./image-converter";
import styles from "./dashboard.module.css";

export function Dashboard({ email, balanceUsd }: { email: string; balanceUsd: string }) {
  return (
    <main id="main-content" className={styles.workspace}>
      <header className={styles.heading}>
        <h1>Image converter</h1>
        <p>Convert JPG, PNG, and WebP images directly in your browser.</p>
      </header>

      <div className={styles.layout}>
        <ImageConverter />

        <aside className={styles.account} aria-labelledby="dashboard-account">
          <h2 id="dashboard-account">Your account</h2>
          <dl>
            <div>
              <dt>Signed in as</dt>
              <dd>{email}</dd>
            </div>
            <div>
              <dt><Wallet size={16} aria-hidden /> Balance</dt>
              <dd className={styles.balance}>{formatUsd(balanceUsd)}</dd>
            </div>
            <div>
              <dt><ShieldCheck size={16} aria-hidden /> Session</dt>
              <dd>Active</dd>
            </div>
          </dl>
        </aside>
      </div>
    </main>
  );
}
