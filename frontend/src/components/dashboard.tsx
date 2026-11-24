import { Cloud, File, Globe, LockKeyhole, Shield, Wallet } from "lucide-react";
import { formatUsd } from "@/lib/money";
import { ImageConverter } from "./image-converter";
import { DashboardHeader } from "./dashboard-header";
import styles from "./dashboard.module.css";

const features = [
  { icon: File, title: "Convert Images", text: "Change your images between JPG, PNG, and WebP. Choose a file from your device, select an output format, and download the result." },
  { icon: Cloud, title: "Works Anywhere", text: "Use OnlineConvert on your desktop, laptop, or phone. Open the converter in your browser to get started." },
  { icon: Shield, title: "Private by Design", text: "Your browser processes the image and saves the converted file directly to your device." },
];

export function Dashboard({ email, balanceUsd }: { email: string; balanceUsd: string }) {
  return (
    <div className={styles.shell}>
      <DashboardHeader />

      <main id="main-content" className={styles.workspace}>
        <div className={styles.rail} aria-hidden="true" />
        <div className={styles.content}>
          <header className={styles.heading}>
            <h1>File Converter</h1>
            <p>Convert JPG, PNG, and WebP images online.</p>
          </header>

          <ImageConverter />

          <section id="features" className={styles.features} aria-label="Converter features">
            {features.map(({ icon: Icon, title, text }) => (
              <article key={title}>
                <Icon size={23} strokeWidth={1.25} aria-hidden />
                <h2>{title}</h2>
                <p>{text}</p>
              </article>
            ))}
          </section>

          <section id="privacy" className={styles.privacy} aria-labelledby="privacy-heading">
            <div>
              <h2 id="privacy-heading">Your Data, Our Priority</h2>
              <p>OnlineConvert processes images locally in your browser. Your selected image stays on your device throughout the conversion.</p>
              <a href="#converter">Back to the converter</a>
            </div>
            <ul>
              <li><LockKeyhole size={17} aria-hidden /> Local processing</li>
              <li><Shield size={17} aria-hidden /> Direct downloads</li>
              <li><Globe size={17} aria-hidden /> Browser-based conversion</li>
            </ul>
          </section>

          <section id="account" className={styles.account} aria-labelledby="account-heading">
            <h2 id="account-heading">Your account</h2>
            <p>{email}</p>
            <p className={styles.balance}><Wallet size={16} aria-hidden /> Balance {formatUsd(balanceUsd)}</p>
          </section>
        </div>
        <div className={styles.rail} aria-hidden="true" />
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <nav aria-label="Footer navigation" className={styles.footerNav}>
            <div><h2>Convert</h2><a href="#converter">Image converter</a></div>
            <div><h2>Features</h2><a href="#features">Supported formats</a></div>
            <div><h2>Privacy</h2><a href="#privacy">Local conversion</a></div>
            <div><h2>Account</h2><a href="#account">Account balance</a></div>
          </nav>
          <div className={styles.footerBottom}>
            <a href="#main-content"><strong>OnlineConvert</strong></a>
            <small>© {new Date().getFullYear()} OnlineConvert</small>
            <span><Globe size={13} aria-hidden /> English</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
