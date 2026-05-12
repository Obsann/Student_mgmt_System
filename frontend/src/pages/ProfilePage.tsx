import { useState } from "react";
import { useApp } from "../contexts/AppContext";
import { api } from "../services/api";
import { User, Mail, Phone, MapPin, Edit3, Shield, GraduationCap, Upload } from "lucide-react";

export default function ProfilePage() {
  const { currentUser } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: currentUser?.name || "",
    email: currentUser?.email || "Not Provided",
    phone: "+251910000000",
    address: "Kera, Addis Ababa",
    bio: "Passionate about education and student success.",
  });

  const [saving, setSaving] = useState(false);
  const [passwordData, setPasswordData] = useState({ current: "", new: "" });
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.updateProfile({ name: profileData.name, email: profileData.email });
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (err: any) {
      alert(err.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    if (passwordData.new.length < 6) return alert("Password must be at least 6 characters");
    setSaving(true);
    try {
      await api.changePassword(passwordData.current, passwordData.new);
      setIsChangingPassword(false);
      setPasswordData({ current: "", new: "" });
      alert("Password changed successfully!");
    } catch (err: any) {
      alert(err.message || "Failed to change password");
    } finally {
      setSaving(false);
    }
  };

  if (!currentUser) return null;

  const roleColor = 
    currentUser.role === "admin" ? "bg-red-50 text-red-600 border-red-200" :
    currentUser.role === "teacher" ? "bg-blue-50 text-blue-600 border-blue-200" :
    "bg-green-50 text-green-600 border-green-200";

  const RoleIcon = 
    currentUser.role === "admin" ? Shield :
    currentUser.role === "teacher" ? User : GraduationCap;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm">
        {/* Cover Photo */}
        <div className="h-48 bg-gradient-to-r from-blue-600 to-indigo-700 relative">
          {isEditing && (
            <button className="absolute bottom-4 right-4 bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl text-white text-sm font-medium border border-white/30 hover:bg-white/30 transition-colors flex items-center gap-2">
              <Upload size={16} /> Update Cover
            </button>
          )}
        </div>

        {/* Profile Info */}
        <div className="px-8 pb-8 relative">
          <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-end -mt-16 sm:-mt-20 mb-6">
            <div className="relative">
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-white bg-white shadow-lg overflow-hidden flex items-center justify-center">
                {currentUser.avatar ? (
                  <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
                ) : (
                  <div className={`w-full h-full flex items-center justify-center text-4xl font-bold ${roleColor}`}>
                    {currentUser.name.charAt(0)}
                  </div>
                )}
              </div>
              {isEditing && (
                <button className="absolute bottom-2 right-2 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-blue-700 transition-colors border-2 border-white">
                  <Edit3 size={18} />
                </button>
              )}
            </div>

            <div className="flex-1 pb-2">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{profileData.name}</h1>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border flex items-center gap-1.5 ${roleColor}`}>
                  <RoleIcon size={14} />
                  {currentUser.role}
                </span>
              </div>
              <p className="text-gray-500 font-medium">{profileData.bio}</p>
            </div>

            <div className="pb-2 w-full sm:w-auto">
              {isEditing ? (
                <div className="flex gap-2">
                  <button onClick={() => setIsEditing(false)} className="px-6 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors w-full sm:w-auto">
                    Cancel
                  </button>
                  <button onClick={handleSave} disabled={saving} className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors shadow-md w-full sm:w-auto disabled:opacity-50">
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              ) : (
                <button onClick={() => setIsEditing(true)} className="px-6 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 w-full sm:w-auto">
                  <Edit3 size={16} /> Edit Profile
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
            {/* Contact Details */}
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4 text-gray-600">
                  <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400">
                    <Mail size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-400 mb-0.5">Email Address</p>
                    {isEditing ? (
                      <input 
                        type="email" 
                        value={profileData.email} 
                        onChange={e => setProfileData({...profileData, email: e.target.value})}
                        className="w-full px-3 py-1.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none text-sm font-medium text-gray-900"
                      />
                    ) : (
                      <p className="text-sm font-medium text-gray-900">{profileData.email}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4 text-gray-600">
                  <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400">
                    <Phone size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-400 mb-0.5">Phone Number</p>
                    {isEditing ? (
                      <input 
                        type="text" 
                        value={profileData.phone} 
                        onChange={e => setProfileData({...profileData, phone: e.target.value})}
                        className="w-full px-3 py-1.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none text-sm font-medium text-gray-900"
                      />
                    ) : (
                      <p className="text-sm font-medium text-gray-900">{profileData.phone}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4 text-gray-600">
                  <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400">
                    <MapPin size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-400 mb-0.5">Location</p>
                    {isEditing ? (
                      <input 
                        type="text" 
                        value={profileData.address} 
                        onChange={e => setProfileData({...profileData, address: e.target.value})}
                        className="w-full px-3 py-1.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none text-sm font-medium text-gray-900"
                      />
                    ) : (
                      <p className="text-sm font-medium text-gray-900">{profileData.address}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Account Details */}
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3">Account Security</h3>
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm font-bold text-gray-900">Password</p>
                    <button onClick={() => setIsChangingPassword(!isChangingPassword)} className="text-xs font-bold text-blue-600 hover:text-blue-700">
                      {isChangingPassword ? "Cancel" : "Change"}
                    </button>
                  </div>
                  {isChangingPassword ? (
                    <div className="space-y-3 mt-3">
                      <input 
                        type="password" 
                        placeholder="Current Password" 
                        value={passwordData.current}
                        onChange={(e) => setPasswordData({...passwordData, current: e.target.value})}
                        className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <input 
                        type="password" 
                        placeholder="New Password (min 6 chars)" 
                        value={passwordData.new}
                        onChange={(e) => setPasswordData({...passwordData, new: e.target.value})}
                        className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button onClick={handlePasswordChange} disabled={saving} className="px-4 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-lg disabled:opacity-50 hover:bg-blue-700">
                        {saving ? "Saving..." : "Update Password"}
                      </button>
                    </div>
                  ) : (
                    <p className="text-xs text-gray-500">Update your account password</p>
                  )}
                </div>
                
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 flex justify-between items-center">
                  <div>
                    <p className="text-sm font-bold text-gray-900 mb-1">Two-Factor Authentication</p>
                    <p className="text-xs text-gray-500">Add an extra layer of security</p>
                  </div>
                  <div className="w-10 h-6 bg-gray-300 rounded-full relative cursor-pointer">
                    <div className="w-4 h-4 bg-white rounded-full absolute left-1 top-1"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
