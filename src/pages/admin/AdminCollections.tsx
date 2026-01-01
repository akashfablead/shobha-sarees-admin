import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Plus,
  Pencil,
  Trash2,
  Image,
  GripVertical,
  FolderOpen,
} from "lucide-react";
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
  getCollections,
  createCollection,
  updateCollection,
  deleteCollection,
} from "@/services/adminService";

interface Collection {
  _id?: string;
  id: string;
  name: string;
  description: string;
  image?: string;
  sareeCount?: number;
  featured: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export default function AdminCollections() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState<Collection | null>(
    null
  );
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    featured: false,
    image: null as File | null | undefined,
  });

  // Load collections on component mount
  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    try {
      setLoading(true);
      const response = await getCollections();
      if (response.success) {
        // Normalize the data to match our interface
        const normalizedCollections = response.data.map((collection: any) => ({
          ...collection,
          id: collection._id || collection.id,
        }));
        setCollections(normalizedCollections);
      }
    } catch (error) {
      toast.error("Failed to load collections");
      console.error("Error fetching collections:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingCollection) {
        // Update existing collection
        const response = await updateCollection(editingCollection.id, {
          name: formData.name,
          description: formData.description,
          featured: formData.featured,
          image: formData.image,
        });

        if (response.success) {
          setCollections(
            collections.map((c) =>
              c.id === editingCollection.id
                ? {
                    ...c,
                    ...response.data,
                    id: response.data._id || response.data.id,
                  }
                : c
            )
          );
          toast.success("Collection updated successfully");
        }
      } else {
        // Create new collection
        const response = await createCollection({
          name: formData.name,
          description: formData.description,
          featured: formData.featured,
          image: formData.image,
        });

        if (response.success) {
          setCollections([
            ...collections,
            {
              ...response.data,
              id: response.data._id || response.data.id,
              image: response.data.image || undefined,
              sareeCount: response.data.sareeCount || 0,
            },
          ]);
          toast.success("Collection created successfully");
        }
      }

      setIsOpen(false);
      setEditingCollection(null);
      setFormData({
        name: "",
        description: "",
        featured: false,
        image: undefined,
      });
      // Refresh the collections list
      await fetchCollections();
    } catch (error) {
      toast.error(
        editingCollection
          ? "Failed to update collection"
          : "Failed to create collection"
      );
      console.error(
        editingCollection
          ? "Error updating collection:"
          : "Error creating collection:",
        error
      );
    }
  };

  const handleEdit = (collection: Collection) => {
    setEditingCollection(collection);
    setFormData({
      name: collection.name,
      description: collection.description,
      featured: collection.featured,
      image: undefined,
    });
    setIsOpen(true);
  };

  const handleDelete = async (id: string, name: string) => {
    try {
      const response = await deleteCollection(id);
      if (response.success) {
        setCollections(collections.filter((c) => c.id !== id));
        toast.success("Collection deleted successfully");
      }
    } catch (error) {
      toast.error("Failed to delete collection");
      console.error("Error deleting collection:", error);
    }
  };

  const toggleFeatured = async (id: string) => {
    try {
      const collection = collections.find((c) => c.id === id);
      if (!collection) return;

      const response = await updateCollection(id, {
        name: collection.name,
        description: collection.description,
        featured: !collection.featured,
      });

      if (response.success) {
        // Refresh the collections list
        await fetchCollections();
        toast.success("Collection updated successfully");
      }
    } catch (error) {
      toast.error("Failed to update collection");
      console.error("Error updating collection featured status:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">
            Collections
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your saree collections
          </p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingCollection(null);
                setFormData({
                  name: "",
                  description: "",
                  featured: false,
                  image: undefined,
                });
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Collection
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingCollection ? "Edit Collection" : "Add New Collection"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Collection Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Enter collection name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Enter description"
                />
              </div>
              <div>
                <Label className="mb-2 block">Cover Image</Label>

                <div className="space-y-2">
                  {/* Hidden file input */}
                  <input
                    id="coverImage"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      setFormData({
                        ...formData,
                        image: file || undefined,
                      });
                    }}
                  />

                  {/* Upload Box */}
                  <label
                    htmlFor="coverImage"
                    className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors"
                  >
                    <Image className="h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Click to upload image
                    </p>
                  </label>

                  {/* Preview */}
                  {formData.image && (
                    <div className="mt-2">
                      <p className="text-sm text-muted-foreground mb-1">
                        Preview:
                      </p>
                      <div className="border rounded-lg p-2 max-w-xs">
                        <img
                          src={URL.createObjectURL(formData.image)}
                          alt="Cover preview"
                          className="w-full h-32 object-cover rounded"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) =>
                    setFormData({ ...formData, featured: e.target.checked })
                  }
                  className="rounded"
                />
                <Label htmlFor="featured">Featured on homepage</Label>
              </div>
              <Button type="submit" className="w-full">
                {editingCollection ? "Update Collection" : "Create Collection"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading collections...</p>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!loading && collections.length === 0 && (
        <div className="text-center py-12">
          <div className="mx-auto h-24 w-24 rounded-full bg-muted flex items-center justify-center">
            <FolderOpen className="h-12 w-12 text-muted-foreground" />
          </div>
          <h3 className="mt-4 text-lg font-medium text-foreground">
            No collections yet
          </h3>
          <p className="mt-2 text-muted-foreground max-w-md mx-auto">
            Get started by creating your first collection.
          </p>
          <div className="mt-6">
            <Button
              onClick={() => {
                setEditingCollection(null);
                setFormData({
                  name: "",
                  description: "",
                  featured: false,
                  image: undefined,
                });
                setIsOpen(true);
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Create your first collection
            </Button>
          </div>
        </div>
      )}

      {/* Collections list */}
      {!loading && collections.length > 0 && (
        <div className="space-y-3">
          {collections.map((collection) => (
            <Card key={collection.id} className="flex items-center p-4">
              <GripVertical className="h-5 w-5 text-muted-foreground mr-3 cursor-grab" />
              <div className="w-16 h-16 bg-muted rounded overflow-hidden mr-4">
                <img
                  src={collection.image || "/placeholder.svg"}
                  alt={collection.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/placeholder.svg";
                  }}
                />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-foreground">
                  {collection.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {collection.description}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {collection.sareeCount || 0} sarees
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => toggleFeatured(collection.id)}
                  className={`px-3 py-1 text-xs rounded-full transition-colors ${
                    collection.featured
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {collection.featured ? "Featured" : "Not Featured"}
                </button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleEdit(collection)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete the collection "{collection.name}" and remove it
                        from our servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() =>
                          handleDelete(collection.id, collection.name)
                        }
                        className="bg-destructive hover:bg-destructive/90"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
