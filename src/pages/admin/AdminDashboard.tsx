import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, FolderOpen, Image, TrendingUp } from "lucide-react";
import { useState, useEffect } from "react";
import { getAdminDashboardStats } from "../../services/adminService";

export default function AdminDashboard() {
  const [stats, setStats] = useState([
    { title: "Total Sarees", value: "0", icon: Image, change: "0" },
    {
      title: "Collections",
      value: "0",
      icon: FolderOpen,
      change: "0",
    },
  ]);

  const [recentActivity, setRecentActivity] = useState([
    { action: "Loading recent activity...", time: "", type: "" },
  ]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const data = await getAdminDashboardStats();

        setStats([
          {
            title: "Total Sarees",
            value: data.totalSarees?.toString() || "0",
            icon: Image,
            change: data.totalSarees > 0 ? `+${data.totalSarees}` : "0",
          },
          {
            title: "Collections",
            value: data.totalCollections?.toString() || "0",
            icon: FolderOpen,
            change:
              data.totalCollections > 0 ? `+${data.totalCollections}` : "0",
          },
        ]);

        setRecentActivity(data.recentActivity || []);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        // Set default values in case of error
        setStats([
          { title: "Total Sarees", value: "0", icon: Image, change: "0" },
          {
            title: "Collections",
            value: "0",
            icon: FolderOpen,
            change: "0",
          },
        ]);
        setRecentActivity([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif font-bold text-foreground">
          Dashboard
        </h1>
        <p className="text-muted-foreground mt-1">
          Welcome back to Shobha Saree Admin
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-primary mt-1">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-2 border-b border-border last:border-0"
                >
                  <span className="text-foreground">{activity.action}</span>
                  <span className="text-sm text-muted-foreground">
                    {activity.time}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground">No recent activity</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
            Add New Saree
          </button>
          <button className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors">
            Create Collection
          </button>
        </CardContent>
      </Card>
    </div>
  );
}
