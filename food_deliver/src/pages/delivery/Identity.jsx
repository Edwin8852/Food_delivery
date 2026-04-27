import { useState } from "react";
import api from "../../services/api";
import { toast } from "react-toastify";

const Identity = () => {
  const [aadhaar, setAadhaar] = useState("");
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("idle"); 
  // idle | uploading | success

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!aadhaar || !file) {
      toast.warning("Please maintain protocol: All identity fields required.");
      return;
    }

    if (aadhaar.length !== 12) {
      toast.error("Invalid Identity Identifier: Must be 12 digits.");
      return;
    }

    const formData = new FormData();
    formData.append("aadhaar_number", aadhaar);
    formData.append("aadhaar_image", file);

    try {
      setStatus("uploading");
      
      const res = await api.post("/delivery/upload-docs", formData);
      
      if (res.data.success) {
        setStatus("success");
        toast.success("Grid Identity Initialized Successfully");
      }
    } catch (err) {
      console.error(err);
      setStatus("idle");
      toast.error(err.response?.data?.message || "Uplink handshake failed");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6 sm:p-12 animate-in fade-in duration-700">
      <div className="bg-white/80 backdrop-blur-xl p-10 rounded-[48px] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] w-full max-w-lg border border-white/50 relative overflow-hidden">
        
        {/* Aesthetic Background Accents */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-orange-100 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-50 rounded-full blur-3xl opacity-50"></div>

        {status === "success" ? (
          <div className="text-center space-y-6 animate-in zoom-in-95 duration-500">
            <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-[32px] flex items-center justify-center text-4xl mx-auto shadow-inner border border-emerald-100/50">
               ✅
            </div>
            
            <div className="space-y-2">
              <h2 className="text-3xl font-[1000] text-slate-800 tracking-tighter uppercase italic">
                Identity <span className="text-emerald-500">Verified</span>
              </h2>
              <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px]">
                You are now synchronized with the logistics grid
              </p>
            </div>

            <div className="relative group max-w-[240px] mx-auto">
              <img
                src={URL.createObjectURL(file)}
                alt="preview"
                className="rounded-[32px] shadow-2xl border-4 border-white transition-transform group-hover:scale-105 duration-500"
              />
              <div className="absolute inset-0 rounded-[32px] bg-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>

            <button 
              onClick={() => window.location.href = '/delivery-dashboard'}
              className="w-full bg-slate-900 text-white py-5 rounded-3xl font-black uppercase text-xs tracking-widest shadow-xl hover:bg-orange-500 transition-all active:scale-95"
            >
              Enter Dashboard
            </button>
          </div>
        ) : (
          <div className="space-y-8 relative">
            <div className="text-center">
              <div className="w-20 h-20 bg-orange-50 text-orange-500 rounded-[28px] flex items-center justify-center text-3xl mx-auto mb-6 shadow-sm">
                 🪪
              </div>
              <h2 className="text-2xl font-[1000] text-slate-800 tracking-tighter uppercase mb-2">
                Initialize <span className="text-orange-500 font-black">Identity</span>
              </h2>
              <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-[10px] italic">
                Mission Authorization Required
              </p>
            </div>

            <form onSubmit={handleUpload} className="space-y-6">
              {/* Aadhaar Input */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">
                  Legal Aadhaar Identifier
                </label>
                <input
                  type="text"
                  placeholder="1234 5678 9012"
                  value={aadhaar}
                  maxLength={12}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (/^\d*$/.test(val)) setAadhaar(val);
                  }}
                  className="w-full bg-slate-50 border-2 border-transparent focus:border-orange-200 focus:bg-white rounded-3xl p-6 font-bold text-slate-700 focus:ring-4 focus:ring-orange-500/5 transition-all outline-none"
                  required
                />
              </div>

              {/* File Upload */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">
                  Biometric Document (Front)
                </label>
                <div className="relative group">
                  <input
                    type="file"
                    id="identity-file"
                    onChange={(e) => setFile(e.target.files[0])}
                    className="hidden"
                    accept="image/*"
                  />
                  <label 
                    htmlFor="identity-file"
                    className={`w-full bg-slate-50 border-2 border-dashed rounded-[32px] p-8 flex flex-col items-center justify-center gap-4 cursor-pointer transition-all ${file ? 'border-emerald-200 bg-emerald-50/50' : 'border-slate-100 hover:border-orange-200 hover:bg-white'}`}
                  >
                    <span className="text-4xl filter grayscale group-hover:grayscale-0 transition-all">
                      {file ? "📂" : "☁️"}
                    </span>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-orange-500 transition-colors">
                      {file ? file.name : "Select JPG/PNG Proof"}
                    </span>
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={status === "uploading"}
                className={`w-full h-20 rounded-[32px] font-[1000] uppercase text-xs tracking-[0.2em] shadow-2xl transition-all flex items-center justify-center gap-3 active:scale-[0.98] ${
                  status === "uploading" 
                  ? "bg-slate-100 text-slate-400 cursor-not-allowed" 
                  : "bg-orange-500 text-white hover:bg-orange-600 hover:shadow-orange-500/20"
                }`}
              >
                {status === "uploading" ? (
                  <>
                    <div className="w-5 h-5 border-2 border-slate-300 border-t-slate-800 rounded-full animate-spin"></div>
                    Updating Grid...
                  </>
                ) : (
                  "Initiate Handshake"
                )}
              </button>
            </form>

            <p className="text-center text-[9px] font-black text-slate-300 uppercase tracking-[0.4em]">
              Fulfillment OS v2.4 • End-to-End Encryption
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Identity;
