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

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    storeName: "",
    tagline: "",
    email: "",
    phone: "",
    address: "",
    whatsapp: "",
    instagram: "",
    facebook: "",
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
          email: data.email || "",
          phone: data.phone || "",
          address: data.address || "",
          whatsapp: data.whatsapp || "",
          instagram: data.instagram || "",
          facebook: data.facebook || "",
        });
      } catch (error) {
        console.error("Error loading settings:", error);
        // Set default values if loading fails
        setSettings({
          storeName: "Shobha Saree",
          tagline: "Timeless Elegance in Every Thread",
          email: "info@shobhasaree.com",
          phone: "9265996898 / 8780381473",
          address: "J-133/134, J J AC Textile Market, Ring Road, Surat",
          whatsapp: "919265996898",
          instagram: "",
          facebook: "",
        });
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  const handleInputChange = (field) => (e) => {
    setSettings({
      ...settings,
      [field]: e.target.value,
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateStoreSettings(settings);
      alert("Settings saved successfully!");
    } catch (error) {
      console.error("Error saving settings:", error);
      alert("Error saving settings. Please try again.");
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

      <Button onClick={handleSave} size="lg" disabled={saving}>
        {saving ? "Saving..." : "Save Settings"}
      </Button>
    </div>
  );
}
