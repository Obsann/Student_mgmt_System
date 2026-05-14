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
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to update profile");
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
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to change password");
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
      <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-all animate-fade-scale">
        {/* Cover Photo */}
        <div className="h-56 bg-gradient-to-br from-indigo-500 via-purple-500 to-blue-600 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.15),transparent_50%)]" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
          {isEditing && (
            <button className="absolute bottom-4 right-4 bg-white/20 backdrop-blur-md px-5 py-2.5 rounded-2xl text-white text-sm font-bold border border-white/30 hover:bg-white/30 transition-all flex items-center gap-2 shadow-lg">
              <Upload size={16} /> Update Cover
            </button>
          )}
        </div>

        {/* Profile Info */}
        <div className="px-8 pb-8 relative">
          <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-end -mt-16 sm:-mt-20 mb-8">
            <div className="relative group">
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-3xl border-4 border-white bg-white shadow-xl overflow-hidden flex items-center justify-center ring-4 ring-white/50">
                {currentUser.avatar ? (
                  <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
                ) : (
                  <div className={`w-full h-full flex items-center justify-center text-5xl font-black ${roleColor}`}>
                    {currentUser.name.charAt(0)}
                  </div>
                )}
              </div>
              {isEditing && (
                <button className="absolute bottom-2 right-2 w-10 h-10 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg hover:bg-indigo-700 transition-all border-2 border-white hover:scale-110">
                  <Edit3 size={18} />
                </button>
              )}
            </div>

            <div className="flex-1 pb-2">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">{profileData.name}</h1>
                <span className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-widest border flex items-center gap-1.5 ${roleColor}`}>
                  <RoleIcon size={14} />
                  {currentUser.role}
                </span>
              </div>
              <p className="text-slate-500 font-medium">{profileData.bio}</p>
            </div>

            <div className="pb-2 w-full sm:w-auto">
              {isEditing ? (
                <div className="flex gap-3">
                  <button onClick={() => setIsEditing(false)} className="px-6 py-3 rounded-2xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition-all w-full sm:w-auto">
                    Cancel
                  </button>
                  <button onClick={handleSave} disabled={saving} className="px-6 py-3 rounded-2xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 w-full sm:w-auto disabled:opacity-50">
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              ) : (
                <button onClick={() => setIsEditing(true)} className="px-6 py-3 rounded-2xl border border-slate-200 text-slate-700 font-bold hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-600 transition-all flex items-center justify-center gap-2 w-full sm:w-auto">
                  <Edit3 size={16} /> Edit Profile
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-12">
            {/* Contact Details */}
            <div className="space-y-6 animate-fade-up">
              <h3 className="text-lg font-extrabold text-slate-900 border-b border-slate-100 pb-4">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-indigo-200 transition-colors">
                  <div className="w-11 h-11 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-indigo-500 shadow-sm">
                    <Mail size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Email Address</p>
                    {isEditing ? (
                      <input 
                        type="email" 
                        value={profileData.email} 
                        onChange={e => setProfileData({...profileData, email: e.target.value})}
                        className="w-full px-3 py-2 rounded-xl border-2 border-slate-100 focus:border-indigo-500 outline-none text-sm font-bold text-slate-900 bg-white transition-all"
                      />
                    ) : (
                      <p className="text-sm font-bold text-slate-900">{profileData.email}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-indigo-200 transition-colors">
                  <div className="w-11 h-11 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-indigo-500 shadow-sm">
                    <Phone size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Phone Number</p>
                    {isEditing ? (
                      <input 
                        type="text" 
                        value={profileData.phone} 
                        onChange={e => setProfileData({...profileData, phone: e.target.value})}
                        className="w-full px-3 py-2 rounded-xl border-2 border-slate-100 focus:border-indigo-500 outline-none text-sm font-bold text-slate-900 bg-white transition-all"
                      />
                    ) : (
                      <p className="text-sm font-bold text-slate-900">{profileData.phone}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-indigo-200 transition-colors">
                  <div className="w-11 h-11 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-indigo-500 shadow-sm">
                    <MapPin size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Location</p>
                    {isEditing ? (
                      <input 
                        type="text" 
                        value={profileData.address} 
                        onChange={e => setProfileData({...profileData, address: e.target.value})}
                        className="w-full px-3 py-2 rounded-xl border-2 border-slate-100 focus:border-indigo-500 outline-none text-sm font-bold text-slate-900 bg-white transition-all"
                      />
                    ) : (
                      <p className="text-sm font-bold text-slate-900">{profileData.address}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Account Details */}
            <div className="space-y-6 animate-fade-up" style={{ animationDelay: '0.1s' }}>
              <h3 className="text-lg font-extrabold text-slate-900 border-b border-slate-100 pb-4">Account Security</h3>
              <div className="space-y-4">
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-indigo-200 transition-colors">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm font-extrabold text-slate-900">Password</p>
                    <button onClick={() => setIsChangingPassword(!isChangingPassword)} className="text-xs font-bold text-indigo-600 hover:text-indigo-700 px-3 py-1 rounded-lg hover:bg-indigo-50 transition-colors">
                      {isChangingPassword ? "Cancel" : "Change"}
                    </button>
                  </div>
                  {isChangingPassword ? (
                    <div className="space-y-3 mt-4">
                      <input 
                        type="password" 
                        placeholder="Current Password" 
                        value={passwordData.current}
                        onChange={(e) => setPasswordData({...passwordData, current: e.target.value})}
                        className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-100 text-sm font-medium outline-none focus:border-indigo-500 bg-white transition-all"
                      />
                      <input 
                        type="password" 
                        placeholder="New Password (min 6 chars)" 
                        value={passwordData.new}
                        onChange={(e) => setPasswordData({...passwordData, new: e.target.value})}
                        className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-100 text-sm font-medium outline-none focus:border-indigo-500 bg-white transition-all"
                      />
                      <button onClick={handlePasswordChange} disabled={saving} className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-xl disabled:opacity-50 hover:bg-indigo-700 transition-all shadow-md shadow-indigo-600/20">
                        {saving ? "Saving..." : "Update Password"}
                      </button>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 font-medium">Update your account password</p>
                  )}
                </div>
                
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 flex justify-between items-center hover:border-indigo-200 transition-colors">
                  <div>
                    <p className="text-sm font-extrabold text-slate-900 mb-1">Two-Factor Authentication</p>
                    <p className="text-xs text-slate-500 font-medium">Add an extra layer of security</p>
                  </div>
                  <div className="w-11 h-6 bg-slate-300 rounded-full relative cursor-pointer hover:bg-slate-400 transition-colors">
                    <div className="w-4 h-4 bg-white rounded-full absolute left-1 top-1 shadow-sm"></div>
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
