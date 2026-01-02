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
  ChevronDown,
  ChevronUp,
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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { toast } from "sonner";
import {
  getCatalogs,
  createCatalog,
  updateCatalog,
  deleteCatalog,
  addSareeToCatalog,
  removeSareeFromCatalog,
  getSarees,
} from "@/services/adminService";

interface SareeVariety {
  id: string;
  name: string;
  price: number;
  color: string;
  image: string;
}

interface Catalog {
  _id?: string;
  id: string;
  name: string;
  description: string;
  image?: string;
  status: "active" | "draft";
  sarees: SareeVariety[];
  createdAt?: string;
  updatedAt?: string;
}

export default function AdminCatalogs() {
  const [catalogs, setCatalogs] = useState<Catalog[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [isSareeDialogOpen, setIsSareeDialogOpen] = useState(false);
  const [editingCatalog, setEditingCatalog] = useState<Catalog | null>(null);
  const [editingSaree, setEditingSaree] = useState<{
    catalogId: string;
    saree: SareeVariety | null;
  }>({ catalogId: "", saree: null });
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "draft" as "active" | "draft",
    image: null as File | null | undefined,
  });
  const [sareeFormData, setSareeFormData] = useState({
    name: "",
    price: "",
    color: "",
    image: null as File | null | undefined,
  });
  const [availableSarees, setAvailableSarees] = useState<any[]>([]);
  const [selectedSareeId, setSelectedSareeId] = useState<string>("");
  const [expandedCatalogs, setExpandedCatalogs] = useState<string[]>([]);

  // Load sarees first, then catalogs
  useEffect(() => {
    const loadData = async () => {
      await fetchSarees();
      await fetchCatalogs();
    };
    loadData();
  }, []);

  const fetchCatalogs = async () => {
    try {
      setLoading(true);
      const response = await getCatalogs();
      if (response.success) {
        // Normalize the data to match our interface
        const normalizedCatalogs = await Promise.all(
          response.data.map(async (catalog: any) => {
            // Create the basic catalog structure
            const basicCatalog = {
              ...catalog,
              id: catalog._id || catalog.id,
            };

            // If catalog has sareeIds, and they are full saree objects, use them directly
            if (catalog.sareeIds && catalog.sareeIds.length > 0) {
              // The sareeIds array contains full saree objects, not just IDs
              const sareeVarieties = catalog.sareeIds.map((saree: any) => ({
                id: saree._id || saree.id,
                name: saree.name,
                price: saree.price,
                color: saree.color,
                image: saree.image,
              }));

              return {
                ...basicCatalog,
                sarees: sareeVarieties,
              };
            } else {
              // If no sareeIds, return catalog with empty sarees array
              return {
                ...basicCatalog,
                sarees: [],
              };
            }
          })
        );

        setCatalogs(normalizedCatalogs);
      }
    } catch (error) {
      toast.error("Failed to load catalogs");
      console.error("Error fetching catalogs:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSarees = async () => {
    try {
      const response = await getSarees();
      if (response.success) {
        setAvailableSarees(response.data.sarees || response.data);
      }
    } catch (error) {
      console.error("Error fetching sarees:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingCatalog) {
        // Update existing catalog
        const response = await updateCatalog(editingCatalog.id, {
          name: formData.name,
          description: formData.description,
          status: formData.status,
          image: formData.image,
        });

        if (response.success) {
          setCatalogs(
            catalogs.map((c) =>
              c.id === editingCatalog.id ? { ...c, ...response.data } : c
            )
          );
          toast.success("Catalog updated successfully");
        }
      } else {
        // Create new catalog
        const response = await createCatalog({
          name: formData.name,
          description: formData.description,
          status: formData.status,
          image: formData.image,
        });

        if (response.success) {
          setCatalogs([
            ...catalogs,
            { ...response.data, id: response.data._id || response.data.id },
          ]);
          toast.success("Catalog created successfully");
        }
      }

      setIsOpen(false);
      setEditingCatalog(null);
      setFormData({
        name: "",
        description: "",
        status: "draft",
        image: undefined,
      });
    } catch (error) {
      toast.error(
        editingCatalog ? "Failed to update catalog" : "Failed to create catalog"
      );
      console.error(
        editingCatalog ? "Error updating catalog:" : "Error creating catalog:",
        error
      );
    }
  };

  const handleSareeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingSaree.saree) {
        // Currently we don't have an API to update saree in a catalog directly
        // This would require a backend endpoint to update saree details in a catalog
        // For now, we'll just show a message
        toast.error("Editing saree in catalog not supported yet");
        return;
      } else {
        // Adding saree to catalog
        if (!selectedSareeId) {
          toast.error("Please select a saree to add to the catalog");
          return;
        }

        const response = await addSareeToCatalog(
          editingSaree.catalogId,
          selectedSareeId
        );
        if (response.success) {
          // Refresh both sarees and catalogs to get updated data
          await fetchSarees();
          await fetchCatalogs();
          toast.success("Saree added to catalog successfully");
        }
      }

      setIsSareeDialogOpen(false);
      setEditingSaree({ catalogId: "", saree: null });
      setSareeFormData({ name: "", price: "", color: "", image: null });
      setSelectedSareeId("");
    } catch (error) {
      toast.error(
        editingSaree.saree
          ? "Failed to update saree in catalog"
          : "Failed to add saree to catalog"
      );
      console.error(
        editingSaree.saree
          ? "Error updating saree in catalog:"
          : "Error adding saree to catalog:",
        error
      );
    }
  };

  const handleEdit = (catalog: Catalog) => {
    setEditingCatalog(catalog);
    setFormData({
      name: catalog.name,
      description: catalog.description,
      status: catalog.status,
      image: undefined,
    });
    setIsOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await deleteCatalog(id);
      if (response.success) {
        setCatalogs(catalogs.filter((c) => c.id !== id));
        toast.success("Catalog deleted successfully");
      }
    } catch (error) {
      toast.error("Failed to delete catalog");
      console.error("Error deleting catalog:", error);
    }
  };

  const handleAddSaree = (catalogId: string) => {
    const catalog = catalogs.find((c) => c.id === catalogId);
    if (catalog && (catalog.sarees?.length || 0) >= 6) {
      toast.error("Catalog already has maximum number of sarees (6)");
      return; // Max 6 sarees per catalog
    }
    setEditingSaree({ catalogId, saree: null });
    setSareeFormData({ name: "", price: "", color: "", image: null });
    setIsSareeDialogOpen(true);
  };

  const handleEditSaree = (catalogId: string, saree: SareeVariety) => {
    // Currently, editing saree in catalog is not supported via API
    toast.error("Editing saree details not supported yet");
  };

  const handleDeleteSaree = async (catalogId: string, sareeId: string) => {
    try {
      const response = await removeSareeFromCatalog(catalogId, sareeId);
      if (response.success) {
        // Refresh both sarees and catalogs to get updated data
        await fetchSarees();
        await fetchCatalogs();
        toast.success("Saree removed from catalog successfully");
      }
    } catch (error) {
      toast.error("Failed to remove saree from catalog");
      console.error("Error removing saree from catalog:", error);
    }
  };

  const toggleCatalog = (catalogId: string) => {
    setExpandedCatalogs((prev) =>
      prev.includes(catalogId)
        ? prev.filter((id) => id !== catalogId)
        : [...prev, catalogId]
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">
            Catalogs
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your product catalogs (6 sarees per catalog)
          </p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingCatalog(null);
                setFormData({
                  name: "",
                  description: "",
                  status: "draft",
                  image: undefined,
                });
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Catalog
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingCatalog ? "Edit Catalog" : "Add New Catalog"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Catalog Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Enter catalog name"
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
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      status: e.target.value as "active" | "draft",
                    })
                  }
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 h-10"
                >
                  <option value="draft">Draft</option>
                  <option value="active">Active</option>
                </select>
              </div>
              <div>
                <Label className="mb-2 block">Cover Image</Label>

                {/* Hidden File Input */}
                <input
                  id="coverImage"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      image: e.target.files?.[0] || undefined,
                    })
                  }
                />

                {/* Custom Upload Box */}
                <label
                  htmlFor="coverImage"
                  className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors"
                >
                  <span className="text-sm font-medium text-foreground">
                    Click to upload image
                  </span>
                  <span className="text-xs text-muted-foreground mt-1">
                    PNG, JPG, JPEG allowed
                  </span>
                </label>
              </div>

              <Button type="submit" className="w-full">
                {editingCatalog ? "Update Catalog" : "Create Catalog"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Saree Dialog */}
      <Dialog open={isSareeDialogOpen} onOpenChange={setIsSareeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingSaree.saree ? "Edit Saree" : "Add Saree to Catalog"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSareeSubmit} className="space-y-4">
            <div>
              <Label htmlFor="sareeSelect">Select Saree</Label>
              <select
                id="sareeSelect"
                value={selectedSareeId}
                onChange={(e) => setSelectedSareeId(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 h-10"
                required={!editingSaree.saree}
              >
                <option value="">Select a saree</option>
                {availableSarees.map((saree) => (
                  <option
                    key={saree._id || saree.id}
                    value={saree._id || saree.id}
                  >
                    {saree.name} - ₹{saree.price} ({saree.color})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="sareeName">Saree Name</Label>
              <Input
                id="sareeName"
                value={sareeFormData.name}
                onChange={(e) =>
                  setSareeFormData({ ...sareeFormData, name: e.target.value })
                }
                placeholder="Enter saree name"
                required
              />
            </div>
            <div>
              <Label htmlFor="sareePrice">Price (₹)</Label>
              <Input
                id="sareePrice"
                type="number"
                value={sareeFormData.price}
                onChange={(e) =>
                  setSareeFormData({ ...sareeFormData, price: e.target.value })
                }
                placeholder="Enter price"
                required
              />
            </div>
            <div>
              <Label htmlFor="sareeColor">Color</Label>
              <Input
                id="sareeColor"
                value={sareeFormData.color}
                onChange={(e) =>
                  setSareeFormData({ ...sareeFormData, color: e.target.value })
                }
                placeholder="Enter color"
                required
              />
            </div>
            <div>
              <Label className="mb-2 block">Saree Image</Label>

              {/* Hidden File Input */}
              <input
                id="sareeImage"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  setSareeFormData({
                    ...sareeFormData,
                    image: file || null,
                  });
                }}
                className="hidden"
              />

              {/* Custom Upload Box */}
              <label
                htmlFor="sareeImage"
                className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors"
              >
                <span className="text-sm font-medium text-foreground">
                  Click to upload image
                </span>
                <span className="text-xs text-muted-foreground mt-1">
                  PNG, JPG, JPEG allowed
                </span>
              </label>
            </div>

            <Button type="submit" className="w-full">
              {editingSaree.saree ? "Update Saree" : "Add Saree"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Loading state */}
      {loading && (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading catalogs...</p>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!loading && catalogs.length === 0 && (
        <div className="text-center py-12">
          <div className="mx-auto h-24 w-24 rounded-full bg-muted flex items-center justify-center">
            <FolderOpen className="h-12 w-12 text-muted-foreground" />
          </div>
          <h3 className="mt-4 text-lg font-medium text-foreground">
            No catalogs yet
          </h3>
          <p className="mt-2 text-muted-foreground max-w-md mx-auto">
            Get started by creating your first catalog. Each catalog can contain
            up to 6 sarees.
          </p>
          <div className="mt-6">
            <Button
              onClick={() => {
                setEditingCatalog(null);
                setFormData({
                  name: "",
                  description: "",
                  status: "draft",
                  image: undefined,
                });
                setIsOpen(true);
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Create your first catalog
            </Button>
          </div>
        </div>
      )}

      {/* Catalogs list */}
      {!loading && catalogs.length > 0 && (
        <div className="space-y-4">
          {catalogs.map((catalog) => (
            <Collapsible
              key={catalog.id}
              open={expandedCatalogs.includes(catalog.id)}
              onOpenChange={() => toggleCatalog(catalog.id)}
            >
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden">
                        <img
                          src={catalog.image || "/placeholder.svg"}
                          alt={catalog.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "/placeholder.svg";
                          }}
                        />
                      </div>
                      <div>
                        <CardTitle className="text-lg flex items-center gap-2">
                          {catalog.name}
                          <span
                            className={`px-2 py-0.5 text-xs rounded ${
                              catalog.status === "active"
                                ? "bg-green-500/20 text-green-600"
                                : "bg-yellow-500/20 text-yellow-600"
                            }`}
                          >
                            {catalog.status}
                          </span>
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {catalog.description}
                        </p>
                        <p className="text-sm text-primary font-medium mt-1">
                          {catalog.sarees?.length || 0}/6 sarees
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(catalog)}
                      >
                        <Pencil className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="sm">
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will
                              permanently delete the catalog "{catalog.name}"
                              and remove it from our servers.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(catalog.id)}
                              className="bg-destructive hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                      {/* <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="sm">
                          {expandedCatalogs.includes(catalog.id) ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>
                      </CollapsibleTrigger> */}
                    </div>
                  </div>
                </CardHeader>
                <CollapsibleContent>
                  <CardContent className="pt-4 border-t">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-medium text-foreground">
                        Saree Varieties
                      </h3>
                      <Button
                        size="sm"
                        onClick={() => handleAddSaree(catalog.id)}
                        disabled={(catalog.sarees?.length || 0) >= 6}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add Saree{" "}
                        {(catalog.sarees?.length || 0) >= 6 && "(Max 6)"}
                      </Button>
                    </div>

                    {catalog.sarees?.length === 0 || !catalog.sarees ? (
                      <p className="text-muted-foreground text-sm text-center py-4">
                        No sarees added yet. Add up to 6 saree varieties.
                      </p>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {catalog.sarees.map((saree) => (
                          <div
                            key={saree.id}
                            className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg"
                          >
                            <div className="w-12 h-12 bg-muted rounded overflow-hidden flex-shrink-0">
                              <img
                                src={saree.image || "/placeholder.svg"}
                                alt={saree.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src = "/placeholder.svg";
                                }}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm truncate">
                                {saree.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                ₹{saree.price?.toLocaleString()}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {saree.color}
                              </p>
                            </div>
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() =>
                                  handleEditSaree(catalog.id, saree)
                                }
                              >
                                <Pencil className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive"
                                onClick={() =>
                                  handleDeleteSaree(catalog.id, saree.id)
                                }
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          ))}
        </div>
      )}
    </div>
  );
}
