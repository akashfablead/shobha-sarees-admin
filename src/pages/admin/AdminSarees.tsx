import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Pencil, Trash2, Image, Search, Loader2 } from "lucide-react";
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
  getSarees,
  createSaree,
  updateSaree,
  deleteSaree,
  getCollections,
  getCategories,
} from "@/services/adminService";

interface Catalog {
  _id: string;
  name: string;
  description: string;
  image?: string;
  status: string;
  sareeIds: string[];
  createdAt?: string;
  updatedAt?: string;
}

interface Saree {
  _id?: string;
  id: string;
  name: string;
  description: string;
  collectionId: string; // This is the collection ID

  fabric: string;
  color: string;
  work: string;
  image?: string;
  images?: string[]; // Add support for multiple images
  createdAt?: string;
  updatedAt?: string;

  collection?: {
    id: string;
    name: string;
    description: string;
    image?: string;
    featured: boolean;
  };
}

type CollectionType = Saree["collectionId"];

interface SareeForm {
  name: string;
  description: string;

  collectionId: CollectionType;
  fabric: string;
  color: string;
  work: string;
  image?: File | File[] | null | undefined; // Support both single and multiple files
  removeImages?: string[];
}

const defaultFormData: SareeForm = {
  name: "",
  description: "",

  collectionId: "", // Required field - must be selected
  fabric: "",
  color: "",
  work: "",
};

export default function AdminSarees() {
  const [collections, setCollections] = useState<any[]>([]); // For collections dropdown
  const [collectionsLoading, setCollectionsLoading] = useState(true);

  const [categories, setCategories] = useState<string[]>([]); // For categories dropdown
  const [sareeList, setSareeList] = useState<Saree[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [collectionFilter, setCollectionFilter] = useState("all");
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [sareeToDelete, setSareeToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [editingSaree, setEditingSaree] = useState<Saree | null>(null);
  const [imagesToRemove, setImagesToRemove] = useState<string[]>([]);
  const [formData, setFormData] = useState<SareeForm>(defaultFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchSarees = async () => {
    try {
      setLoading(true);
      const response = await getSarees(
        categoryFilter === "all" ? undefined : categoryFilter,
        searchTerm,
        page,
        limit,
        collectionFilter === "all" ? undefined : collectionFilter
      );
      if (response.success) {
        // Handle pagination data if present
        const sareesData = response.data.sarees || response.data;
        const pagination = response.data.pagination;

        // Debug log to see the actual data structure
        console.log("Raw sarees data:", sareesData);

        // Normalize the data to match our interface
        const normalizedSarees = sareesData.map((saree: any) => ({
          ...saree,
          id: saree._id || saree.id,
        }));

        // Debug log to see normalized data
        console.log("Normalized sarees:", normalizedSarees);

        setSareeList(normalizedSarees);

        if (pagination) {
          setTotal(pagination.total);
          setPages(pagination.pages);
          setPage(pagination.page || page); // Update current page if needed
        }
      }
    } catch (error) {
      console.error("Error fetching sarees:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCollections = async () => {
    try {
      setCollectionsLoading(true);
      console.log("Fetching collections...");
      const response = await getCollections();
      console.log("Collections response:", response);

      if (response.success && response.data) {
        // Ensure collection objects have the expected structure
        const normalizedCollections = response.data.map((collection) => ({
          ...collection,
          _id: collection._id || collection.id,
          id: collection.id || collection._id,
        }));

        // Store full collection objects
        setCollections(normalizedCollections);
        console.log("Collections loaded:", normalizedCollections);
        console.log("Number of collections:", normalizedCollections.length);
        console.log("First collection:", normalizedCollections[0]);
        console.log(
          "First collection structure:",
          JSON.stringify(normalizedCollections[0], null, 2)
        );
      } else {
        console.error("Failed to load collections:", response);
        setCollections([]);
      }
    } catch (error) {
      console.error("Error fetching collections:", error);
      setCollections([]);
      toast.error("Failed to load collections");
    } finally {
      setCollectionsLoading(false);
      console.log("Collections loading finished");
    }
  };

  // Load sarees and collections on component mount
  useEffect(() => {
    fetchSarees();
    fetchCollections();
  }, []);

  // Debug logging for form data changes
  useEffect(() => {
    console.log("Form Data Changed:", formData);
    console.log("Selected Collection ID:", formData.collectionId);
    console.log("Available collections:", collections);
    console.log("Collections loading:", collectionsLoading);

    if (formData.collectionId) {
      const selectedCollection = collections.find(
        (c) => c._id === formData.collectionId
      );
      console.log("Selected Collection:", selectedCollection);
    } else {
      console.log("No collection selected");
    }

    // Log image data
    if (formData.image) {
      console.log("Image data:", formData.image);
      if (Array.isArray(formData.image)) {
        console.log("Number of images:", formData.image.length);
      }
    }
  }, [formData, collections, collectionsLoading]);

  // Real-time form validation
  useEffect(() => {
    // Clear error messages when form becomes valid
    if (
      formData.name.trim() &&
      formData.collectionId &&
      formData.fabric.trim() &&
      formData.color.trim() &&
      formData.work.trim() &&
      formData.description.trim()
    ) {
      // Form is valid
      console.log("Form is valid");
    }
  }, [formData]);

  // Reload sarees when filters change
  useEffect(() => {
    setPage(1); // Reset to first page when filters change
    fetchSarees();
  }, [categoryFilter, searchTerm, collectionFilter]);

  // Reload sarees when page or limit changes
  useEffect(() => {
    fetchSarees();
  }, [page, limit]);

  // Use the sareeList as is since filtering is done on the server
  const displayedSarees = sareeList;

  const handleEdit = (saree: Saree) => {
    console.log("Editing saree:", saree);
    console.log("Saree collectionId:", saree.collectionId);

    setEditingSaree(saree);

    const formDataToSet = {
      name: saree.name || "",
      description: saree.description || "",

      collectionId: saree.collectionId || "", // This is crucial
      fabric: saree.fabric || "",
      color: saree.color || "",
      work: saree.work || "",
      image: null, // Don't prefill with existing images for editing
    };

    console.log(
      "Setting form data for edit - saree collectionId:",
      saree.collectionId
    );
    console.log(
      "Setting form data for edit - formDataToSet collectionId:",
      formDataToSet.collectionId
    );

    console.log("Setting form data for edit:", formDataToSet);
    console.log("Collections available for edit:", collections);
    setFormData(formDataToSet);
    setIsOpen(true);
  };

  const handleDelete = (saree: Saree) => {
    setSareeToDelete({ id: saree.id, name: saree.name });
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async (id: string) => {
    try {
      const response = await deleteSaree(id);
      if (response.success) {
        setSareeList(sareeList.filter((s) => s.id !== id));
        toast.success("Saree deleted successfully");
      } else {
        toast.error(response.message || "Failed to delete saree");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to delete saree"
      );
      console.error("Error deleting saree:", error);
    } finally {
      setIsDeleteDialogOpen(false);
      setSareeToDelete(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Form validation
    if (!formData.name.trim()) {
      toast.error("Saree name is required");
      return;
    }

    if (!formData.collectionId) {
      toast.error("Please select a collection");
      return;
    }

    if (!formData.fabric.trim()) {
      toast.error("Fabric is required");
      return;
    }

    if (!formData.color.trim()) {
      toast.error("Color is required");
      return;
    }

    if (!formData.work.trim()) {
      toast.error("Work type is required");
      return;
    }

    if (!formData.description.trim()) {
      toast.error("Description is required");
      return;
    }

    setIsSubmitting(true);

    // Debug log to see what data is being sent
    console.log("Form Data being submitted:", formData);
    console.log("Collection ID in form data:", formData.collectionId);
    console.log("Collections available:", collections);
    console.log(
      "Selected collection:",
      collections.find((c) => c._id === formData.collectionId)
    );

    try {
      if (editingSaree) {
        // Update existing saree
        const updateData: any = {
          name: formData.name.trim(),
          description: formData.description.trim(),
          collectionId: formData.collectionId, // This should now work
          fabric: formData.fabric.trim(),
          color: formData.color.trim(),
          work: formData.work.trim(),
          image: formData.image,
          ...(imagesToRemove.length > 0 && { removeImages: imagesToRemove }),
        };

        const response = await updateSaree(editingSaree.id, updateData);

        if (response.success) {
          setSareeList(
            sareeList.map((s) =>
              s.id === editingSaree.id ? { ...s, ...response.data } : s
            )
          );
          toast.success("Saree updated successfully");
        }
      } else {
        // Create new saree
        const response = await createSaree({
          name: formData.name.trim(),
          description: formData.description.trim(),
          collectionId: formData.collectionId, // This should now work
          fabric: formData.fabric.trim(),
          color: formData.color.trim(),
          work: formData.work.trim(),
          image: formData.image,
        });

        if (response.success === true) {
          setSareeList([
            ...sareeList,
            { ...response.data, id: response.data._id || response.data.id },
          ]);
          toast.success("Saree created successfully");
        }
      }

      setIsOpen(false);
      setEditingSaree(null);
      setImagesToRemove([]); // Clear removed images list
      console.log("Resetting form to default values");
      console.log("Default form data:", defaultFormData);
      setFormData(defaultFormData);
      console.log("Form data after reset:", formData);
    } catch (error) {
      console.error(
        editingSaree ? "Error updating saree:" : "Error creating saree:",
        error
      );
      toast.error(
        editingSaree ? "Failed to update saree" : "Failed to create saree"
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
            Sarees
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your saree inventory
          </p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingSaree(null);
                setFormData(defaultFormData);
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Saree
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
            <DialogHeader className="p-6 pb-0">
              <DialogTitle>
                {editingSaree ? "Edit Saree" : "Add New Saree"}
              </DialogTitle>
            </DialogHeader>
            <div className="overflow-y-auto flex-1 px-6 py-2">
              {collectionsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  <span className="ml-2">Loading collections...</span>
                </div>
              ) : collections.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">
                    No collections available
                  </p>
                  <Button
                    onClick={() =>
                      (window.location.href = "/admin/collections")
                    }
                    variant="outline"
                  >
                    Create Collection First
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Saree Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="Enter saree name"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <Label htmlFor="collectionId">Collection</Label>

                      <Select
                        value={formData.collectionId || ""}
                        onValueChange={(value) => {
                          console.log("Collection selected in Select:", value);
                          console.log(
                            "Current formData before update:",
                            formData
                          );
                          // Make sure we're not setting an empty or invalid value
                          if (
                            value &&
                            value !== "" &&
                            value !== "no-collections" &&
                            value !== "loading"
                          ) {
                            const newFormData = {
                              ...formData,
                              collectionId: value,
                            };
                            console.log("New formData to be set:", newFormData);
                            setFormData(newFormData);
                            console.log("Collection ID set to:", value);
                          } else {
                            console.log(
                              "Invalid value selected, not updating form. Value was:",
                              value
                            );
                          }
                        }}
                      >
                        <SelectTrigger
                          className={
                            formData.collectionId ? "" : "border-red-500"
                          }
                        >
                          <SelectValue placeholder="Select collection">
                            {formData.collectionId
                              ? collections.find(
                                  (c) =>
                                    (c._id || c.id) === formData.collectionId
                                )?.name || "Select collection"
                              : "Select collection"}
                          </SelectValue>
                        </SelectTrigger>

                        <SelectContent>
                          {collectionsLoading ? (
                            <SelectItem value="loading" disabled>
                              Loading collections...
                            </SelectItem>
                          ) : collections.length === 0 ? (
                            <SelectItem value="no-collections" disabled>
                              No collections available
                            </SelectItem>
                          ) : (
                            collections.map((collection) => (
                              <SelectItem
                                key={collection._id || collection.id}
                                value={collection._id || collection.id}
                              >
                                {collection.name}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                      {!formData.collectionId && (
                        <p className="text-sm text-red-500 mt-1">
                          Collection is required
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fabric">Fabric</Label>
                      <Input
                        id="fabric"
                        value={formData.fabric}
                        onChange={(e) =>
                          setFormData({ ...formData, fabric: e.target.value })
                        }
                        placeholder="e.g., Pure Silk"
                      />
                    </div>
                    <div>
                      <Label htmlFor="color">Color</Label>
                      <Input
                        id="color"
                        value={formData.color}
                        onChange={(e) =>
                          setFormData({ ...formData, color: e.target.value })
                        }
                        placeholder="e.g., Red"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="work">Work Type</Label>
                    <Input
                      id="work"
                      value={formData.work}
                      onChange={(e) =>
                        setFormData({ ...formData, work: e.target.value })
                      }
                      placeholder="e.g., Zari Work"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      placeholder="Enter description"
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label className="mb-2 block">Images</Label>

                    {/* Hidden file input */}
                    <input
                      id="sareeImages"
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(e) => {
                        const files = e.target.files;
                        if (files) {
                          // Convert FileList to array and store
                          const fileArray = Array.from(files);
                          setFormData({
                            ...formData,
                            image: fileArray,
                          });
                        }
                      }}
                    />

                    {/* Custom upload box */}
                    <label
                      htmlFor="sareeImages"
                      className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors"
                    >
                      <Image className="h-8 w-8 text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">
                        Click to upload multiple images
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        PNG, JPG, JPEG allowed (Max 10 images)
                      </p>
                    </label>

                    {/* Existing image previews when editing */}
                    {editingSaree && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium mb-2">
                          Existing Images
                        </h4>
                        <div className="grid grid-cols-3 gap-2">
                          {(editingSaree.images &&
                          editingSaree.images.length > 0
                            ? editingSaree.images
                            : [editingSaree.image]
                          )
                            .filter(Boolean)
                            .map((imgUrl, index) => {
                              // Check if this image is marked for removal
                              const isMarkedForRemoval =
                                imagesToRemove.includes(imgUrl);
                              return (
                                !isMarkedForRemoval && (
                                  <div
                                    key={`existing-${index}`}
                                    className="relative"
                                  >
                                    <img
                                      src={imgUrl}
                                      alt={`Existing ${index + 1}`}
                                      className="w-full h-24 object-cover rounded border"
                                    />
                                    <button
                                      type="button"
                                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                                      onClick={() => {
                                        // Mark this image for removal by adding to a state
                                        if (
                                          window.confirm(
                                            "Are you sure you want to remove this existing image?"
                                          )
                                        ) {
                                          setImagesToRemove((prev) => [
                                            ...prev,
                                            imgUrl,
                                          ]);
                                        }
                                      }}
                                    >
                                      ×
                                    </button>
                                    <div className="absolute bottom-1 left-1 bg-black bg-opacity-50 text-white text-xs px-1 rounded">
                                      {index + 1}
                                    </div>
                                  </div>
                                )
                              );
                            })}
                        </div>
                      </div>
                    )}

                    {/* New image previews */}
                    {formData.image &&
                      Array.isArray(formData.image) &&
                      formData.image.length > 0 && (
                        <div className="mt-4">
                          <h4 className="text-sm font-medium mb-2">
                            New Images to Upload
                          </h4>
                          <div className="grid grid-cols-3 gap-2">
                            {formData.image.map((file, index) => (
                              <div key={index} className="relative">
                                <img
                                  src={URL.createObjectURL(file)}
                                  alt={`Preview ${index + 1}`}
                                  className="w-full h-24 object-cover rounded border"
                                />
                                <button
                                  type="button"
                                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                                  onClick={() => {
                                    const newImages = [
                                      ...(formData.image as File[]),
                                    ];
                                    newImages.splice(index, 1);
                                    setFormData({
                                      ...formData,
                                      image:
                                        newImages.length > 0 ? newImages : null,
                                    });
                                  }}
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {editingSaree ? "Updating..." : "Adding..."}
                      </>
                    ) : editingSaree ? (
                      "Update Saree"
                    ) : (
                      "Add Saree"
                    )}
                  </Button>
                </form>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search sarees..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={collectionFilter} onValueChange={setCollectionFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue
              placeholder={
                collectionsLoading ? "Loading..." : "All Collections"
              }
            />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Collections</SelectItem>
            {!collectionsLoading &&
              collections.map((collection) => (
                <SelectItem key={collection._id} value={collection._id}>
                  {collection.name}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>

      {/* Sarees Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {displayedSarees.map((saree) => (
          <Card key={saree.id} className="overflow-hidden">
            <div className="aspect-[3/4] bg-muted">
              <img
                src={
                  (saree as any).images && (saree as any).images.length > 0
                    ? (saree as any).images[0]
                    : saree.image || "/placeholder-image.jpg"
                }
                alt={saree.name}
                className="w-full h-full object-cover"
              />
            </div>
            <CardContent className="p-4">
              <h3 className="font-medium text-foreground truncate">
                {saree.name}
              </h3>
              <p className="text-sm text-muted-foreground">
                {saree.collection?.name || saree.collectionId}
              </p>

              <div className="flex gap-2 mt-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => handleEdit(saree)}
                >
                  <Pencil className="h-3 w-3 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(saree)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
                <AlertDialog
                  open={isDeleteDialogOpen && sareeToDelete?.id === saree.id}
                >
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete the saree "{saree.name}" and remove it from our
                        servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel
                        onClick={() => {
                          setIsDeleteDialogOpen(false);
                          setSareeToDelete(null);
                        }}
                      >
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => confirmDelete(saree.id)}
                        className="bg-destructive hover:bg-destructive/90"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {displayedSarees.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No sarees found</p>
        </div>
      )}

      {/* Pagination Controls */}
      {pages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {(page - 1) * limit + 1}-{Math.min(page * limit, total)} of{" "}
            {total} sarees
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
}
