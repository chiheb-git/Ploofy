import { Link, useLocation } from "wouter";
import { LayoutDashboard, List, UtensilsCrossed, QrCode, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/categories", label: "Catégories", icon: List },
  { href: "/dishes", label: "Plats", icon: UtensilsCrossed },
  { href: "/qr", label: "QR Code", icon: QrCode },
];

export function Sidebar() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Mobile toggle */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-sidebar border-b border-sidebar-border flex items-center justify-between px-4 z-50">
        <div className="text-sidebar-foreground font-serif font-bold text-lg">Le Palais d'Orient</div>
        <Button variant="ghost" size="icon" onClick={toggleSidebar} className="text-sidebar-foreground hover:bg-sidebar-accent">
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {/* Sidebar backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar content */}
      <div className={cn(
        "fixed top-0 left-0 bottom-0 w-64 bg-sidebar border-r border-sidebar-border flex flex-col z-40 transition-transform duration-200 ease-in-out md:translate-x-0",
        isOpen ? "translate-x-0 mt-16 md:mt-0" : "-translate-x-full md:mt-0"
      )}>
        <div className="hidden md:flex h-16 items-center px-6 border-b border-sidebar-border">
          <div className="text-sidebar-foreground font-serif font-bold text-xl tracking-wide">Le Palais d'Orient</div>
        </div>

        <nav className="flex-1 py-6 px-3 space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                    : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
                )}
                onClick={() => setIsOpen(false)}
              >
                <item.icon className={cn("h-5 w-5", isActive ? "text-sidebar-primary" : "opacity-70")} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="md:ml-64 min-h-screen pt-16 md:pt-0 pb-8 px-4 md:px-8 max-w-7xl mx-auto">
        {children}
      </main>
      <footer className="md:ml-64 border-t border-border py-4 px-8 flex items-center justify-center">
        <p className="text-xs text-muted-foreground tracking-widest uppercase">
          Developed by <span className="text-primary/70 font-semibold">Meghraoui Chiheb</span>
        </p>
      </footer>
    </div>
  );
}
