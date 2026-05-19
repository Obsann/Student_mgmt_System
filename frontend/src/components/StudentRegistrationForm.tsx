import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { User, BookOpen, MapPin, ShieldAlert, ChevronRight, ChevronLeft, Save, Loader2, CheckCircle2, Lock } from "lucide-react";
import { api } from "../services/api";
import { useApp } from "../contexts/AppContext";
import { useEffect } from "react";

const registrationSchema = z.object({
  // Step 1: Personal
  firstName: z.string().min(2, "First name is required"),
  middleName: z.string().min(2, "Middle name is required"),
  lastName: z.string().min(2, "Last name is required"),
  dateOfBirth: z.string().min(1, "DOB is required"),
  gender: z.enum(["Male", "Female"]),
  faydaId: z.string().length(12, "Fayda ID must be exactly 12 digits").regex(/^\d+$/, "Must be digits only"),

  // Step 2: Academic
  grade8GPA: z.coerce.number().min(0).max(100),
  previousSchool: z.string().min(2, "School name is required"),
  nationalExamNumber: z.string().min(5, "Exam number is required"),
  grade: z.string().min(1, "Grade is required"),
  section: z.string().min(1, "Section is required"),
  rollNumber: z.string().min(1, "Roll number is required"),

  // Step 3: Guardian & Address
  region: z.string().min(2, "Region is required"),
  zone: z.string().min(2, "Zone is required"),
  kebele: z.string().min(1, "Kebele is required"),
  houseNo: z.string().min(1, "House No is required"),
  guardianName: z.string().min(2, "Guardian name is required"),
  guardianRelation: z.string().min(2, "Relation is required"),
  parentPhone: z.string().min(10, "Valid phone is required"),
  personalEmail: z.string().email("Invalid email").optional().or(z.literal("")),
});

export default function StudentRegistrationForm() {
  const { currentUser, state } = useApp();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isWindowOpen, setIsWindowOpen] = useState(true);
  const [checkingWindow, setCheckingWindow] = useState(true);

  // Get teacher info if role is teacher
  const teacher = currentUser?.role === "teacher" 
    ? state.teachers.find(t => t.id === currentUser.ref_id) 
    : null;

  useEffect(() => {
    if (currentUser?.role === "teacher") {
      api.getSettings().then(settings => {
        setIsWindowOpen(settings.registrationOpen === true || settings.registrationOpen === "true");
        setCheckingWindow(false);
      }).catch(() => setCheckingWindow(false));
    } else {
      setCheckingWindow(false);
    }
  }, [currentUser]);

  const { register, handleSubmit, formState: { errors }, trigger } = useForm({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      gender: "Male" as const,
      grade: teacher?.assigned_grade || "9",
      section: teacher?.assigned_section || "A",
      region: "Oromia",
      zone: "Jimma",
      kebele: "Jimma City",
      houseNo: "N/A",
    }
  });

  const nextStep = async () => {
    let fields: any[] = [];
    if (step === 1) fields = ["firstName", "middleName", "lastName", "dateOfBirth", "gender", "faydaId"];
    if (step === 2) fields = ["grade8GPA", "previousSchool", "nationalExamNumber", "grade", "section", "rollNumber"];
    
    const isValid = await trigger(fields as any);
    if (isValid) setStep(step + 1);
  };

  const onSubmit = async (data: any) => {
    setLoading(true);
    setError(null);
    try {
      await api.createStudent({
        first_name: data.firstName,
        middle_name: data.middleName,
        last_name: data.lastName,
        date_of_birth: data.dateOfBirth,
        gender: data.gender,
        fayda_id: data.faydaId,
        grade_8_gpa: data.grade8GPA,
        previous_school: data.previousSchool,
        national_exam_number: data.nationalExamNumber,
        address: {
          region: data.region,
          zone: data.zone,
          kebele: data.kebele,
          house_no: data.houseNo,
        },
        guardian_name: data.guardianName,
        guardian_relation: data.guardianRelation,
        parent_phone: data.parentPhone,
        personal_email: data.personalEmail,
        grade: data.grade,
        section: data.section,
        roll_number: data.rollNumber,
        status: "active",
        enrolled_date: new Date().toISOString(),
      });
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Failed to register student");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-white rounded-3xl border border-slate-100 p-12 text-center shadow-xl animate-fade-scale">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 size={40} />
        </div>
        <h2 className="text-2xl font-black text-slate-900 mb-2">Registration Successful!</h2>
        <p className="text-slate-500 mb-8 font-medium">The student has been added to the system and credentials have been generated.</p>
        <button 
          onClick={() => { setSuccess(false); setStep(1); }}
          className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20"
        >
          Register Another Student
        </button>
      </div>
    );
  }

  if (checkingWindow) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-indigo-500 w-10 h-10" />
      </div>
    );
  }

  if (!isWindowOpen && currentUser?.role === "teacher") {
    return (
      <div className="max-w-xl mx-auto bg-white rounded-3xl border border-slate-100 p-12 text-center shadow-xl animate-fade-scale">
        <div className="w-20 h-20 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <Lock size={40} />
        </div>
        <h2 className="text-2xl font-black text-slate-900 mb-2">Registration is Closed</h2>
        <p className="text-slate-500 font-medium">The student registration window is currently closed by the administration. Please contact the administrator to open the registration window.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-10 flex items-center justify-between px-2">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center flex-1 last:flex-none">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black transition-all duration-500 ${
              step >= s ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20" : "bg-slate-100 text-slate-400"
            }`}>
              {s}
            </div>
            {s < 3 && (
              <div className={`h-1 flex-1 mx-4 rounded-full transition-all duration-500 ${
                step > s ? "bg-indigo-600" : "bg-slate-100"
              }`} />
            )}
          </div>
        ))}
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          
          {step === 1 && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl"><User size={20} /></div>
                <h3 className="text-lg font-black text-slate-900">Personal Identity</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input label="First Name" {...register("firstName")} error={errors.firstName?.message} />
                <Input label="Middle Name" {...register("middleName")} error={errors.middleName?.message} />
                <Input label="Last Name" {...register("lastName")} error={errors.lastName?.message} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input label="Date of Birth" type="date" {...register("dateOfBirth")} error={errors.dateOfBirth?.message} />
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-wider">Gender</label>
                  <select {...register("gender")} className="w-full px-4 py-3 rounded-xl border border-slate-100 bg-slate-50 text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none">
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <Input label="Fayda ID (12 digits)" {...register("faydaId")} error={errors.faydaId?.message} placeholder="123456789012" />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl"><BookOpen size={20} /></div>
                <h3 className="text-lg font-black text-slate-900">Academic History</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input label="Grade 8 GPA (%)" type="number" step="0.01" {...register("grade8GPA")} error={errors.grade8GPA?.message} />
                <Input label="Previous School" {...register("previousSchool")} error={errors.previousSchool?.message} />
                <Input label="National Exam No." {...register("nationalExamNumber")} error={errors.nationalExamNumber?.message} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-wider">Current Grade</label>
                  <select {...register("grade")} className="w-full px-4 py-3 rounded-xl border border-slate-100 bg-slate-50 text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none">
                    {["9", "10", "11", "12"].map(g => <option key={g} value={g}>Grade {g}</option>)}
                  </select>
                </div>
                <Input label="Section" {...register("section")} error={errors.section?.message} placeholder="e.g. A" />
                <Input label="Roll Number" {...register("rollNumber")} error={errors.rollNumber?.message} />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-orange-50 text-orange-600 rounded-xl"><MapPin size={20} /></div>
                <h3 className="text-lg font-black text-slate-900">Contact & Address</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Input label="Region" {...register("region")} error={errors.region?.message} />
                <Input label="Zone" {...register("zone")} error={errors.zone?.message} />
                <Input label="Kebele" {...register("kebele")} error={errors.kebele?.message} />
                <Input label="House No." {...register("houseNo")} error={errors.houseNo?.message} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input label="Guardian Name" {...register("guardianName")} error={errors.guardianName?.message} />
                <Input label="Relation" {...register("guardianRelation")} error={errors.guardianRelation?.message} />
                <Input label="Guardian Phone" {...register("parentPhone")} error={errors.parentPhone?.message} />
              </div>
              <Input label="Student Email (Optional)" {...register("personalEmail")} error={errors.personalEmail?.message} placeholder="student@gmail.com" />
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-sm font-bold animate-shake">
              <ShieldAlert size={18} /> {error}
            </div>
          )}

          <div className="pt-6 flex justify-between">
            {step > 1 ? (
              <button 
                type="button" 
                onClick={() => setStep(step - 1)}
                className="px-6 py-3 rounded-2xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-all flex items-center gap-2"
              >
                <ChevronLeft size={18} /> Back
              </button>
            ) : <div />}

            {step < 3 ? (
              <button 
                type="button" 
                onClick={nextStep}
                className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 flex items-center gap-2"
              >
                Next <ChevronRight size={18} />
              </button>
            ) : (
              <button 
                type="submit" 
                disabled={loading}
                className="px-10 py-3 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 flex items-center gap-2 disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                Complete Registration
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

const Input = ({ label, error, ...props }: any) => (
  <div className="space-y-1.5">
    <label className="text-xs font-black text-slate-400 uppercase tracking-wider">{label}</label>
    <input 
      {...props} 
      className={`w-full px-4 py-3 rounded-xl border bg-slate-50 text-sm font-bold transition-all focus:ring-2 outline-none ${
        error ? "border-red-200 ring-red-50" : "border-slate-100 focus:ring-indigo-500"
      }`}
    />
    {error && <p className="text-[10px] font-bold text-red-500">{error}</p>}
  </div>
);
