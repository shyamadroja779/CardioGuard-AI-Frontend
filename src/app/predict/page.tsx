"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import {
  Activity, ArrowRight, ArrowLeft, HeartPulse, Building, Calendar,
  Cigarette, Droplets, Droplet, FileText, FlaskConical, LayoutDashboard,
  MapPin, Phone, ShieldCheck, Smile, Stethoscope, User, Users,
  Wine, CheckCircle2, DownloadCloud, AlertTriangle
} from "lucide-react";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import * as z from "zod";

/* ---------------- TYPES & APP SCHEMA ---------------- */

const formSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  age: z.number({ message: "Required" }).min(1, "Must be > 0").max(120, "Must be <= 120"),
  genderStr: z.enum(["Male", "Female"]),
  phone: z.string().optional(),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  address: z.string().optional(),
  doctorName: z.string().optional(),
  hospitalName: z.string().optional(),

  height: z.number({ message: "Required" }).min(100, "Min 100cm").max(250, "Max 250cm"),
  weight: z.number({ message: "Required" }).min(30, "Min 30kg").max(300, "Max 300kg"),
  apHi: z.number({ message: "Required" }).min(60, "Min 60").max(250, "Max 250"),
  apLo: z.number({ message: "Required" }).min(30, "Min 30").max(200, "Max 200"),

  cholesterol: z.number().min(1).max(3),
  gluc: z.number().min(1).max(3),
  smoke: z.number().min(0).max(1),
  alco: z.number().min(0).max(1),
  active: z.number().min(0).max(1),
});

type FormValues = z.infer<typeof formSchema>;

type PredictionResult = {
  id: string;
  prediction: number;
  prediction_label: string;
  probability: number;
  risk_level: string;
  recommendations: string[];
  created_at: string;
};

const BASE_API_URL = "/api";

const STEPS = [
  { id: 1, title: "Patient & Doctor Info" },
  { id: 2, title: "Clinical Biometrics" },
  { id: 3, title: "Lifestyle Factors" },
];

/* ---------------- COMPONENT ---------------- */

export default function EnhancedPredictPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
    defaultValues: {
      fullName: "",
      genderStr: "Male",
      cholesterol: 1,
      gluc: 1,
      smoke: 0,
      alco: 0,
      active: 1,
    },
  });

  const nextStep = async () => {
    let valid = false;
    if (step === 1) {
      valid = await trigger(["fullName", "age", "genderStr", "email", "phone", "address", "doctorName", "hospitalName"]);
    }
    if (step === 2) {
      valid = await trigger(["height", "weight", "apHi", "apLo"]);
    }
    if (valid) {
      setStep((s) => s + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const prevStep = () => {
    setStep((s) => s - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onSubmit = async (data: FormValues) => {
    if (step !== 3) return; // Prevent premature submission
    setLoading(true);

    try {
      const payload = {
        patient: {
          full_name: data.fullName,
          age: data.age,
          gender: data.genderStr,
          phone: data.phone || null,
          email: data.email || null,
          address: data.address || null,
        },
        doctor: {
          doctor_name: data.doctorName || null,
          hospital_name: data.hospitalName || null,
        },
        medical: {
          gender: data.genderStr === "Female" ? 1 : 2,
          height: data.height,
          weight: data.weight,
          ap_hi: data.apHi,
          ap_lo: data.apLo,
          cholesterol: data.cholesterol,
          gluc: data.gluc,
          smoke: data.smoke,
          alco: data.alco,
          active: data.active,
          age_years: data.age,
        },
      };

      const res = await axios.post<PredictionResult>(`${BASE_API_URL}/predict`, payload);
      setResult(res.data);
      setStep(4);
    } catch (error) {
      console.error("Prediction error:", error);
      alert("Uh oh! We couldn't process your request. Please ensure all inputs are valid.");
    } finally {
      setLoading(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  /* ---------------- UI HELPERS ---------------- */

  const getRiskStyles = (riskLevel: string) => {
    if (riskLevel.toLowerCase().includes("low")) {
      return {
        color: "text-emerald-400",
        border: "border-emerald-500/30",
        bg: "bg-emerald-500/10",
        shadow: "shadow-emerald-500/20",
        icon: <CheckCircle2 className="w-16 h-16 text-emerald-400 mb-4" />
      };
    }
    if (riskLevel.toLowerCase().includes("medium") || riskLevel.toLowerCase().includes("moderate")) {
      return {
        color: "text-yellow-400",
        border: "border-yellow-500/30",
        bg: "bg-yellow-500/10",
        shadow: "shadow-yellow-500/20",
        icon: <AlertTriangle className="w-16 h-16 text-yellow-400 mb-4" />
      };
    }
    return {
      color: "text-rose-500",
      border: "border-rose-500/30",
      bg: "bg-rose-500/10",
      shadow: "shadow-rose-500/20",
      icon: <CheckCircle2 className="w-16 h-16 text-rose-500 mb-4" />
    };
  };

  const InputField = ({ label, icon: Icon, id, type = "text", placeholder, registerName, error, width = "full" }: any) => (
    <div className={`w-${width} flex flex-col gap-1.5`}>
      <label className="text-sm font-medium text-gray-300 ml-1" htmlFor={id}>{label}</label>
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
          <Icon className={`w-5 h-5 transition-colors duration-200 ${error ? "text-red-400" : "text-gray-500 group-focus-within:text-purple-400"}`} />
        </div>
        <input
          id={id}
          type={type}
          step={type === "number" ? "any" : undefined}
          className={`w-full pl-11 pr-4 py-3 bg-white/5 border ${error ? "border-red-500/50 focus:border-red-500" : "border-white/10 focus:border-purple-500"} rounded-xl text-white placeholder-gray-500 outline-none transition-all duration-300 focus:bg-white/10`}
          placeholder={placeholder}
          {...register(registerName, { valueAsNumber: type === "number" })}
        />
      </div>
      {error && (
        <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-red-400 text-xs ml-1 mt-0.5">
          {error.message}
        </motion.p>
      )}
    </div>
  );

  const SelectionCard = ({ label, value, current, onClick }: any) => {
    const isSelected = current === value;
    return (
      <div
        onClick={() => onClick(value)}
        className={`flex-1 py-3 px-4 rounded-xl border cursor-pointer text-center transition-all duration-300 font-medium text-sm
          ${isSelected ? "bg-purple-600 border-purple-500 text-white shadow-[0_0_15px_rgba(147,51,234,0.4)]" : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-gray-200"}
        `}
      >
        {label}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#030509] text-gray-100 py-24 relative overflow-hidden selection:bg-purple-500/30">
      {/* Dynamic Background */}
      <div className="absolute top-0 inset-x-0 h-full w-full pointer-events-none z-0">
        <div className="absolute -top-[10%] -left-[10%] w-[40rem] h-[40rem] bg-purple-600/10 blur-[150px] rounded-full" />
        <div className="absolute top-[30%] -right-[15%] w-[40rem] h-[40rem] bg-indigo-600/10 blur-[150px] rounded-full" />
        <div className="absolute -bottom-[10%] left-[20%] w-[30rem] h-[30rem] bg-blue-600/10 blur-[140px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6">
        {/* Header content */}
        <div className="text-center mb-12">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="inline-flex items-center justify-center p-3 rounded-2xl bg-purple-500/10 border border-purple-500/20 mb-6">
            <HeartPulse className="w-8 h-8 text-purple-400" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
            {step < 4 ? "Cardio Analytics AI" : "Prediction Results"}
          </h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            {step < 4 ? "Provide your clinical parameters for an advanced machine-learning driven cardiovascular risk assessment." : "Your AI-driven personalized health analysis is complete."}
          </p>
        </div>

        {/* Progress Tracker map */}
        {step < 4 && (
          <div className="mb-10 w-full flex items-center justify-center space-x-2 md:space-x-4">
            {STEPS.map((s, index) => (
              <div key={s.id} className="flex items-center">
                <div className={`flex flex-col items-center group`}>
                  <div className={`w-10 h-10 flex items-center justify-center rounded-full border-2 transition-all duration-500 ${step === s.id ? "bg-purple-600 border-purple-500 shadow-[0_0_20px_rgba(147,51,234,0.4)]" : step > s.id ? "bg-emerald-500/20 border-emerald-500 text-emerald-400" : "bg-transparent border-white/10 text-gray-500"}`}>
                    {step > s.id ? <CheckCircle2 className="w-5 h-5" /> : <span className="text-sm font-semibold text-white">{s.id}</span>}
                  </div>
                  <span className={`text-xs mt-3 select-none font-medium hidden md:block transition-colors duration-300 ${step === s.id ? "text-purple-300" : step > s.id ? "text-emerald-400/80" : "text-gray-600"}`}>
                    {s.title}
                  </span>
                </div>
                {index < STEPS.length - 1 && (
                  <div className={`w-12 md:w-20 h-[2px] mx-2 md:mt-[-20px] transition-colors duration-500 ${step > s.id ? "bg-emerald-500/50" : "bg-white/10"}`} />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Form Container */}
        <motion.div
          className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-3xl p-6 md:p-10 shadow-2xl relative overflow-hidden"
          layout
        >
          {loading && (
            <div className="absolute inset-0 z-20 bg-[#030509]/80 backdrop-blur-sm flex flex-col items-center justify-center border border-white/10 rounded-3xl">
              <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mb-4" />
              <p className="text-purple-400 font-medium animate-pulse">Running advanced diagnostic algorithms...</p>
            </div>
          )}

          <form onSubmit={step === 3 ? handleSubmit(onSubmit) : (e) => e.preventDefault()}>
            <AnimatePresence mode="wait">
              {/* STEP 1 */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}
                  className="space-y-8"
                >
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-white flex items-center gap-2 border-b border-white/10 pb-4">
                      <User className="text-purple-400 w-5 h-5" /> Patient Demographics
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <InputField label="Full Name" id="fullName" registerName="fullName" icon={User} placeholder="John Doe" error={errors.fullName} />
                      <div className="flex gap-4">
                        <InputField label="Age" type="number" id="age" registerName="age" icon={Calendar} placeholder="45" error={errors.age} />
                      </div>
                      <div className="flex flex-col gap-1.5 md:col-span-2">
                        <label className="text-sm font-medium text-gray-300 ml-1">Biological Gender</label>
                        <div className="flex gap-4">
                          <SelectionCard label="Male" value="Male" current={watch("genderStr")} onClick={(val: string) => setValue("genderStr", val as any)} />
                          <SelectionCard label="Female" value="Female" current={watch("genderStr")} onClick={(val: string) => setValue("genderStr", val as any)} />
                        </div>
                      </div>
                      <InputField label="Email Address" id="email" type="email" registerName="email" icon={MapPin} placeholder="Optional" error={errors.email} />
                      <InputField label="Phone Number" id="phone" registerName="phone" icon={Phone} placeholder="Optional" error={errors.phone} />
                    </div>
                  </div>

                  <div className="space-y-6 pt-4">
                    <h3 className="text-xl font-semibold text-white flex items-center gap-2 border-b border-white/10 pb-4">
                      <Stethoscope className="text-purple-400 w-5 h-5" /> Provider Information (Optional)
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <InputField label="Doctor Name" id="doctorName" registerName="doctorName" icon={Stethoscope} placeholder="Dr. Smith" error={errors.doctorName} />
                      <InputField label="Hospital / Clinic" id="hospitalName" registerName="hospitalName" icon={Building} placeholder="City General" error={errors.hospitalName} />
                    </div>
                  </div>

                  <div className="flex justify-end pt-6">
                    <button type="button" onClick={nextStep} className="group flex items-center gap-2 bg-white text-black px-8 py-3.5 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-300 hover:scale-[1.02]">
                      Proceed to Vitals <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 2 */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}
                  className="space-y-8"
                >
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-white flex items-center gap-2 border-b border-white/10 pb-4">
                      <Activity className="text-purple-400 w-5 h-5" /> Anthropometric Info
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <InputField label="Height (cm)" type="number" id="height" registerName="height" icon={Activity} placeholder="175" error={errors.height} />
                      <InputField label="Weight (kg)" type="number" id="weight" registerName="weight" icon={LayoutDashboard} placeholder="70" error={errors.weight} />
                    </div>
                  </div>

                  <div className="space-y-6 pt-4">
                    <h3 className="text-xl font-semibold text-white flex items-center gap-2 border-b border-white/10 pb-4">
                      <HeartPulse className="text-purple-400 w-5 h-5" /> Blood Pressure
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <InputField label="Systolic (mmHg) apHi" type="number" id="apHi" registerName="apHi" icon={Droplets} placeholder="120" error={errors.apHi} />
                      <InputField label="Diastolic (mmHg) apLo" type="number" id="apLo" registerName="apLo" icon={Droplet} placeholder="80" error={errors.apLo} />
                    </div>
                  </div>

                  <div className="flex justify-between pt-6 border-t border-white/10">
                    <button type="button" onClick={prevStep} className="group flex items-center gap-2 text-gray-400 px-6 py-3.5 rounded-xl font-semibold hover:text-white hover:bg-white/5 transition-all duration-300">
                      <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> Back
                    </button>
                    <button type="button" onClick={nextStep} className="group flex items-center gap-2 bg-white text-black px-8 py-3.5 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-300 hover:scale-[1.02]">
                      Next Step <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 3 */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}
                  className="space-y-8"
                >
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-white flex items-center gap-2 border-b border-white/10 pb-4">
                      <FlaskConical className="text-purple-400 w-5 h-5" /> Blood Chemistry
                    </h3>

                    <div className="space-y-3">
                      <label className="text-sm font-medium text-gray-300 ml-1">Cholesterol Level</label>
                      <div className="flex flex-col md:flex-row gap-3">
                        <SelectionCard label="Normal" value={1} current={watch("cholesterol")} onClick={(v: number) => setValue("cholesterol", v)} />
                        <SelectionCard label="Above Normal" value={2} current={watch("cholesterol")} onClick={(v: number) => setValue("cholesterol", v)} />
                        <SelectionCard label="Well Above Normal" value={3} current={watch("cholesterol")} onClick={(v: number) => setValue("cholesterol", v)} />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-sm font-medium text-gray-300 ml-1">Glucose Level</label>
                      <div className="flex flex-col md:flex-row gap-3">
                        <SelectionCard label="Normal" value={1} current={watch("gluc")} onClick={(v: number) => setValue("gluc", v)} />
                        <SelectionCard label="Above Normal" value={2} current={watch("gluc")} onClick={(v: number) => setValue("gluc", v)} />
                        <SelectionCard label="Well Above Normal" value={3} current={watch("gluc")} onClick={(v: number) => setValue("gluc", v)} />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6 pt-4">
                    <h3 className="text-xl font-semibold text-white flex items-center gap-2 border-b border-white/10 pb-4">
                      <Smile className="text-purple-400 w-5 h-5" /> Lifestyle Variables
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300 flex items-center gap-2"><Cigarette className="w-4 h-4 text-gray-400" /> Smoking</label>
                        <div className="flex gap-2">
                          <SelectionCard label="No" value={0} current={watch("smoke")} onClick={(v: number) => setValue("smoke", v)} />
                          <SelectionCard label="Yes" value={1} current={watch("smoke")} onClick={(v: number) => setValue("smoke", v)} />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300 flex items-center gap-2"><Wine className="w-4 h-4 text-gray-400" /> Alcohol Intake</label>
                        <div className="flex gap-2">
                          <SelectionCard label="No" value={0} current={watch("alco")} onClick={(v: number) => setValue("alco", v)} />
                          <SelectionCard label="Yes" value={1} current={watch("alco")} onClick={(v: number) => setValue("alco", v)} />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300 flex items-center gap-2"><Activity className="w-4 h-4 text-gray-400" /> Physically Active</label>
                        <div className="flex gap-2">
                          <SelectionCard label="No" value={0} current={watch("active")} onClick={(v: number) => setValue("active", v)} />
                          <SelectionCard label="Yes" value={1} current={watch("active")} onClick={(v: number) => setValue("active", v)} />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between pt-6 border-t border-white/10">
                    <button type="button" onClick={prevStep} className="group flex items-center gap-2 text-gray-400 px-6 py-3.5 rounded-xl font-semibold hover:text-white hover:bg-white/5 transition-all duration-300">
                      <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> Back
                    </button>
                    <button type="submit" className="group flex items-center gap-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-3.5 rounded-xl font-bold shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300 hover:scale-[1.02]">
                      <ShieldCheck className="w-5 h-5" /> Run AI Assessment
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 4: RESULTS */}
              {step === 4 && result && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, type: "spring" }}
                  className="flex flex-col items-center"
                >
                  {/* Risk Badge */}
                  <div className={`flex flex-col items-center justify-center p-8 rounded-3xl w-full border border-b-0 rounded-b-none backdrop-blur-md ${getRiskStyles(result.risk_level).bg} ${getRiskStyles(result.risk_level).border}`}>
                    {getRiskStyles(result.risk_level).icon}
                    <h2 className={`text-4xl font-extrabold tracking-tight mb-2 ${getRiskStyles(result.risk_level).color}`}>
                      {result.risk_level}
                    </h2>
                    <p className="text-gray-300 text-lg">AI Probability Assessment: <span className="font-bold text-white">{Number(result.probability).toFixed(1)}%</span></p>
                  </div>

                  <div className="bg-black/40 w-full p-8 rounded-b-3xl border border-t-0 border-white/10 mb-8">
                    <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <Activity className="w-5 h-5 text-purple-400" /> AI Recommendations
                    </h4>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {result.recommendations.map((rec, i) => (
                        <li key={i} className="flex items-start gap-3 bg-white/5 border border-white/5 p-4 rounded-xl">
                          <CheckCircle2 className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                          <span className="text-gray-300 text-sm leading-relaxed">{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row w-full gap-4 justify-center mt-4">
                    <button
                      onClick={async () => {
                        try {
                          const response = await axios.post(`${BASE_API_URL}/generate-report`, {
                            prediction_id: result.id
                          }, {
                            headers: {
                              "Content-Type": "application/json",
                              "accept": "application/json"
                            },
                            responseType: "blob" // Important for downloading PDF files
                          });

                          // Create a local blob URL and trigger download
                          const url = window.URL.createObjectURL(new Blob([response.data]));
                          const link = document.createElement("a");
                          link.href = url;
                          link.setAttribute("download", `cardioguard-report-${result.id}.pdf`);
                          document.body.appendChild(link);
                          link.click();
                          
                          // Cleanup
                          link.parentNode?.removeChild(link);
                          window.URL.revokeObjectURL(url);
                        } catch (err) {
                          console.error("Error downloading PDF:", err);
                          alert("Failed to download the PDF report. Please try again.");
                        }
                      }}
                      className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-4 rounded-xl font-bold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 hover:scale-[1.02]"
                    >
                      <DownloadCloud className="w-5 h-5" /> Download PDF Report
                    </button>
                    <button
                      onClick={() => window.open(`${BASE_API_URL}/report/${result.id}/pdf`, "_blank")}
                      className="flex-1 flex items-center justify-center gap-2 bg-white/10 text-white border border-white/10 px-6 py-4 rounded-xl font-semibold hover:bg-white/15 transition-all duration-300"
                    >
                      <FileText className="w-5 h-5" /> View PDF Report
                    </button>
                    <button
                      onClick={() => {
                        setResult(null);
                        setStep(1);
                      }}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 bg-transparent text-gray-400 hover:text-white px-6 py-4 rounded-xl font-medium transition-all duration-300"
                    >
                      Start Over
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </motion.div>
      </div>
    </div>
  );
}