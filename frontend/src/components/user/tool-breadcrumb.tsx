import Link from "next/link";

export function ToolBreadcrumb({
  label,
  trail = [],
}: {
  label: string;
  trail?: { href: string; label: string }[];
}) {
  return (
    <nav className="tool-breadcrumb" aria-label="Breadcrumb">
      <ol>
        <li>
          <Link href="/">Home</Link>
        </li>
        {trail.map((item) => (
          <li key={item.href}>
            <Link href={item.href}>{item.label}</Link>
          </li>
        ))}
        <li aria-current="page">{label}</li>
      </ol>
    </nav>
  );
}