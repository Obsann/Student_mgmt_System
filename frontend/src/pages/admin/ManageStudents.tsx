import { useState, useEffect, useCallback } from "react";
import { UserCheck, Plus, Pencil, Trash2, Search, Save, Upload, Download, Eye, Users, User, Layers, Info, MapPin, BookOpen, Mail, FileText } from "lucide-react";
import { jsPDF } from "jspdf";
import { useApp } from "../../contexts/AppContext";
import { useToast } from "../../contexts/ToastContext";
import { api } from "../../services/api";
import ConfirmationDialog from "../../components/ConfirmationDialog";
import Pagination from "../../components/Pagination";
import FormField from "../../components/FormField";
import type { Student, User as AuthUser } from "../../types";

export default function ManageStudents() {
  const { state, loadAllData } = useApp();
  const { addToast } = useToast();

  const [studentsData, setStudentsData] = useState<Student[]>([]);
  const [totalStudentsCount, setTotalStudentsCount] = useState(0);
  const [serverTotalPages, setServerTotalPages] = useState(1);
  const [isFetching, setIsFetching] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("All");
  const [selectedSection, setSelectedSection] = useState("All");
  const [selectedGender, setSelectedGender] = useState("All");

  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ open: boolean; student: Student | null }>({ open: false, student: null });
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewStudent, setViewStudent] = useState<Student | null>(null);

  const [form, setForm] = useState({
    first_name: "", middle_name: "", last_name: "", 
    date_of_birth: "", gender: "Male" as "Male" | "Female",
    fayda_id: "", grade_8_gpa: 0, previous_school: "", national_exam_number: "",
    region: "Jimma City", zone: "", kebele: "", house_no: "",
    guardian_name: "", guardian_relation: "", parent_phone: "", personal_email: "",
    grade: "9", section: "A", roll_number: "", status: "active" as "active" | "withdrawn" | "pending"
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const itemsPerPage = 10;
  
  const fetchStudents = useCallback(async () => {
    setIsFetching(true);
    try {
      const res = await api.getStudents({
        page: currentPage,
        limit: itemsPerPage,
        search: searchTerm,
        grade: selectedGrade,
        section: selectedSection,
        gender: selectedGender
      });
      setStudentsData(res.data);
      setTotalStudentsCount(res.total);
      setServerTotalPages(res.totalPages);
    } catch (err) {
      console.error(err);
    } finally {
      setIsFetching(false);
    }
  }, [currentPage, itemsPerPage, searchTerm, selectedGrade, selectedSection, selectedGender]);

  useEffect(() => {
    // Debounce search
    const timeout = setTimeout(() => {
      fetchStudents();
    }, 300);
    return () => clearTimeout(timeout);
  }, [fetchStudents]);

  const totalStudents = state.students.length; // Global stats from context
  const totalMale = state.students.filter(s => s.gender === 'Male').length;
  const totalFemale = state.students.filter(s => s.gender === 'Female').length;
  const totalSections = new Set(state.students.map(s => `${s.grade}${s.section}`)).size;

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!form.first_name.trim()) errors.first_name = "Required";
    if (!form.last_name.trim()) errors.last_name = "Required";
    if (!form.fayda_id.trim() || form.fayda_id.length !== 12) errors.fayda_id = "12 digits required";
    if (!form.roll_number.trim()) errors.roll_number = "Required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const openAdd = () => {
    setEditId(null);
    setForm({
      first_name: "", middle_name: "", last_name: "", 
      date_of_birth: "", gender: "Male",
      fayda_id: "", grade_8_gpa: 0, previous_school: "", national_exam_number: "",
      region: "Jimma City", zone: "", kebele: "", house_no: "",
      guardian_name: "", guardian_relation: "", parent_phone: "", personal_email: "",
      grade: "9", section: "A", roll_number: "", status: "active"
    });
    setFormErrors({});
    setModalOpen(true);
  };

  const openEdit = (s: Student) => {
    setEditId(s.id);
    setForm({
      first_name: s.first_name,
      middle_name: s.middle_name,
      last_name: s.last_name,
      date_of_birth: s.date_of_birth.split("T")[0],
      gender: s.gender,
      fayda_id: s.fayda_id,
      grade_8_gpa: s.grade_8_gpa,
      previous_school: s.previous_school,
      national_exam_number: s.national_exam_number,
      region: s.address.region,
      zone: s.address.zone,
      kebele: s.address.kebele,
      house_no: s.address.house_no,
      guardian_name: s.guardian_name,
      guardian_relation: s.guardian_relation,
      parent_phone: s.parent_phone,
      personal_email: s.personal_email || "",
      grade: s.grade,
      section: s.section,
      roll_number: s.roll_number,
      status: s.status
    });
    setFormErrors({});
    setModalOpen(true);
  };

  const handleBulkImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const text = evt.target?.result as string;
        const lines = text.split('\n').filter(l => l.trim().length > 0);
        
        const students = lines.slice(1).map(line => {
          const parts = line.split(',').map(p => p.trim());
          return {
            first_name: parts[0],
            middle_name: parts[1],
            last_name: parts[2],
            date_of_birth: parts[3],
            gender: parts[4] as any,
            fayda_id: parts[5],
            grade_8_gpa: Number(parts[6]),
            previous_school: parts[7],
            national_exam_number: parts[8],
            address: {
              region: parts[9],
              zone: parts[10],
              kebele: parts[11],
              house_no: parts[12],
            },
            guardian_name: parts[13],
            guardian_relation: parts[14],
            parent_phone: parts[15],
            personal_email: parts[16] || "",
            grade: parts[17],
            section: parts[18],
            roll_number: parts[19],
            status: "active" as const,
            enrolled_date: new Date().toISOString()
          };
        });

        await api.bulkImportStudents(students);
        await loadAllData();
        addToast({ type: "success", title: "Import Successful", message: `Imported ${students.length} students.` });
      } catch (err: any) {
        addToast({ type: "error", title: "Import Failed", message: err.message || "Invalid CSV format" });
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    setLoading(true);
    try {
      const payload = {
        ...form,
        address: { region: form.region, zone: form.zone, kebele: form.kebele, house_no: form.house_no }
      };
      if (editId) {
        await api.updateStudent(editId, payload);
        addToast({ type: "success", title: "Success", message: "Student updated" });
      } else {
        await api.createStudent({ ...payload, enrolled_date: new Date().toISOString() });
        addToast({ type: "success", title: "Success", message: "Student added" });
      }
      setModalOpen(false);
      fetchStudents();
      loadAllData(); // Refresh global stats
    } catch (err: any) {
      addToast({ type: "error", title: "Error", message: err.message || "Operation failed" });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (student: Student) => {
    setConfirmDelete({ open: true, student });
  };

  const confirmDeleteStudent = async () => {
    if (confirmDelete.student) {
      try {
        await api.deleteStudent(confirmDelete.student.id);
        addToast({ type: "success", title: "Success", message: "Student removed" });
        fetchStudents();
        loadAllData();
      } catch (err: any) {
        addToast({ type: "error", title: "Error", message: err.message || "Failed to delete" });
      }
      setConfirmDelete({ open: false, student: null });
    }
  };

  const downloadStudentTranscript = (student: Student) => {
    // Collect student's subjects based on their grade
    const studentSubjects = state.subjects.filter((s) => s.grade === student.grade);
    const myMarks = state.marks.filter((m) => m.student_id === student.id);
    
    let totalScoreAll = 0;
    let validSubjectsCount = 0;

    studentSubjects.forEach(sub => {
      const subjectMarks = myMarks.filter(m => m.subject_id === sub.id);
      if (subjectMarks.length > 0) {
        const att = subjectMarks.find(m => m.assessment_type === "attendance")?.score ?? 0;
        const ass = subjectMarks.find(m => m.assessment_type === "assignment")?.score ?? 0;
        const quiz = subjectMarks.find(m => m.assessment_type === "quiz")?.score ?? 0;
        const mid = subjectMarks.find(m => m.assessment_type === "midterm")?.score ?? 0;
        const fnl = subjectMarks.find(m => m.assessment_type === "final")?.score ?? 0;
        totalScoreAll += (Number(att) + Number(ass) + Number(quiz) + Number(mid) + Number(fnl));
        validSubjectsCount++;
      }
    });

    const avgScore = validSubjectsCount > 0 ? (totalScoreAll / validSubjectsCount).toFixed(1) : 0;
    const gradedSubjectIds = new Set(myMarks.map((m) => m.subject_id));
    const allMarksEntered = studentSubjects.length > 0 && studentSubjects.every((sub) => gradedSubjectIds.has(sub.id));

    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4"
    });

    const navy = [15, 23, 42];
    const slate = [100, 116, 139];
    const border = [226, 232, 240];

    // Page Border
    doc.setDrawColor(navy[0], navy[1], navy[2]);
    doc.setLineWidth(0.5);
    doc.rect(5, 5, 200, 287);

    // Header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(navy[0], navy[1], navy[2]);
    doc.text("KERA HIGH SCHOOL", 105, 20, { align: "center" });

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(slate[0], slate[1], slate[2]);
    doc.text("Official Academic Transcript • Addis Ababa, Ethiopia", 105, 25, { align: "center" });

    doc.setDrawColor(border[0], border[1], border[2]);
    doc.setLineWidth(0.5);
    doc.line(15, 30, 195, 30);

    // Student Info
    doc.setFontSize(11);
    doc.setTextColor(navy[0], navy[1], navy[2]);
    doc.setFont("helvetica", "bold");
    doc.text("STUDENT PROFILE", 15, 38);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Full Name: ${student.first_name} ${student.last_name}`, 15, 45);
    doc.text(`Roll Number: ${student.roll_number}`, 15, 51);
    doc.text(`Grade & Section: Grade ${student.grade}${student.section}`, 15, 57);

    doc.text(`Academic Year: 2026/2027`, 120, 45);
    doc.text(`Semester: Semester 1`, 120, 51);
    doc.text(`Issue Date: ${new Date().toLocaleDateString()}`, 120, 57);

    // Table Header
    const tableTop = 68;
    doc.setFillColor(navy[0], navy[1], navy[2]);
    doc.rect(15, tableTop, 180, 8, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(255, 255, 255);
    doc.text("Subject/Course", 17, tableTop + 5.5);
    doc.text("Att. (10)", 70, tableTop + 5.5);
    doc.text("Ass. (10)", 90, tableTop + 5.5);
    doc.text("Quiz (10)", 110, tableTop + 5.5);
    doc.text("Mid (20)", 130, tableTop + 5.5);
    doc.text("Final (50)", 150, tableTop + 5.5);
    doc.text("Total (100)", 175, tableTop + 5.5);

    let currentY = tableTop + 8;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(navy[0], navy[1], navy[2]);

    studentSubjects.forEach((sub, index) => {
      const marks = myMarks.filter(m => m.subject_id === sub.id);
      const att = marks.find(m => m.assessment_type === "attendance")?.score ?? "-";
      const ass = marks.find(m => m.assessment_type === "assignment")?.score ?? "-";
      const quiz = marks.find(m => m.assessment_type === "quiz")?.score ?? "-";
      const mid = marks.find(m => m.assessment_type === "midterm")?.score ?? "-";
      const fnl = marks.find(m => m.assessment_type === "final")?.score ?? "-";

      const hasMarks = marks.length > 0;
      const totalScore = hasMarks ? (Number(att) || 0) + (Number(ass) || 0) + (Number(quiz) || 0) + (Number(mid) || 0) + (Number(fnl) || 0) : "-";

      if (index % 2 === 1) {
        doc.setFillColor(248, 250, 252);
        doc.rect(15, currentY, 180, 7, "F");
      }

      doc.setDrawColor(border[0], border[1], border[2]);
      doc.line(15, currentY + 7, 195, currentY + 7);

      doc.text(sub.name, 17, currentY + 5);
      doc.text(String(att), 75, currentY + 5, { align: "center" });
      doc.text(String(ass), 95, currentY + 5, { align: "center" });
      doc.text(String(quiz), 115, currentY + 5, { align: "center" });
      doc.text(String(mid), 135, currentY + 5, { align: "center" });
      doc.text(String(fnl), 155, currentY + 5, { align: "center" });
      doc.setFont("helvetica", "bold");
      doc.text(String(totalScore), 180, currentY + 5, { align: "center" });
      doc.setFont("helvetica", "normal");

      currentY += 7;
    });

    // Summary Box
    currentY += 10;
    doc.setFillColor(248, 250, 252);
    doc.rect(15, currentY, 180, 20, "F");
    doc.setDrawColor(border[0], border[1], border[2]);
    doc.rect(15, currentY, 180, 20, "S");

    doc.setFont("helvetica", "bold");
    doc.text(`Overall Average Percent: ${avgScore}%`, 20, currentY + 8);
    doc.text(`Academic Status: ${allMarksEntered ? (Number(avgScore) >= 50 ? "PASS" : "FAIL") : "PENDING"}`, 20, currentY + 14);

    doc.text("Grading Scale:", 120, currentY + 8);
    doc.setFont("helvetica", "normal");
    doc.text("Pass: >= 50%   Fail: < 50%", 120, currentY + 14);

    // Signatures
    currentY += 40;
    doc.line(20, currentY, 80, currentY);
    doc.text("Homeroom Teacher Signature", 22, currentY + 5);

    doc.line(130, currentY, 190, currentY);
    doc.text("School Principal Stamp", 137, currentY + 5);

    doc.save(`Transcript_${student.first_name}_${student.last_name}.pdf`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-up">
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 group hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Users size={24} className="text-blue-500" />
          </div>
          <p className="text-3xl font-black text-slate-900">{totalStudents}</p>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">Total Students</p>
        </div>
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 group hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <User size={24} className="text-emerald-500" />
          </div>
          <p className="text-3xl font-black text-slate-900">{totalMale}</p>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">Male</p>
        </div>
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 group hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-pink-50 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <User size={24} className="text-pink-500" />
          </div>
          <p className="text-3xl font-black text-slate-900">{totalFemale}</p>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">Female</p>
        </div>
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 group hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Layers size={24} className="text-purple-500" />
          </div>
          <p className="text-3xl font-black text-slate-900">{totalSections}</p>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">Sections</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5 animate-fade-up" style={{ animationDelay: '0.1s' }}>
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex-1 min-w-[240px]">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Search</label>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input type="text" placeholder="Search by name, ID or roll number..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all outline-none" />
            </div>
          </div>
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Grade</label>
            <select value={selectedGrade} onChange={e => { setSelectedGrade(e.target.value); setCurrentPage(1); }}
              className="block w-28 px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all outline-none">
              <option value="All">All</option><option value="9">Grade 9</option><option value="10">Grade 10</option><option value="11">Grade 11</option><option value="12">Grade 12</option>
            </select>
          </div>
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Section</label>
            <select value={selectedSection} onChange={e => { setSelectedSection(e.target.value); setCurrentPage(1); }}
              className="block w-28 px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all outline-none">
              <option value="All">All</option><option value="A">A</option><option value="B">B</option><option value="C">C</option><option value="D">D</option>
            </select>
          </div>
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Gender</label>
            <select value={selectedGender} onChange={e => { setSelectedGender(e.target.value); setCurrentPage(1); }}
              className="block w-32 px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all outline-none">
              <option value="All">All</option><option value="Male">Male</option><option value="Female">Female</option>
            </select>
          </div>
          <label className="flex items-center gap-2 px-6 py-3 bg-indigo-50 text-indigo-700 rounded-2xl font-bold text-sm cursor-pointer hover:bg-indigo-100 transition-colors h-[46px]">
            <Upload size={16} /> Import
            <input type="file" accept=".csv" className="hidden" onChange={handleBulkImport} />
          </label>
          <button onClick={openAdd} className="flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl font-bold text-sm transition-all shadow-lg shadow-amber-500/20 hover:-translate-y-0.5 h-[46px]">
            <Plus size={16} /> Add Student
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden animate-fade-up" style={{ animationDelay: '0.2s' }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Student</th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Roll / ID</th>
                <th className="px-6 py-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Class</th>
                <th className="px-6 py-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Gender</th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Parent / Phone</th>
                <th className="px-6 py-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {studentsData.map((student) => (
                <tr key={student.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-black ${student.gender === 'Male' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'}`}>
                        {student.first_name[0]}{student.last_name[0]}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{student.first_name} {student.last_name}</p>
                        <span className={`inline-flex mt-0.5 px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider ${student.status === 'active' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100/50' : 'bg-red-50 text-red-600 border border-red-100/50'}`}>
                          {student.status}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-slate-700">R: {student.roll_number}</div>
                    <div className="text-xs font-mono text-slate-400 mt-0.5">{student.fayda_id}</div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
                      student.grade === '9' ? 'bg-blue-50 text-blue-700' :
                      student.grade === '10' ? 'bg-purple-50 text-purple-700' :
                      student.grade === '11' ? 'bg-indigo-50 text-indigo-700' :
                      'bg-emerald-50 text-emerald-700'
                    }`}>
                      {student.grade}-{student.section}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-sm font-medium text-slate-600">{student.gender}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-slate-700">{student.guardian_name || 'N/A'}</div>
                    <div className="text-xs font-medium text-slate-500 mt-0.5">{student.parent_phone || 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={() => setViewStudent(student)} className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-200 transition-colors">View</button>
                      <button onClick={() => openEdit(student)} className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-xl text-xs font-bold hover:bg-blue-100 transition-colors">Edit</button>
                      <button onClick={() => handleDelete(student)} className="px-3 py-1.5 bg-red-50 text-red-600 rounded-xl text-xs font-bold hover:bg-red-100 transition-colors">Del</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {serverTotalPages > 1 && (
          <div className="p-4 border-t border-slate-100 flex justify-center">
            <Pagination currentPage={currentPage} totalPages={serverTotalPages} onPageChange={setCurrentPage} />
          </div>
        )}
      </div>

      {/* Add/Edit Student Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in" onClick={() => setModalOpen(false)}>
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl animate-fade-scale flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-amber-50 to-orange-50/50">
              <h3 className="text-xl font-black text-slate-900">{editId ? "Edit Student Record" : "Add New Student"}</h3>
              <p className="text-sm font-medium text-slate-500 mt-1">Fill in the student details below</p>
            </div>
            <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6">
              
              <SectionTitle icon={<Info size={16} />} title="Identity" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField label="First Name" value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} error={formErrors.first_name} required />
                <FormField label="Middle Name" value={form.middle_name} onChange={(e) => setForm({ ...form, middle_name: e.target.value })} />
                <FormField label="Last Name" value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} error={formErrors.last_name} required />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField label="DOB" type="date" value={form.date_of_birth} onChange={(e) => setForm({ ...form, date_of_birth: e.target.value })} />
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Gender</label>
                  <select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value as any })} className="w-full px-4 py-2.5 rounded-xl border border-slate-100 bg-slate-50 text-sm font-bold focus:ring-2 focus:ring-amber-500 outline-none transition-all">
                    <option>Male</option><option>Female</option>
                  </select>
                </div>
                <FormField label="Fayda ID" value={form.fayda_id} onChange={(e) => setForm({ ...form, fayda_id: e.target.value })} error={formErrors.fayda_id} required />
              </div>

              <SectionTitle icon={<BookOpen size={16} />} title="Academic" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField label="Grade 8 GPA" type="number" value={form.grade_8_gpa} onChange={(e) => setForm({ ...form, grade_8_gpa: Number(e.target.value) })} />
                <FormField label="Previous School" value={form.previous_school} onChange={(e) => setForm({ ...form, previous_school: e.target.value })} />
                <FormField label="National Exam #" value={form.national_exam_number} onChange={(e) => setForm({ ...form, national_exam_number: e.target.value })} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 <FormField label="Grade" value={form.grade} onChange={(e) => setForm({ ...form, grade: e.target.value })} />
                 <FormField label="Section" value={form.section} onChange={(e) => setForm({ ...form, section: e.target.value })} />
                 <FormField label="Roll Number" value={form.roll_number} onChange={(e) => setForm({ ...form, roll_number: e.target.value })} error={formErrors.roll_number} required />
              </div>

              <SectionTitle icon={<MapPin size={16} />} title="Address & Contact" />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <FormField label="Region" value={form.region} onChange={(e) => setForm({ ...form, region: e.target.value })} />
                <FormField label="Zone" value={form.zone} onChange={(e) => setForm({ ...form, zone: e.target.value })} />
                <FormField label="Kebele" value={form.kebele} onChange={(e) => setForm({ ...form, kebele: e.target.value })} />
                <FormField label="House No" value={form.house_no} onChange={(e) => setForm({ ...form, house_no: e.target.value })} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Guardian Name" value={form.guardian_name} onChange={(e) => setForm({ ...form, guardian_name: e.target.value })} />
                <FormField label="Relation" value={form.guardian_relation} onChange={(e) => setForm({ ...form, guardian_relation: e.target.value })} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Phone" value={form.parent_phone} onChange={(e) => setForm({ ...form, parent_phone: e.target.value })} />
                <FormField label="Personal Email" type="email" value={form.personal_email} onChange={(e) => setForm({ ...form, personal_email: e.target.value })} />
              </div>

            </div>
            <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex gap-3">
              <button onClick={() => setModalOpen(false)} className="flex-1 py-3 rounded-2xl bg-white border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-all">
                Cancel
              </button>
              <button onClick={handleSave} disabled={loading} className="flex-1 py-3 rounded-2xl bg-amber-500 text-white font-bold hover:bg-amber-600 transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50 flex items-center justify-center gap-2">
                {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={18} />}
                {editId ? "Update Record" : "Save Student"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Student Detail Modal */}
      {viewStudent && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in" onClick={() => setViewStudent(null)}>
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl animate-fade-scale" onClick={e => e.stopPropagation()}>
            <div className="h-24 bg-gradient-to-r from-amber-500 to-orange-500 rounded-t-3xl relative shrink-0">
              <button onClick={() => setViewStudent(null)} className="absolute top-4 right-4 w-8 h-8 bg-black/10 hover:bg-black/20 rounded-xl flex items-center justify-center text-white transition-colors">X</button>
            </div>
            <div className="px-8 pb-8 -mt-10 overflow-y-auto custom-scrollbar flex-1">
              <div className={`w-20 h-20 rounded-3xl border-4 border-white shadow-lg flex items-center justify-center text-3xl font-black shrink-0 ${viewStudent.gender === 'Male' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'}`}>
                {viewStudent.first_name[0]}{viewStudent.last_name[0]}
              </div>
              <div className="mt-4 flex items-start justify-between">
                <div>
                  <h3 className="text-2xl font-black text-slate-900">{viewStudent.first_name} {viewStudent.last_name}</h3>
                  <p className="text-sm font-bold text-slate-500">Grade {viewStudent.grade} Section {viewStudent.section} • Roll: {viewStudent.roll_number}</p>
                </div>
                <span className={`px-3 py-1 rounded-xl text-xs font-black uppercase tracking-wider border ${viewStudent.status === 'active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100/50' : 'bg-red-50 text-red-600 border-red-100/50'}`}>
                  {viewStudent.status}
                </span>
              </div>
              
              <div className="mt-6 space-y-2">
                {[
                  ['Fayda ID', viewStudent.fayda_id], 
                  ['Phone', viewStudent.parent_phone || 'N/A'], 
                  ['Email', viewStudent.personal_email || 'N/A'],
                  ['Age', viewStudent.date_of_birth ? `${new Date().getFullYear() - new Date(viewStudent.date_of_birth).getFullYear()} years` : 'N/A'], 
                  ['Gender', viewStudent.gender], 
                  ['Guardian', viewStudent.guardian_name || 'N/A'], 
                  ['Address', `${viewStudent.address.region}, ${viewStudent.address.zone}, ${viewStudent.address.kebele}`], 
                  ['Enrolled', viewStudent.enrolled_date ? new Date(viewStudent.enrolled_date).toLocaleDateString() : 'N/A']
                ].map(([l, v]) => (
                  <div key={l} className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-100/50 hover:bg-slate-100/50 transition-colors">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{l}</span>
                    <span className="text-sm font-bold text-slate-900 text-right">{v}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex flex-col gap-3">
                <div className="flex gap-3">
                  <button onClick={() => { setViewStudent(null); openEdit(viewStudent); }} className="flex-1 px-4 py-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-2xl font-bold text-sm transition-colors flex items-center justify-center gap-2">
                    <Pencil size={16} /> Edit Student
                  </button>
                  <button onClick={() => { setViewStudent(null); handleDelete(viewStudent); }} className="flex-1 px-4 py-3 bg-red-50 hover:bg-red-100 text-red-700 rounded-2xl font-bold text-sm transition-colors flex items-center justify-center gap-2">
                    <Trash2 size={16} /> Delete
                  </button>
                </div>
                <button 
                  onClick={() => downloadStudentTranscript(viewStudent)}
                  className="w-full px-4 py-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-2xl font-bold text-sm transition-colors flex items-center justify-center gap-2"
                >
                  <FileText size={16} /> Download PDF Transcript
                </button>
                <button 
                  onClick={async () => {
                    try {
                      await api.issueCredentials(viewStudent.id, viewStudent.personal_email || "");
                      addToast({ type: "success", title: "Credentials Sent", message: "New credentials have been emailed to the student." });
                    } catch (err: any) {
                      addToast({ type: "error", title: "Error", message: err.message || "Failed to issue credentials" });
                    }
                  }} 
                  className="w-full px-4 py-3 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-2xl font-bold text-sm transition-colors flex items-center justify-center gap-2"
                >
                  <Mail size={16} /> Resend Login Credentials
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ConfirmationDialog
        open={confirmDelete.open}
        onClose={() => setConfirmDelete({ open: false, student: null })}
        onConfirm={confirmDeleteStudent}
        title="Delete Student Record"
        description={`Are you sure you want to delete ${confirmDelete.student?.first_name} ${confirmDelete.student?.last_name}? All associated records (marks, attendance) will be lost.`}
        confirmText="Delete Record"
        type="danger"
      />
    </div>
  );
}

function SectionTitle({ icon, title }: any) {
  return (
    <div className="flex items-center gap-2 border-b border-slate-100 pb-2 mb-4">
      <div className="text-amber-500">{icon}</div>
      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{title}</h4>
    </div>
  );
}
