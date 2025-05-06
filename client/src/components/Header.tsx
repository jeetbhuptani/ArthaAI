import { Link } from "react-router-dom"
import { ThemeToggle } from "./ThemeToggle"
import { Button } from "@/components/ui/button"
import Logo from "../assets/logo.png"

export function Header() {
  return (
    <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            {/* Logo with increased size */}
            <Link to="/" className="flex items-center">
              <img src={Logo || "/placeholder.svg"} alt="Artha AI Logo" className="h-10 w-auto" />
              <span className="ml-2 font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-emerald-600 dark:from-teal-400 dark:to-emerald-400 hidden sm:inline-block">
                ArthaAI
              </span>
            </Link>

            {/* Main Navigation */}
            <nav className="flex items-center gap-6">
              <Link
                to="/"
                className="text-sm font-medium transition-colors hover:text-teal-600 dark:hover:text-teal-400"
              >
                Home
              </Link>
              <Link
                to="/learning"
                className="text-sm font-medium transition-colors hover:text-teal-600 dark:hover:text-teal-400"
              >
                Learning
              </Link>
              <Link
                to="/form"
                className="text-sm font-medium transition-colors hover:text-teal-600 dark:hover:text-teal-400"
              >
                Finances
              </Link>
              <Link
                to="/about"
                className="text-sm font-medium transition-colors hover:text-teal-600 dark:hover:text-teal-400"
              >
                About
              </Link>
            </nav>
          </div>

          {/* Auth & Theme Toggle */}
          <div className="flex items-center gap-4">
            <nav className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="ghost" size="sm" className="hover:text-teal-600 dark:hover:text-teal-400">
                  Login
                </Button>
              </Link>
              <Link to="/signup">
                <Button size="sm" className="bg-teal-600 hover:bg-teal-700 dark:bg-teal-700 dark:hover:bg-teal-600">
                  Sign Up
                </Button>
              </Link>
            </nav>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  )
}
