import React, { useState, useEffect } from 'react';
import { 
  Home, Users, Calendar, BookOpen, ClipboardList, User, LogOut, 
  Bell, Search, Plus, Edit2, CheckCircle, XCircle, TrendingUp 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Student {
  id: number;
  name: string;
  grade: string;
  gender: 'M' | 'F';
  attendance: number;
  avgMark: number;
  photo: string;
  contact: string;
  marks: { subject: string; score: number }[];
}

interface Teacher {
  name: string;
  title: string;
  email: string;
  phone: string;
  experience: number;
  subjects: string[];
  bio: string;
  photo: string;
}

const KeraTeacherPortal: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'students' | 'attendance' | 'marks' | 'registration' | 'profile'>('dashboard');
  const [students, setStudents] = useState<Student[]>([
    {
      id: 1,
      name: "Amina Bekele",
      grade: "10A",
      gender: "F",
      attendance: 96,
      avgMark: 87,
      photo: "/images/student1.jpg",
      contact: "+251 911 234 567",
      marks: [
        { subject: "Mathematics", score: 92 },
        { subject: "Physics", score: 85 },
        { subject: "Chemistry", score: 88 },
        { subject: "English", score: 83 }
      ]
    },
    {
      id: 2,
      name: "Dawit Kebede",
      grade: "10A",
      gender: "M",
      attendance: 89,
      avgMark: 76,
      photo: "/images/student2.jpg",
      contact: "+251 922 345 678",
      marks: [
        { subject: "Mathematics", score: 71 },
        { subject: "Physics", score: 79 },
        { subject: "Chemistry", score: 82 },
        { subject: "English", score: 72 }
      ]
    },
    {
      id: 3,
      name: "Selam Tesfaye",
      grade: "9B",
      gender: "F",
      attendance: 98,
      avgMark: 91,
      photo: "/images/student1.jpg",
      contact: "+251 933 456 789",
      marks: [
        { subject: "Mathematics", score: 95 },
        { subject: "Biology", score: 89 },
        { subject: "History", score: 93 },
        { subject: "English", score: 87 }
      ]
    },
    {
      id: 4,
      name: "Yared Mulugeta",
      grade: "11A",
      gender: "M",
      attendance: 84,
      avgMark: 79,
      photo: "/images/student2.jpg",
      contact: "+251 944 567 890",
      marks: [
        { subject: "Mathematics", score: 68 },
        { subject: "Physics", score: 85 },
        { subject: "Chemistry", score: 77 },
        { subject: "English", score: 86 }
      ]
    },
    {
      id: 5,
      name: "Meron Hailu",
      grade: "10B",
      gender: "F",
      attendance: 93,
      avgMark: 85,
      photo: "/images/student1.jpg",
      contact: "+251 955 678 901",
      marks: [
        { subject: "Mathematics", score: 88 },
        { subject: "Biology", score: 82 },
        { subject: "History", score: 79 },
        { subject: "English", score: 91 }
      ]
    },
    {
      id: 6,
      name: "Biruk Alemu",
      grade: "9B",
      gender: "M",
      attendance: 91,
      avgMark: 82,
      photo: "/images/student2.jpg",
      contact: "+251 966 789 012",
      marks: [
        { subject: "Mathematics", score: 84 },
        { subject: "Physics", score: 78 },
        { subject: "Chemistry", score: 81 },
        { subject: "English", score: 85 }
      ]
    },
  ]);
  
  const [teacher, setTeacher] = useState<Teacher>({
    name: "Mr. Tesfaye Alemayehu",
    title: "Senior Mathematics Teacher",
    email: "tesfaye.alemayehu@khs.edu.et",
    phone: "+251 911 876 543",
    experience: 14,
    subjects: ["Mathematics", "Physics"],
    bio: "Passionate educator with 14 years of experience teaching mathematics and physics at Kera High School. Dedicated to nurturing young minds in Jimma, Ethiopia and helping students achieve academic excellence.",
    photo: "/images/teacher.jpg"
  });

  const [selectedClass, setSelectedClass] = useState("10A");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedSubject, setSelectedSubject] = useState("Mathematics");
  const [attendanceData, setAttendanceData] = useState<Record<string, Record<number, boolean>>>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [notification, setNotification] = useState("");
  const [newStudent, setNewStudent] = useState({
    name: "",
    grade: "10A",
    gender: "M" as "M" | "F",
    contact: ""
  });
  const [editingProfile, setEditingProfile] = useState(false);
  const [tempTeacher, setTempTeacher] = useState(teacher);

  // Filtered students
  const filteredStudents = students.filter(student => 
    (student.grade === selectedClass || activeTab !== 'attendance' && activeTab !== 'marks') &&
    (student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
     student.grade.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(""), 3000);
  };

  const markAttendance = (studentId: number, isPresent: boolean) => {
    const dateKey = selectedDate;
    setAttendanceData(prev => ({
      ...prev,
      [dateKey]: {
        ...(prev[dateKey] || {}),
        [studentId]: isPresent
      }
    }));
  };

  const saveAttendance = () => {
    const dateKey = selectedDate;
    const currentAttendance = attendanceData[dateKey] || {};
    
    setStudents(prevStudents => {
      return prevStudents.map(student => {
        if (currentAttendance[student.id] !== undefined) {
          const isPresent = currentAttendance[student.id];
          const newAttendance = isPresent 
            ? Math.min(100, student.attendance + 1) 
            : Math.max(75, student.attendance - 2);
          
          return { ...student, attendance: newAttendance };
        }
        return student;
      });
    });
    
    showNotification(`Attendance for ${selectedDate} saved successfully!`);
  };

  const updateMark = (studentId: number, subject: string, score: number) => {
    setStudents(prev => prev.map(student => {
      if (student.id === studentId) {
        const updatedMarks = student.marks.map(m => 
          m.subject === subject ? { ...m, score: Math.max(0, Math.min(100, score)) } : m
        );
        
        // Add subject if not present
        const hasSubject = updatedMarks.some(m => m.subject === subject);
        const finalMarks = hasSubject ? updatedMarks : [...updatedMarks, { subject, score }];
        
        const avgMark = Math.round(
          finalMarks.reduce((sum, m) => sum + m.score, 0) / finalMarks.length
        );
        
        return { ...student, marks: finalMarks, avgMark };
      }
      return student;
    }));
  };

  const getAttendanceForDate = (date: string, studentId: number) => {
    return attendanceData[date]?.[studentId] !== undefined 
      ? attendanceData[date][studentId] 
      : true; // default to present
  };

  const addNewStudent = () => {
    if (!newStudent.name.trim()) {
      showNotification("Please enter student name");
      return;
    }
    
    const newId = Math.max(0, ...students.map(s => s.id)) + 1;
    const newStud: Student = {
      id: newId,
      name: newStudent.name,
      grade: newStudent.grade,
      gender: newStudent.gender,
      attendance: 90,
      avgMark: 78,
      photo: newId % 2 === 0 ? "/images/student2.jpg" : "/images/student1.jpg",
      contact: newStudent.contact || "+251 900 000 000",
      marks: [
        { subject: "Mathematics", score: 75 },
        { subject: "Physics", score: 72 },
        { subject: "English", score: 88 }
      ]
    };
    
    setStudents([...students, newStud]);
    setNewStudent({ name: "", grade: "10A", gender: "M", contact: "" });
    setShowAddStudentModal(false);
    showNotification(`${newStudent.name} has been registered successfully!`);
  };

  const updateTeacherProfile = () => {
    setTeacher(tempTeacher);
    setEditingProfile(false);
    showNotification("Profile updated successfully!");
  };

  const getClassStudents = (grade: string) => {
    return students.filter(s => s.grade === grade);
  };

  const classAverages = {
    "10A": 81,
    "10B": 85,
    "9B": 86,
    "11A": 79
  };

  // Stats
  const totalStudents = students.length;
  const avgAttendance = Math.round(
    students.reduce((sum, s) => sum + s.attendance, 0) / totalStudents
  );
  const avgScore = Math.round(
    students.reduce((sum, s) => sum + s.avgMark, 0) / totalStudents
  );
  const classesTaught = 4;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'students', label: 'My Students', icon: Users },
    { id: 'attendance', label: 'Attendance', icon: Calendar },
    { id: 'marks', label: 'Marks & Grades', icon: BookOpen },
    { id: 'registration', label: 'Registration', icon: ClipboardList },
    { id: 'profile', label: 'My Profile', icon: User },
  ];

  const subjects = ["Mathematics", "Physics", "Chemistry", "Biology", "English", "History"];

  return (
    <div className="flex h-screen bg-zinc-950 text-zinc-100 overflow-hidden">
      {/* Sidebar */}
      <div className="w-72 bg-zinc-900 border-r border-zinc-800 flex flex-col">
        <div className="p-6 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">K</span>
            </div>
            <div>
              <div className="font-semibold text-2xl tracking-tight">Kera High</div>
              <div className="text-[10px] text-emerald-400 -mt-1">JIMMA, ETHIOPIA</div>
            </div>
          </div>
          <div className="mt-2 text-xs text-zinc-500">TEACHER PORTAL</div>
        </div>

        <div className="p-4 flex-1 overflow-y-auto">
          <div className="px-3 mb-4 text-xs font-medium text-zinc-500 uppercase tracking-widest">Main Menu</div>
          
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <motion.button
                key={item.id}
                whileHover={{ x: 4 }}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl mb-1 transition-all text-left ${
                  isActive 
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20' 
                    : 'hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : ''}`} />
                <span className="font-medium">{item.label}</span>
              </motion.button>
            );
          })}
        </div>

        <div className="p-4 border-t border-zinc-800 mt-auto">
          <div className="flex items-center gap-3 px-3 py-2">
            <img 
              src={teacher.photo} 
              alt={teacher.name}
              className="w-9 h-9 rounded-full object-cover ring-2 ring-emerald-500"
            />
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm truncate">{teacher.name}</div>
              <div className="text-emerald-400 text-xs">Online</div>
            </div>
            <button 
              onClick={() => {
                if (window.confirm("Log out of the portal?")) {
                  window.location.reload();
                }
              }}
              className="p-2 hover:bg-zinc-800 rounded-xl text-zinc-400 hover:text-red-400 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <div className="h-16 bg-zinc-900 border-b border-zinc-800 px-8 flex items-center justify-between z-20">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="text-emerald-400">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h1 className="text-xl font-semibold capitalize">{activeTab}</h1>
            </div>
            
            {(activeTab === 'students' || activeTab === 'attendance' || activeTab === 'marks') && (
              <div className="relative ml-6 w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 pl-10 py-2 rounded-2xl text-sm focus:outline-none focus:border-emerald-600 placeholder:text-zinc-500"
                />
              </div>
            )}
          </div>

          <div className="flex items-center gap-6">
            {/* Class Selector */}
            {(activeTab === 'attendance' || activeTab === 'marks' || activeTab === 'students') && (
              <select 
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="bg-zinc-800 border border-zinc-700 text-sm rounded-2xl px-4 py-2 focus:outline-none focus:border-emerald-600 cursor-pointer"
              >
                <option value="10A">Class 10A</option>
                <option value="10B">Class 10B</option>
                <option value="9B">Class 9B</option>
                <option value="11A">Class 11A</option>
              </select>
            )}

            {/* Subject Selector for Marks */}
            {activeTab === 'marks' && (
              <select 
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="bg-zinc-800 border border-zinc-700 text-sm rounded-2xl px-4 py-2 focus:outline-none focus:border-emerald-600 cursor-pointer"
              >
                {subjects.map(sub => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
              </select>
            )}

            <div className="relative cursor-pointer" onClick={() => showNotification("No new notifications")}>
              <Bell className="w-5 h-5 text-zinc-400 hover:text-white transition-colors" />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-[9px] font-bold">3</div>
            </div>

            <div className="flex items-center gap-3 pl-6 border-l border-zinc-800">
              <img 
                src={teacher.photo} 
                alt="Teacher" 
                className="w-8 h-8 rounded-2xl object-cover ring-2 ring-offset-2 ring-offset-zinc-900 ring-emerald-500/70" 
              />
              <div>
                <div className="text-sm font-medium leading-none">{teacher.name.split(' ')[1]}</div>
                <div className="text-[10px] text-emerald-500">Mathematics</div>
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-8 bg-zinc-950">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="max-w-7xl mx-auto"
            >
              {/* DASHBOARD */}
              {activeTab === 'dashboard' && (
                <div>
                  <div className="mb-10">
                    <img 
                      src="/images/banner.jpg" 
                      alt="Kera High School" 
                      className="w-full h-64 object-cover rounded-3xl shadow-2xl" 
                    />
                    <div className="absolute -mt-14 ml-10 bg-zinc-900/90 backdrop-blur-lg px-8 py-5 rounded-3xl border border-zinc-700 shadow-xl">
                      <div className="flex items-center gap-4">
                        <div>
                          <div className="text-emerald-400 text-sm font-medium tracking-[3px]">WELCOME BACK</div>
                          <div className="text-4xl font-semibold text-white">Mr. Tesfaye</div>
                        </div>
                        <div className="text-6xl">👋</div>
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {[
                      { label: "Total Students", value: totalStudents, icon: Users, color: "emerald", suffix: "" },
                      { label: "Avg Attendance", value: avgAttendance, icon: CheckCircle, color: "emerald", suffix: "%" },
                      { label: "Average Score", value: avgScore, icon: TrendingUp, color: "amber", suffix: "%" },
                      { label: "Classes Taught", value: classesTaught, icon: BookOpen, color: "violet", suffix: "" },
                    ].map((stat, index) => (
                      <motion.div 
                        key={index}
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-zinc-900 rounded-3xl p-7 border border-zinc-800 hover:border-emerald-900 group"
                      >
                        <div className={`w-12 h-12 rounded-2xl bg-${stat.color}-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                          <stat.icon className={`w-6 h-6 text-${stat.color}-400`} />
                        </div>
                        <div className="text-5xl font-semibold tabular-nums mb-1">{stat.value}{stat.suffix}</div>
                        <div className="text-zinc-400 text-sm">{stat.label}</div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Performance Overview */}
                    <div className="lg:col-span-7 bg-zinc-900 rounded-3xl p-8 border border-zinc-800">
                      <div className="flex justify-between items-center mb-8">
                        <div>
                          <div className="uppercase text-xs tracking-widest text-emerald-400 mb-1">CLASS PERFORMANCE</div>
                          <div className="text-2xl font-semibold">Current Semester Overview</div>
                        </div>
                        <div className="text-xs px-4 py-1.5 bg-zinc-800 rounded-3xl text-zinc-400">2025 Academic Year</div>
                      </div>
                      
                      <div className="space-y-8 mt-4">
                        {Object.entries(classAverages).map(([cls, avg], idx) => (
                          <div key={idx} className="flex items-center gap-5">
                            <div className="w-16 font-mono text-sm text-right text-zinc-400">{cls}</div>
                            <div className="flex-1 h-3 bg-zinc-800 rounded-3xl overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${avg}%` }}
                                transition={{ delay: idx * 0.1, duration: 1 }}
                                className="h-3 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-3xl"
                              />
                            </div>
                            <div className="font-semibold w-12 text-right text-emerald-400 tabular-nums">{avg}%</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Quick Actions & Upcoming */}
                    <div className="lg:col-span-5 space-y-6">
                      <div className="bg-zinc-900 rounded-3xl p-8 border border-zinc-800 h-full">
                        <div className="uppercase tracking-widest text-xs text-amber-400 mb-6">QUICK ACTIONS</div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <button 
                            onClick={() => setActiveTab('attendance')}
                            className="bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 h-28 rounded-3xl flex flex-col items-center justify-center gap-3 transition-all active:scale-[0.985]"
                          >
                            <Calendar className="w-8 h-8 text-emerald-400" />
                            <div className="text-sm font-medium">Take Attendance</div>
                          </button>
                          
                          <button 
                            onClick={() => setActiveTab('marks')}
                            className="bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 h-28 rounded-3xl flex flex-col items-center justify-center gap-3 transition-all active:scale-[0.985]"
                          >
                            <BookOpen className="w-8 h-8 text-amber-400" />
                            <div className="text-sm font-medium">Enter Marks</div>
                          </button>
                          
                          <button 
                            onClick={() => setActiveTab('students')}
                            className="bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 h-28 rounded-3xl flex flex-col items-center justify-center gap-3 transition-all active:scale-[0.985]"
                          >
                            <Users className="w-8 h-8 text-violet-400" />
                            <div className="text-sm font-medium">View Students</div>
                          </button>
                          
                          <button 
                            onClick={() => setShowAddStudentModal(true)}
                            className="bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 h-28 rounded-3xl flex flex-col items-center justify-center gap-3 transition-all active:scale-[0.985]"
                          >
                            <Plus className="w-8 h-8 text-rose-400" />
                            <div className="text-sm font-medium">Register Student</div>
                          </button>
                        </div>
                      </div>

                      <div className="bg-zinc-900 rounded-3xl p-8 border border-zinc-800">
                        <div className="flex items-center justify-between mb-6">
                          <div className="uppercase text-xs tracking-widest text-zinc-400">UPCOMING</div>
                          <div className="text-emerald-500 text-xs">THIS WEEK</div>
                        </div>
                        
                        <div className="space-y-5">
                          {[
                            { title: "Midterm Examinations", time: "Tomorrow • 8:30 AM", class: "All 10th Grade" },
                            { title: "Parent-Teacher Meeting", time: "Thursday • 2:00 PM", class: "Classes 9B & 10A" },
                            { title: "Science Fair Preparation", time: "Friday • All Day", class: "11th Grade" },
                          ].map((event, i) => (
                            <div key={i} className="flex gap-4 bg-zinc-950 border border-zinc-800 rounded-2xl p-4">
                              <div className="w-2 h-2 mt-2 rounded-full bg-emerald-400 flex-shrink-0" />
                              <div className="flex-1">
                                <div className="font-medium">{event.title}</div>
                                <div className="text-xs text-zinc-500 mt-1">{event.time}</div>
                                <div className="text-[10px] text-emerald-500/70 mt-2">{event.class}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* MY STUDENTS */}
              {activeTab === 'students' && (
                <div>
                  <div className="flex justify-between items-end mb-8">
                    <div>
                      <div className="text-3xl font-semibold">My Students</div>
                      <div className="text-zinc-400">Manage and monitor {totalStudents} learners • Jimma, Ethiopia</div>
                    </div>
                    <button 
                      onClick={() => setShowAddStudentModal(true)}
                      className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 transition-colors px-6 py-3 rounded-2xl text-sm font-medium"
                    >
                      <Plus className="w-4 h-4" /> ADD STUDENT
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredStudents.length > 0 ? (
                      filteredStudents.map((student, index) => (
                        <motion.div 
                          key={student.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: Math.min(index * 0.04, 0.6) }}
                          onClick={() => {
                            setSelectedStudent(student);
                            setShowModal(true);
                          }}
                          className="group bg-zinc-900 border border-zinc-800 hover:border-emerald-600 rounded-3xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
                        >
                          <div className="h-2 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400" />
                          
                          <div className="p-6">
                            <div className="flex gap-5">
                              <img 
                                src={student.photo} 
                                alt={student.name} 
                                className="w-20 h-20 rounded-2xl object-cover ring-4 ring-zinc-800 group-hover:ring-emerald-500 transition-colors" 
                              />
                              <div className="flex-1 pt-1">
                                <div className="font-semibold text-xl">{student.name}</div>
                                <div className="flex items-center gap-2 text-sm mt-1">
                                  <span className="inline-block px-3 py-0.5 bg-zinc-800 rounded-full text-emerald-400 font-mono text-xs">{student.grade}</span>
                                  <span className={`inline-block w-2 h-2 rounded-full ${student.gender === 'F' ? 'bg-pink-400' : 'bg-sky-400'}`} />
                                  <span className="text-zinc-500 text-xs">{student.gender}</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="mt-8 grid grid-cols-2 gap-4 text-center">
                              <div className="bg-zinc-950 rounded-2xl py-4">
                                <div className="text-3xl font-semibold text-emerald-400 tabular-nums">{student.attendance}</div>
                                <div className="text-xs tracking-wider text-zinc-500 mt-1">ATTENDANCE %</div>
                              </div>
                              <div className="bg-zinc-950 rounded-2xl py-4">
                                <div className="text-3xl font-semibold text-amber-400 tabular-nums">{student.avgMark}</div>
                                <div className="text-xs tracking-wider text-zinc-500 mt-1">AVERAGE</div>
                              </div>
                            </div>
                            
                            <div className="mt-6 text-xs flex justify-between items-center text-zinc-400 border-t border-zinc-800 pt-6">
                              <div>{student.contact}</div>
                              <div className="flex items-center text-emerald-500 text-[10px] font-medium">
                                VIEW PROFILE <span className="ml-1">→</span>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <div className="col-span-3 py-20 text-center text-zinc-400">No students found matching your search.</div>
                    )}
                  </div>
                </div>
              )}

              {/* ATTENDANCE */}
              {activeTab === 'attendance' && (
                <div>
                  <div className="flex justify-between mb-8 items-center">
                    <div>
                      <div className="text-3xl font-semibold mb-1">Class Attendance</div>
                      <div className="text-zinc-400">Mark and track daily presence for {selectedClass}</div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <input 
                        type="date" 
                        value={selectedDate} 
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="bg-zinc-900 border border-zinc-700 px-5 py-3 rounded-2xl text-sm focus:outline-none focus:border-emerald-500"
                      />
                      <button 
                        onClick={saveAttendance}
                        className="bg-white text-black px-8 py-3 rounded-2xl font-semibold flex items-center gap-2 hover:bg-emerald-400 transition-all active:scale-95"
                      >
                        <CheckCircle className="w-4 h-4" /> SAVE ATTENDANCE
                      </button>
                    </div>
                  </div>

                  <div className="bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-700">
                    <div className="grid grid-cols-12 bg-zinc-950 py-4 px-8 text-xs font-medium text-zinc-400 border-b border-zinc-800">
                      <div className="col-span-5">STUDENT NAME</div>
                      <div className="col-span-2">GRADE</div>
                      <div className="col-span-2">CURRENT AVG</div>
                      <div className="col-span-3 text-center">MARK PRESENT</div>
                    </div>
                    
                    {getClassStudents(selectedClass).map((student, idx) => {
                      const isPresentToday = getAttendanceForDate(selectedDate, student.id);
                      return (
                        <div key={student.id} className={`grid grid-cols-12 items-center py-5 px-8 border-b border-zinc-800 last:border-0 hover:bg-zinc-950/60 transition-colors ${idx % 2 === 0 ? 'bg-zinc-900/40' : ''}`}>
                          <div className="col-span-5 flex items-center gap-4">
                            <img src={student.photo} alt="" className="w-9 h-9 rounded-2xl object-cover" />
                            <div>
                              <div className="font-medium">{student.name}</div>
                              <div className="text-xs text-zinc-500">{student.contact}</div>
                            </div>
                          </div>
                          <div className="col-span-2 font-mono text-sm">{student.grade}</div>
                          <div className="col-span-2">
                            <div className="inline-block px-4 py-1 bg-zinc-800 rounded-3xl text-sm font-medium text-emerald-400">{student.avgMark}%</div>
                          </div>
                          <div className="col-span-3 flex justify-center gap-4">
                            <button 
                              onClick={() => markAttendance(student.id, true)}
                              className={`flex items-center justify-center w-9 h-9 rounded-2xl transition-all ${isPresentToday ? 'bg-emerald-500 text-black scale-110' : 'bg-zinc-800 hover:bg-emerald-900/40 text-zinc-400'}`}
                            >
                              <CheckCircle className="w-5 h-5" />
                            </button>
                            <button 
                              onClick={() => markAttendance(student.id, false)}
                              className={`flex items-center justify-center w-9 h-9 rounded-2xl transition-all ${!isPresentToday ? 'bg-red-500/80 text-white scale-110' : 'bg-zinc-800 hover:bg-red-900/30 text-zinc-400'}`}
                            >
                              <XCircle className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-6 text-xs text-zinc-500 flex items-center gap-2 bg-zinc-900/70 w-fit px-5 py-3 rounded-3xl">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                    Last saved: Today at 09:41 AM • Attendance rate this month: {avgAttendance}%
                  </div>
                </div>
              )}

              {/* MARKS */}
              {activeTab === 'marks' && (
                <div>
                  <div className="mb-8">
                    <div className="text-3xl font-semibold">Marks &amp; Assessment</div>
                    <div className="text-zinc-400">Update scores for {selectedSubject} • {selectedClass}</div>
                  </div>

                  <div className="bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-700">
                    <div className="px-8 py-5 bg-zinc-950 border-b border-zinc-800 flex text-xs uppercase font-medium text-zinc-400">
                      <div className="flex-1">Student</div>
                      <div className="w-40">CURRENT AVG</div>
                      <div className="w-52">MARK FOR {selectedSubject.toUpperCase()}</div>
                      <div className="w-24 text-right">FINALIZE</div>
                    </div>
                    
                    {getClassStudents(selectedClass).map((student) => {
                      const currentMark = student.marks.find(m => m.subject === selectedSubject)?.score || 75;
                      
                      return (
                        <div key={student.id} className="px-8 py-6 border-b border-zinc-800 flex items-center last:border-none hover:bg-zinc-950">
                          <div className="flex-1 flex items-center gap-4">
                            <img src={student.photo} className="w-11 h-11 rounded-2xl" alt="" />
                            <div>
                              <div>{student.name}</div>
                              <div className="text-xs text-zinc-500">{student.grade}</div>
                            </div>
                          </div>
                          
                          <div className="w-40">
                            <div className={`font-mono text-xl font-semibold ${student.avgMark > 82 ? 'text-emerald-400' : 'text-amber-400'}`}>
                              {student.avgMark}
                            </div>
                          </div>
                          
                          <div className="w-52">
                            <div className="flex items-center gap-4">
                              <input 
                                type="range" 
                                min="35" 
                                max="100" 
                                value={currentMark}
                                onChange={(e) => updateMark(student.id, selectedSubject, parseInt(e.target.value))}
                                className="accent-emerald-500 w-28"
                              />
                              <input 
                                type="number" 
                                value={currentMark}
                                onChange={(e) => updateMark(student.id, selectedSubject, parseInt(e.target.value) || 0)}
                                className="w-16 bg-zinc-800 text-center border border-zinc-700 focus:border-emerald-500 rounded-xl py-2 text-sm font-mono font-semibold"
                              />
                            </div>
                          </div>
                          
                          <div className="w-24 text-right">
                            <div className={`inline text-xs px-5 py-2 rounded-3xl font-medium ${currentMark >= 80 ? 'bg-emerald-900 text-emerald-300' : currentMark >= 65 ? 'bg-amber-900 text-amber-300' : 'bg-red-900 text-red-300'}`}>
                              {currentMark >= 80 ? 'EXCELLENT' : currentMark >= 65 ? 'SATISFACTORY' : 'NEEDS WORK'}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="mt-8 bg-zinc-900 p-8 rounded-3xl border border-zinc-700 text-sm">
                    <div className="font-medium mb-4 flex items-center gap-2">
                      <div className="text-emerald-400">💡</div> 
                      TIP: Scores are automatically averaged across subjects and reflected in the dashboard
                    </div>
                    <div className="text-zinc-400 text-xs leading-relaxed">All changes are saved instantly. Mid-term results will be visible to parents via the school portal.</div>
                  </div>
                </div>
              )}

              {/* REGISTRATION */}
              {activeTab === 'registration' && (
                <div className="max-w-2xl mx-auto">
                  <div className="text-center mb-12">
                    <div className="mx-auto w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl flex items-center justify-center mb-6">
                      <ClipboardList className="w-10 h-10 text-white" />
                    </div>
                    <div className="text-4xl font-semibold mb-3">Student Registration</div>
                    <div className="max-w-xs mx-auto text-zinc-400">Enroll new students into Kera High School programs. All records are maintained securely.</div>
                  </div>

                  <div 
                    onClick={() => setShowAddStudentModal(true)}
                    className="border border-dashed border-zinc-700 hover:border-emerald-600 transition-all rounded-3xl p-16 flex flex-col items-center justify-center cursor-pointer hover:bg-zinc-900/50 group"
                  >
                    <div className="w-20 h-20 rounded-2xl bg-zinc-900 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <Plus className="w-12 h-12 text-emerald-400" />
                    </div>
                    <div className="text-xl font-medium mb-2">Register a New Student</div>
                    <div className="text-zinc-500 max-w-[240px] text-center">Fill out the form with basic details to add a new learner to the school database</div>
                  </div>

                  <div className="mt-16">
                    <div className="uppercase text-xs text-zinc-500 mb-5 tracking-widest">Recently Registered Students</div>
                    <div className="space-y-3">
                      {students.slice(0, 3).map((s, index) => (
                        <div key={index} className="flex items-center justify-between bg-zinc-900 px-7 py-5 rounded-2xl border border-zinc-800">
                          <div className="flex items-center gap-4">
                            <img src={s.photo} className="w-10 h-10 rounded-2xl" />
                            <div>
                              <div>{s.name}</div>
                              <div className="text-xs text-zinc-500">{s.grade} • Registered 2 days ago</div>
                            </div>
                          </div>
                          <div className="text-emerald-500 text-sm font-medium">ENROLLED ✓</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* PROFILE */}
              {activeTab === 'profile' && (
                <div className="max-w-3xl mx-auto">
                  <div className="flex gap-8">
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-8">
                        <div>
                          <div className="text-emerald-400 text-sm font-medium mb-1">FACULTY MEMBER SINCE 2011</div>
                          <div className="text-5xl font-semibold leading-none">{teacher.name}</div>
                          <div className="mt-3 text-xl text-zinc-400">{teacher.title}</div>
                        </div>
                        <button 
                          onClick={() => {
                            setTempTeacher({...teacher});
                            setEditingProfile(!editingProfile);
                          }}
                          className="px-6 py-3 bg-zinc-800 hover:bg-white hover:text-black transition-all rounded-2xl text-sm flex items-center gap-2"
                        >
                          <Edit2 className="w-4 h-4" /> {editingProfile ? "CANCEL" : "EDIT PROFILE"}
                        </button>
                      </div>

                      {editingProfile ? (
                        <div className="space-y-8">
                          <div>
                            <label className="block text-xs uppercase tracking-widest mb-2 text-zinc-400">Full Name</label>
                            <input 
                              type="text" 
                              value={tempTeacher.name} 
                              onChange={(e) => setTempTeacher({...tempTeacher, name: e.target.value})}
                              className="w-full bg-zinc-900 border border-zinc-700 focus:border-white rounded-2xl px-6 py-4 outline-none"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-6">
                            <div>
                              <label className="block text-xs uppercase tracking-widest mb-2 text-zinc-400">Email Address</label>
                              <input 
                                type="email" 
                                value={tempTeacher.email} 
                                onChange={(e) => setTempTeacher({...tempTeacher, email: e.target.value})}
                                className="w-full bg-zinc-900 border border-zinc-700 focus:border-white rounded-2xl px-6 py-4 outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-xs uppercase tracking-widest mb-2 text-zinc-400">Phone</label>
                              <input 
                                type="tel" 
                                value={tempTeacher.phone} 
                                onChange={(e) => setTempTeacher({...tempTeacher, phone: e.target.value})}
                                className="w-full bg-zinc-900 border border-zinc-700 focus:border-white rounded-2xl px-6 py-4 outline-none"
                              />
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-xs uppercase tracking-widest mb-2 text-zinc-400">Bio</label>
                            <textarea 
                              value={tempTeacher.bio} 
                              onChange={(e) => setTempTeacher({...tempTeacher, bio: e.target.value})}
                              rows={5}
                              className="w-full resize-y bg-zinc-900 border border-zinc-700 focus:border-white rounded-3xl px-6 py-5 outline-none"
                            />
                          </div>
                          
                          <div className="flex gap-4 pt-4">
                            <button onClick={updateTeacherProfile} className="flex-1 py-4 bg-emerald-600 hover:bg-emerald-500 rounded-2xl font-semibold">SAVE CHANGES</button>
                            <button onClick={() => setEditingProfile(false)} className="flex-1 py-4 bg-zinc-800 hover:bg-zinc-700 rounded-2xl font-semibold">DISCARD</button>
                          </div>
                        </div>
                      ) : (
                        <div className="prose prose-invert">
                          <p className="text-zinc-300 leading-relaxed text-[15.2px]">{teacher.bio}</p>
                          
                          <div className="mt-12 grid grid-cols-2 gap-x-16">
                            <div>
                              <div className="text-xs text-zinc-400 mb-4">SUBJECTS TAUGHT</div>
                              <div className="flex flex-wrap gap-2">
                                {teacher.subjects.map((sub, index) => (
                                  <div key={index} className="bg-zinc-900 text-sm border border-zinc-700 px-6 py-2.5 rounded-3xl">{sub}</div>
                                ))}
                              </div>
                            </div>
                            
                            <div>
                              <div className="text-xs text-zinc-400 mb-4">CONTACT INFORMATION</div>
                              <div className="space-y-4">
                                <div className="flex justify-between border-b border-zinc-800 pb-4">
                                  <div className="text-zinc-400">Email</div>
                                  <div className="font-mono text-sm">{teacher.email}</div>
                                </div>
                                <div className="flex justify-between border-b border-zinc-800 pb-4">
                                  <div className="text-zinc-400">Phone</div>
                                  <div>{teacher.phone}</div>
                                </div>
                                <div className="flex justify-between">
                                  <div className="text-zinc-400">Experience</div>
                                  <div>{teacher.experience} years</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="-mt-6">
                      <div className="sticky top-8">
                        <img 
                          src={teacher.photo} 
                          alt="Profile" 
                          className="w-80 h-80 object-cover rounded-[2.75rem] shadow-2xl ring-1 ring-inset ring-white/10" 
                        />
                        <div className="text-center mt-8">
                          <div className="inline-flex items-center gap-2 bg-zinc-900 text-xs px-5 py-2 rounded-3xl border border-emerald-900">
                            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            VERIFIED EDUCATOR
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer Bar */}
        <div className="h-11 bg-zinc-900 border-t border-zinc-800 text-xs flex items-center px-8 text-zinc-500 font-mono justify-between">
          <div>KERA HIGH SCHOOL • JIMMA • 2025</div>
          <div>CONFIDENTIAL TEACHER DASHBOARD v4.2.1</div>
          <div>ETHIOPIAN MINISTRY OF EDUCATION</div>
        </div>
      </div>

      {/* Student Detail Modal */}
      <AnimatePresence>
        {showModal && selectedStudent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80" onClick={() => setShowModal(false)}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.88, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ type: "spring", bounce: 0.02, duration: 0.4 }}
              onClick={e => e.stopPropagation()}
              className="bg-zinc-900 w-full max-w-2xl mx-4 rounded-3xl overflow-hidden"
            >
              <div className="relative h-80">
                <img 
                  src={selectedStudent.photo} 
                  alt={selectedStudent.name}
                  className="absolute inset-0 w-full h-full object-cover brightness-75" 
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/70 to-zinc-900" />
                
                <div className="absolute bottom-0 left-0 p-8">
                  <div className="flex items-center gap-4">
                    <div className={`px-4 py-1 text-xs font-mono tracking-widest rounded-3xl ${selectedStudent.gender === "F" ? "bg-pink-500/80" : "bg-sky-500/80"}`}>{selectedStudent.gender}</div>
                    <div className="text-sm font-medium bg-black/60 px-4 py-1 rounded-3xl">{selectedStudent.grade}</div>
                  </div>
                  <div className="text-5xl font-semibold mt-3 text-white">{selectedStudent.name}</div>
                </div>
                
                <button onClick={() => setShowModal(false)} className="absolute top-6 right-6 w-10 h-10 bg-black/60 hover:bg-black rounded-2xl flex items-center justify-center text-xl leading-none">×</button>
              </div>

              <div className="p-8">
                <div className="grid grid-cols-3 gap-4 mb-9">
                  <div className="bg-zinc-950 rounded-2xl p-5 text-center">
                    <div className="text-4xl font-semibold text-emerald-400">{selectedStudent.attendance}</div>
                    <div className="text-xs mt-3 text-zinc-400 tracking-wider">ATTENDANCE</div>
                  </div>
                  <div className="bg-zinc-950 rounded-2xl p-5 text-center">
                    <div className="text-4xl font-semibold text-amber-400">{selectedStudent.avgMark}</div>
                    <div className="text-xs mt-3 text-zinc-400 tracking-wider">AVERAGE SCORE</div>
                  </div>
                  <div className="bg-zinc-950 rounded-2xl p-5 text-center">
                    <div className="text-4xl font-semibold text-violet-400">4</div>
                    <div className="text-xs mt-3 text-zinc-400 tracking-wider">SUBJECTS</div>
                  </div>
                </div>

                <div className="mb-6 uppercase text-xs text-zinc-400 tracking-[1px]">SUBJECT PERFORMANCE</div>
                
                <div className="space-y-6">
                  {selectedStudent.marks.map((mark, idx) => (
                    <div key={idx} className="flex items-center gap-6">
                      <div className="w-36 text-sm font-medium">{mark.subject}</div>
                      <div className="flex-1">
                        <div className="h-px bg-zinc-700 relative">
                          <div 
                            className="absolute h-px bg-white" 
                            style={{ width: `${mark.score}%` }}
                          />
                        </div>
                      </div>
                      <div className="font-mono text-xl font-semibold w-12 text-right">{mark.score}</div>
                    </div>
                  ))}
                </div>

                <div className="pt-8 mt-8 border-t border-zinc-700 flex items-center gap-3 text-xs">
                  <div className="bg-emerald-900 text-emerald-400 px-4 py-2 rounded-3xl">CONTACT PARENT</div>
                  <div className="text-zinc-400">• {selectedStudent.contact}</div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add / Register New Student Modal */}
      <AnimatePresence>
        {showAddStudentModal && (
          <div className="fixed inset-0 bg-black/70 z-[60] flex items-center justify-center" onClick={() => setShowAddStudentModal(false)}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.88 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-zinc-900 w-full max-w-md rounded-3xl p-10"
              onClick={e => e.stopPropagation()}
            >
              <div className="text-2xl font-semibold mb-8">Register New Student</div>
              
              <div className="space-y-6">
                <div>
                  <div className="text-xs text-zinc-400 mb-2">FULL NAME</div>
                  <input 
                    type="text" 
                    placeholder="Enter student full name" 
                    value={newStudent.name}
                    onChange={(e) => setNewStudent({...newStudent, name: e.target.value})}
                    className="bg-zinc-950 w-full rounded-2xl border border-zinc-700 px-6 py-4 focus:outline-none focus:border-white placeholder:text-zinc-600"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <div className="text-xs text-zinc-400 mb-2">GRADE / SECTION</div>
                    <select 
                      value={newStudent.grade}
                      onChange={(e) => setNewStudent({...newStudent, grade: e.target.value})}
                      className="bg-zinc-950 w-full rounded-2xl border border-zinc-700 px-6 py-4 focus:outline-none focus:border-white"
                    >
                      <option value="9B">9B</option>
                      <option value="10A">10A</option>
                      <option value="10B">10B</option>
                      <option value="11A">11A</option>
                    </select>
                  </div>
                  <div>
                    <div className="text-xs text-zinc-400 mb-2">GENDER</div>
                    <div className="flex gap-3">
                      <button 
                        onClick={() => setNewStudent({...newStudent, gender: "M"})}
                        className={`flex-1 py-4 rounded-2xl text-sm transition-all ${newStudent.gender === "M" ? "bg-white text-black" : "bg-zinc-800"}`}
                      >
                        MALE
                      </button>
                      <button 
                        onClick={() => setNewStudent({...newStudent, gender: "F"})}
                        className={`flex-1 py-4 rounded-2xl text-sm transition-all ${newStudent.gender === "F" ? "bg-white text-black" : "bg-zinc-800"}`}
                      >
                        FEMALE
                      </button>
                    </div>
                  </div>
                </div>
                
                <div>
                  <div className="text-xs text-zinc-400 mb-2">PARENT CONTACT NUMBER</div>
                  <input 
                    type="tel" 
                    placeholder="+251 9XX XXX XXX" 
                    value={newStudent.contact}
                    onChange={(e) => setNewStudent({...newStudent, contact: e.target.value})}
                    className="bg-zinc-950 w-full rounded-2xl border border-zinc-700 px-6 py-4 focus:outline-none focus:border-white placeholder:text-zinc-600"
                  />
                </div>
              </div>
              
              <div className="flex gap-4 mt-10">
                <button 
                  onClick={() => setShowAddStudentModal(false)}
                  className="flex-1 py-4 text-sm border border-zinc-700 hover:bg-zinc-800 rounded-2xl"
                >
                  CANCEL
                </button>
                <button 
                  onClick={addNewStudent}
                  className="flex-1 py-4 text-sm bg-white hover:bg-emerald-400 text-black font-semibold rounded-2xl transition-colors"
                >
                  REGISTER STUDENT
                </button>
              </div>
              
              <div className="text-center text-[10px] mt-6 text-zinc-500">Records are synced with the school administration system</div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div 
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 60 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-sm px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3 z-[70]"
          >
            <CheckCircle className="w-5 h-5" />
            {notification}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default KeraTeacherPortal;

