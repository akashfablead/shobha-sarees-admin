import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  getReviews,
  updateReviewStatus,
  deleteReview,
  toggleReviewFeatured,
} from "@/services/adminService";
import { Star } from "lucide-react";

interface Review {
  id: string;
  name: string;
  email: string;
  phone?: string;
  productId: {
    id: string;
    name: string;
    image?: string;
  };
  productName: string;
  rating: number;
  review: string;
  isApproved: boolean;
  isFeatured: boolean;
  helpfulCount: number;
  createdAt: string;
}

const AdminReviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(0);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [reviewToDelete, setReviewToDelete] = useState<Review | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await getReviews(statusFilter, page, limit);

      if (response.success) {
        const reviewsData = response.data.reviews || response.data;
        const pagination = response.data.pagination;

        // Normalize the data to match our interface
        const normalizedReviews = reviewsData.map((review: any) => ({
          ...review,
          id: review._id || review.id,
          productId: review.productId || {},
        }));

        setReviews(normalizedReviews);

        if (pagination) {
          setTotal(pagination.total);
          setPages(pagination.pages);
          setPage(pagination.page || page);
        }
      } else {
        toast.error(response.message || "Failed to fetch reviews");
      }
    } catch (error: any) {
      console.error("Error fetching reviews:", error);
      toast.error(error.response?.data?.message || "Failed to fetch reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [page, limit, statusFilter]);

  const handleStatusChange = async (reviewId: string, status: boolean) => {
    try {
      const response = await updateReviewStatus(reviewId, status);
      if (response.success) {
        setReviews((prev) =>
          prev.map((review) =>
            review.id === reviewId ? { ...review, isApproved: status } : review
          )
        );
        toast.success(
          `Review ${status ? "approved" : "rejected"} successfully`
        );
      } else {
        toast.error(response.message || "Failed to update review status");
      }
    } catch (error: any) {
      console.error("Error updating review status:", error);
      toast.error(
        error.response?.data?.message || "Failed to update review status"
      );
    }
  };

  const handleToggleFeatured = async (reviewId: string) => {
    try {
      const response = await toggleReviewFeatured(reviewId);
      if (response.success) {
        setReviews((prev) =>
          prev.map((review) =>
            review.id === reviewId
              ? { ...review, isFeatured: !review.isFeatured }
              : review
          )
        );
        toast.success(`Review ${response.data.message}`);
      } else {
        toast.error(response.message || "Failed to toggle featured status");
      }
    } catch (error: any) {
      console.error("Error toggling featured status:", error);
      toast.error(
        error.response?.data?.message || "Failed to toggle featured status"
      );
    }
  };

  const confirmDelete = async () => {
    if (!reviewToDelete) return;

    try {
      const response = await deleteReview(reviewToDelete.id);
      if (response.success) {
        setReviews((prev) =>
          prev.filter((review) => review.id !== reviewToDelete.id)
        );
        toast.success("Review deleted successfully");
      } else {
        toast.error(response.message || "Failed to delete review");
      }
    } catch (error: any) {
      console.error("Error deleting review:", error);
      toast.error(error.response?.data?.message || "Failed to delete review");
    } finally {
      setIsDeleteDialogOpen(false);
      setReviewToDelete(null);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={16}
            className={`${
              i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">
            Reviews
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage customer reviews and ratings
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search reviews..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Reviews</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Reviews Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Reviewer</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Review</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Featured</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    Loading reviews...
                  </TableCell>
                </TableRow>
              ) : reviews.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    No reviews found
                  </TableCell>
                </TableRow>
              ) : (
                reviews.map((review) => (
                  <TableRow key={review.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{review.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {review.email}
                        </div>
                        {review.phone && (
                          <div className="text-sm text-muted-foreground">
                            {review.phone}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{review.productName}</div>
                        {review.productId?.name && (
                          <div className="text-sm text-muted-foreground">
                            {review.productId.name}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {renderStars(review.rating)}
                        <span className="ml-2 text-sm">{review.rating}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="link"
                            className="p-0 h-auto text-left"
                          >
                            {review.review.length > 50
                              ? `${review.review.substring(0, 50)}...`
                              : review.review}
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                          <DialogHeader>
                            <DialogTitle>Review Details</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <h4 className="font-medium">
                                Reviewer Information
                              </h4>
                              <p className="text-sm">
                                <strong>Name:</strong> {review.name}
                              </p>
                              <p className="text-sm">
                                <strong>Email:</strong> {review.email}
                              </p>
                              {review.phone && (
                                <p className="text-sm">
                                  <strong>Phone:</strong> {review.phone}
                                </p>
                              )}
                            </div>
                            <div>
                              <h4 className="font-medium">Review</h4>
                              <p className="text-sm">{review.review}</p>
                            </div>
                            <div className="flex items-center">
                              <span className="mr-2">Rating:</span>
                              {renderStars(review.rating)}
                              <span className="ml-2">{review.rating}/5</span>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={review.isApproved ? "default" : "secondary"}
                      >
                        {review.isApproved ? "Approved" : "Pending"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={review.isFeatured ? "default" : "secondary"}
                      >
                        {review.isFeatured ? "Featured" : "Not Featured"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(review.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {!review.isApproved ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleStatusChange(review.id, true)}
                          >
                            Approve
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleStatusChange(review.id, false)}
                          >
                            Reject
                          </Button>
                        )}

                        <Button
                          variant={review.isFeatured ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleToggleFeatured(review.id)}
                        >
                          {review.isFeatured ? "Unfeature" : "Feature"}
                        </Button>

                        <AlertDialog
                          open={
                            isDeleteDialogOpen &&
                            reviewToDelete?.id === review.id
                          }
                        >
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => {
                                setReviewToDelete(review);
                                setIsDeleteDialogOpen(true);
                              }}
                            >
                              Delete
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will permanently delete the review from "
                                {review.name}". This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel
                                onClick={() => setIsDeleteDialogOpen(false)}
                              >
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={confirmDelete}
                                className="bg-destructive hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination Controls */}
      {pages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {(page - 1) * limit + 1}-{Math.min(page * limit, total)} of{" "}
            {total} reviews
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page <= 1}
            >
              Previous
            </Button>

            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, pages) }, (_, i) => {
                let pageNum;
                if (pages <= 5) {
                  pageNum = i + 1;
                } else if (page <= 3) {
                  pageNum = i + 1;
                } else if (page >= pages - 2) {
                  pageNum = pages - 4 + i;
                } else {
                  pageNum = page - 2 + i;
                }

                return (
                  <Button
                    key={pageNum}
                    variant={page === pageNum ? "default" : "outline"}
                    size="sm"
                    onClick={() => setPage(pageNum)}
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(Math.min(pages, page + 1))}
              disabled={page >= pages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReviews;
