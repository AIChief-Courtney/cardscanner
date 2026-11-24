import type { Metadata } from "next";
import Link from "next/link";
import {
  Activity, CloudCog, DatabaseBackup, FileLock2, FileCheck2, Globe, LockKeyhole, MonitorCheck,
  Network, Phone, Server, ShieldCheck, ShieldEllipsis, ThumbsUp, UserRoundCheck, Workflow,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { DashboardHeader } from "@/components/dashboard-header";
import { safeHeaderUser } from "@/lib/safe-session";
import shell from "@/components/dashboard.module.css";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Security and Compliance",
  description: "FreeConvert’s security and compliance practices, reproduced as reference material.",
};

type SecurityItem = { title: string; icon: LucideIcon; text: ReactNode };

const technology: SecurityItem[] = [
  {
    title: "SSL/TLS Encryption", icon: FileLock2,
    text: "We ensure that all data transmitted between your device and our servers is secured with SSL/TLS encryption. This protects your information from unauthorized access and provides a safe environment for file conversions.",
  },
  {
    title: "Secured Data Centers", icon: CloudCog,
    text: "Our data centers are fortified with multiple layers of physical and digital security. From biometric access controls to 24/7 monitoring, we take every step necessary to safeguard the infrastructure that powers FreeConvert.",
  },
  {
    title: "User Activity Monitoring", icon: Activity,
    text: "We actively monitor user activity to detect any suspicious behavior. Our real-time monitoring tools allow us to respond swiftly to potential security threats, keeping your data safe.",
  },
  {
    title: "Secure API Endpoints", icon: Network,
    text: "Our API endpoints are fortified with industry-standard security protocols, including OAuth2 and API keys, ensuring that only authorized applications can interact securely with our services.",
  },
  {
    title: "Intrusion Detection and Prevention Systems (IDPS)", icon: ShieldCheck,
    text: "Our systems are constantly monitored with advanced IDPS, which detects and prevents unauthorized access and potential threats in real-time, ensuring the integrity of our services.",
  },
  {
    title: "Data Backup and Disaster Recovery", icon: DatabaseBackup,
    text: "We regularly back up data and have a comprehensive disaster recovery plan. This ensures that your data remains safe and accessible even in the event of an unforeseen issue.",
  },
  {
    title: "Secure and Encrypted Access via VPNs", icon: ShieldEllipsis,
    text: "Access to our servers is restricted and secured through encrypted VPN connections, ensuring that only authorized personnel can manage and interact with our systems.",
  },
  {
    title: "Reliable Uptime", icon: MonitorCheck,
    text: <>We continuously monitor our services and servers, achieving a 99.8% uptime for seamless file conversions. Check our <a href="https://status.freeconvert.com/">status page</a> for real-time updates on system performance and availability.</>,
  },
  {
    title: "Data Isolation", icon: Server,
    text: "Our software and infrastructure were built with customer data isolation as a core principle. Every conversion operates within its own dedicated, isolated container. These containers are short-lived and completely independent, with no access to other files being processed in the system.",
  },
];

const practices: SecurityItem[] = [
  {
    title: "Compliance with Industry Standards", icon: ThumbsUp,
    text: "We adhere to widely recognized security practices to ensure the highest level of data protection. Our commitment to maintaining robust security protocols reflects our dedication to meeting customers' expectations and staying ahead of evolving security challenges.",
  },
  {
    title: "Access Control and Authentication", icon: LockKeyhole,
    text: "We enforce strict access control policies and multi-factor authentication (MFA) to ensure that only authorized users can access sensitive data and systems, reducing the risk of unauthorized access.",
  },
  {
    title: "Privacy Policy and Data Protection", icon: FileCheck2,
    text: "We take your privacy seriously. Our comprehensive privacy policy outlines how we handle your data with the utmost care, ensuring your information remains confidential and secure.",
  },
  {
    title: "Security Training and Awareness", icon: UserRoundCheck,
    text: "Our team is regularly trained on the latest security threats and best practices. By fostering a culture of security awareness, we ensure that our staff is well-equipped to protect your data.",
  },
  {
    title: "Secure Software Development Lifecycle", icon: Workflow,
    text: "Security is embedded in every stage of our software development process. From design to deployment, we follow a secure SDLC to identify and mitigate potential vulnerabilities before they can be exploited.",
  },
  {
    title: "Incident Response Plan", icon: Phone,
    text: "We have a robust incident response plan in place. In the unlikely event of a security incident, our team is prepared to act quickly and effectively to mitigate risks and restore security.",
  },
];

const referenceFooter = [
  ["Video Converter", "MP4 Converter", "Video to GIF", "MOV to MP4", "Video Converter"],
  ["Audio Converter", "MP3 Converter", "MP4 to MP3", "Video to MP3", "Audio Converter"],
  ["Image Converter", "JPG to PDF", "PDF to JPG", "HEIC to JPG", "Image to PDF", "Image Converter"],
  ["Document & Ebook", "PDF to Word", "EPUB to PDF", "EPUB to MOBI", "Document Converter"],
  ["Archive & Time", "RAR to Zip", "PST to EST", "CST to EST", "Archive Converter"],
  ["Unit Converter", "Lbs to Kg", "Kg to Lbs", "Feet to Meters", "Unit Converter"],
  ["Web Apps", "Collage Maker", "Image Resizer", "Crop Image", "Color Picker"],
  ["Mobile Apps", "Collage Maker Android", "Collage Maker iOS", "Image Converter Android", "Image Converter iOS"],
];

function SecuritySection({ id, title, items }: { id: string; title: string; items: SecurityItem[] }) {
  return (
    <section className={styles.section} aria-labelledby={id}>
      <h2 id={id}>{title}</h2>
      <div className={styles.grid}>
        {items.map(({ title, icon: Icon, text }) => (
          <article key={title}>
            <Icon className={styles.icon} size={48} strokeWidth={1.25} aria-hidden />
            <h3>{title}</h3>
            <p>{text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default async function SecurityAndCompliancePage() {
  const user = await safeHeaderUser();

  return (
    <div className={shell.shell}>
      <DashboardHeader onDashboard={false} signedIn={Boolean(user)} />
      <div className={styles.breadcrumbBar}>
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true">›</span>
          <span aria-current="page">Security and Compliance</span>
        </nav>
      </div>

      <main id="main-content" className={styles.content}>
        <h1>Our Commitment to Security</h1>
        <div className={styles.reference}>
          <p className={styles.attribution}><a href="https://www.freeconvert.com/security-and-compliance">FreeConvert reference material</a></p>
          <p>At FreeConvert, we prioritize the security of your data as much as we prioritize seamless file conversions. Our extensive security framework is built on cutting-edge technology and industry-leading practices to ensure your data remains safe, confidential, and available whenever needed. Explore the security measures we've implemented to protect your trust.</p>
          <SecuritySection id="technology" title="Technology" items={technology} />
          <SecuritySection id="practices" title="Practices" items={practices} />
        </div>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div className={styles.footerGrid} aria-label="FreeConvert reference catalog">
            {referenceFooter.map(([title, ...items]) => (
              <section key={title}>
                <h2>{title}</h2>
                <ul>{items.map((item) => <li key={item}>{item}</li>)}</ul>
              </section>
            ))}
          </div>
          <nav className={styles.footerLinks} aria-label="Footer">
            <Link href="/">Home</Link>
            <Link href="/dashboard">Dashboard</Link>
            <Link href="/security-and-compliance" aria-current="page">Security and Compliance</Link>
            <a href="https://status.freeconvert.com/">FreeConvert Status</a>
          </nav>
          <div className={styles.footerBottom}>
            <Link href="/"><strong>OnlineConvert</strong></Link>
            <small>© {new Date().getFullYear()} OnlineConvert</small>
            <span><Globe size={13} aria-hidden /> English</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
