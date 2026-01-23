import { ThemeSettings } from "./theme-settings";

export default function SettingsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-headline font-bold mb-6">Settings</h1>
      <div className="max-w-2xl mx-auto space-y-8">
        <ThemeSettings />
      </div>
    </div>
  );
}
