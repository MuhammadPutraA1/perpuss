"use client"
import { Bell, User, Shield, Globe, LogOut } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export default function SettingsPage() {
  const settings = [
    {
      title: "Notifications",
      desc: "Push notifications & reminders",
      icon: <Bell size={20} />,
      onClick: () => console.log("Notification clicked"),
    },
    {
      title: "Privacy & Security",
      desc: "Permissions, password, security",
      icon: <Shield size={20} />,
      onClick: () => console.log("Privacy clicked"),
    },
    {
      title: "Language",
      desc: "Change app language",
      icon: <Globe size={20} />,
      onClick: () => console.log("Language clicked"),
    },
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-4">
        {settings.map((item, i) => (
          <Card 
            key={i}
            className="cursor-pointer hover:bg-gray-100 transition"
            onClick={item.onClick}
          >
            <CardContent className="flex items-center gap-4 p-4">
              <div className="p-3 bg-gray-200 rounded-xl">
                {item.icon}
              </div>
              <div>
                <h2 className="font-medium text-lg">{item.title}</h2>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <button
  className="w-full py-3 mt-6 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600"
  onClick={async () => {
    // 1. Panggil API untuk hapus cookie
    await fetch("/api/auth/logout", { method: "POST" });

    // 2. Hapus localStorage user
    localStorage.removeItem("user");

    // 3. Trigger event ke layout
    window.dispatchEvent(new Event("user-updated"));

    // 4. Redirect ke login
    window.location.href = "/login";
  }}
>
  <div className="flex items-center justify-center gap-2">
    <LogOut size={18} />
    Logout
  </div>
</button>
    </div>
  )
}
