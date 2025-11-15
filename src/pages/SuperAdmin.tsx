import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Building2, Users, X } from "lucide-react";
import { useState, useEffect } from "react";
import IssuesList from "@/components/IssuesList";
import IssueDetailModal from "@/components/IssueDetailModal";
import { getIssuesByCity, getSummaryCountsByCity, type Issue } from "@/lib/mockData";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const admins = [
  { city: "Bengaluru", name: "Akhil Kumar", email: "akhil@city.gov", status: "active" },
  { city: "Bengaluru", name: "Neha Patel", email: "neha@city.gov", status: "active" },
  { city: "Mumbai", name: "Rohit Sharma", email: "rohit@city.gov", status: "inactive" },
  { city: "Delhi", name: "Sara Khan", email: "sara@city.gov", status: "active" },
  { city: "Pune", name: "Vikram Desai", email: "vikram@city.gov", status: "active" },
];

// summary will be derived from mock data in `src/lib/mockData.ts`

const SuperAdmin = () => {
  const [cityModalOpen, setCityModalOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [issueDetailOpen, setIssueDetailOpen] = useState(false);

  const issuesByCity = getSummaryCountsByCity();

  useEffect(() => {
    // lock background scroll when any dialog is open
    if (typeof window === "undefined") return;
    if (cityModalOpen || issueDetailOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [cityModalOpen, issueDetailOpen]);
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-hero rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">SuperAdmin Console</h1>
              <p className="text-muted-foreground">Manage city admins and track citywide issue status</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">Export</Button>
            <Button className="bg-gradient-hero">Add Admin</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5" /> Admins by City
              </CardTitle>
              <CardDescription>Overview of admins across cities</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>City</TableHead>
                    <TableHead>Admin</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {admins.map((a, idx) => (
                    <TableRow key={`${a.email}-${idx}`}>
                      <TableCell>{a.city}</TableCell>
                      <TableCell>{a.name}</TableCell>
                      <TableCell className="font-mono text-sm">{a.email}</TableCell>
                      <TableCell>
                        <Badge variant={a.status === "active" ? "default" : "secondary"}>{a.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm">View</Button>
                          <Button variant="ghost" size="sm">Deactivate</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" /> Pending & Unresolved Issues by City
              </CardTitle>
              <CardDescription>City-level aggregation of open issues</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>City</TableHead>
                    <TableHead className="text-right">Pending</TableHead>
                    <TableHead className="text-right">Unresolved</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {issuesByCity.map((row) => (
                    <TableRow key={row.city}>
                      <TableCell>{row.city}</TableCell>
                      <TableCell className="text-right">{row.pending}</TableCell>
                      <TableCell className="text-right">{row.unresolved}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedCity(row.city);
                              setCityModalOpen(true);
                            }}
                          >
                            View Issues
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* City issues dialog */}
      <Dialog open={cityModalOpen} onOpenChange={() => setCityModalOpen(false)}>
        <DialogContent className="w-full h-screen md:h-auto md:max-w-4xl md:max-h-[80vh] overflow-y-auto bg-gradient-card border-border/50 rounded-none md:rounded-lg">
          <DialogHeader className="relative">
            <DialogTitle className="flex items-center justify-between">
              <span>Issues in {selectedCity}</span>
            </DialogTitle>
            <div className="absolute right-3 top-3 md:hidden">
              <Button size="sm" variant="ghost" onClick={() => setCityModalOpen(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </DialogHeader>

          <div className="p-4">
            {selectedCity ? (
              <div className="max-h-[60vh] md:max-h-[65vh] overflow-y-auto">
                <IssuesList
                  issues={getIssuesByCity(selectedCity)}
                  onIssueClick={(issue) => {
                    setSelectedIssue(issue as unknown as Issue);
                    setIssueDetailOpen(true);
                  }}
                  onMapHighlight={() => {}}
                  selectedIssueId={selectedIssue?.id ?? null}
                />
              </div>
            ) : (
              <p className="text-muted-foreground">No city selected.</p>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <IssueDetailModal
        issue={selectedIssue}
        isOpen={issueDetailOpen}
        onClose={() => setIssueDetailOpen(false)}
      />
    </div>
  );
};

export default SuperAdmin;
