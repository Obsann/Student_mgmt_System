import { useState } from 'react';

interface RegistrationForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: string;
  dateOfBirth: string;
  address: string;
  qualification: string;
  department: string;
  subjects: string[];
  experience: string;
  previousSchool: string;
  emergencyContact: string;
  bloodGroup: string;
}

export default function Registration() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState<RegistrationForm>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    gender: '',
    dateOfBirth: '',
    address: '',
    qualification: '',
    department: '',
    subjects: [],
    experience: '',
    previousSchool: '',
    emergencyContact: '',
    bloodGroup: '',
  });

  const updateForm = (field: keyof RegistrationForm, value: string | string[]) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const toggleSubject = (subject: string) => {
    setForm(prev => ({
      ...prev,
      subjects: prev.subjects.includes(subject)
        ? prev.subjects.filter(s => s !== subject)
        : [...prev.subjects, subject],
    }));
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const handleReset = () => {
    setForm({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      gender: '',
      dateOfBirth: '',
      address: '',
      qualification: '',
      department: '',
      subjects: [],
      experience: '',
      previousSchool: '',
      emergencyContact: '',
      bloodGroup: '',
    });
    setStep(1);
    setSubmitted(false);
  };

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center text-4xl mx-auto mb-4">
            ✅
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Registration Submitted!</h2>
          <p className="text-gray-500 mb-6">
            Your registration form has been successfully submitted to Kera Highschool administration. 
            You will receive a confirmation email once your registration is approved.
          </p>
          <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left">
            <p className="text-sm text-gray-500 mb-2">Reference Number:</p>
            <p className="text-lg font-bold text-emerald-700">REG-{Date.now().toString().slice(-8)}</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleReset}
              className="flex-1 px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium text-sm transition-colors"
            >
              New Registration
            </button>
            <button className="flex-1 px-5 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium text-sm hover:bg-gray-200 transition-colors">
              Print Form
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Steps */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between max-w-md mx-auto">
          {[
            { num: 1, label: 'Personal Info' },
            { num: 2, label: 'Professional' },
            { num: 3, label: 'Review & Submit' },
          ].map((s, i) => (
            <div key={s.num} className="flex items-center">
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold transition-all ${
                  step >= s.num ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' : 'bg-gray-100 text-gray-400'
                }`}>
                  {step > s.num ? '✓' : s.num}
                </div>
                <span className={`text-xs mt-2 font-medium ${step >= s.num ? 'text-emerald-600' : 'text-gray-400'}`}>
                  {s.label}
                </span>
              </div>
              {i < 2 && (
                <div className={`w-16 sm:w-24 h-0.5 mx-2 mb-5 ${step > s.num ? 'bg-emerald-500' : 'bg-gray-200'}`}></div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step 1: Personal Information */}
      {step === 1 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-emerald-50 to-teal-50">
            <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
              <span className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600 text-sm">👤</span>
              Personal Information
            </h3>
            <p className="text-sm text-gray-500 mt-1">Please fill in your personal details accurately</p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <FormField label="First Name" required>
                <input
                  type="text"
                  value={form.firstName}
                  onChange={e => updateForm('firstName', e.target.value)}
                  placeholder="Enter first name"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                />
              </FormField>
              <FormField label="Last Name" required>
                <input
                  type="text"
                  value={form.lastName}
                  onChange={e => updateForm('lastName', e.target.value)}
                  placeholder="Enter last name"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                />
              </FormField>
              <FormField label="Email Address" required>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => updateForm('email', e.target.value)}
                  placeholder="email@example.com"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                />
              </FormField>
              <FormField label="Phone Number" required>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={e => updateForm('phone', e.target.value)}
                  placeholder="+251 9XX XXX XXX"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                />
              </FormField>
              <FormField label="Gender" required>
                <select
                  value={form.gender}
                  onChange={e => updateForm('gender', e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </FormField>
              <FormField label="Date of Birth" required>
                <input
                  type="date"
                  value={form.dateOfBirth}
                  onChange={e => updateForm('dateOfBirth', e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                />
              </FormField>
              <FormField label="Blood Group">
                <select
                  value={form.bloodGroup}
                  onChange={e => updateForm('bloodGroup', e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                >
                  <option value="">Select blood group</option>
                  {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                    <option key={bg} value={bg}>{bg}</option>
                  ))}
                </select>
              </FormField>
              <FormField label="Address" required>
                <input
                  type="text"
                  value={form.address}
                  onChange={e => updateForm('address', e.target.value)}
                  placeholder="Jimma, Oromia, Ethiopia"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                />
              </FormField>
              <FormField label="Emergency Contact">
                <input
                  type="tel"
                  value={form.emergencyContact}
                  onChange={e => updateForm('emergencyContact', e.target.value)}
                  placeholder="+251 9XX XXX XXX"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                />
              </FormField>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Professional Information */}
      {step === 2 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
            <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
              <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 text-sm">💼</span>
              Professional Information
            </h3>
            <p className="text-sm text-gray-500 mt-1">Provide your teaching qualifications and experience</p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <FormField label="Highest Qualification" required>
                <select
                  value={form.qualification}
                  onChange={e => updateForm('qualification', e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                >
                  <option value="">Select qualification</option>
                  <option value="Diploma">Diploma</option>
                  <option value="BSc">Bachelor of Science (BSc)</option>
                  <option value="BA">Bachelor of Arts (BA)</option>
                  <option value="MSc">Master of Science (MSc)</option>
                  <option value="MA">Master of Arts (MA)</option>
                  <option value="PhD">Doctorate (PhD)</option>
                </select>
              </FormField>
              <FormField label="Department" required>
                <select
                  value={form.department}
                  onChange={e => updateForm('department', e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                >
                  <option value="">Select department</option>
                  <option value="Natural Science">Natural Science</option>
                  <option value="Social Science">Social Science</option>
                  <option value="Language">Language</option>
                  <option value="IT">Information Technology</option>
                  <option value="Arts">Arts</option>
                </select>
              </FormField>
              <FormField label="Years of Experience" required>
                <input
                  type="number"
                  value={form.experience}
                  onChange={e => updateForm('experience', e.target.value)}
                  placeholder="e.g., 5"
                  min="0"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                />
              </FormField>
              <FormField label="Previous School">
                <input
                  type="text"
                  value={form.previousSchool}
                  onChange={e => updateForm('previousSchool', e.target.value)}
                  placeholder="Previous school name"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                />
              </FormField>
            </div>

            <FormField label="Subjects You Can Teach" required>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mt-1">
                {[
                  'Mathematics', 'Physics', 'Chemistry', 'Biology',
                  'English', 'Amharic', 'Afaan Oromoo', 'History',
                  'Geography', 'Civics', 'IT', 'Economics',
                  'Business', 'Art', 'Music', 'PE',
                ].map(subject => (
                  <button
                    key={subject}
                    type="button"
                    onClick={() => toggleSubject(subject)}
                    className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      form.subjects.includes(subject)
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    {subject}
                  </button>
                ))}
              </div>
            </FormField>
          </div>
        </div>
      )}

      {/* Step 3: Review & Submit */}
      {step === 3 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-pink-50">
            <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
              <span className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 text-sm">📋</span>
              Review & Submit
            </h3>
            <p className="text-sm text-gray-500 mt-1">Please review your information before submitting</p>
          </div>
          <div className="p-6 space-y-6">
            {/* Personal Info Review */}
            <div>
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <span className="w-6 h-6 bg-emerald-100 rounded-md flex items-center justify-center text-emerald-600 text-xs">1</span>
                Personal Information
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <ReviewField label="Full Name" value={`${form.firstName} ${form.lastName}`} />
                <ReviewField label="Email" value={form.email} />
                <ReviewField label="Phone" value={form.phone} />
                <ReviewField label="Gender" value={form.gender} />
                <ReviewField label="Date of Birth" value={form.dateOfBirth} />
                <ReviewField label="Blood Group" value={form.bloodGroup} />
                <ReviewField label="Address" value={form.address} />
                <ReviewField label="Emergency Contact" value={form.emergencyContact} />
              </div>
            </div>

            {/* Professional Review */}
            <div>
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <span className="w-6 h-6 bg-blue-100 rounded-md flex items-center justify-center text-blue-600 text-xs">2</span>
                Professional Information
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <ReviewField label="Qualification" value={form.qualification} />
                <ReviewField label="Department" value={form.department} />
                <ReviewField label="Experience" value={`${form.experience} years`} />
                <ReviewField label="Previous School" value={form.previousSchool} />
              </div>
              <div className="mt-3">
                <p className="text-xs text-gray-500 mb-2">Subjects:</p>
                <div className="flex flex-wrap gap-2">
                  {form.subjects.map(s => (
                    <span key={s} className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-medium">
                      {s}
                    </span>
                  ))}
                  {form.subjects.length === 0 && <span className="text-sm text-gray-400">No subjects selected</span>}
                </div>
              </div>
            </div>

            {/* Declaration */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <input type="checkbox" className="mt-1 w-4 h-4 accent-emerald-600" id="declare" />
                <label htmlFor="declare" className="text-sm text-gray-700">
                  I hereby declare that all the information provided above is true and correct to the best of my knowledge. 
                  I understand that any false information may lead to disqualification of my application.
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between mt-6">
        <button
          onClick={() => setStep(Math.max(1, step - 1))}
          className={`px-6 py-3 rounded-xl font-medium text-sm transition-colors ${
            step === 1
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          disabled={step === 1}
        >
          ← Previous
        </button>
        <div className="flex gap-3">
          <button
            onClick={handleReset}
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium text-sm hover:bg-gray-200 transition-colors"
          >
            Reset
          </button>
          {step < 3 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium text-sm transition-colors"
            >
              Next Step →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium text-sm transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Submit Registration
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function FormField({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <div className="mt-1">{children}</div>
    </div>
  );
}

function ReviewField({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-gray-50 rounded-xl px-4 py-2.5 border border-gray-100">
      <p className="text-xs text-gray-400">{label}</p>
      <p className="text-sm font-medium text-gray-800 mt-0.5">{value || '—'}</p>
    </div>
  );
}
