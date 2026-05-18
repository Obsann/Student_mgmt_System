import { teacherData } from '../data/mockData';

export default function Profile() {
  const teacher = teacherData;

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Profile Header */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="h-40 bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-700 relative">
          <div className="absolute inset-0 opacity-10">
            <svg width="100%" height="100%">
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
              </pattern>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>
        </div>
        <div className="px-8 pb-6 relative">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 -mt-12">
            <div className="w-24 h-24 bg-white rounded-2xl border-4 border-white shadow-lg flex items-center justify-center">
              <span className="text-3xl font-bold text-emerald-700">DB</span>
            </div>
            <div className="flex-1 pb-1">
              <h2 className="text-2xl font-bold text-gray-800">{teacher.firstName} {teacher.lastName}</h2>
              <p className="text-gray-500 mt-1">{teacher.department} Department • {teacher.qualification}</p>
            </div>
            <button className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium text-sm transition-colors shadow-sm">
              Edit Profile
            </button>
          </div>
        </div>
      </div>

      {/* Profile Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Personal Information */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="p-6 border-b border-gray-100">
            <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
              <span className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600 text-sm">👤</span>
              Personal Information
            </h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <InfoField label="Full Name" value={`${teacher.firstName} ${teacher.lastName}`} />
              <InfoField label="Teacher ID" value={teacher.id} />
              <InfoField label="Email" value={teacher.email} />
              <InfoField label="Phone" value={teacher.phone} />
              <InfoField label="Date of Birth" value={teacher.dateOfBirth} />
              <InfoField label="Gender" value={teacher.gender} />
              <InfoField label="Blood Group" value={teacher.bloodGroup} />
              <InfoField label="Address" value={teacher.address} />
              <InfoField label="Emergency Contact" value={teacher.emergencyContact} />
            </div>
          </div>
        </div>

        {/* Quick Info Sidebar */}
        <div className="space-y-6">
          {/* Employment Info */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="p-6 border-b border-gray-100">
              <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                <span className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 text-sm">💼</span>
                Employment
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-lg">🏫</div>
                <div>
                  <p className="text-xs text-gray-500">Department</p>
                  <p className="font-medium text-sm text-gray-800">{teacher.department}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center text-lg">📅</div>
                <div>
                  <p className="text-xs text-gray-500">Joined</p>
                  <p className="font-medium text-sm text-gray-800">{teacher.joinDate}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center text-lg">⏱️</div>
                <div>
                  <p className="text-xs text-gray-500">Experience</p>
                  <p className="font-medium text-sm text-gray-800">{teacher.experience} Years</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center text-lg">💰</div>
                <div>
                  <p className="text-xs text-gray-500">Salary</p>
                  <p className="font-medium text-sm text-gray-800">{teacher.salary}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Subjects */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="p-6 border-b border-gray-100">
              <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                <span className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center text-purple-600 text-sm">📖</span>
                Subjects
              </h3>
            </div>
            <div className="p-6 space-y-3">
              {teacher.subjects.map(subject => (
                <div key={subject} className="flex items-center gap-3 p-3 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-100">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                  <span className="font-medium text-sm text-gray-800">{subject}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">{label}</label>
      <p className="mt-1 text-sm font-medium text-gray-800 bg-gray-50 px-4 py-2.5 rounded-xl border border-gray-100">{value}</p>
    </div>
  );
}
