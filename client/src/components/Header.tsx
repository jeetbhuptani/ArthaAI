import { Link, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { User, ChevronDown } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import Logo from "../assets/logo.png";

export function Header() {
  const { isAuthenticated, user, logout } = useAuth();
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("auth_token"); 
    logout();
    setDropdownVisible(false);
    navigate("/authentication");
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownVisible(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center">
              <img
                src={Logo || "/placeholder.svg"}
                alt="Artha AI Logo"
                className="h-10 w-auto"
              />
              <span className="ml-2 font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-emerald-600 dark:from-teal-400 dark:to-emerald-400 hidden sm:inline-block">
                ArthaAI
              </span>
            </Link>

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
              {/* <Link
                to="/form"
                className="text-sm font-medium transition-colors hover:text-teal-600 dark:hover:text-teal-400"
              >
                Finances
              </Link> */}
              <Link
                to="/analyzer"
                className="text-sm font-medium transition-colors hover:text-teal-600 dark:hover:text-teal-400"
              >
                Bills Analyzer
              </Link>
              <Link
                to="/tax"
                className="text-sm font-medium transition-colors hover:text-teal-600 dark:hover:text-teal-400"
              >
                Tax Filling
              </Link>
              <Link to="/comparator" className="text-sm font-medium transition-colors hover:text-teal-600 dark:hover:text-teal-400">
                Investment Comparator
              </Link>
              <Link
                to="/about"
                className="text-sm font-medium transition-colors hover:text-teal-600 dark:hover:text-teal-400"
              >
                About
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />

            <div className="relative">
              {isAuthenticated ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    className="flex items-center space-x-2 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
                    onClick={() => setDropdownVisible(!dropdownVisible)}
                  >
                    {user?.picture ? (
                      <img
                        src={user.picture}
                        alt={user.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                        <User className="h-5 w-5" />
                      </div>
                    )}
                    <ChevronDown className="h-4 w-4" />
                  </button>

                  {dropdownVisible && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 shadow-lg rounded-lg py-2 z-50">
                      <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                        <div className="font-medium text-sm text-black dark:text-white">
                          {user?.name}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {user?.email}
                        </div>
                      </div>
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => setDropdownVisible(false)}
                      >
                        Profile
                      </Link>
                      <button
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={handleLogout}
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <nav className="flex items-center gap-2">
                  <Link to="/authentication?mode=login">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="hover:text-teal-600 dark:hover:text-teal-400"
                    >
                      Login
                    </Button>
                  </Link>
                  <Link to="/authentication?mode=signup">
                    <Button
                      size="sm"
                      className="bg-teal-600 hover:bg-teal-700 dark:bg-teal-700 dark:hover:bg-teal-600"
                    >
                      Sign Up
                    </Button>
                  </Link>
                </nav>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
