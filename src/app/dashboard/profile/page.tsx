"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Card, GradientButton } from "@/app/components/ui-components"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Camera, Edit, Loader2, Mail } from "lucide-react"
import { api } from "@/trpc/react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"

// Form validation schema
const profileFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  role: z.string().optional(),
  bio: z.string().optional()
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  const data = api.profile.getProfile.useQuery()
  const user = data.data

  // Form setup
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user?.name ?? "",
      role: user?.role ?? "",
      bio: user?.bio ?? ""
    }
  })

  // Update form values when user data changes
  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name ?? "",
        role: user.role ?? "",
        bio: user.bio ?? ""
      })
    }
  }, [user])

  // Update profile mutation
  const updateProfile = api.profile.updateProfile.useMutation({
    onSuccess: () => {
      toast.success("Profile updated successfully")
      setIsEditing(false)
      data.refetch()
    },
    onError: (error) => {
      toast.error("Failed to update profile", {
        description: error.message
      })
    }
  })

  const handleUploadImage = () => {
    setIsUploading(true)
    // Implement actual image upload logic here
    setTimeout(() => {
      setIsUploading(false)
    }, 1500)
  }

  const onSubmit = (data: ProfileFormValues) => {
    updateProfile.mutate(data)
  }

  // if (isLoading) {
  //   return (
  //     <div className="flex h-screen items-center justify-center">
  //       <Loader2 className="h-8 w-8 animate-spin" />
  //     </div>
  //   )
  // }

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Profile not found</h2>
          <p className="text-muted-foreground mt-2">
            We couldn't load your profile information.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground">Manage your personal information.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <div className="flex flex-col items-center p-6">
            <div className="relative mb-4">
              <div className="relative h-32 w-32 overflow-hidden rounded-full">
                <Image
                  src={user.image || "/placeholder-user.jpg"}
                  alt="Profile picture"
                  width={128}
                  height={128}
                  className="object-cover"
                />
              </div>
              <Button
                variant="outline"
                size="icon"
                className="absolute bottom-0 right-0 rounded-full bg-background shadow-sm"
                onClick={handleUploadImage}
                disabled={isUploading}
              >
                {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
                <span className="sr-only">Upload new picture</span>
              </Button>
            </div>

            <h2 className="text-xl font-bold">{user.name}</h2>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </Card>

        <Card className="md:col-span-2">
          <Tabs defaultValue="info" className="w-full">
            <div className="flex items-center justify-between border-b px-6 py-4">
              <TabsList>
                <TabsTrigger value="info">Personal Info</TabsTrigger>
              </TabsList>
              {!isEditing && (
                <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Profile
                </Button>
              )}
            </div>

            <TabsContent value="info" className="p-6">
              {isEditing ? (
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      {...form.register("name")}
                      // error={form.formState.errors.name?.message}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Input
                      id="role"
                      {...form.register("role")}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      rows={4}
                      {...form.register("bio")}
                    />
                  </div>

                  <div className="flex justify-end gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                      // disabled={updateProfile.isLoading}
                    >
                      Cancel
                    </Button>
                    <GradientButton
                      type="submit"
                      // disabled={updateProfile.isLoading}
                    >
                      Save Changes
                    </GradientButton>
                  </div>
                </form>
              ) : (
                <div className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Full Name</h3>
                      <p>{user.name}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
                      <p>{user.email}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Role</h3>
                      <p>{user.role || "Not specified"}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Member Since</h3>
                      <p>{new Date(user.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Bio</h3>
                    <p className="mt-1">
                      {user.bio || "No bio provided yet."}
                    </p>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="mb-4 text-lg font-medium">Contact Information</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="flex items-start gap-4">
            <div className="rounded-lg bg-primary/10 p-2 text-primary">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-medium">Email Address</h3>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}