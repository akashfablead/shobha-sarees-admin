import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Pencil, Trash2, Image, Search } from "lucide-react";
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
  price: number;
  collectionId: string; // This is the collection ID

  fabric: string;
  color: string;
  work: string;
  image?: string;
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
  price: number;

  collectionId: CollectionType;
  fabric: string;
  color: string;
  work: string;
  image?: File | null | undefined;
}

const defaultFormData: SareeForm = {
  name: "",
  description: "",
  price: 0,

  collectionId: "", // Will be converted to collection ID on submit
  fabric: "",
  color: "",
  work: "",
};

export default function AdminSarees() {
  const [collections, setCollections] = useState<any[]>([]); // For collections dropdown

  const [categories, setCategories] = useState<string[]>([]); // For categories dropdown
  const [sareeList, setSareeList] = useState<Saree[]>([]);
  const [loading, setLoading] = useState(true);
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
  const [formData, setFormData] = useState<SareeForm>(defaultFormData);

  const fetchSarees = async () => {
    try {
      setLoading(true);
      const response = await getSarees();
      if (response.success) {
        // Handle pagination data if present
        const sareesData = response.data.sarees || response.data;

        // Normalize the data to match our interface
        const normalizedSarees = sareesData.map((saree: any) => ({
          ...saree,
          id: saree._id || saree.id,
        }));
        setSareeList(normalizedSarees);
      }
    } catch (error) {
      console.error("Error fetching sarees:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCollections = async () => {
    try {
      const response = await getCollections();
      if (response.success && response.data) {
        // Store full collection objects
        setCollections(response.data);
      }
    } catch (error) {
      console.error("Error fetching collections:", error);
    }
  };

  // Load sarees and collections on component mount
  useEffect(() => {
    fetchSarees();
    fetchCollections();
  }, []);

  const filteredSarees = sareeList.filter((saree) => {
    const matchesSearch = saree.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesCategory = true;
    const matchesCollection =
      collectionFilter === "all" || saree.collectionId === collectionFilter;
    return matchesSearch && matchesCategory && matchesCollection;
  });

  const handleEdit = (saree: Saree) => {
    setEditingSaree(saree);

    const collectionName = saree.collection?.name || "";

    setFormData({
      name: saree.name,
      description: saree.description,
      price: saree.price,

      collectionId: saree.collectionId || "", // Use collection ID for display
      fabric: saree.fabric,
      color: saree.color,
      work: saree.work,
    });
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

    try {
      // Convert collection name to ID
      const selectedCollection = collections.find(
        (c) => c._id === formData.collectionId
      );
      const collectionId = selectedCollection ? selectedCollection._id : "";

      if (editingSaree) {
        // Update existing saree
        const response = await updateSaree(editingSaree.id, {
          name: formData.name,
          description: formData.description,
          price: formData.price,
          collectionId: formData.collectionId, // ✅ direct ID
          fabric: formData.fabric,
          color: formData.color,
          work: formData.work,
          image: formData.image,
        });

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
          name: formData.name,
          description: formData.description,
          price: formData.price,
          collectionId: formData.collectionId, // ✅ ID
          fabric: formData.fabric,
          color: formData.color,
          work: formData.work,
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
      setFormData(defaultFormData);
    } catch (error) {
      console.error(
        editingSaree ? "Error updating saree:" : "Error creating saree:",
        error
      );
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
                    <Label htmlFor="price">Price (₹)</Label>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          price: Number(e.target.value),
                        })
                      }
                      placeholder="18999"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="collectionId">Collection</Label>

                    <Select
                      value={formData.collectionId}
                      onValueChange={(value) =>
                        setFormData({ ...formData, collectionId: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select collection" />
                      </SelectTrigger>

                      <SelectContent>
                        {collections.map((collection) => (
                          <SelectItem
                            key={collection._id}
                            value={collection._id}
                          >
                            {collection.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                      setFormData({ ...formData, description: e.target.value })
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
                        setFormData({
                          ...formData,
                          image: files[0], // ya array bana sakte ho agar backend support karta ho
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
                      Click to upload images
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      PNG, JPG, JPEG allowed
                    </p>
                  </label>
                </div>

                <Button type="submit" className="w-full">
                  {editingSaree ? "Update Saree" : "Add Saree"}
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
            placeholder="Search sarees..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={collectionFilter} onValueChange={setCollectionFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="All Collections" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Collections</SelectItem>
            {collections.map((collection) => (
              <SelectItem key={collection._id} value={collection._id}>
                {collection.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Sarees Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredSarees.map((saree) => (
          <Card key={saree.id} className="overflow-hidden">
            <div className="aspect-[3/4] bg-muted">
              <img
                src={saree.image}
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
              <p className="text-primary font-semibold mt-1">
                ₹{saree.price.toLocaleString()}
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

      {filteredSarees.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No sarees found</p>
        </div>
      )}
    </div>
  );
}
