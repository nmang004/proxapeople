import { Link } from "wouter";
import ProxaLogoPath from "@/assets/proxa-logo.png";

export function PublicFooter() {
  return (
    <footer className="bg-neutral-800 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img src={ProxaLogoPath} alt="Proxa People Logo" className="h-6 w-6" />
              <span className="font-heading text-lg font-bold">Proxa People</span>
            </div>
            <p className="text-neutral-400 text-sm">
              The people management platform that drives success.
            </p>
          </div>
          
          {[
            {
              title: "Product",
              links: [
                { label: "Features", href: "/features" },
                { label: "Pricing", href: "/pricing" },
                { label: "Demo", href: "/demo" },
                { label: "Integrations", href: "/integrations" },
                { label: "Updates", href: "/updates" }
              ]
            },
            {
              title: "Company", 
              links: [
                { label: "About", href: "/about" },
                { label: "Customers", href: "/customers" },
                { label: "Blog", href: "/blog" },
                { label: "Careers", href: "/careers" },
                { label: "Contact", href: "/contact" }
              ]
            },
            {
              title: "Resources",
              links: [
                { label: "Resource Center", href: "/resources" },
                { label: "Templates", href: "/templates" },
                { label: "Developers", href: "/developers" },
                { label: "Help Center", href: "/help" },
                { label: "Security", href: "/security" },
                { label: "Status", href: "/status" },
                { label: "Privacy", href: "/privacy" }
              ]
            }
          ].map((section) => (
            <div key={section.title}>
              <h3 className="font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href}>
                      <a className="text-neutral-400 hover:text-white text-sm">
                        {link.label}
                      </a>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="border-t border-neutral-700 mt-8 pt-8 text-center text-neutral-400 text-sm">
          © 2025 Proxa People. All rights reserved.
        </div>
      </div>
    </footer>
  );
}