import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMe, useUpdateProfile } from "@/hooks/useGraphQL";
import {
  formatMemberRoles,
  getUserRoles,
  ROLE_LABELS,
  type RoleCode,
} from "@/lib/roles";
import { useAppDispatch } from "@/redux/hooks";
import { updateUser, type User } from "@/redux/slices/authSlice";
import { useAuth } from "@/redux/useAuth";
import { useEffect, useState } from "react";

const ProfilePage = () => {
  const dispatch = useAppDispatch();
  const { user: authUser } = useAuth();
  const { data, loading: meLoading } = useMe();
  const { updateProfile, loading: saving } = useUpdateProfile();

  const user: User | null = data?.me || authUser;

  const [fullName, setFullName] = useState("");
  const [contactNo, setContactNo] = useState("");
  const [errors, setErrors] = useState<{
    full_name?: string;
    contact_no?: string;
  }>({});

  useEffect(() => {
    if (data?.me) {
      dispatch(updateUser(data.me));
    }
  }, [data?.me, dispatch]);

  useEffect(() => {
    if (user?.member) {
      setFullName(user.member.full_name || "");
      setContactNo(user.member.contact_no || user.phone || "");
    } else if (user?.phone) {
      setContactNo(user.phone);
    }
  }, [
    user?.id,
    user?.member?.full_name,
    user?.member?.contact_no,
    user?.phone,
  ]);

  const roleLabel =
    (user && getUserRoles(user).join(", ")) ||
    formatMemberRoles(user?.member, "Family Member");

  const getUserInitials = () => {
    if (user?.member?.full_name) {
      const names = user.member.full_name.split(" ");
      if (names.length >= 2) {
        return `${names[0].charAt(0)}${names[names.length - 1].charAt(0)}`.toUpperCase();
      }
      return names[0].charAt(0).toUpperCase();
    }
    if (user?.phone) {
      return user.phone.slice(-2).toUpperCase();
    }
    return "U";
  };

  const validate = () => {
    const next: typeof errors = {};
    if (!fullName.trim()) {
      next.full_name = "Full name is required";
    }
    if (!contactNo.trim()) {
      next.contact_no = "Phone number is required";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await updateProfile({
        full_name: fullName.trim(),
        contact_no: contactNo.trim(),
      });
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  if (!user && meLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-brand-gradient">Profile</h1>
          <p className="text-muted-foreground">Your account</p>
        </div>
        <Card>
          <CardContent className="py-12 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
            <p className="mt-4 text-muted-foreground">Loading profile...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-brand-gradient">Profile</h1>
        </div>
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            Unable to load profile.
          </CardContent>
        </Card>
      </div>
    );
  }

  const roles = getUserRoles(user);
  const ministries = user.member?.ministries?.filter((m) => m.is_active) || [];
  const ledMinistries =
    user.member?.ledMinistries?.filter((m) => m.is_active) || [];

  const roleDisplayLabel = (code: string) =>
    ROLE_LABELS[code as RoleCode] || code;

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-3xl font-bold text-brand-gradient">Profile</h1>
        <p className="text-muted-foreground">Your account</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-lg font-medium">
                {getUserInitials()}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>{user.member?.full_name || user.phone}</CardTitle>
              <CardDescription className="mt-1">
                {roleLabel}
                {user.member?.status?.name
                  ? ` · ${user.member.status.name}`
                  : ""}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <p className="text-sm text-muted-foreground">Family</p>
              <p className="font-medium">{user.member?.family?.name || "—"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Phone</p>
              <p className="font-medium">{user.phone || "—"}</p>
            </div>
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-2">Roles</p>
            {roles.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {roles.map((code) => (
                  <Badge key={code} variant="outline">
                    {roleDisplayLabel(code)}
                    <span className="ml-1 text-muted-foreground">({code})</span>
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="font-medium">—</p>
            )}
          </div>

          {(ministries.length > 0 || ledMinistries.length > 0) && (
            <div className="space-y-2">
              {ministries.length > 0 && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Ministries
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {ministries.map((m) => (
                      <Badge key={m.id} variant="secondary">
                        {m.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {ledMinistries.length > 0 && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Leading</p>
                  <div className="flex flex-wrap gap-2">
                    {ledMinistries.map((m) => (
                      <Badge key={m.id}>{m.name}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Edit profile</CardTitle>
          <CardDescription>
            Update your name and phone number. Roles and family are managed by
            administrators.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="full_name">Full name</Label>
              <Input
                id="full_name"
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  if (errors.full_name) {
                    setErrors((prev) => ({ ...prev, full_name: undefined }));
                  }
                }}
                placeholder="Your full name"
                disabled={saving}
              />
              {errors.full_name && (
                <p className="text-sm text-destructive">{errors.full_name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact_no">Phone number</Label>
              <Input
                id="contact_no"
                value={contactNo}
                onChange={(e) => {
                  setContactNo(e.target.value);
                  if (errors.contact_no) {
                    setErrors((prev) => ({ ...prev, contact_no: undefined }));
                  }
                }}
                placeholder="Phone number"
                disabled={saving}
              />
              {errors.contact_no && (
                <p className="text-sm text-destructive">{errors.contact_no}</p>
              )}
            </div>

            <Button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save changes"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;
