import { useEffect } from "react";
import "./GTTranslator.css"; // We'll create this CSS file next

declare global {
  interface Window {
    gtranslateSettings: {
      default_language: string;
      detect_browser_language: boolean;
      wrapper_selector: string;
      switcher_horizontal_position: string;
      float_switcher_open_direction: string;
      [key: string]: any;
    };
  }
}

export default function GTTranslator() {
  useEffect(() => {
    // Configure GTTranslate settings
    window.gtranslateSettings = {
      "default_language": "en",
      "detect_browser_language": true,
      "wrapper_selector": ".gtranslate_wrapper",
      "switcher_horizontal_position": "right", // Position on the right
      "float_switcher_open_direction": "bottom"
    };

    // Create and add the script element to load GTTranslate
    const script = document.createElement("script");
    script.src = "https://cdn.gtranslate.net/widgets/latest/float.js";
    script.defer = true;
    document.body.appendChild(script);

    // Cleanup function to run when component unmounts
    return () => {
      // Find and remove the script element
      const scripts = document.querySelectorAll('script[src="https://cdn.gtranslate.net/widgets/latest/float.js"]');
      scripts.forEach(s => s.parentNode?.removeChild(s));
      
      // Remove any GTTranslate elements that might have been added to the DOM
      const gtElements = document.querySelectorAll('.gt_float_switcher, #gt_float_wrapper');
      gtElements.forEach(el => el.parentNode?.removeChild(el));
    };
  }, []); // Empty dependency array means this runs once on mount

  // Render the container element that GTTranslate will attach to
  return <div className="gtranslate_wrapper"></div>;
}