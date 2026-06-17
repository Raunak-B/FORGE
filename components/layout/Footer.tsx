import Container from "@/components/ui/Container";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-steel/20 bg-iron py-8">
      <Container>
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="font-display text-2xl font-bold tracking-widest text-steel">
            FORGE
          </p>
          <p className="text-sm text-chalk/50 font-sans">
            © {new Date().getFullYear()} Forge Fitness.
          </p>
        </div>
      </Container>
    </footer>
  );
}