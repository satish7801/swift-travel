"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useUser, useDoc, useFirestore } from "@/firebase";
import type { UserProfile } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { updateUserDisplayName } from "@/firebase/firestore/users";
import { Loader2 } from "lucide-react";

const profileFormSchema = z.object({
  displayName: z.string().min(2, { message: "Display name must be at least 2 characters." }).max(50, { message: "Display name cannot exceed 50 characters." }),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function ProfilePage() {
  const { user, status } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const { data: userProfile, loading: profileLoading, error: profileError } = useDoc<UserProfile>(
    user ? `users/${user.uid}` : ''
  );

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      displayName: "",
    },
  });

  React.useEffect(() => {
    if (userProfile?.displayName) {
      form.reset({ displayName: userProfile.displayName });
    }
  }, [userProfile, form]);

  const onSubmit = async (data: ProfileFormValues) => {
    if (!user || !firestore) {
        toast({
            variant: "destructive",
            title: "Error",
            description: "You must be logged in to update your profile.",
        });
        return;
    }
    
    setIsSubmitting(true);
    try {
      await updateUserDisplayName(firestore, user.uid, data.displayName);
      toast({
        title: "Profile Updated",
        description: "Your display name has been successfully updated.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: error.message || "An unknown error occurred.",
      });
    } finally {
        setIsSubmitting(false);
    }
  };

  if (status === 'loading' || (status === 'authenticated' && profileLoading)) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-headline font-bold mb-6">My Profile</h1>
        <div className="space-y-8 max-w-2xl">
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-64" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-24" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated' || !user) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-headline font-bold mb-4">My Profile</h1>
        <p className="text-muted-foreground">Please log in to view your profile.</p>
      </div>
    );
  }

  if (profileError) {
    return (
        <div className="container mx-auto px-4 py-8 text-center">
            <h1 className="text-3xl font-headline font-bold mb-4">Error</h1>
            <p className="text-destructive">Could not load your profile. Please try again later.</p>
        </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-headline font-bold mb-6">My Profile</h1>
      <div className="max-w-2xl space-y-8">
        <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
                {userProfile?.photoURL && <AvatarImage src={userProfile.photoURL} alt={userProfile?.displayName || 'User'} />}
                <AvatarFallback className="text-3xl">
                    {userProfile?.displayName ? userProfile.displayName[0].toUpperCase() : 'U'}
                </AvatarFallback>
            </Avatar>
            <div>
                <h2 className="text-2xl font-bold">{userProfile?.displayName}</h2>
                <p className="text-muted-foreground">{userProfile?.email}</p>
            </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Edit Profile</CardTitle>
            <CardDescription>Update your public display name.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="displayName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Display Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your display name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isSubmitting || !form.formState.isDirty}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Changes
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
