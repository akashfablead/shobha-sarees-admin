import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import {
  getContacts,
  getContactById,
  updateContact,
} from "@/services/adminService";
import {
  Mail,
  Phone,
  User,
  MessageCircle,
  Search,
  Edit,
  Eye,
  CheckCircle,
  Clock,
  AlertTriangle,
  Send,
  Loader2,
} from "lucide-react";

interface Contact {
  _id: string;
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  status: "pending" | "in-progress" | "resolved";
  note?: string;
  respondedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export default function AdminContacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalContacts, setTotalContacts] = useState(0);
  const [limit] = useState(10);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [updating, setUpdating] = useState(false);

  // Load contacts on component mount and when filters change
  useEffect(() => {
    fetchContacts();
  }, [searchTerm, statusFilter, currentPage]);

  const fetchContacts = async () => {
    try {
      setLoading(true);

      const statusParam = statusFilter === "all" ? undefined : statusFilter;

      const response = await getContacts(
        statusParam,
        searchTerm,
        currentPage,
        limit
      );

      setContacts(response.data.contacts || []);
      setTotalContacts(response.data.pagination.total);
      setTotalPages(response.data.pagination.pages);
    } catch (error) {
      toast.error("Failed to load contacts");
      console.error("Error fetching contacts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      setUpdating(true);
      const response = await updateContact(id, { status });

      // Update the contact in the local state
      setContacts((prev) =>
        prev.map((contact) =>
          contact._id === id
            ? { ...contact, status: response.data.status }
            : contact
        )
      );

      toast.success("Contact status updated successfully");
      setIsEditModalOpen(false);
      setSelectedContact(null);
    } catch (error) {
      toast.error("Failed to update contact status");
      console.error("Error updating contact:", error);
    } finally {
      setUpdating(false);
    }
  };

  const handleNoteUpdate = async (id: string, note: string) => {
    try {
      setUpdating(true);
      const response = await updateContact(id, { note });

      // Update the contact in the local state
      setContacts((prev) =>
        prev.map((contact) =>
          contact._id === id
            ? { ...contact, note: response.data.note }
            : contact
        )
      );

      toast.success("Contact note updated successfully");
      setIsEditModalOpen(false);
      setSelectedContact(null);
    } catch (error) {
      toast.error("Failed to update contact note");
      console.error("Error updating contact:", error);
    } finally {
      setUpdating(false);
    }
  };

  const handleViewContact = async (contactId: string) => {
    try {
      const contact = await getContactById(contactId);
      setSelectedContact(contact.data);
      setIsViewModalOpen(true);
    } catch (error) {
      toast.error("Failed to load contact details");
      console.error("Error fetching contact:", error);
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "resolved":
        return "bg-green-100 text-green-800 border-green-200";
      case "in-progress":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "pending":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "resolved":
        return <CheckCircle className="h-4 w-4" />;
      case "in-progress":
        return <AlertTriangle className="h-4 w-4" />;
      case "pending":
        return <Clock className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const totalPagesArray = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">
            Contact Inquiries
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage customer contact inquiries and responses
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search contacts..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10"
            />
          </div>

          <Select
            value={statusFilter}
            onValueChange={(value) => {
              setStatusFilter(value);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Inquiries
              </p>
              <p className="text-2xl font-bold">{totalContacts}</p>
            </div>
            <MessageCircle className="h-8 w-8 text-blue-500" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Pending
              </p>
              <p className="text-2xl font-bold">
                {contacts.filter((c) => c.status === "pending").length}
              </p>
            </div>
            <Clock className="h-8 w-8 text-red-500" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Resolved
              </p>
              <p className="text-2xl font-bold">
                {contacts.filter((c) => c.status === "resolved").length}
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </CardContent>
        </Card>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-3" />
            <p className="text-muted-foreground">Loading contacts...</p>
          </div>
        </div>
      )}

      {/* Contacts list */}
      {!loading && (
        <Card>
          <CardContent className="p-0">
            <div className="divide-y">
              {contacts.length === 0 ? (
                <div className="p-8 text-center">
                  <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-1">
                    No contacts found
                  </h3>
                  <p className="text-muted-foreground">
                    {searchTerm || statusFilter !== "all"
                      ? "Try adjusting your search or filter criteria"
                      : "No contact inquiries received yet"}
                  </p>
                </div>
              ) : (
                contacts.map((contact) => (
                  <div
                    key={contact._id}
                    className="p-4 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium text-foreground truncate">
                            {contact.name}
                          </h3>
                          <Badge
                            className={`text-xs ${getStatusBadgeVariant(
                              contact.status
                            )}`}
                          >
                            <div className="flex items-center gap-1">
                              {getStatusIcon(contact.status)}
                              {contact.status.charAt(0).toUpperCase() +
                                contact.status.slice(1)}
                            </div>
                          </Badge>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-2">
                          <div className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            <span className="truncate max-w-[150px]">
                              {contact.email}
                            </span>
                          </div>

                          {contact.phone && (
                            <div className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              <span>{contact.phone}</span>
                            </div>
                          )}

                          {contact.subject && (
                            <div className="flex items-center gap-1">
                              <span className="font-medium">Subject:</span>
                              <span className="truncate max-w-[200px]">
                                {contact.subject}
                              </span>
                            </div>
                          )}
                        </div>

                        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                          {contact.message}
                        </p>

                        <p className="text-xs text-muted-foreground">
                          {formatDate(contact.createdAt)}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewContact(contact._id)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedContact(contact);
                            setIsEditModalOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Respond
                        </Button>
                      </div>
                    </div>

                    {contact.note && (
                      <div className="mt-3 p-3 bg-muted rounded-lg">
                        <p className="text-sm font-medium text-muted-foreground mb-1">
                          Note:
                        </p>
                        <p className="text-sm">{contact.note}</p>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="p-4 border-t flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Showing {(currentPage - 1) * limit + 1} to{" "}
                  {Math.min(currentPage * limit, totalContacts)} of{" "}
                  {totalContacts} inquiries
                </p>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>

                  <div className="flex gap-1">
                    {totalPagesArray.map((page) => (
                      <Button
                        key={page}
                        variant={page === currentPage ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        className={page === currentPage ? "bg-primary" : ""}
                      >
                        {page}
                      </Button>
                    ))}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* View Contact Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Contact Details</DialogTitle>
          </DialogHeader>

          {selectedContact && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Name</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{selectedContact.name}</span>
                  </div>
                </div>

                <div>
                  <Label>Email</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedContact.email}</span>
                  </div>
                </div>

                {selectedContact.phone && (
                  <div>
                    <Label>Phone</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedContact.phone}</span>
                    </div>
                  </div>
                )}

                {selectedContact.subject && (
                  <div>
                    <Label>Subject</Label>
                    <p className="mt-1">{selectedContact.subject}</p>
                  </div>
                )}

                <div>
                  <Label>Status</Label>
                  <div className="mt-1">
                    <Badge
                      className={`${getStatusBadgeVariant(
                        selectedContact.status
                      )}`}
                    >
                      <div className="flex items-center gap-1">
                        {getStatusIcon(selectedContact.status)}
                        {selectedContact.status.charAt(0).toUpperCase() +
                          selectedContact.status.slice(1)}
                      </div>
                    </Badge>
                  </div>
                </div>

                <div>
                  <Label>Date</Label>
                  <p className="mt-1">
                    {formatDate(selectedContact.createdAt)}
                  </p>
                </div>
              </div>

              <div>
                <Label>Message</Label>
                <div className="mt-1 p-3 bg-muted rounded-lg">
                  <p>{selectedContact.message}</p>
                </div>
              </div>

              {selectedContact.note && (
                <div>
                  <Label>Note</Label>
                  <div className="mt-1 p-3 bg-muted rounded-lg">
                    <p>{selectedContact.note}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Contact Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Respond to Contact</DialogTitle>
          </DialogHeader>

          {selectedContact && (
            <div className="space-y-4">
              <div>
                <Label>From</Label>
                <p className="font-medium">
                  {selectedContact.name} &lt;{selectedContact.email}&gt;
                </p>
              </div>

              <div>
                <Label>Message</Label>
                <div className="mt-1 p-3 bg-muted rounded-lg">
                  <p>{selectedContact.message}</p>
                </div>
              </div>

              <div>
                <Label>Status</Label>
                <Select
                  value={selectedContact.status}
                  onValueChange={(value) => {
                    const updatedContact = {
                      ...selectedContact,
                      status: value as any,
                    };
                    setSelectedContact(updatedContact);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Note (Optional)</Label>
                <Textarea
                  value={selectedContact.note || ""}
                  onChange={(e) => {
                    const updatedContact = {
                      ...selectedContact,
                      note: e.target.value,
                    };
                    setSelectedContact(updatedContact);
                  }}
                  placeholder="Add a note about this contact inquiry..."
                  rows={4}
                />
              </div>

              <Button
                onClick={() => {
                  if (selectedContact) {
                    handleStatusUpdate(
                      selectedContact._id,
                      selectedContact.status
                    );
                    if (selectedContact.note) {
                      handleNoteUpdate(
                        selectedContact._id,
                        selectedContact.note
                      );
                    }
                  }
                }}
                disabled={updating}
                className="w-full"
              >
                {updating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Update Contact
                  </>
                )}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
