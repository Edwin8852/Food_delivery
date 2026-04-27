import React, { useState, useEffect } from "react";
import api from "../../services/api";
import { toast } from "react-toastify";

export default function Profile() {
  const [profile, setProfile] = useState({
    name: "",
    phone: "",
    aadhaarNumber: "",
    aadhaarImage: "",
    licenseNumber: "",
    licenseImage: "",
    panNumber: "",
    panImage: "",
    vehicleNumber: "",
    vehicleType: "",
    isVerified: false,
    verificationStatus: "PENDING",
    profileImage: ""
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  
  // 🔥 STEP 1 — ADD STATE (EDIT MODE / SPECIFIC FIELDS)
  const [aadhaar, setAadhaar] = useState("");
  const [aadhaarFile, setAadhaarFile] = useState(null);

   const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await api.get("/delivery/profile");
      
      // 🔍 DEBUG CHECKLIST (as per requirement)
      console.log("PROFILE RESPONSE:", res.data);

      if (res.data.success) {
        const partnerData = res.data.data; // ✅ CORRECT
        setProfile(partnerData);

        // 🧪 DEBUG LOG (Moved from top-level to prevent spam)
        console.log("Current Aadhaar Digit Grid:", partnerData.aadhaarNumber || "");

        // Initialize local states with fetched data ONLY if not editing
        if (!editMode) {
          setAadhaar(partnerData.aadhaarNumber || "");
        }
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Grid sync failed";
      console.error("🛑 Profile Error:", errorMsg);
      // If it's a 404, we treat it as an uninitialized profile
      if (err.response?.status === 404) {
        setProfile(null);
      } else {
        toast.error(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchProfile();
    // ✅ RUN ONLY ONCE TO PREVENT INFINITE API LOOPS
  }, []); // Empty dependency array as requested



  // 🔥 STEP 4 — UPDATE API CALL
  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      // Validation for NEW uploads (if no existing image)
      if (!profile?.aadhaarImage && (!aadhaar || !aadhaarFile)) {
        if (!aadhaar) toast.warning("Aadhaar Number is required protocol");
        if (!aadhaarFile) toast.warning("Identity proof document missing");
        return;
      }

      const formData = new FormData();
      // Use snake_case as per request, but matching backend expectation for number
      formData.append("aadhaar_number", aadhaar); 
      formData.append("aadhaarNumber", aadhaar); // Dual support just in case
      
      if (aadhaarFile) {
        formData.append("aadhaar_image", aadhaarFile);
      }

      // Append other fields from profile state to maintain full record
      formData.append("licenseNumber", profile.licenseNumber || "");
      formData.append("panNumber", profile.panNumber || "");
      formData.append("vehicleNumber", profile.vehicleNumber || "");
      formData.append("vehicleType", profile.vehicleType || "");
      
      const res = await api.post("/delivery/upload-docs", formData);
      if (res.data.success) {
        toast.success("Updated Successfully ✅");
        setEditMode(false);
        await fetchProfile(); // 🚀 EXTRA: fetchProfile() to avoid old data
      }
    } catch (err) {
      toast.error("Handshake update failed");
    } finally {
      setSaving(false);
    }
  };


  const logout = () => {
    sessionStorage.clear();
    window.location.href = "/";
  };

  const handleFileUpload = async (file, type) => {
    const formData = new FormData();
    // Convert CamelCase to underscores for field name mapping
    const fieldName = type.replace(/([A-Z])/g, '_$1').toLowerCase();
    formData.append(fieldName, file);
    
    try {
      const res = await api.post("/delivery/upload-docs", formData);
      if (res.data.success) {
        setProfile(res.data.data);
        toast.success(`${type.replace(/([A-Z])/g, ' $1').toUpperCase()} Grid Synchronized`);
      }
    } catch (err) {
      toast.error("Upload stream failure");
    }
  };



  const handleAvatarUpload = async (file) => {
    const formData = new FormData();
    formData.append("avatar", file);
    try {
      const res = await api.post("/user/upload-avatar", formData);
      if (res.data.success) {
        setProfile(prev => ({ ...prev, profileImage: res.data.url }));
        toast.success("Avatar Identity Updated");
      }
    } catch (err) {
      toast.error("Avatar sync failure");
    }
  };

  const handleBulkSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Formally finalize and request review
      const res = await api.put("/user/update", { ...profile, verificationStatus: 'PENDING' });
      if (res.data.success) {
        toast.success("Identity Packet Submitted for Operational Review");
        await fetchProfile(); // Explicit Refresh
      }
    } catch (err) {
      toast.error("Handshake Protocol Failed");
    } finally {
      setSaving(false);
    }
  };



  const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // 🔥 STEP 5 — SWIGGY STYLE RENDERING LOGIC
  const renderContent = () => {
    // 🚦 Loading/Error States
    if (loading) return (
      <div className="flex justify-center p-40">
         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-orange-500 border-r-2 border-slate-100 shadow-lg"></div>
      </div>
    );

    // Flow: Initialize (if not verified) -> Edit -> View
    // ✅ REAL FIX: Using isVerified as the primary status gate
    if (!profile || !profile.isVerified) {
      return UploadForm();
    }

    if (editMode) {
      return EditForm();
    }

    return ProfileView();
  };

  // Sub-component: Upload Form
  const UploadForm = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
       <div className="bg-white rounded-[48px] p-10 shadow-2xl border border-slate-50 text-center">
          <div className="w-24 h-24 bg-orange-50 text-orange-500 rounded-[32px] flex items-center justify-center text-4xl mx-auto mb-6">🪪</div>
          <h3 className="text-2xl font-black text-slate-800 mb-2 tracking-tighter uppercase">Initialize Identity</h3>
          <p className="text-slate-400 font-bold mb-10 text-sm">Please upload your Aadhaar details to join the logistics grid.</p>
          
          <form onSubmit={handleUpdate} className="space-y-6 text-left">
            <div className="space-y-2">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Aadhaar Number</label>
               <input 
                 type="text" 
                 value={aadhaar} 
                 maxLength={12}
                 onChange={(e) => {
                   const val = e.target.value;
                   if (/^\d*$/.test(val)) {
                      setAadhaar(val); // ✅ full value save
                   }
                 }}
                 placeholder="1234 5678 9012"
                 className="w-full bg-slate-50 border-none rounded-3xl p-6 font-bold text-slate-700 focus:ring-2 focus:ring-orange-500 transition-all"
               />
            </div>
            <div className="space-y-2">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Aadhaar Document (Front)</label>
               <div className="relative group">
                 <input 
                   type="file" 
                   id="aadhaar-join-file"
                   onChange={(e) => setAadhaarFile(e.target.files[0])}
                   className="hidden"
                   accept="image/*"
                 />
                 <label 
                   htmlFor="aadhaar-join-file"
                   className={`w-full bg-slate-50 border-2 border-dashed rounded-3xl p-10 flex flex-col items-center justify-center gap-4 cursor-pointer transition-all ${aadhaarFile ? 'border-emerald-200 bg-emerald-50' : 'border-slate-100 hover:border-orange-200 hover:bg-orange-50/30'}`}
                 >
                   <span className="text-3xl">{aadhaarFile ? "📄" : "☁️"}</span>
                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                     {aadhaarFile ? aadhaarFile.name : "Select JPG/PNG Identity Proof"}
                   </span>
                 </label>
               </div>
            </div>
            <button 
              type="submit"
              disabled={saving}
              className="w-full bg-orange-500 text-white h-18 py-5 rounded-3xl font-black uppercase text-xs tracking-widest shadow-xl hover:bg-orange-600 disabled:opacity-50 transition-all mt-4"
            >
              {saving ? "🔄 Uploading..." : "Upload Identity Packet"}
            </button>
          </form>
       </div>
    </div>
  );

  // Sub-component: Edit Form
  const EditForm = () => {
    if (!profile) return null;
    return (
    <form onSubmit={handleUpdate} className="space-y-8 animate-in slide-in-from-right-10 duration-500">
      <div className="flex justify-between items-center mb-4">
         <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest italic">Identity Mutation Mode</span>
         <button type="button" onClick={() => setEditMode(false)} className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-rose-500">Cancel</button>
      </div>

      <div className="bg-white rounded-[48px] p-10 shadow-2xl border border-slate-50">
         <div className="space-y-6">
            <div className="space-y-2">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Legal Aadhaar Identifier</label>
               <input 
                 type="text" 
                 value={aadhaar} 
                 maxLength={12}
                 onChange={(e) => {
                   const val = e.target.value;
                   if (/^\d*$/.test(val)) {
                      setAadhaar(val); // ✅ full value save
                   }
                 }}
                 className="w-full bg-slate-50 border-none rounded-3xl p-6 font-bold text-slate-700 focus:ring-2 focus:ring-orange-500 transition-all"
               />
            </div>

            <div className="space-y-2">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Update Document</label>
               <div className="relative group">
                  <input 
                    type="file" 
                    id="aadhaar-edit-file"
                    onChange={(e) => setAadhaarFile(e.target.files[0])}
                    className="hidden"
                    accept="image/*"
                  />
                  <label 
                    htmlFor="aadhaar-edit-file"
                    className={`w-full bg-slate-50 border-2 border-dashed rounded-3xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all ${aadhaarFile ? 'border-emerald-200 bg-emerald-50' : 'border-slate-100 hover:border-orange-200 hover:bg-orange-50/30'}`}
                  >
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 bg-white rounded-xl overflow-hidden shadow-sm border border-slate-100">
                          <img src={`${BASE_URL}${profile.aadhaarImage}`} alt="" className="w-full h-full object-cover opacity-50" />
                       </div>
                       <div className="flex flex-col">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
                             {aadhaarFile ? aadhaarFile.name : "Tap to Change Proof"}
                          </span>
                       </div>
                    </div>
                  </label>
               </div>
            </div>
         </div>
      </div>

      <button 
        type="submit"
        disabled={saving}
        className="w-full bg-slate-900 text-white h-20 rounded-[32px] font-black uppercase text-xs tracking-[0.2em] shadow-2xl hover:bg-emerald-600 transition-all disabled:opacity-50"
      >
        {saving ? "🔄 Synchronizing..." : "💾 Save Identity Changes"}
      </button>
    </form>
    );
  };

  // Sub-component: Profile View
  const ProfileView = () => {
    if (!profile) return null;
    return (
    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
       <div className="bg-white rounded-[48px] p-10 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.06)] border border-slate-50 flex flex-col items-center">
          <div className="w-40 h-40 rounded-[60px] bg-slate-100 overflow-hidden mb-6 shadow-inner border-4 border-white">
             {profile.profileImage ? (
                <img src={`${BASE_URL}${profile.profileImage}`} className="w-full h-full object-cover" />
             ) : (

                <div className="w-full h-full flex items-center justify-center text-4xl">🛸</div>
             )}
          </div>
          <h3 className="text-2xl font-black text-slate-800">{profile.name}</h3>
          <p className="text-slate-400 font-bold mb-8">{profile.phone}</p>
          
          <button 
            onClick={() => setEditMode(true)}
            className="bg-slate-900 text-white px-10 py-4 rounded-3xl font-black uppercase text-[10px] tracking-widest hover:bg-orange-600 transition-all shadow-xl"
          >
            Update Profile
          </button>
       </div>

       <div className="grid grid-cols-2 gap-6">
          <div className="bg-white rounded-[40px] p-8 shadow-sm border border-slate-50">
             <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-2">Aadhaar Protocol</p>
             <p className="font-bold text-slate-700">{profile.aadhaarNumber}</p>
          </div>
          <div className="bg-white rounded-[40px] p-8 shadow-sm border border-slate-50">
             <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-2">Verification Status</p>
             <p className={`font-bold uppercase text-[12px] ${profile.verificationStatus === 'APPROVED' ? 'text-emerald-500' : 'text-amber-500'}`}>
               {profile.verificationStatus}
             </p>
          </div>
       </div>
    </div>
    );
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-6 animate-in fade-in slide-in-from-bottom-5 duration-700 pb-40">
      <div className="mb-14 text-center">
        <h2 className="text-4xl font-[1000] text-slate-800 tracking-tighter uppercase italic">Partner <span className="text-orange-500">Identity</span></h2>
        <p className="text-slate-400 font-black uppercase tracking-[0.4em] text-[10px] mt-2 italic flex items-center justify-center gap-2">
           <span className={`w-2 h-2 rounded-full ${
             profile.verificationStatus === 'APPROVED' ? 'bg-emerald-500 animate-pulse' : 
             profile.verificationStatus === 'REJECTED' ? 'bg-rose-500' : 'bg-amber-400 animate-bounce'
           }`}></span>
           Status: {
             profile.verificationStatus === 'APPROVED' ? 'Verified Logistics Unit' : 
             profile.verificationStatus === 'REJECTED' ? 'Operational Access Denied' : 'Awaiting Operational Approval'
           }
        </p>
      </div>

      {renderContent()}

      <div className="mt-16 p-8 bg-slate-50 border border-slate-100 rounded-[48px] text-center">
         <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.4em]">Fulfillment OS v2.4.0 • Encrypted Biometric Grid</p>
      </div>
    </div>
  );
}
