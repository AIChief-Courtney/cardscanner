import Link from "next/link";

export function ToolBreadcrumb({ label }: { label: string }) {
  return (
    <nav className="tool-breadcrumb" aria-label="Breadcrumb">
      <ol>
        <li>
          <Link href="/">Home</Link>
        </li>
        <li aria-current="page">{label}</li>
      </ol>
    </nav>
  );
}