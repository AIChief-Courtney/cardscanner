import { Cloud, Database, File, FileLock2, LockKeyhole, Shield, Wallet } from "lucide-react";
import Link from "next/link";
import { formatUsd } from "@/lib/money";
import { ImageConverter } from "./image-converter";
import { DashboardHeader } from "./dashboard-header";
import { ReferenceFooter } from "./reference-footer";
import styles from "./dashboard.module.css";

const features = [
  { icon: File, title: "Convert Any File", text: "FreeConvert supports more than 1500 file conversions. You can convert videos, images, audio files, or e-books. There are tons of Advanced Options to fine-tune your conversions." },
  { icon: Cloud, title: "Works Anywhere", text: "FreeConvert is an online file converter. So it works on Windows, Mac, Linux, or any mobile device. All major browsers are supported. Simply upload a file and select a target format." },
  { icon: Shield, title: "Privacy Guaranteed", text: "We know that file security and privacy are important to you. That is why we use 256-bit SSL encryption when transferring files and automatically delete them after 8 hours." },
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
            <p>Easily convert files from one format to another, online.</p>
          </header>

          <ImageConverter />

          <section id="features" className={styles.features} aria-label="Converter features">
            <span className={styles.referenceLabel}>FreeConvert reference content</span>
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
              <p>At FreeConvert, we go beyond just converting files—we protect them. Our robust security framework ensures that your data is always safe, whether you're converting an image, video, or document. With advanced encryption, secure data centers, and vigilant monitoring, we've covered every aspect of your data's safety.</p>
              <Link href="/security-and-compliance">Learn more about our commitment to security</Link>
            </div>
            <ul>
              <li><FileLock2 size={17} aria-hidden /> SSL/TLS Encryption</li>
              <li><Database size={17} aria-hidden /> Secured Data Centers</li>
              <li><LockKeyhole size={17} aria-hidden /> Access Control and Authentication</li>
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

      <div className={styles.footerOffset}>
        <ReferenceFooter />
      </div>
    </div>
  );
}
