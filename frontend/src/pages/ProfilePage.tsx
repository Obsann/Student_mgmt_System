import { useState, useRef, useEffect } from "react";
import { useApp } from "../contexts/AppContext";
import { api } from "../services/api";
import { User, Mail, Phone, MapPin, Edit3, Shield, GraduationCap, Upload, Camera, AtSign, ShieldAlert } from "lucide-react";

export default function ProfilePage() {
  const { currentUser, checkSession } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  
  const [profileData, setProfileData] = useState({
    name: currentUser?.name || "",
    email: currentUser?.email || "Not Provided",
    recoveryEmail: (currentUser as any)?.recoveryEmail || "",
    phone: "+251910000000",
    address: "Kera, Addis Ababa",
    bio: "Passionate about education and student success.",
  });

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [coverPhotoFile, setCoverPhotoFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>((currentUser as any)?.avatar || null);
  const [coverPhotoPreview, setCoverPhotoPreview] = useState<string | null>((currentUser as any)?.coverPhoto || null);

  const [verificationQuestions, setVerificationQuestions] = useState<{question: string, answer: string}[]>(
    (currentUser as any)?.verificationQuestions || [
      { question: "What is your mother's maiden name?", answer: "" },
      { question: "What was the name of your first pet?", answer: "" }
    ]
  );

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  // Sync state when currentUser updates (after checkSession)
  useEffect(() => {
    if (currentUser && !isEditing) {
      setAvatarPreview((currentUser as any).avatar || null);
      setCoverPhotoPreview((currentUser as any).coverPhoto || null);
      setProfileData({
        name: currentUser.name || "",
        email: currentUser.email || "Not Provided",
        recoveryEmail: (currentUser as any).recoveryEmail || "",
        phone: "+251910000000",
        address: "Kera, Addis Ababa",
        bio: "Passionate about education and student success.",
      });
      setVerificationQuestions((currentUser as any).verificationQuestions || [
        { question: "What is your mother's maiden name?", answer: "" },
        { question: "What was the name of your first pet?", answer: "" }
      ]);
    }
  }, [currentUser, isEditing]);

  const [saving, setSaving] = useState(false);
  const [passwordData, setPasswordData] = useState({ current: "", new: "" });
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleCoverPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCoverPhotoFile(file);
      setCoverPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleQuestionChange = (index: number, field: 'question' | 'answer', value: string) => {
    const updated = [...verificationQuestions];
    updated[index][field] = value;
    setVerificationQuestions(updated);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("name", profileData.name);
      if (profileData.email !== "Not Provided") formData.append("email", profileData.email);
      if (profileData.recoveryEmail) formData.append("recoveryEmail", profileData.recoveryEmail);
      
      // Send verification questions only if they have answers
      const validQuestions = verificationQuestions.filter(q => q.question.trim() && q.answer.trim());
      if (validQuestions.length > 0) {
        formData.append("verificationQuestions", JSON.stringify(validQuestions));
      }

      if (avatarFile) formData.append("avatar", avatarFile);
      if (coverPhotoFile) formData.append("coverPhoto", coverPhotoFile);

      await api.updateProfile(formData);
      await checkSession(); // Reload current user
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

  const roleStyles: Record<string, { bg: string, text: string, border: string, icon: any }> = {
    admin: { bg: "bg-red-50", text: "text-red-600", border: "border-red-200", icon: Shield },
    teacher: { bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-200", icon: User },
    student: { bg: "bg-green-50", text: "text-green-600", border: "border-green-200", icon: GraduationCap }
  };

  const currentStyle = roleStyles[currentUser.role] || roleStyles.student;
  const RoleIcon = currentStyle.icon;
  const roleClasses = `${currentStyle.bg} ${currentStyle.text} ${currentStyle.border}`;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-all animate-fade-scale">
        {/* Cover Photo */}
        <div 
          className="h-56 bg-gradient-to-br from-indigo-500 via-purple-500 to-blue-600 relative overflow-hidden bg-cover bg-center"
          style={coverPhotoPreview ? { backgroundImage: `url(${coverPhotoPreview})` } : {}}
        >
          {!coverPhotoPreview && (
            <>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.15),transparent_50%)]" />
              <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
            </>
          )}
          {coverPhotoPreview && <div className="absolute inset-0 bg-black/20" />}
          
          {isEditing && (
            <>
              <input type="file" accept="image/*" ref={coverInputRef} className="hidden" onChange={handleCoverPhotoChange} />
              <button onClick={() => coverInputRef.current?.click()} className="absolute bottom-4 right-4 bg-white/20 backdrop-blur-md px-5 py-2.5 rounded-2xl text-white text-sm font-bold border border-white/30 hover:bg-white/30 transition-all flex items-center gap-2 shadow-lg">
                <Upload size={16} /> Update Cover
              </button>
            </>
          )}
        </div>

        {/* Profile Info */}
        <div className="px-8 pb-8 relative">
          <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-end -mt-16 sm:-mt-20 mb-8">
            <div className="relative group">
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-3xl border-4 border-white bg-white shadow-xl overflow-hidden flex items-center justify-center ring-4 ring-white/50 relative">
                {avatarPreview ? (
                  <img src={avatarPreview} alt={currentUser.name} className="w-full h-full object-cover" />
                ) : (
                  <div className={`w-full h-full flex items-center justify-center text-5xl font-black ${roleClasses}`}>
                    {profileData.name.charAt(0)}
                  </div>
                )}
                {isEditing && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="text-white w-8 h-8" />
                  </div>
                )}
              </div>
              {isEditing && (
                <>
                  <input type="file" accept="image/*" ref={avatarInputRef} className="hidden" onChange={handleAvatarChange} />
                  <button onClick={() => avatarInputRef.current?.click()} className="absolute bottom-2 right-2 w-10 h-10 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg hover:bg-indigo-700 transition-all border-2 border-white hover:scale-110">
                    <Edit3 size={18} />
                  </button>
                </>
              )}
            </div>

            <div className="flex-1 pb-2">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                {isEditing ? (
                  <input 
                    type="text" 
                    value={profileData.name} 
                    onChange={e => setProfileData({...profileData, name: e.target.value})}
                    className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight bg-slate-50 border-b-2 border-indigo-500 focus:outline-none px-2 py-1 rounded-t-lg"
                  />
                ) : (
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">{profileData.name}</h1>
                )}
                <span className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-widest border flex items-center gap-1.5 ${roleClasses}`}>
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
                  <button onClick={handleSave} disabled={saving} className="px-6 py-3 rounded-2xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 w-full sm:w-auto disabled:opacity-50 flex items-center justify-center gap-2">
                    {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : null}
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
                    <AtSign size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Username</p>
                    <p className="text-sm font-bold text-slate-900">{currentUser.username}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-indigo-200 transition-colors">
                  <div className="w-11 h-11 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-indigo-500 shadow-sm">
                    <Mail size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Recovery Email</p>
                    {isEditing ? (
                      <input type="email" value={profileData.recoveryEmail} onChange={e => setProfileData({...profileData, recoveryEmail: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="recovery@example.com" />
                    ) : (
                      <p className="text-sm font-bold text-slate-900">{profileData.recoveryEmail || "Not Set"}</p>
                    )}
                  </div>
                </div>

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

            {/* Account Security & Identity */}
            <div className="space-y-6 animate-fade-up" style={{ animationDelay: '0.1s' }}>
              <h3 className="text-lg font-extrabold text-slate-900 border-b border-slate-100 pb-4">Account Security & Identity</h3>
              <div className="space-y-4">
                
                {/* Password Change */}
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

                {/* Identity Verification Questions */}
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 transition-colors">
                  <div className="flex items-center gap-2 mb-4">
                    <ShieldAlert size={18} className="text-indigo-600" />
                    <p className="text-sm font-extrabold text-slate-900">Identity Verification</p>
                  </div>
                  <p className="text-xs text-slate-500 font-medium mb-4">
                    These questions are used to verify your identity if you forget your password. Please provide memorable answers.
                  </p>
                  
                  <div className="space-y-4">
                    {verificationQuestions.map((vq, index) => (
                      <div key={index} className="space-y-2">
                        {isEditing ? (
                          <>
                            <input
                              type="text"
                              value={vq.question}
                              onChange={(e) => handleQuestionChange(index, 'question', e.target.value)}
                              placeholder="E.g., What is your favorite color?"
                              className="w-full px-3 py-2 rounded-xl border-2 border-slate-100 text-sm font-medium outline-none focus:border-indigo-500 bg-white"
                            />
                            <input
                              type="text"
                              value={vq.answer}
                              onChange={(e) => handleQuestionChange(index, 'answer', e.target.value)}
                              placeholder="Your Answer"
                              className="w-full px-3 py-2 rounded-xl border-2 border-slate-100 text-sm font-medium outline-none focus:border-indigo-500 bg-white"
                            />
                          </>
                        ) : (
                          <div className="bg-white p-3 rounded-xl border border-slate-100">
                            <p className="text-xs font-bold text-slate-700 mb-1">Q: {vq.question}</p>
                            <p className="text-xs text-slate-400 italic">A: •••••••• (Hidden)</p>
                          </div>
                        )}
                      </div>
                    ))}
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
