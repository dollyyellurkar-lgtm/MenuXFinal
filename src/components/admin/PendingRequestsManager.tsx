import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { MailCheck, MailX, MailPlus } from "lucide-react";

interface AdminRequestRow {
  id: string;
  email: string;
  requested_by: string | null;
  status: "pending" | "approved" | "rejected";
  created_at: string;
}

export default function PendingRequestsManager() {
  const [pending, setPending] = useState<AdminRequestRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  const loadPending = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.rpc("list_pending_admin_requests");
      if (error) throw error;
      setPending(data || []);
    } catch (err: any) {
      console.error("Failed to fetch pending requests", err);
      toast.error(err.message || "Failed to fetch pending requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPending();
  }, []);

  const createRequest = async () => {
    try {
      if (!email || !email.includes("@")) {
        toast.error("Enter a valid email");
        return;
      }
      setLoading(true);
      const { data, error } = await supabase.rpc("create_admin_request", { target_email: email });
      if (error) throw error;
      toast.success("Request submitted");
      setEmail("");
      await loadPending();
    } catch (err: any) {
      console.error("Failed to submit request", err);
      toast.error(err.message || "Failed to submit request");
    } finally {
      setLoading(false);
    }
  };

  const approve = async (targetEmail: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.rpc("approve_admin_by_email", { target_email: targetEmail });
      if (error) throw error;
      toast.success("Approved admin");
      await loadPending();
    } catch (err: any) {
      console.error("Approve failed", err);
      toast.error(err.message || "Approve failed");
    } finally {
      setLoading(false);
    }
  };

  const reject = async (targetEmail: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.rpc("reject_admin_request", { target_email: targetEmail });
      if (error) throw error;
      toast.success("Rejected request");
      await loadPending();
    } catch (err: any) {
      console.error("Reject failed", err);
      toast.error(err.message || "Reject failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MailPlus className="w-5 h-5" />
            Request Admin Access (email-based)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Any restaurant can use MenuX. Request admin access by email, then configure your outlet name, address and branding in Admin.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 space-y-2">
              <Label htmlFor="req-email">Email</Label>
              <Input id="req-email" type="email" placeholder="owner@restaurant.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <Button className="self-end" onClick={createRequest} disabled={loading}>Submit Request</Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MailCheck className="w-5 h-5" />
            Pending Requests
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {pending.length === 0 && (
            <p className="text-sm text-muted-foreground">No pending requests.</p>
          )}
          <div className="space-y-3">
            {pending.map((r) => (
              <div key={r.id} className="flex items-center justify-between rounded-lg border border-border/50 px-4 py-2">
                <div>
                  <p className="font-medium">{r.email}</p>
                  <p className="text-xs text-muted-foreground">Requested: {new Date(r.created_at).toLocaleString()}</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="default" onClick={() => approve(r.email)} disabled={loading}>Approve</Button>
                  <Button size="sm" variant="outline" onClick={() => reject(r.email)} disabled={loading}>
                    <MailX className="w-4 h-4 mr-1" />Reject
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}