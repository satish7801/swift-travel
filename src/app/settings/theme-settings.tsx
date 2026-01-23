"use client"

import { useTheme } from "next-themes"
import { Sun, Moon, Laptop } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function ThemeSettings() {
  const { theme, setTheme } = useTheme()

  const themes = [
    { name: "Light", value: "light", icon: Sun },
    { name: "Dark", value: "dark", icon: Moon },
    { name: "System", value: "system", icon: Laptop },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Theme</CardTitle>
        <CardDescription>Select a theme for the application.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          {themes.map((t) => (
            <Button
              key={t.value}
              variant={theme === t.value ? "default" : "outline"}
              onClick={() => setTheme(t.value)}
              className="flex flex-col h-24 text-base"
            >
              <t.icon className="h-6 w-6 mb-2" />
              {t.name}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
