import { ThemeSettings } from "./theme-settings";

export default function SettingsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-headline font-bold mb-6">Settings</h1>
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="glass p-8 rounded-3xl text-center space-y-4">
          <p className="text-muted-foreground text-lg italic">
            "We've locked the theme to Dark mode to give you the most premium travel experience."
          </p>
        </div>
      </div>
    </div>
  );
}
