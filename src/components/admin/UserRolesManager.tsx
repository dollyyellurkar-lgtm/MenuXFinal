import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { ShieldCheck, UserCog } from "lucide-react";

interface UserRoleRow {
  id: string;
  user_id: string;
  role: "admin" | "user";
  created_at: string;
}

export default function UserRolesManager() {
  const [rows, setRows] = useState<UserRoleRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [newUserId, setNewUserId] = useState("");
  const [newRole, setNewRole] = useState<"admin" | "user">("admin");

  const loadRoles = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("user_roles")
        .select("id,user_id,role,created_at")
        .order("created_at", { ascending: false });
      if (error) throw error;
      setRows(data || []);
    } catch (err: any) {
      console.error("Failed to fetch user roles", err);
      toast.error(err.message || "Failed to fetch user roles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRoles();
  }, []);

  const upsertRole = async (userId: string, role: "admin" | "user") => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from("user_roles")
        .upsert({ user_id: userId, role }, { onConflict: "user_id" });
      if (error) throw error;
      toast.success(role === "admin" ? "Admin role granted" : "Role set to user");
      await loadRoles();
    } catch (err: any) {
      console.error("Failed to update role", err);
      toast.error(err.message || "Failed to update role");
    } finally {
      setLoading(false);
    }
  };

  const handleManualGrant = async () => {
    if (!newUserId.trim()) {
      toast.error("Enter a valid user ID");
      return;
    }
    await upsertRole(newUserId.trim(), newRole);
    setNewUserId("");
  };

  return (
    <div className="space-y-6">
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCog className="w-5 h-5" />
            Admin Approval
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Grant or revoke admin access. Use the list below or enter a Supabase user ID manually.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="user-id">Supabase User ID</Label>
              <Input id="user-id" placeholder="e.g. 1a2b3c-..." value={newUserId} onChange={(e) => setNewUserId(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Select value={newRole} onValueChange={(v) => setNewRole(v as any)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button onClick={handleManualGrant} disabled={loading} className="w-full sm:w-auto">
            <ShieldCheck className="w-4 h-4 mr-2" />
            {newRole === "admin" ? "Approve Admin" : "Set as User"}
          </Button>
        </CardContent>
      </Card>

      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>Existing Roles</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {rows.length === 0 ? (
            <p className="text-sm text-muted-foreground">No roles found.</p>
          ) : (
            <div className="space-y-3">
              {rows.map((row) => (
                <div key={row.id} className="flex items-center justify-between rounded-lg border border-border/50 p-3">
                  <div>
                    <p className="text-sm font-medium">{row.user_id}</p>
                    <p className="text-xs text-muted-foreground">Role: {row.role}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {row.role !== "admin" && (
                      <Button size="sm" onClick={() => upsertRole(row.user_id, "admin")}>Make Admin</Button>
                    )}
                    {row.role !== "user" && (
                      <Button size="sm" variant="outline" onClick={() => upsertRole(row.user_id, "user")}>Set User</Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}