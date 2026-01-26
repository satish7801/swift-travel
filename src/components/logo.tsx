import { Plane } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2 text-2xl font-logo text-primary tracking-wide", className)}>
      <Plane className="h-7 w-7" />
      <span>SwiftTravel</span>
    </div>
  );
}
