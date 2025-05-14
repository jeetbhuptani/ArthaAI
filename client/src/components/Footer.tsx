import { Globe, Github } from "lucide-react";
export function Footer() {
  return (
    <footer className="py-12 bg-zinc-100 dark:bg-zinc-900/80">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="text-2xl font-bold text-teal-600 dark:text-teal-400">
            ArthaAI
          </div>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Democratizing financial wisdom for every Indian
          </p>
          <div className="flex items-center justify-center space-x-4">
            <a
              href="https://github.com/jeetbhuptani"
              className="text-zinc-600 hover:text-teal-600 dark:text-zinc-400 dark:hover:text-teal-400"
            >
              <Github className="h-5 w-5" />
              <span className="sr-only">GitHub</span>
            </a>
            <a
              href="https://arthaai-7x8z.onrender.com/"
              className="text-zinc-600 hover:text-teal-600 dark:text-zinc-400 dark:hover:text-teal-400"
            >
              <Globe className="h-5 w-5" />
              <span className="sr-only">Website</span>
            </a>
          </div>
          <div className="text-xs text-zinc-500 dark:text-zinc-500">
            <p>
              &copy; {new Date().getFullYear()} Artha AI. All rights reserved.
            </p>
            <p className="mt-2">
              Built during the Ignosis Hackathon &middot;{" "}
              <a href="/about" className="underline">
                About
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
