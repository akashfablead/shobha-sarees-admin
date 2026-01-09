import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Star, Plus, Pencil, Trash2, Search } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  getTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from "@/services/adminService";

interface Testimonial {
  _id?: string;
  id: string;
  name: string;
  review: string;
  rating: number;
  isFeatured: boolean;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface TestimonialForm {
  name: string;
  review: string;
  rating: number;
  isFeatured: boolean;
  isActive: boolean;
}

const defaultFormData: TestimonialForm = {
  name: "",
  review: "",
  rating: 5,
  isFeatured: true,
  isActive: true,
};

export default function AdminTestimonials() {
  const [testimonialList, setTestimonialList] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [featuredFilter, setFeaturedFilter] = useState("all");
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [testimonialToDelete, setTestimonialToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [editingTestimonial, setEditingTestimonial] =
    useState<Testimonial | null>(null);
  const [formData, setFormData] = useState<TestimonialForm>(defaultFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const response = await getTestimonials();
      if (response.success) {
        // Normalize the data to match our interface
        const normalizedTestimonials = response.data.map(
          (testimonial: any) => ({
            ...testimonial,
            id: testimonial._id || testimonial.id,
          })
        );
        setTestimonialList(normalizedTestimonials);
      }
    } catch (error) {
      console.error("Error fetching testimonials:", error);
    } finally {
      setLoading(false);
    }
  };

  // Load testimonials on component mount
  useEffect(() => {
    fetchTestimonials();
  }, []);

  const filteredTestimonials = testimonialList.filter((testimonial) => {
    const matchesSearch =
      testimonial.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      testimonial.review.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && testimonial.isActive) ||
      (statusFilter === "inactive" && !testimonial.isActive);

    const matchesFeatured =
      featuredFilter === "all" ||
      (featuredFilter === "featured" && testimonial.isFeatured) ||
      (featuredFilter === "not-featured" && !testimonial.isFeatured);

    return matchesSearch && matchesStatus && matchesFeatured;
  });

  const handleEdit = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial);
    setFormData({
      name: testimonial.name,
      review: testimonial.review,
      rating: testimonial.rating,
      isFeatured: testimonial.isFeatured,
      isActive: testimonial.isActive,
    });
    setIsOpen(true);
  };

  const handleDelete = (testimonial: Testimonial) => {
    setTestimonialToDelete({ id: testimonial.id, name: testimonial.name });
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async (id: string) => {
    try {
      const response = await deleteTestimonial(id);
      if (response.success) {
        setTestimonialList(testimonialList.filter((t) => t.id !== id));
        toast.success("Testimonial deleted successfully");
      } else {
        toast.error(response.message || "Failed to delete testimonial");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to delete testimonial"
      );
      console.error("Error deleting testimonial:", error);
    } finally {
      setIsDeleteDialogOpen(false);
      setTestimonialToDelete(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (editingTestimonial) {
        // Update existing testimonial
        const response = await updateTestimonial(editingTestimonial.id, {
          name: formData.name,
          review: formData.review,
          rating: formData.rating,
          isFeatured: formData.isFeatured,
          isActive: formData.isActive,
        });

        if (response.success) {
          setTestimonialList(
            testimonialList.map((t) =>
              t.id === editingTestimonial.id ? { ...t, ...response.data } : t
            )
          );
          toast.success("Testimonial updated successfully");
        }
      } else {
        // Create new testimonial
        const response = await createTestimonial({
          name: formData.name,
          review: formData.review,
          rating: formData.rating,
          isFeatured: formData.isFeatured,
          isActive: formData.isActive,
        });

        if (response.success === true) {
          setTestimonialList([
            ...testimonialList,
            { ...response.data, id: response.data._id || response.data.id },
          ]);
          toast.success("Testimonial created successfully");
        }
      }

      setIsOpen(false);
      setEditingTestimonial(null);
      setFormData(defaultFormData);
    } catch (error) {
      console.error(
        editingTestimonial
          ? "Error updating testimonial:"
          : "Error creating testimonial:",
        error
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">
            Testimonials
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage customer testimonials
          </p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingTestimonial(null);
                setFormData(defaultFormData);
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Testimonial
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
            <DialogHeader className="p-6 pb-0">
              <DialogTitle>
                {editingTestimonial
                  ? "Edit Testimonial"
                  : "Add New Testimonial"}
              </DialogTitle>
            </DialogHeader>
            <div className="overflow-y-auto flex-1 px-6 py-2">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Customer Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Enter customer name"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="rating">Rating</Label>
                  <Select
                    value={formData.rating.toString()}
                    onValueChange={(value) =>
                      setFormData({ ...formData, rating: parseInt(value) })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select rating" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <SelectItem key={rating} value={rating.toString()}>
                          {rating} Star{rating > 1 ? "s" : ""} (
                          {"★".repeat(rating)}
                          {"☆".repeat(5 - rating)})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>
                      <Input
                        type="checkbox"
                        checked={formData.isFeatured}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            isFeatured: e.target.checked,
                          })
                        }
                        className="mr-2"
                      />
                      Featured
                    </Label>
                  </div>
                  <div>
                    <Label>
                      <Input
                        type="checkbox"
                        checked={formData.isActive}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            isActive: e.target.checked,
                          })
                        }
                        className="mr-2"
                      />
                      Active
                    </Label>
                  </div>
                </div>

                <div>
                  <Label htmlFor="review">Review</Label>
                  <Textarea
                    id="review"
                    value={formData.review}
                    onChange={(e) =>
                      setFormData({ ...formData, review: e.target.value })
                    }
                    placeholder="Enter customer review"
                    rows={4}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="animate-spin mr-2">⏳</span>
                      {editingTestimonial ? "Updating..." : "Adding..."}
                    </>
                  ) : editingTestimonial ? (
                    "Update Testimonial"
                  ) : (
                    "Add Testimonial"
                  )}
                </Button>
              </form>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search testimonials..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
        <Select value={featuredFilter} onValueChange={setFeaturedFilter}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Featured" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="featured">Featured</SelectItem>
            <SelectItem value="not-featured">Not Featured</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Testimonials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTestimonials.map((testimonial) => (
          <Card key={testimonial.id} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium text-foreground truncate">
                    {testimonial.name}
                  </h3>
                  <div className="flex items-center mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < testimonial.rating
                            ? "text-yellow-500 fill-current"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex gap-1">
                  {testimonial.isFeatured && (
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      Featured
                    </span>
                  )}
                  {testimonial.isActive ? (
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      Active
                    </span>
                  ) : (
                    <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                      Inactive
                    </span>
                  )}
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-2 line-clamp-3">
                "{testimonial.review}"
              </p>
              <div className="flex gap-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => handleEdit(testimonial)}
                >
                  <Pencil className="h-3 w-3 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(testimonial)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTestimonials.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No testimonials found</p>
        </div>
      )}

      {loading && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading testimonials...</p>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              testimonial "{testimonialToDelete?.name}" and remove it from our
              servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setTestimonialToDelete(null);
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                testimonialToDelete && confirmDelete(testimonialToDelete.id)
              }
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
