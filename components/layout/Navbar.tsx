import Link from "next/link";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";

export default function Navbar() {
  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Workouts", href: "/workouts" },
    { name: "Diet", href: "/diet" },
    { name: "Community", href: "/community" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-steel/20 bg-iron/80 backdrop-blur-md">
      <Container>
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link
              href="/"
              className="font-display text-3xl font-bold tracking-wider text-chalk focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass rounded"
            >
              FORGE
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-sm font-medium text-chalk/70 transition-colors hover:text-chalk focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass rounded px-2 py-1"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Auth Placeholders */}
            <Button variant="ghost" className="hidden sm:inline-flex">
              Sign In
            </Button>
            <Button variant="primary">Profile</Button>
          </div>
        </div>
      </Container>
    </nav>
  );
}