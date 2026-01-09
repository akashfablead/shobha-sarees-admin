import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import {
  getStoreSettings,
  updateStoreSettings,
} from "../../services/settingsService";
import { ADMIN_API_BASE_URL } from "../../config/api";
import { toast } from "sonner";

export default function AdminSettings() {
  type SettingsType = {
    storeName: string;
    tagline: string;
    subTagline: string;
    email: string;
    phone: string;
    address: string;
    whatsapp: string;
    instagram: string;
    facebook: string;
    logoImage: string | File;
    bannerImage: string | File;
  };

  const [settings, setSettings] = useState<SettingsType>({
    storeName: "",
    tagline: "",
    subTagline: "",
    email: "",
    phone: "",
    address: "",
    whatsapp: "",
    instagram: "",
    facebook: "",
    logoImage: "",
    bannerImage: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Load settings on component mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = await getStoreSettings();
        setSettings({
          storeName: data.storeName || "",
          tagline: data.tagline || "",
          subTagline: data.subTagline || "",
          email: data.email || "",
          phone: data.phone || "",
          address: data.address || "",
          whatsapp: data.whatsapp || "",
          instagram: data.instagram || "",
          facebook: data.facebook || "",
          logoImage: data.logoImage || "",
          bannerImage: data.bannerImage || "",
        });
      } catch (error) {
        console.error("Error loading settings:", error);
        // Set default values if loading fails
        setSettings({
          storeName: "Shobha Saree",
          tagline: "Timeless Elegance in Every Thread",
          subTagline: "",
          email: "info@shobhasaree.com",
          phone: "9265996898 / 8780381473",
          address: "J-133/134, J J AC Textile Market, Ring Road, Surat",
          whatsapp: "919265996898",
          instagram: "",
          facebook: "",
          logoImage: "",
          bannerImage: "",
        });
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  const handleInputChange =
    (field: keyof SettingsType) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setSettings({
        ...settings,
        [field]: e.target.value,
      });
    };

  // Function to upload image
  const uploadImage = async (file, imageType) => {
    const formData = new FormData();
    formData.append("image", file);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${ADMIN_API_BASE_URL}/settings/image`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.message || "Failed to upload image");
      }

      return result.data.imageUrl;
    } catch (error) {
      console.error(`Error uploading ${imageType} image:`, error);
      throw error;
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // If we have File objects for images, upload them first and get URLs
      let updatedSettings = { ...settings };

      if (settings.logoImage && typeof settings.logoImage !== "string") {
        const logoUrl = await uploadImage(settings.logoImage, "logo");
        updatedSettings.logoImage = logoUrl;
      }

      if (settings.bannerImage && typeof settings.bannerImage !== "string") {
        const bannerUrl = await uploadImage(settings.bannerImage, "banner");
        updatedSettings.bannerImage = bannerUrl;
      }

      await updateStoreSettings(updatedSettings);
      toast.success("Settings saved successfully!");
    } catch (error) {
      console.error("Error saving settings:", error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">
            Settings
          </h1>
          <p className="text-muted-foreground mt-1">Loading settings...</p>
        </div>
        <div className="text-center py-10">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 ">
      <div>
        <h1 className="text-3xl font-serif font-bold text-foreground">
          Settings
        </h1>
        <p className="text-muted-foreground mt-1">Manage your store settings</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Store Information</CardTitle>
          <CardDescription>Basic information about your store</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="storeName">Store Name</Label>
            <Input
              id="storeName"
              value={settings.storeName}
              onChange={handleInputChange("storeName")}
            />
          </div>
          <div>
            <Label htmlFor="tagline">Tagline</Label>
            <Input
              id="tagline"
              value={settings.tagline}
              onChange={handleInputChange("tagline")}
            />
          </div>
          <div>
            <Label htmlFor="subTagline">Sub Tagline</Label>
            <Input
              id="subTagline"
              value={settings.subTagline}
              onChange={handleInputChange("subTagline")}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
          <CardDescription>How customers can reach you</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={settings.email}
              onChange={handleInputChange("email")}
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone Numbers</Label>
            <Input
              id="phone"
              value={settings.phone}
              onChange={handleInputChange("phone")}
            />
          </div>
          <div>
            <Label htmlFor="whatsapp">
              WhatsApp Number (with country code)
            </Label>
            <Input
              id="whatsapp"
              value={settings.whatsapp}
              onChange={handleInputChange("whatsapp")}
              placeholder="919265996898"
            />
          </div>
          <div>
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              value={settings.address}
              onChange={handleInputChange("address")}
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Social Media</CardTitle>
          <CardDescription>Your social media links</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="instagram">Instagram URL</Label>
            <Input
              id="instagram"
              value={settings.instagram}
              onChange={handleInputChange("instagram")}
              placeholder="https://instagram.com/shobhasaree"
            />
          </div>
          <div>
            <Label htmlFor="facebook">Facebook URL</Label>
            <Input
              id="facebook"
              value={settings.facebook}
              onChange={handleInputChange("facebook")}
              placeholder="https://facebook.com/shobhasaree"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Store Images</CardTitle>
          <CardDescription>
            Upload your store logo and banner images
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="logoImage">Logo Image</Label>
            <div className="flex flex-col gap-2">
              <Input
                id="logoImage"
                type="file"
                accept="image/*"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  if (e.target.files && e.target.files[0]) {
                    setSettings({
                      ...settings,
                      logoImage: e.target.files[0],
                    });
                  }
                }}
              />
              {typeof settings.logoImage === "string" && settings.logoImage && (
                <div className="mt-2">
                  <p className="text-sm text-muted-foreground mb-1">
                    Current Logo:
                  </p>
                  <img
                    src={settings.logoImage}
                    alt="Current logo"
                    className="max-h-20 object-contain border rounded"
                  />
                </div>
              )}
              {settings.logoImage && typeof settings.logoImage !== "string" && (
                <div className="mt-2">
                  <p className="text-sm text-muted-foreground mb-1">
                    Selected Logo: {settings.logoImage.name}
                  </p>
                </div>
              )}
            </div>
          </div>
          <div>
            <Label htmlFor="bannerImage">Banner Image</Label>
            <div className="flex flex-col gap-2">
              <Input
                id="bannerImage"
                type="file"
                accept="image/*"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  if (e.target.files && e.target.files[0]) {
                    setSettings({
                      ...settings,
                      bannerImage: e.target.files[0],
                    });
                  }
                }}
              />
              {typeof settings.bannerImage === "string" &&
                settings.bannerImage && (
                  <div className="mt-2">
                    <p className="text-sm text-muted-foreground mb-1">
                      Current Banner:
                    </p>
                    <img
                      src={settings.bannerImage}
                      alt="Current banner"
                      className="max-h-32 object-contain border rounded w-full"
                    />
                  </div>
                )}
              {settings.bannerImage &&
                typeof settings.bannerImage !== "string" && (
                  <div className="mt-2">
                    <p className="text-sm text-muted-foreground mb-1">
                      Selected Banner: {settings.bannerImage.name}
                    </p>
                  </div>
                )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSave} size="lg" disabled={saving}>
        {saving ? "Saving..." : "Save Settings"}
      </Button>
    </div>
  );
}
