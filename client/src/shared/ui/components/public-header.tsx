import { Link } from "wouter";
import { Button } from "@/shared/ui/components/button";
import LogoIconPurplePath from "@/assets/LogoIcon_Purple.png";

export function PublicHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/">
          <div className="flex items-center gap-2 cursor-pointer">
            <img src={LogoIconPurplePath} alt="Proxa People Logo" className="h-8 w-8" />
            <span className="font-heading text-xl font-bold">Proxa People</span>
          </div>
        </Link>
        
        <nav className="hidden md:flex space-x-6">
          <Link href="/features">
            <a className="text-sm font-medium text-neutral-600 hover:text-primary">Features</a>
          </Link>
          <Link href="/pricing">
            <a className="text-sm font-medium text-neutral-600 hover:text-primary">Pricing</a>
          </Link>
          <Link href="/customers">
            <a className="text-sm font-medium text-neutral-600 hover:text-primary">Customers</a>
          </Link>
          <Link href="/resources">
            <a className="text-sm font-medium text-neutral-600 hover:text-primary">Resources</a>
          </Link>
        </nav>
        
        <div className="flex items-center space-x-3">
          <Link href="/demo">
            <Button variant="outline" size="sm">View Demo</Button>
          </Link>
          <Link href="/dashboard">
            <Button size="sm">Get Started</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}