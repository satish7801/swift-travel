"use client";

import * as React from 'react';
import { User, Mail, Camera, Loader2, Plane, Train, Bus, Save } from 'lucide-react';
import { useUser } from '@/hooks/use-session';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import type { UserProfile } from '@/lib/types';
import { AuthGuard } from '@/components/auth-guard';

export default function ProfilePage() {
  return (
    <AuthGuard>
      <ProfileContent />
    </AuthGuard>
  );
}

function ProfileContent() {
  const { user } = useUser();
  const [profile, setProfile] = React.useState<UserProfile | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const { toast } = useToast();

  const [displayName, setDisplayName] = React.useState('');
  const [preferredMode, setPreferredMode] = React.useState<'flight' | 'train' | 'bus' | 'any'>('any');
  const [budgetLevel, setBudgetLevel] = React.useState<'budget' | 'mid-range' | 'luxury' | 'any'>('any');

  React.useEffect(() => {
    const fetchProfile = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const response = await fetch('/api/user/profile');
        if (response.ok) {
          const data = await response.json();
          setProfile(data);
          setDisplayName(data.displayName || '');
          setPreferredMode(data.travelPreferences?.preferredMode || 'any');
          setBudgetLevel(data.travelPreferences?.budgetLevel || 'any');
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          displayName,
          travelPreferences: { preferredMode, budgetLevel },
        }),
      });

      if (response.ok) {
        toast({ title: 'Profile updated!' });
      } else {
        throw new Error('Failed to save');
      }
    } catch (error) {
      toast({ variant: 'destructive', title: 'Failed to save profile' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="flex-1">
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="flex-1">
        <div className="min-h-[60vh] flex items-center justify-center p-4">
          <div className="text-center space-y-6 max-w-md">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
              <User className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-2xl font-bold">Sign in to view profile</h1>
            <p className="text-muted-foreground">
              Personalize your travel preferences and settings.
            </p>
          </div>
        </div>
      </main>
    );
  }

  const transportModes = [
    { value: 'any', label: 'Any', icon: null, color: '' },
    { value: 'flight', label: 'Flights', icon: Plane, color: 'text-blue-500' },
    { value: 'train', label: 'Trains', icon: Train, color: 'text-orange-500' },
    { value: 'bus', label: 'Buses', icon: Bus, color: 'text-emerald-500' },
  ] as const;

  const budgetLevels = [
    { value: 'any', label: 'Flexible' },
    { value: 'budget', label: 'Budget' },
    { value: 'mid-range', label: 'Mid-Range' },
    { value: 'luxury', label: 'Luxury' },
  ] as const;

  return (
    <main className="flex-1">
      {/* Header */}
      <section className="relative py-12 md:py-16 overflow-hidden">
        <div className="container mx-auto px-4 relative">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-2xl font-bold">
                {user.name?.charAt(0) || user.email?.charAt(0) || 'U'}
              </div>
              <button className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-background border border-border flex items-center justify-center hover:bg-muted transition-colors">
                <Camera className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">{user.name || 'Traveler'}</h1>
              <p className="text-muted-foreground flex items-center gap-2">
                <Mail className="h-4 w-4" />
                {user.email}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="container mx-auto px-4 pb-12">
        <div className="max-w-2xl space-y-8">
          {/* Personal Info */}
          <div className="card-premium p-6 space-y-4">
            <h2 className="text-lg font-semibold">Personal Information</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="displayName" className="text-sm text-muted-foreground">
                  Display Name
                </Label>
                <Input
                  id="displayName"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Enter your name"
                  className="mt-1"
                />
              </div>
            </div>
          </div>

          {/* Travel Preferences */}
          <div className="card-premium p-6 space-y-6">
            <h2 className="text-lg font-semibold">Travel Preferences</h2>

            {/* Preferred Mode */}
            <div>
              <Label className="text-sm text-muted-foreground mb-3 block">
                Preferred Transport
              </Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {transportModes.map(({ value, label, icon: Icon, color }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setPreferredMode(value)}
                    className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${preferredMode === value
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                      }`}
                  >
                    {Icon && <Icon className={`h-5 w-5 ${color}`} />}
                    <span className="text-sm font-medium">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Budget Level */}
            <div>
              <Label className="text-sm text-muted-foreground mb-3 block">
                Budget Preference
              </Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {budgetLevels.map(({ value, label }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setBudgetLevel(value)}
                    className={`p-4 rounded-xl border-2 transition-all ${budgetLevel === value
                      ? 'border-accent bg-accent/5'
                      : 'border-border hover:border-accent/50'
                      }`}
                  >
                    <span className="text-sm font-medium">{label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Save Button */}
          <Button
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-primary hover:bg-primary/90"
            size="lg"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Save Changes
          </Button>
        </div>
      </section>
    </main>
  );
}
