import { Link, useLocation } from "wouter";
import { Menu, Box, Info } from "lucide-react";
import { cn } from "@/lib/utils";
export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const navItems = [
    { href: "/", icon: Menu, label: "Menu" },
    { href: "/ar", icon: Box, label: "AR" },
    { href: "/about", icon: Info, label: "Info" },
  ];
  return (
    <div className="min-h-[100dvh] flex flex-col text-foreground pb-20">
      <main className="flex-1 w-full relative">
        {children}
      </main>
      <nav className="fixed bottom-0 left-0 right-0 glass-nav z-50">
        <div className="flex items-center justify-around h-16 px-8">
          {navItems.map((item, i) => {
            const isActive = location === item.href || (item.label === "Menu" && location === "/");
            return (
              <Link key={i} href={item.href} className={cn(
                "flex flex-col items-center justify-center w-full h-full space-y-1 tap-effect",
                isActive ? "text-primary" : "text-muted-foreground"
              )}>
                <item.icon className="w-5 h-5" />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

