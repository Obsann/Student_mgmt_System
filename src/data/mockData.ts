// ============================================================
// TYPES
// ============================================================

export interface Student {
  id: string;
  first_name: string;
  last_name: string;
  age: number;
  gender: "Male" | "Female";
  grade: string;
  section: string;
  roll_number: string;
  parent_phone: string;
  address: string;
  enrolled_date: string;
}

export interface Teacher {
  id: string;
  name: string;
  email: string;
  phone: string;
  qualification: string;
  subjects: string[];
  assigned_grade: string;
  assigned_section: string;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  grade: string;
  teacher_id: string;
}

export interface Enrollment {
  id: string;
  student_id: string;
  subject_id: string;
  academic_year: string;
  semester: number;
}

export interface AttendanceRecord {
  id: string;
  student_id: string;
  subject_id: string;
  date: string;
  status: "present" | "absent" | "late" | "excused";
  recorded_by: string;
}

export interface Mark {
  id: string;
  student_id: string;
  subject_id: string;
  academic_year: string;
  semester: number;
  assessment_type: "quiz" | "midterm" | "final" | "assignment";
  score: number;
  max_score?: number;
  remarks?: string;
  entered_by: string;
}

export interface User {
  id: string;
  username: string;
  password: string;
  role: "admin" | "teacher" | "student";
  name: string;
  email?: string;
  ref_id: string;
  avatar?: string;
}

export const initialSubjects: Subject[] = [
  {
    "id": "sub1",
    "name": "Mathematics",
    "code": "MATH",
    "grade": "9",
    "teacher_id": "t1"
  },
  {
    "id": "sub2",
    "name": "Physics",
    "code": "PHY",
    "grade": "9",
    "teacher_id": "t2"
  },
  {
    "id": "sub3",
    "name": "Chemistry",
    "code": "CHEM",
    "grade": "9",
    "teacher_id": "t3"
  },
  {
    "id": "sub4",
    "name": "Biology",
    "code": "BIO",
    "grade": "9",
    "teacher_id": "t4"
  },
  {
    "id": "sub5",
    "name": "English",
    "code": "ENG",
    "grade": "9",
    "teacher_id": "t5"
  },
  {
    "id": "sub6",
    "name": "Mathematics",
    "code": "MATH",
    "grade": "10",
    "teacher_id": "t6"
  },
  {
    "id": "sub7",
    "name": "Physics",
    "code": "PHY",
    "grade": "10",
    "teacher_id": "t7"
  },
  {
    "id": "sub8",
    "name": "Chemistry",
    "code": "CHEM",
    "grade": "10",
    "teacher_id": "t8"
  },
  {
    "id": "sub9",
    "name": "English",
    "code": "ENG",
    "grade": "10",
    "teacher_id": "t9"
  },
  {
    "id": "sub10",
    "name": "Biology",
    "code": "BIO",
    "grade": "10",
    "teacher_id": "t10"
  }
];
export const initialTeachers: Teacher[] = [
  {
    "id": "t1",
    "name": "Ephrem Worku",
    "email": "ephrem.worku@keraschool.et",
    "phone": "+251911595966",
    "qualification": "BSc Computer Science",
    "subjects": [
      "sub1"
    ],
    "assigned_grade": "9",
    "assigned_section": "A"
  },
  {
    "id": "t2",
    "name": "Hiwot Zewde",
    "email": "hiwot.zewde@keraschool.et",
    "phone": "+251913877337",
    "qualification": "BSc Biology",
    "subjects": [
      "sub2"
    ],
    "assigned_grade": "9",
    "assigned_section": "B"
  },
  {
    "id": "t3",
    "name": "Daniel Adane",
    "email": "daniel.adane@keraschool.et",
    "phone": "+251911904798",
    "qualification": "MSc Physics",
    "subjects": [
      "sub3"
    ],
    "assigned_grade": "10",
    "assigned_section": "A"
  },
  {
    "id": "t4",
    "name": "Kidist Bekele",
    "email": "kidist.bekele@keraschool.et",
    "phone": "+251919974427",
    "qualification": "BA Civics",
    "subjects": [
      "sub4"
    ],
    "assigned_grade": "10",
    "assigned_section": "B"
  },
  {
    "id": "t5",
    "name": "Abebe Zewde",
    "email": "abebe.zewde@keraschool.et",
    "phone": "+251912483747",
    "qualification": "MA English",
    "subjects": [
      "sub5"
    ],
    "assigned_grade": "9",
    "assigned_section": "A"
  },
  {
    "id": "t6",
    "name": "Worku Tilahun",
    "email": "worku.tilahun@keraschool.et",
    "phone": "+251917313279",
    "qualification": "MSc Physics",
    "subjects": [
      "sub6"
    ],
    "assigned_grade": "9",
    "assigned_section": "B"
  },
  {
    "id": "t7",
    "name": "Hiwot Bizuneh",
    "email": "hiwot.bizuneh@keraschool.et",
    "phone": "+251919922371",
    "qualification": "BSc Computer Science",
    "subjects": [
      "sub7"
    ],
    "assigned_grade": "10",
    "assigned_section": "A"
  },
  {
    "id": "t8",
    "name": "Mahlet Fikre",
    "email": "mahlet.fikre@keraschool.et",
    "phone": "+251916841482",
    "qualification": "BA Civics",
    "subjects": [
      "sub8"
    ],
    "assigned_grade": "10",
    "assigned_section": "B"
  },
  {
    "id": "t9",
    "name": "Bruktawit Bogale",
    "email": "bruktawit.bogale@keraschool.et",
    "phone": "+251912300884",
    "qualification": "MSc Physics",
    "subjects": [
      "sub9"
    ],
    "assigned_grade": "9",
    "assigned_section": "A"
  },
  {
    "id": "t10",
    "name": "Rahel Tesfaye",
    "email": "rahel.tesfaye@keraschool.et",
    "phone": "+251915015612",
    "qualification": "BSc Mathematics",
    "subjects": [
      "sub10"
    ],
    "assigned_grade": "9",
    "assigned_section": "B"
  },
  {
    "id": "t11",
    "name": "Rahel Belay",
    "email": "rahel.belay@keraschool.et",
    "phone": "+251916962499",
    "qualification": "BSc Computer Science",
    "subjects": [],
    "assigned_grade": "10",
    "assigned_section": "A"
  },
  {
    "id": "t12",
    "name": "Yonatan Goshu",
    "email": "yonatan.goshu@keraschool.et",
    "phone": "+251919727510",
    "qualification": "BSc Biology",
    "subjects": [],
    "assigned_grade": "10",
    "assigned_section": "B"
  },
  {
    "id": "t13",
    "name": "Tsion Wondimu",
    "email": "tsion.wondimu@keraschool.et",
    "phone": "+251911113125",
    "qualification": "MA English",
    "subjects": [],
    "assigned_grade": "9",
    "assigned_section": "A"
  },
  {
    "id": "t14",
    "name": "Hiwot Mekonnen",
    "email": "hiwot.mekonnen@keraschool.et",
    "phone": "+251917959364",
    "qualification": "BSc Computer Science",
    "subjects": [],
    "assigned_grade": "9",
    "assigned_section": "B"
  },
  {
    "id": "t15",
    "name": "Aster Ashenafi",
    "email": "aster.ashenafi@keraschool.et",
    "phone": "+251912435403",
    "qualification": "MSc Physics",
    "subjects": [],
    "assigned_grade": "10",
    "assigned_section": "A"
  }
];
export const initialStudents: Student[] = [
  {
    "id": "s1",
    "first_name": "Mekdes",
    "last_name": "Tsegaye",
    "age": 15,
    "gender": "Male",
    "grade": "9",
    "section": "A",
    "roll_number": "KR/9/A/001",
    "parent_phone": "+251916997061",
    "address": "Kera, Addis Ababa",
    "enrolled_date": "2025-09-01"
  },
  {
    "id": "s2",
    "first_name": "Kidist",
    "last_name": "Desta",
    "age": 15,
    "gender": "Female",
    "grade": "9",
    "section": "A",
    "roll_number": "KR/9/A/002",
    "parent_phone": "+251915529082",
    "address": "Kera, Addis Ababa",
    "enrolled_date": "2025-09-01"
  },
  {
    "id": "s3",
    "first_name": "Yonas",
    "last_name": "Girma",
    "age": 15,
    "gender": "Female",
    "grade": "9",
    "section": "A",
    "roll_number": "KR/9/A/003",
    "parent_phone": "+251916031979",
    "address": "Kera, Addis Ababa",
    "enrolled_date": "2025-09-01"
  },
  {
    "id": "s4",
    "first_name": "Hanna",
    "last_name": "Bogale",
    "age": 16,
    "gender": "Male",
    "grade": "9",
    "section": "A",
    "roll_number": "KR/9/A/004",
    "parent_phone": "+251918182722",
    "address": "Kera, Addis Ababa",
    "enrolled_date": "2025-09-01"
  },
  {
    "id": "s5",
    "first_name": "Ephrem",
    "last_name": "Amare",
    "age": 16,
    "gender": "Female",
    "grade": "9",
    "section": "A",
    "roll_number": "KR/9/A/005",
    "parent_phone": "+251912640327",
    "address": "Kera, Addis Ababa",
    "enrolled_date": "2025-09-01"
  },
  {
    "id": "s6",
    "first_name": "Sara",
    "last_name": "Mekonnen",
    "age": 16,
    "gender": "Female",
    "grade": "9",
    "section": "A",
    "roll_number": "KR/9/A/006",
    "parent_phone": "+251912138523",
    "address": "Kera, Addis Ababa",
    "enrolled_date": "2025-09-01"
  },
  {
    "id": "s7",
    "first_name": "Mekdes",
    "last_name": "Fikre",
    "age": 15,
    "gender": "Male",
    "grade": "9",
    "section": "A",
    "roll_number": "KR/9/A/007",
    "parent_phone": "+251912304653",
    "address": "Kera, Addis Ababa",
    "enrolled_date": "2025-09-01"
  },
  {
    "id": "s8",
    "first_name": "Mahlet",
    "last_name": "Tefera",
    "age": 15,
    "gender": "Male",
    "grade": "9",
    "section": "A",
    "roll_number": "KR/9/A/008",
    "parent_phone": "+251916123205",
    "address": "Kera, Addis Ababa",
    "enrolled_date": "2025-09-01"
  },
  {
    "id": "s9",
    "first_name": "Henok",
    "last_name": "Adane",
    "age": 16,
    "gender": "Female",
    "grade": "9",
    "section": "A",
    "roll_number": "KR/9/A/009",
    "parent_phone": "+251919730128",
    "address": "Kera, Addis Ababa",
    "enrolled_date": "2025-09-01"
  },
  {
    "id": "s10",
    "first_name": "Mekdes",
    "last_name": "Hailemariam",
    "age": 15,
    "gender": "Female",
    "grade": "9",
    "section": "A",
    "roll_number": "KR/9/A/010",
    "parent_phone": "+251913011881",
    "address": "Kera, Addis Ababa",
    "enrolled_date": "2025-09-01"
  },
  {
    "id": "s11",
    "first_name": "Nahom",
    "last_name": "Amare",
    "age": 16,
    "gender": "Male",
    "grade": "9",
    "section": "A",
    "roll_number": "KR/9/A/011",
    "parent_phone": "+251914365650",
    "address": "Kera, Addis Ababa",
    "enrolled_date": "2025-09-01"
  },
  {
    "id": "s12",
    "first_name": "Samuel",
    "last_name": "Bekele",
    "age": 15,
    "gender": "Male",
    "grade": "9",
    "section": "A",
    "roll_number": "KR/9/A/012",
    "parent_phone": "+251912502345",
    "address": "Kera, Addis Ababa",
    "enrolled_date": "2025-09-01"
  },
  {
    "id": "s13",
    "first_name": "Bekele",
    "last_name": "Worku",
    "age": 16,
    "gender": "Female",
    "grade": "9",
    "section": "A",
    "roll_number": "KR/9/A/013",
    "parent_phone": "+251916380807",
    "address": "Kera, Addis Ababa",
    "enrolled_date": "2025-09-01"
  },
  {
    "id": "s14",
    "first_name": "Worku",
    "last_name": "Adane",
    "age": 15,
    "gender": "Male",
    "grade": "9",
    "section": "A",
    "roll_number": "KR/9/A/014",
    "parent_phone": "+251915837781",
    "address": "Kera, Addis Ababa",
    "enrolled_date": "2025-09-01"
  },
  {
    "id": "s15",
    "first_name": "Dawit",
    "last_name": "Belay",
    "age": 15,
    "gender": "Male",
    "grade": "9",
    "section": "A",
    "roll_number": "KR/9/A/015",
    "parent_phone": "+251917907784",
    "address": "Kera, Addis Ababa",
    "enrolled_date": "2025-09-01"
  },
  {
    "id": "s16",
    "first_name": "Yonas",
    "last_name": "Amare",
    "age": 15,
    "gender": "Female",
    "grade": "9",
    "section": "A",
    "roll_number": "KR/9/A/016",
    "parent_phone": "+251911462950",
    "address": "Kera, Addis Ababa",
    "enrolled_date": "2025-09-01"
  },
  {
    "id": "s17",
    "first_name": "Tsegaye",
    "last_name": "Getachew",
    "age": 16,
    "gender": "Female",
    "grade": "9",
    "section": "A",
    "roll_number": "KR/9/A/017",
    "parent_phone": "+251918495915",
    "address": "Kera, Addis Ababa",
    "enrolled_date": "2025-09-01"
  },
  {
    "id": "s18",
    "first_name": "Hana",
    "last_name": "Demeke",
    "age": 15,
    "gender": "Female",
    "grade": "9",
    "section": "A",
    "roll_number": "KR/9/A/018",
    "parent_phone": "+251913904485",
    "address": "Kera, Addis Ababa",
    "enrolled_date": "2025-09-01"
  },
  {
    "id": "s19",
    "first_name": "Henok",
    "last_name": "Tilahun",
    "age": 16,
    "gender": "Male",
    "grade": "9",
    "section": "A",
    "roll_number": "KR/9/A/019",
    "parent_phone": "+251915192521",
    "address": "Kera, Addis Ababa",
    "enrolled_date": "2025-09-01"
  },
  {
    "id": "s20",
    "first_name": "Hiwot",
    "last_name": "Abera",
    "age": 15,
    "gender": "Female",
    "grade": "9",
    "section": "A",
    "roll_number": "KR/9/A/020",
    "parent_phone": "+251913486630",
    "address": "Kera, Addis Ababa",
    "enrolled_date": "2025-09-01"
  },
  {
    "id": "s21",
    "first_name": "Kidist",
    "last_name": "Adane",
    "age": 16,
    "gender": "Female",
    "grade": "9",
    "section": "B",
    "roll_number": "KR/9/B/021",
    "parent_phone": "+251911298480",
    "address": "Kera, Addis Ababa",
    "enrolled_date": "2025-09-01"
  },
  {
    "id": "s22",
    "first_name": "Worku",
    "last_name": "Alemu",
    "age": 15,
    "gender": "Male",
    "grade": "9",
    "section": "B",
    "roll_number": "KR/9/B/022",
    "parent_phone": "+251917142216",
    "address": "Kera, Addis Ababa",
    "enrolled_date": "2025-09-01"
  },
  {
    "id": "s23",
    "first_name": "Mekdes",
    "last_name": "Belay",
    "age": 15,
    "gender": "Female",
    "grade": "9",
    "section": "B",
    "roll_number": "KR/9/B/023",
    "parent_phone": "+251915351746",
    "address": "Kera, Addis Ababa",
    "enrolled_date": "2025-09-01"
  },
  {
    "id": "s24",
    "first_name": "Birhanu",
    "last_name": "Adane",
    "age": 15,
    "gender": "Female",
    "grade": "9",
    "section": "B",
    "roll_number": "KR/9/B/024",
    "parent_phone": "+251917734513",
    "address": "Kera, Addis Ababa",
    "enrolled_date": "2025-09-01"
  },
  {
    "id": "s25",
    "first_name": "Abel",
    "last_name": "Tafesse",
    "age": 16,
    "gender": "Female",
    "grade": "9",
    "section": "B",
    "roll_number": "KR/9/B/025",
    "parent_phone": "+251919049676",
    "address": "Kera, Addis Ababa",
    "enrolled_date": "2025-09-01"
  },
  {
    "id": "s26",
    "first_name": "Tesfaye",
    "last_name": "Getachew",
    "age": 15,
    "gender": "Female",
    "grade": "9",
    "section": "B",
    "roll_number": "KR/9/B/026",
    "parent_phone": "+251917357467",
    "address": "Kera, Addis Ababa",
    "enrolled_date": "2025-09-01"
  },
  {
    "id": "s27",
    "first_name": "Selamawit",
    "last_name": "Hailemariam",
    "age": 16,
    "gender": "Female",
    "grade": "9",
    "section": "B",
    "roll_number": "KR/9/B/027",
    "parent_phone": "+251912472056",
    "address": "Kera, Addis Ababa",
    "enrolled_date": "2025-09-01"
  },
  {
    "id": "s28",
    "first_name": "Kidist",
    "last_name": "Goshu",
    "age": 16,
    "gender": "Female",
    "grade": "9",
    "section": "B",
    "roll_number": "KR/9/B/028",
    "parent_phone": "+251919613542",
    "address": "Kera, Addis Ababa",
    "enrolled_date": "2025-09-01"
  },
  {
    "id": "s29",
    "first_name": "Hana",
    "last_name": "Gebre",
    "age": 16,
    "gender": "Male",
    "grade": "9",
    "section": "B",
    "roll_number": "KR/9/B/029",
    "parent_phone": "+251914043555",
    "address": "Kera, Addis Ababa",
    "enrolled_date": "2025-09-01"
  },
  {
    "id": "s30",
    "first_name": "Tigist",
    "last_name": "Mekonnen",
    "age": 15,
    "gender": "Male",
    "grade": "9",
    "section": "B",
    "roll_number": "KR/9/B/030",
    "parent_phone": "+251917659504",
    "address": "Kera, Addis Ababa",
    "enrolled_date": "2025-09-01"
  },
  {
    "id": "s31",
    "first_name": "Selamawit",
    "last_name": "Kebede",
    "age": 16,
    "gender": "Male",
    "grade": "9",
    "section": "B",
    "roll_number": "KR/9/B/031",
    "parent_phone": "+251914454452",
    "address": "Kera, Addis Ababa",
    "enrolled_date": "2025-09-01"
  },
  {
    "id": "s32",
    "first_name": "Feven",
    "last_name": "Bekele",
    "age": 16,
    "gender": "Female",
    "grade": "9",
    "section": "B",
    "roll_number": "KR/9/B/032",
    "parent_phone": "+251918988662",
    "address": "Kera, Addis Ababa",
    "enrolled_date": "2025-09-01"
  },
  {
    "id": "s33",
    "first_name": "Haile",
    "last_name": "Gebremeskel",
    "age": 15,
    "gender": "Female",
    "grade": "9",
    "section": "B",
    "roll_number": "KR/9/B/033",
    "parent_phone": "+251914930169",
    "address": "Kera, Addis Ababa",
    "enrolled_date": "2025-09-01"
  },
  {
    "id": "s34",
    "first_name": "Ruth",
    "last_name": "Damte",
    "age": 15,
    "gender": "Female",
    "grade": "9",
    "section": "B",
    "roll_number": "KR/9/B/034",
    "parent_phone": "+251913798446",
    "address": "Kera, Addis Ababa",
    "enrolled_date": "2025-09-01"
  },
  {
    "id": "s35",
    "first_name": "Tsion",
    "last_name": "Tefera",
    "age": 15,
    "gender": "Male",
    "grade": "9",
    "section": "B",
    "roll_number": "KR/9/B/035",
    "parent_phone": "+251918590698",
    "address": "Kera, Addis Ababa",
    "enrolled_date": "2025-09-01"
  },
  {
    "id": "s36",
    "first_name": "Haile",
    "last_name": "Bogale",
    "age": 16,
    "gender": "Female",
    "grade": "9",
    "section": "B",
    "roll_number": "KR/9/B/036",
    "parent_phone": "+251911641369",
    "address": "Kera, Addis Ababa",
    "enrolled_date": "2025-09-01"
  },
  {
    "id": "s37",
    "first_name": "Nahom",
    "last_name": "Damte",
    "age": 15,
    "gender": "Male",
    "grade": "9",
    "section": "B",
    "roll_number": "KR/9/B/037",
    "parent_phone": "+251912787174",
    "address": "Kera, Addis Ababa",
    "enrolled_date": "2025-09-01"
  },
  {
    "id": "s38",
    "first_name": "Frezewd",
    "last_name": "Amare",
    "age": 15,
    "gender": "Male",
    "grade": "9",
    "section": "B",
    "roll_number": "KR/9/B/038",
    "parent_phone": "+251914506330",
    "address": "Kera, Addis Ababa",
    "enrolled_date": "2025-09-01"
  },
  {
    "id": "s39",
    "first_name": "Tsion",
    "last_name": "Belay",
    "age": 15,
    "gender": "Female",
    "grade": "9",
    "section": "B",
    "roll_number": "KR/9/B/039",
    "parent_phone": "+251917885871",
    "address": "Kera, Addis Ababa",
    "enrolled_date": "2025-09-01"
  },
  {
    "id": "s40",
    "first_name": "Ruth",
    "last_name": "Worku",
    "age": 16,
    "gender": "Male",
    "grade": "9",
    "section": "B",
    "roll_number": "KR/9/B/040",
    "parent_phone": "+251912734867",
    "address": "Kera, Addis Ababa",
    "enrolled_date": "2025-09-01"
  },
  {
    "id": "s41",
    "first_name": "Hiwot",
    "last_name": "Yilma",
    "age": 17,
    "gender": "Female",
    "grade": "10",
    "section": "A",
    "roll_number": "KR/10/A/041",
    "parent_phone": "+251916523512",
    "address": "Kera, Addis Ababa",
    "enrolled_date": "2025-09-01"
  },
  {
    "id": "s42",
    "first_name": "Ephrem",
    "last_name": "Abera",
    "age": 17,
    "gender": "Female",
    "grade": "10",
    "section": "A",
    "roll_number": "KR/10/A/042",
    "parent_phone": "+251918039221",
    "address": "Kera, Addis Ababa",
    "enrolled_date": "2025-09-01"
  },
  {
    "id": "s43",
    "first_name": "Nebiyu",
    "last_name": "Girma",
    "age": 17,
    "gender": "Male",
    "grade": "10",
    "section": "A",
    "roll_number": "KR/10/A/043",
    "parent_phone": "+251916387211",
    "address": "Kera, Addis Ababa",
    "enrolled_date": "2025-09-01"
  },
  {
    "id": "s44",
    "first_name": "Mahlet",
    "last_name": "Zewde",
    "age": 17,
    "gender": "Male",
    "grade": "10",
    "section": "A",
    "roll_number": "KR/10/A/044",
    "parent_phone": "+251914871175",
    "address": "Kera, Addis Ababa",
    "enrolled_date": "2025-09-01"
  },
  {
    "id": "s45",
    "first_name": "Nahom",
    "last_name": "Alemu",
    "age": 17,
    "gender": "Male",
    "grade": "10",
    "section": "A",
    "roll_number": "KR/10/A/045",
    "parent_phone": "+251914270526",
    "address": "Kera, Addis Ababa",
    "enrolled_date": "2025-09-01"
  },
  {
    "id": "s46",
    "first_name": "Tsion",
    "last_name": "Bogale",
    "age": 17,
    "gender": "Female",
    "grade": "10",
    "section": "A",
    "roll_number": "KR/10/A/046",
    "parent_phone": "+251918499302",
    "address": "Kera, Addis Ababa",
    "enrolled_date": "2025-09-01"
  },
  {
    "id": "s47",
    "first_name": "Yonatan",
    "last_name": "Abera",
    "age": 17,
    "gender": "Male",
    "grade": "10",
    "section": "A",
    "roll_number": "KR/10/A/047",
    "parent_phone": "+251917839617",
    "address": "Kera, Addis Ababa",
    "enrolled_date": "2025-09-01"
  },
  {
    "id": "s48",
    "first_name": "Yonatan",
    "last_name": "Getachew",
    "age": 17,
    "gender": "Female",
    "grade": "10",
    "section": "A",
    "roll_number": "KR/10/A/048",
    "parent_phone": "+251912260807",
    "address": "Kera, Addis Ababa",
    "enrolled_date": "2025-09-01"
  },
  {
    "id": "s49",
    "first_name": "Solomon",
    "last_name": "Alemu",
    "age": 17,
    "gender": "Female",
    "grade": "10",
    "section": "A",
    "roll_number": "KR/10/A/049",
    "parent_phone": "+251913524018",
    "address": "Kera, Addis Ababa",
    "enrolled_date": "2025-09-01"
  },
  {
    "id": "s50",
    "first_name": "Tsion",
    "last_name": "Wondimu",
    "age": 17,
    "gender": "Female",
    "grade": "10",
    "section": "A",
    "roll_number": "KR/10/A/050",
    "parent_phone": "+251913955460",
    "address": "Kera, Addis Ababa",
    "enrolled_date": "2025-09-01"
  },
  {
    "id": "s51",
    "first_name": "Ermias",
    "last_name": "Tilahun",
    "age": 16,
    "gender": "Female",
    "grade": "10",
    "section": "A",
    "roll_number": "KR/10/A/051",
    "parent_phone": "+251918360487",
    "address": "Kera, Addis Ababa",
    "enrolled_date": "2025-09-01"
  },
  {
    "id": "s52",
    "first_name": "Abel",
    "last_name": "Gebre",
    "age": 17,
    "gender": "Female",
    "grade": "10",
    "section": "A",
    "roll_number": "KR/10/A/052",
    "parent_phone": "+251911531365",
    "address": "Kera, Addis Ababa",
    "enrolled_date": "2025-09-01"
  },
  {
    "id": "s53",
    "first_name": "Tsion",
    "last_name": "Gizaw",
    "age": 16,
    "gender": "Male",
    "grade": "10",
    "section": "A",
    "roll_number": "KR/10/A/053",
    "parent_phone": "+251914131515",
    "address": "Kera, Addis Ababa",
    "enrolled_date": "2025-09-01"
  },
  {
    "id": "s54",
    "first_name": "Fikadu",
    "last_name": "Alemu",
    "age": 17,
    "gender": "Male",
    "grade": "10",
    "section": "A",
    "roll_number": "KR/10/A/054",
    "parent_phone": "+251912548650",
    "address": "Kera, Addis Ababa",
    "enrolled_date": "2025-09-01"
  },
  {
    "id": "s55",
    "first_name": "Mulatu",
    "last_name": "Goshu",
    "age": 16,
    "gender": "Female",
    "grade": "10",
    "section": "A",
    "roll_number": "KR/10/A/055",
    "parent_phone": "+251919102860",
    "address": "Kera, Addis Ababa",
    "enrolled_date": "2025-09-01"
  },
  {
    "id": "s56",
    "first_name": "Selamawit",
    "last_name": "Demeke",
    "age": 17,
    "gender": "Male",
    "grade": "10",
    "section": "A",
    "roll_number": "KR/10/A/056",
    "parent_phone": "+251915994086",
    "address": "Kera, Addis Ababa",
    "enrolled_date": "2025-09-01"
  },
  {
    "id": "s57",
    "first_name": "Tsion",
    "last_name": "Demeke",
    "age": 16,
    "gender": "Male",
    "grade": "10",
    "section": "A",
    "roll_number": "KR/10/A/057",
    "parent_phone": "+251918132885",
    "address": "Kera, Addis Ababa",
    "enrolled_date": "2025-09-01"
  },
  {
    "id": "s58",
    "first_name": "Hiwot",
    "last_name": "Ashenafi",
    "age": 16,
    "gender": "Female",
    "grade": "10",
    "section": "A",
    "roll_number": "KR/10/A/058",
    "parent_phone": "+251915934453",
    "address": "Kera, Addis Ababa",
    "enrolled_date": "2025-09-01"
  },
  {
    "id": "s59",
    "first_name": "Hiwot",
    "last_name": "Abera",
    "age": 16,
    "gender": "Male",
    "grade": "10",
    "section": "A",
    "roll_number": "KR/10/A/059",
    "parent_phone": "+251916145168",
    "address": "Kera, Addis Ababa",
    "enrolled_date": "2025-09-01"
  },
  {
    "id": "s60",
    "first_name": "Yonas",
    "last_name": "Goshu",
    "age": 17,
    "gender": "Male",
    "grade": "10",
    "section": "A",
    "roll_number": "KR/10/A/060",
    "parent_phone": "+251919511339",
    "address": "Kera, Addis Ababa",
    "enrolled_date": "2025-09-01"
  },
  {
    "id": "s61",
    "first_name": "Nardos",
    "last_name": "Alemu",
    "age": 17,
    "gender": "Female",
    "grade": "10",
    "section": "B",
    "roll_number": "KR/10/B/061",
    "parent_phone": "+251918015071",
    "address": "Kera, Addis Ababa",
    "enrolled_date": "2025-09-01"
  },
  {
    "id": "s62",
    "first_name": "Aster",
    "last_name": "Girma",
    "age": 17,
    "gender": "Female",
    "grade": "10",
    "section": "B",
    "roll_number": "KR/10/B/062",
    "parent_phone": "+251917026817",
    "address": "Kera, Addis Ababa",
    "enrolled_date": "2025-09-01"
  },
  {
    "id": "s63",
    "first_name": "Eden",
    "last_name": "Mekonen",
    "age": 16,
    "gender": "Female",
    "grade": "10",
    "section": "B",
    "roll_number": "KR/10/B/063",
    "parent_phone": "+251919232349",
    "address": "Kera, Addis Ababa",
    "enrolled_date": "2025-09-01"
  },
  {
    "id": "s64",
    "first_name": "Hana",
    "last_name": "Berhanu",
    "age": 17,
    "gender": "Male",
    "grade": "10",
    "section": "B",
    "roll_number": "KR/10/B/064",
    "parent_phone": "+251919307246",
    "address": "Kera, Addis Ababa",
    "enrolled_date": "2025-09-01"
  },
  {
    "id": "s65",
    "first_name": "Mulatu",
    "last_name": "Bekele",
    "age": 16,
    "gender": "Male",
    "grade": "10",
    "section": "B",
    "roll_number": "KR/10/B/065",
    "parent_phone": "+251911189020",
    "address": "Kera, Addis Ababa",
    "enrolled_date": "2025-09-01"
  },
  {
    "id": "s66",
    "first_name": "Lidiya",
    "last_name": "Amare",
    "age": 16,
    "gender": "Male",
    "grade": "10",
    "section": "B",
    "roll_number": "KR/10/B/066",
    "parent_phone": "+251919405273",
    "address": "Kera, Addis Ababa",
    "enrolled_date": "2025-09-01"
  },
  {
    "id": "s67",
    "first_name": "Bekele",
    "last_name": "Wondimu",
    "age": 16,
    "gender": "Male",
    "grade": "10",
    "section": "B",
    "roll_number": "KR/10/B/067",
    "parent_phone": "+251917851169",
    "address": "Kera, Addis Ababa",
    "enrolled_date": "2025-09-01"
  },
  {
    "id": "s68",
    "first_name": "Alemu",
    "last_name": "Mekonen",
    "age": 17,
    "gender": "Male",
    "grade": "10",
    "section": "B",
    "roll_number": "KR/10/B/068",
    "parent_phone": "+251919302952",
    "address": "Kera, Addis Ababa",
    "enrolled_date": "2025-09-01"
  },
  {
    "id": "s69",
    "first_name": "Hana",
    "last_name": "Demeke",
    "age": 16,
    "gender": "Female",
    "grade": "10",
    "section": "B",
    "roll_number": "KR/10/B/069",
    "parent_phone": "+251914848108",
    "address": "Kera, Addis Ababa",
    "enrolled_date": "2025-09-01"
  },
  {
    "id": "s70",
    "first_name": "Daniel",
    "last_name": "Kebede",
    "age": 17,
    "gender": "Male",
    "grade": "10",
    "section": "B",
    "roll_number": "KR/10/B/070",
    "parent_phone": "+251913602213",
    "address": "Kera, Addis Ababa",
    "enrolled_date": "2025-09-01"
  },
  {
    "id": "s71",
    "first_name": "Sara",
    "last_name": "Worku",
    "age": 17,
    "gender": "Female",
    "grade": "10",
    "section": "B",
    "roll_number": "KR/10/B/071",
    "parent_phone": "+251912868726",
    "address": "Kera, Addis Ababa",
    "enrolled_date": "2025-09-01"
  },
  {
    "id": "s72",
    "first_name": "Solomon",
    "last_name": "Kebede",
    "age": 17,
    "gender": "Male",
    "grade": "10",
    "section": "B",
    "roll_number": "KR/10/B/072",
    "parent_phone": "+251913282082",
    "address": "Kera, Addis Ababa",
    "enrolled_date": "2025-09-01"
  },
  {
    "id": "s73",
    "first_name": "Tsion",
    "last_name": "Mekonnen",
    "age": 16,
    "gender": "Female",
    "grade": "10",
    "section": "B",
    "roll_number": "KR/10/B/073",
    "parent_phone": "+251918802180",
    "address": "Kera, Addis Ababa",
    "enrolled_date": "2025-09-01"
  },
  {
    "id": "s74",
    "first_name": "Endale",
    "last_name": "Tafesse",
    "age": 16,
    "gender": "Female",
    "grade": "10",
    "section": "B",
    "roll_number": "KR/10/B/074",
    "parent_phone": "+251913931081",
    "address": "Kera, Addis Ababa",
    "enrolled_date": "2025-09-01"
  },
  {
    "id": "s75",
    "first_name": "Meron",
    "last_name": "Yilma",
    "age": 17,
    "gender": "Female",
    "grade": "10",
    "section": "B",
    "roll_number": "KR/10/B/075",
    "parent_phone": "+251918237656",
    "address": "Kera, Addis Ababa",
    "enrolled_date": "2025-09-01"
  },
  {
    "id": "s76",
    "first_name": "Kidus",
    "last_name": "Amare",
    "age": 16,
    "gender": "Male",
    "grade": "10",
    "section": "B",
    "roll_number": "KR/10/B/076",
    "parent_phone": "+251911419124",
    "address": "Kera, Addis Ababa",
    "enrolled_date": "2025-09-01"
  },
  {
    "id": "s77",
    "first_name": "Martha",
    "last_name": "Tesfaye",
    "age": 17,
    "gender": "Female",
    "grade": "10",
    "section": "B",
    "roll_number": "KR/10/B/077",
    "parent_phone": "+251919624812",
    "address": "Kera, Addis Ababa",
    "enrolled_date": "2025-09-01"
  },
  {
    "id": "s78",
    "first_name": "Daniel",
    "last_name": "Gebremeskel",
    "age": 16,
    "gender": "Male",
    "grade": "10",
    "section": "B",
    "roll_number": "KR/10/B/078",
    "parent_phone": "+251913727138",
    "address": "Kera, Addis Ababa",
    "enrolled_date": "2025-09-01"
  },
  {
    "id": "s79",
    "first_name": "Meron",
    "last_name": "Adane",
    "age": 17,
    "gender": "Male",
    "grade": "10",
    "section": "B",
    "roll_number": "KR/10/B/079",
    "parent_phone": "+251916326426",
    "address": "Kera, Addis Ababa",
    "enrolled_date": "2025-09-01"
  },
  {
    "id": "s80",
    "first_name": "Bekele",
    "last_name": "Destaw",
    "age": 16,
    "gender": "Male",
    "grade": "10",
    "section": "B",
    "roll_number": "KR/10/B/080",
    "parent_phone": "+251919643736",
    "address": "Kera, Addis Ababa",
    "enrolled_date": "2025-09-01"
  }
];
export const initialUsers: User[] = [
  {
    "id": "u1",
    "username": "admin",
    "password": "admin123",
    "role": "admin",
    "name": "Admin",
    "email": "admin@keraschool.et",
    "ref_id": "admin1"
  },
  {
    "id": "u2",
    "username": "ephrem.worku",
    "password": "teacher123",
    "role": "teacher",
    "name": "Ephrem Worku",
    "email": "ephrem.worku@keraschool.et",
    "ref_id": "t1"
  },
  {
    "id": "u3",
    "username": "hiwot.zewde",
    "password": "teacher123",
    "role": "teacher",
    "name": "Hiwot Zewde",
    "email": "hiwot.zewde@keraschool.et",
    "ref_id": "t2"
  },
  {
    "id": "u4",
    "username": "daniel.adane",
    "password": "teacher123",
    "role": "teacher",
    "name": "Daniel Adane",
    "email": "daniel.adane@keraschool.et",
    "ref_id": "t3"
  },
  {
    "id": "u5",
    "username": "kidist.bekele",
    "password": "teacher123",
    "role": "teacher",
    "name": "Kidist Bekele",
    "email": "kidist.bekele@keraschool.et",
    "ref_id": "t4"
  },
  {
    "id": "u6",
    "username": "abebe.zewde",
    "password": "teacher123",
    "role": "teacher",
    "name": "Abebe Zewde",
    "email": "abebe.zewde@keraschool.et",
    "ref_id": "t5"
  },
  {
    "id": "u7",
    "username": "worku.tilahun",
    "password": "teacher123",
    "role": "teacher",
    "name": "Worku Tilahun",
    "email": "worku.tilahun@keraschool.et",
    "ref_id": "t6"
  },
  {
    "id": "u8",
    "username": "hiwot.bizuneh",
    "password": "teacher123",
    "role": "teacher",
    "name": "Hiwot Bizuneh",
    "email": "hiwot.bizuneh@keraschool.et",
    "ref_id": "t7"
  },
  {
    "id": "u9",
    "username": "mahlet.fikre",
    "password": "teacher123",
    "role": "teacher",
    "name": "Mahlet Fikre",
    "email": "mahlet.fikre@keraschool.et",
    "ref_id": "t8"
  },
  {
    "id": "u10",
    "username": "bruktawit.bogale",
    "password": "teacher123",
    "role": "teacher",
    "name": "Bruktawit Bogale",
    "email": "bruktawit.bogale@keraschool.et",
    "ref_id": "t9"
  },
  {
    "id": "u11",
    "username": "rahel.tesfaye",
    "password": "teacher123",
    "role": "teacher",
    "name": "Rahel Tesfaye",
    "email": "rahel.tesfaye@keraschool.et",
    "ref_id": "t10"
  },
  {
    "id": "u12",
    "username": "rahel.belay",
    "password": "teacher123",
    "role": "teacher",
    "name": "Rahel Belay",
    "email": "rahel.belay@keraschool.et",
    "ref_id": "t11"
  },
  {
    "id": "u13",
    "username": "yonatan.goshu",
    "password": "teacher123",
    "role": "teacher",
    "name": "Yonatan Goshu",
    "email": "yonatan.goshu@keraschool.et",
    "ref_id": "t12"
  },
  {
    "id": "u14",
    "username": "tsion.wondimu",
    "password": "teacher123",
    "role": "teacher",
    "name": "Tsion Wondimu",
    "email": "tsion.wondimu@keraschool.et",
    "ref_id": "t13"
  },
  {
    "id": "u15",
    "username": "hiwot.mekonnen",
    "password": "teacher123",
    "role": "teacher",
    "name": "Hiwot Mekonnen",
    "email": "hiwot.mekonnen@keraschool.et",
    "ref_id": "t14"
  },
  {
    "id": "u16",
    "username": "aster.ashenafi",
    "password": "teacher123",
    "role": "teacher",
    "name": "Aster Ashenafi",
    "email": "aster.ashenafi@keraschool.et",
    "ref_id": "t15"
  },
  {
    "id": "u17",
    "username": "mekdes.tsegaye1",
    "password": "student123",
    "role": "student",
    "name": "Mekdes Tsegaye",
    "email": "mekdes.tsegaye1@keraschool.et",
    "ref_id": "s1"
  },
  {
    "id": "u18",
    "username": "kidist.desta2",
    "password": "student123",
    "role": "student",
    "name": "Kidist Desta",
    "email": "kidist.desta2@keraschool.et",
    "ref_id": "s2"
  },
  {
    "id": "u19",
    "username": "yonas.girma3",
    "password": "student123",
    "role": "student",
    "name": "Yonas Girma",
    "email": "yonas.girma3@keraschool.et",
    "ref_id": "s3"
  },
  {
    "id": "u20",
    "username": "hanna.bogale4",
    "password": "student123",
    "role": "student",
    "name": "Hanna Bogale",
    "email": "hanna.bogale4@keraschool.et",
    "ref_id": "s4"
  },
  {
    "id": "u21",
    "username": "ephrem.amare5",
    "password": "student123",
    "role": "student",
    "name": "Ephrem Amare",
    "email": "ephrem.amare5@keraschool.et",
    "ref_id": "s5"
  },
  {
    "id": "u22",
    "username": "sara.mekonnen6",
    "password": "student123",
    "role": "student",
    "name": "Sara Mekonnen",
    "email": "sara.mekonnen6@keraschool.et",
    "ref_id": "s6"
  },
  {
    "id": "u23",
    "username": "mekdes.fikre7",
    "password": "student123",
    "role": "student",
    "name": "Mekdes Fikre",
    "email": "mekdes.fikre7@keraschool.et",
    "ref_id": "s7"
  },
  {
    "id": "u24",
    "username": "mahlet.tefera8",
    "password": "student123",
    "role": "student",
    "name": "Mahlet Tefera",
    "email": "mahlet.tefera8@keraschool.et",
    "ref_id": "s8"
  },
  {
    "id": "u25",
    "username": "henok.adane9",
    "password": "student123",
    "role": "student",
    "name": "Henok Adane",
    "email": "henok.adane9@keraschool.et",
    "ref_id": "s9"
  },
  {
    "id": "u26",
    "username": "mekdes.hailemariam10",
    "password": "student123",
    "role": "student",
    "name": "Mekdes Hailemariam",
    "email": "mekdes.hailemariam10@keraschool.et",
    "ref_id": "s10"
  },
  {
    "id": "u27",
    "username": "nahom.amare11",
    "password": "student123",
    "role": "student",
    "name": "Nahom Amare",
    "email": "nahom.amare11@keraschool.et",
    "ref_id": "s11"
  },
  {
    "id": "u28",
    "username": "samuel.bekele12",
    "password": "student123",
    "role": "student",
    "name": "Samuel Bekele",
    "email": "samuel.bekele12@keraschool.et",
    "ref_id": "s12"
  },
  {
    "id": "u29",
    "username": "bekele.worku13",
    "password": "student123",
    "role": "student",
    "name": "Bekele Worku",
    "email": "bekele.worku13@keraschool.et",
    "ref_id": "s13"
  },
  {
    "id": "u30",
    "username": "worku.adane14",
    "password": "student123",
    "role": "student",
    "name": "Worku Adane",
    "email": "worku.adane14@keraschool.et",
    "ref_id": "s14"
  },
  {
    "id": "u31",
    "username": "dawit.belay15",
    "password": "student123",
    "role": "student",
    "name": "Dawit Belay",
    "email": "dawit.belay15@keraschool.et",
    "ref_id": "s15"
  },
  {
    "id": "u32",
    "username": "yonas.amare16",
    "password": "student123",
    "role": "student",
    "name": "Yonas Amare",
    "email": "yonas.amare16@keraschool.et",
    "ref_id": "s16"
  },
  {
    "id": "u33",
    "username": "tsegaye.getachew17",
    "password": "student123",
    "role": "student",
    "name": "Tsegaye Getachew",
    "email": "tsegaye.getachew17@keraschool.et",
    "ref_id": "s17"
  },
  {
    "id": "u34",
    "username": "hana.demeke18",
    "password": "student123",
    "role": "student",
    "name": "Hana Demeke",
    "email": "hana.demeke18@keraschool.et",
    "ref_id": "s18"
  },
  {
    "id": "u35",
    "username": "henok.tilahun19",
    "password": "student123",
    "role": "student",
    "name": "Henok Tilahun",
    "email": "henok.tilahun19@keraschool.et",
    "ref_id": "s19"
  },
  {
    "id": "u36",
    "username": "hiwot.abera20",
    "password": "student123",
    "role": "student",
    "name": "Hiwot Abera",
    "email": "hiwot.abera20@keraschool.et",
    "ref_id": "s20"
  },
  {
    "id": "u37",
    "username": "kidist.adane21",
    "password": "student123",
    "role": "student",
    "name": "Kidist Adane",
    "email": "kidist.adane21@keraschool.et",
    "ref_id": "s21"
  },
  {
    "id": "u38",
    "username": "worku.alemu22",
    "password": "student123",
    "role": "student",
    "name": "Worku Alemu",
    "email": "worku.alemu22@keraschool.et",
    "ref_id": "s22"
  },
  {
    "id": "u39",
    "username": "mekdes.belay23",
    "password": "student123",
    "role": "student",
    "name": "Mekdes Belay",
    "email": "mekdes.belay23@keraschool.et",
    "ref_id": "s23"
  },
  {
    "id": "u40",
    "username": "birhanu.adane24",
    "password": "student123",
    "role": "student",
    "name": "Birhanu Adane",
    "email": "birhanu.adane24@keraschool.et",
    "ref_id": "s24"
  },
  {
    "id": "u41",
    "username": "abel.tafesse25",
    "password": "student123",
    "role": "student",
    "name": "Abel Tafesse",
    "email": "abel.tafesse25@keraschool.et",
    "ref_id": "s25"
  },
  {
    "id": "u42",
    "username": "tesfaye.getachew26",
    "password": "student123",
    "role": "student",
    "name": "Tesfaye Getachew",
    "email": "tesfaye.getachew26@keraschool.et",
    "ref_id": "s26"
  },
  {
    "id": "u43",
    "username": "selamawit.hailemariam27",
    "password": "student123",
    "role": "student",
    "name": "Selamawit Hailemariam",
    "email": "selamawit.hailemariam27@keraschool.et",
    "ref_id": "s27"
  },
  {
    "id": "u44",
    "username": "kidist.goshu28",
    "password": "student123",
    "role": "student",
    "name": "Kidist Goshu",
    "email": "kidist.goshu28@keraschool.et",
    "ref_id": "s28"
  },
  {
    "id": "u45",
    "username": "hana.gebre29",
    "password": "student123",
    "role": "student",
    "name": "Hana Gebre",
    "email": "hana.gebre29@keraschool.et",
    "ref_id": "s29"
  },
  {
    "id": "u46",
    "username": "tigist.mekonnen30",
    "password": "student123",
    "role": "student",
    "name": "Tigist Mekonnen",
    "email": "tigist.mekonnen30@keraschool.et",
    "ref_id": "s30"
  },
  {
    "id": "u47",
    "username": "selamawit.kebede31",
    "password": "student123",
    "role": "student",
    "name": "Selamawit Kebede",
    "email": "selamawit.kebede31@keraschool.et",
    "ref_id": "s31"
  },
  {
    "id": "u48",
    "username": "feven.bekele32",
    "password": "student123",
    "role": "student",
    "name": "Feven Bekele",
    "email": "feven.bekele32@keraschool.et",
    "ref_id": "s32"
  },
  {
    "id": "u49",
    "username": "haile.gebremeskel33",
    "password": "student123",
    "role": "student",
    "name": "Haile Gebremeskel",
    "email": "haile.gebremeskel33@keraschool.et",
    "ref_id": "s33"
  },
  {
    "id": "u50",
    "username": "ruth.damte34",
    "password": "student123",
    "role": "student",
    "name": "Ruth Damte",
    "email": "ruth.damte34@keraschool.et",
    "ref_id": "s34"
  },
  {
    "id": "u51",
    "username": "tsion.tefera35",
    "password": "student123",
    "role": "student",
    "name": "Tsion Tefera",
    "email": "tsion.tefera35@keraschool.et",
    "ref_id": "s35"
  },
  {
    "id": "u52",
    "username": "haile.bogale36",
    "password": "student123",
    "role": "student",
    "name": "Haile Bogale",
    "email": "haile.bogale36@keraschool.et",
    "ref_id": "s36"
  },
  {
    "id": "u53",
    "username": "nahom.damte37",
    "password": "student123",
    "role": "student",
    "name": "Nahom Damte",
    "email": "nahom.damte37@keraschool.et",
    "ref_id": "s37"
  },
  {
    "id": "u54",
    "username": "frezewd.amare38",
    "password": "student123",
    "role": "student",
    "name": "Frezewd Amare",
    "email": "frezewd.amare38@keraschool.et",
    "ref_id": "s38"
  },
  {
    "id": "u55",
    "username": "tsion.belay39",
    "password": "student123",
    "role": "student",
    "name": "Tsion Belay",
    "email": "tsion.belay39@keraschool.et",
    "ref_id": "s39"
  },
  {
    "id": "u56",
    "username": "ruth.worku40",
    "password": "student123",
    "role": "student",
    "name": "Ruth Worku",
    "email": "ruth.worku40@keraschool.et",
    "ref_id": "s40"
  },
  {
    "id": "u57",
    "username": "hiwot.yilma41",
    "password": "student123",
    "role": "student",
    "name": "Hiwot Yilma",
    "email": "hiwot.yilma41@keraschool.et",
    "ref_id": "s41"
  },
  {
    "id": "u58",
    "username": "ephrem.abera42",
    "password": "student123",
    "role": "student",
    "name": "Ephrem Abera",
    "email": "ephrem.abera42@keraschool.et",
    "ref_id": "s42"
  },
  {
    "id": "u59",
    "username": "nebiyu.girma43",
    "password": "student123",
    "role": "student",
    "name": "Nebiyu Girma",
    "email": "nebiyu.girma43@keraschool.et",
    "ref_id": "s43"
  },
  {
    "id": "u60",
    "username": "mahlet.zewde44",
    "password": "student123",
    "role": "student",
    "name": "Mahlet Zewde",
    "email": "mahlet.zewde44@keraschool.et",
    "ref_id": "s44"
  },
  {
    "id": "u61",
    "username": "nahom.alemu45",
    "password": "student123",
    "role": "student",
    "name": "Nahom Alemu",
    "email": "nahom.alemu45@keraschool.et",
    "ref_id": "s45"
  },
  {
    "id": "u62",
    "username": "tsion.bogale46",
    "password": "student123",
    "role": "student",
    "name": "Tsion Bogale",
    "email": "tsion.bogale46@keraschool.et",
    "ref_id": "s46"
  },
  {
    "id": "u63",
    "username": "yonatan.abera47",
    "password": "student123",
    "role": "student",
    "name": "Yonatan Abera",
    "email": "yonatan.abera47@keraschool.et",
    "ref_id": "s47"
  },
  {
    "id": "u64",
    "username": "yonatan.getachew48",
    "password": "student123",
    "role": "student",
    "name": "Yonatan Getachew",
    "email": "yonatan.getachew48@keraschool.et",
    "ref_id": "s48"
  },
  {
    "id": "u65",
    "username": "solomon.alemu49",
    "password": "student123",
    "role": "student",
    "name": "Solomon Alemu",
    "email": "solomon.alemu49@keraschool.et",
    "ref_id": "s49"
  },
  {
    "id": "u66",
    "username": "tsion.wondimu50",
    "password": "student123",
    "role": "student",
    "name": "Tsion Wondimu",
    "email": "tsion.wondimu50@keraschool.et",
    "ref_id": "s50"
  },
  {
    "id": "u67",
    "username": "ermias.tilahun51",
    "password": "student123",
    "role": "student",
    "name": "Ermias Tilahun",
    "email": "ermias.tilahun51@keraschool.et",
    "ref_id": "s51"
  },
  {
    "id": "u68",
    "username": "abel.gebre52",
    "password": "student123",
    "role": "student",
    "name": "Abel Gebre",
    "email": "abel.gebre52@keraschool.et",
    "ref_id": "s52"
  },
  {
    "id": "u69",
    "username": "tsion.gizaw53",
    "password": "student123",
    "role": "student",
    "name": "Tsion Gizaw",
    "email": "tsion.gizaw53@keraschool.et",
    "ref_id": "s53"
  },
  {
    "id": "u70",
    "username": "fikadu.alemu54",
    "password": "student123",
    "role": "student",
    "name": "Fikadu Alemu",
    "email": "fikadu.alemu54@keraschool.et",
    "ref_id": "s54"
  },
  {
    "id": "u71",
    "username": "mulatu.goshu55",
    "password": "student123",
    "role": "student",
    "name": "Mulatu Goshu",
    "email": "mulatu.goshu55@keraschool.et",
    "ref_id": "s55"
  },
  {
    "id": "u72",
    "username": "selamawit.demeke56",
    "password": "student123",
    "role": "student",
    "name": "Selamawit Demeke",
    "email": "selamawit.demeke56@keraschool.et",
    "ref_id": "s56"
  },
  {
    "id": "u73",
    "username": "tsion.demeke57",
    "password": "student123",
    "role": "student",
    "name": "Tsion Demeke",
    "email": "tsion.demeke57@keraschool.et",
    "ref_id": "s57"
  },
  {
    "id": "u74",
    "username": "hiwot.ashenafi58",
    "password": "student123",
    "role": "student",
    "name": "Hiwot Ashenafi",
    "email": "hiwot.ashenafi58@keraschool.et",
    "ref_id": "s58"
  },
  {
    "id": "u75",
    "username": "hiwot.abera59",
    "password": "student123",
    "role": "student",
    "name": "Hiwot Abera",
    "email": "hiwot.abera59@keraschool.et",
    "ref_id": "s59"
  },
  {
    "id": "u76",
    "username": "yonas.goshu60",
    "password": "student123",
    "role": "student",
    "name": "Yonas Goshu",
    "email": "yonas.goshu60@keraschool.et",
    "ref_id": "s60"
  },
  {
    "id": "u77",
    "username": "nardos.alemu61",
    "password": "student123",
    "role": "student",
    "name": "Nardos Alemu",
    "email": "nardos.alemu61@keraschool.et",
    "ref_id": "s61"
  },
  {
    "id": "u78",
    "username": "aster.girma62",
    "password": "student123",
    "role": "student",
    "name": "Aster Girma",
    "email": "aster.girma62@keraschool.et",
    "ref_id": "s62"
  },
  {
    "id": "u79",
    "username": "eden.mekonen63",
    "password": "student123",
    "role": "student",
    "name": "Eden Mekonen",
    "email": "eden.mekonen63@keraschool.et",
    "ref_id": "s63"
  },
  {
    "id": "u80",
    "username": "hana.berhanu64",
    "password": "student123",
    "role": "student",
    "name": "Hana Berhanu",
    "email": "hana.berhanu64@keraschool.et",
    "ref_id": "s64"
  },
  {
    "id": "u81",
    "username": "mulatu.bekele65",
    "password": "student123",
    "role": "student",
    "name": "Mulatu Bekele",
    "email": "mulatu.bekele65@keraschool.et",
    "ref_id": "s65"
  },
  {
    "id": "u82",
    "username": "lidiya.amare66",
    "password": "student123",
    "role": "student",
    "name": "Lidiya Amare",
    "email": "lidiya.amare66@keraschool.et",
    "ref_id": "s66"
  },
  {
    "id": "u83",
    "username": "bekele.wondimu67",
    "password": "student123",
    "role": "student",
    "name": "Bekele Wondimu",
    "email": "bekele.wondimu67@keraschool.et",
    "ref_id": "s67"
  },
  {
    "id": "u84",
    "username": "alemu.mekonen68",
    "password": "student123",
    "role": "student",
    "name": "Alemu Mekonen",
    "email": "alemu.mekonen68@keraschool.et",
    "ref_id": "s68"
  },
  {
    "id": "u85",
    "username": "hana.demeke69",
    "password": "student123",
    "role": "student",
    "name": "Hana Demeke",
    "email": "hana.demeke69@keraschool.et",
    "ref_id": "s69"
  },
  {
    "id": "u86",
    "username": "daniel.kebede70",
    "password": "student123",
    "role": "student",
    "name": "Daniel Kebede",
    "email": "daniel.kebede70@keraschool.et",
    "ref_id": "s70"
  },
  {
    "id": "u87",
    "username": "sara.worku71",
    "password": "student123",
    "role": "student",
    "name": "Sara Worku",
    "email": "sara.worku71@keraschool.et",
    "ref_id": "s71"
  },
  {
    "id": "u88",
    "username": "solomon.kebede72",
    "password": "student123",
    "role": "student",
    "name": "Solomon Kebede",
    "email": "solomon.kebede72@keraschool.et",
    "ref_id": "s72"
  },
  {
    "id": "u89",
    "username": "tsion.mekonnen73",
    "password": "student123",
    "role": "student",
    "name": "Tsion Mekonnen",
    "email": "tsion.mekonnen73@keraschool.et",
    "ref_id": "s73"
  },
  {
    "id": "u90",
    "username": "endale.tafesse74",
    "password": "student123",
    "role": "student",
    "name": "Endale Tafesse",
    "email": "endale.tafesse74@keraschool.et",
    "ref_id": "s74"
  },
  {
    "id": "u91",
    "username": "meron.yilma75",
    "password": "student123",
    "role": "student",
    "name": "Meron Yilma",
    "email": "meron.yilma75@keraschool.et",
    "ref_id": "s75"
  },
  {
    "id": "u92",
    "username": "kidus.amare76",
    "password": "student123",
    "role": "student",
    "name": "Kidus Amare",
    "email": "kidus.amare76@keraschool.et",
    "ref_id": "s76"
  },
  {
    "id": "u93",
    "username": "martha.tesfaye77",
    "password": "student123",
    "role": "student",
    "name": "Martha Tesfaye",
    "email": "martha.tesfaye77@keraschool.et",
    "ref_id": "s77"
  },
  {
    "id": "u94",
    "username": "daniel.gebremeskel78",
    "password": "student123",
    "role": "student",
    "name": "Daniel Gebremeskel",
    "email": "daniel.gebremeskel78@keraschool.et",
    "ref_id": "s78"
  },
  {
    "id": "u95",
    "username": "meron.adane79",
    "password": "student123",
    "role": "student",
    "name": "Meron Adane",
    "email": "meron.adane79@keraschool.et",
    "ref_id": "s79"
  },
  {
    "id": "u96",
    "username": "bekele.destaw80",
    "password": "student123",
    "role": "student",
    "name": "Bekele Destaw",
    "email": "bekele.destaw80@keraschool.et",
    "ref_id": "s80"
  }
];

export const initialEnrollments: Enrollment[] = [];
initialStudents.forEach((student) => {
  const gradeSubjects = initialSubjects.filter(
    (sub) => sub.grade === student.grade
  );
  gradeSubjects.forEach((sub) => {
    initialEnrollments.push({
      id: Math.random().toString(36).substring(2, 10),
      student_id: student.id,
      subject_id: sub.id,
      academic_year: "2025/2026",
      semester: 1,
    });
  });
});

export const initialAttendance: AttendanceRecord[] = [];
export const initialMarks: Mark[] = [];

export interface AppState {
  students: Student[];
  teachers: Teacher[];
  subjects: Subject[];
  enrollments: Enrollment[];
  attendance: AttendanceRecord[];
  marks: Mark[];
  users: User[];
}

export const getInitialState = (): AppState => {
  try {
    const saved = localStorage.getItem("sms_data");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.students && parsed.teachers && parsed.subjects) {
        return parsed;
      }
    }
  } catch {}
  return {
    students: initialStudents,
    teachers: initialTeachers,
    subjects: initialSubjects,
    enrollments: initialEnrollments,
    attendance: initialAttendance,
    marks: initialMarks,
    users: initialUsers,
  };
};

export const saveState = (state: AppState) => {
  try {
    localStorage.setItem("sms_data", JSON.stringify(state));
  } catch {}
};
