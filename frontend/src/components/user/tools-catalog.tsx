import { NAV_MEGA_CATALOG } from "@/lib/nav-catalog";
import { NAV_MENU_LABELS, type ProductNavMenu } from "@/lib/nav-menus";
import { toolHref } from "@/lib/tool-registry";
import { ToolNavLink } from "./tool-nav-link";
import { ToolTypeIcon } from "./tool-type-icon";

const MENU_ORDER: ProductNavMenu[] = ["convert", "compress", "tools", "api"];

export function ToolsCatalog({ id = "tools-catalog" }: { signedIn?: boolean; id?: string }) {
  return (
    <section className="tools-catalog" id={id} aria-labelledby={`${id}-title`}>
      <div className="tools-catalog-head">
        <h2 id={`${id}-title`}>All tools</h2>
        <p>
          Same catalogs as Convert, Compress, and Tools in the header — pick any workflow to open its page.
        </p>
      </div>
      {MENU_ORDER.map((menu) => (
        <MenuCatalogSection key={menu} menu={menu} />
      ))}
    </section>
  );
}

function MenuCatalogSection({ menu }: { menu: ProductNavMenu }) {
  const columns = NAV_MEGA_CATALOG[menu];
  return (
    <div className="tools-catalog-menu-block">
      <h3 className="tools-catalog-menu-title">{NAV_MENU_LABELS[menu]}</h3>
      <div className="tools-catalog-grid">
        {columns.map((cat) => (
          <article key={`${menu}-${cat.id}`} className="tools-catalog-card panel">
            <h4>{cat.title}</h4>
            <ul>
              {cat.tools.map((tool) => (
                <li key={`${menu}-${tool.slug}`}>
                  <ToolNavLink href={toolHref(tool.slug)} className="tools-catalog-link">
                    <ToolTypeIcon kind={tool.kind} size={17} />
                    {tool.label}
                  </ToolNavLink>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </div>
  );
}