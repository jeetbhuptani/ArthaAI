import { Link } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "@/components/ui/button";
import Logo from "../assets/logo.png";

export function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            {/* Logo with increased size */}
            <Link to="/" className="flex items-center">
              <img src={Logo} alt="Artha AI Logo" className="h-14 w-auto" />
            </Link>
            
            {/* Main Navigation */}
            <nav className="flex items-center gap-6">
              <Link 
                to="/" 
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                Home
              </Link>
              <Link 
                to="/learning" 
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                Learning
              </Link>
              <Link 
                to="/form" 
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                Finances
              </Link>
              <Link 
                to="/about" 
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                About
              </Link>
            </nav>
          </div>

          {/* Auth & Theme Toggle */}
          <div className="flex items-center gap-4">
            <nav className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
              <Link to="/signup">
                <Button size="sm">
                  Sign Up
                </Button>
              </Link>
            </nav>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}