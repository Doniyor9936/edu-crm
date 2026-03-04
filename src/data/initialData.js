// ===================== FOYDALANUVCHILAR =====================
export const USERS_INIT = [
  { id: 1, name: "Admin Karimov",      email: "admin@edu.uz",    password: "admin123", role: "admin",   avatar: "AK", phone: "+998901234567", status: "active" },
  { id: 2, name: "Dilnoza Ergasheva",  email: "dilnoza@edu.uz",  password: "123456",   role: "teacher", avatar: "DE", phone: "+998912345678", status: "active", courseIds: [1,3] },
  { id: 3, name: "Mansur Qodirov",     email: "mansur@edu.uz",   password: "123456",   role: "teacher", avatar: "MQ", phone: "+998923456789", status: "active", courseIds: [2] },
  { id: 4, name: "Sarvinoz Mirzayeva", email: "sarvinoz@edu.uz", password: "123456",   role: "staff",   avatar: "SM", phone: "+998934567890", status: "active" },
];

// ===================== KURSLAR =====================
export const INITIAL_COURSES = [
  { id: 1, name: "Ingliz tili (Boshlang'ich)", type: "offline", price: 350000, duration: "3 oy", teacherId: 2, status: "active",   schedule: "Dush, Chor, Juma 10:00", room: "201",    startDate: "2025-01-15" },
  { id: 2, name: "Matematika (O'rta)",          type: "offline", price: 300000, duration: "4 oy", teacherId: 3, status: "active",   schedule: "Sesh, Pay 14:00",         room: "105",    startDate: "2025-02-01" },
  { id: 3, name: "IELTS Tayyorlov",             type: "online",  price: 500000, duration: "6 oy", teacherId: 2, status: "active",   schedule: "Har kuni 09:00",          room: "Online", startDate: "2025-01-20" },
  { id: 4, name: "Python Dasturlash",           type: "online",  price: 450000, duration: "3 oy", teacherId: null, status: "archived", schedule: "Sesh, Pay, Shan 16:00", room: "Online", startDate: "2024-09-01" },
];

// ===================== TALABALAR =====================
export const INITIAL_STUDENTS = [
  { id: 1, name: "Alibek Karimov",    phone: "+998901001001", email: "alibek@mail.uz",  courseIds: [1,3], status: "active",   joinDate: "2025-01-15", balance: 0,       qr: "STD-001", points: 320 },
  { id: 2, name: "Malika Yusupova",   phone: "+998902002002", email: "malika@mail.uz",  courseIds: [1],   status: "active",   joinDate: "2025-01-16", balance: -350000, qr: "STD-002", points: 180 },
  { id: 3, name: "Jasur Toshmatov",   phone: "+998903003003", email: "jasur@mail.uz",   courseIds: [2],   status: "active",   joinDate: "2025-02-01", balance: 0,       qr: "STD-003", points: 450 },
  { id: 4, name: "Nilufar Rashidova", phone: "+998904004004", email: "nilufar@mail.uz", courseIds: [3],   status: "active",   joinDate: "2025-01-20", balance: 0,       qr: "STD-004", points: 290 },
  { id: 5, name: "Bobur Hamidov",     phone: "+998905005005", email: "bobur@mail.uz",   courseIds: [1,2], status: "inactive", joinDate: "2024-11-10", balance: -300000, qr: "STD-005", points: 60  },
  { id: 6, name: "Zulfiya Nazarova",  phone: "+998906006006", email: "zulfiya@mail.uz", courseIds: [2,3], status: "active",   joinDate: "2025-02-05", balance: 0,       qr: "STD-006", points: 510 },
  { id: 7, name: "Sherzod Tursunov",  phone: "+998907007007", email: "sherzod@mail.uz", courseIds: [1],   status: "active",   joinDate: "2025-01-18", balance: -350000, qr: "STD-007", points: 130 },
];

// ===================== TO'LOVLAR =====================
export const INITIAL_PAYMENTS = [
  { id: 1,  studentId: 1, courseId: 1, amount: 350000, date: "2025-03-01", method: "naqd",  note: "",          status: "paid" },
  { id: 2,  studentId: 1, courseId: 3, amount: 500000, date: "2025-03-01", method: "karta", note: "",          status: "paid" },
  { id: 3,  studentId: 2, courseId: 1, amount: 350000, date: "2025-03-01", method: "naqd",  note: "Kechikkan", status: "pending" },
  { id: 4,  studentId: 3, courseId: 2, amount: 300000, date: "2025-03-02", method: "naqd",  note: "",          status: "paid" },
  { id: 5,  studentId: 4, courseId: 3, amount: 500000, date: "2025-03-01", method: "karta", note: "",          status: "paid" },
  { id: 6,  studentId: 5, courseId: 1, amount: 350000, date: "2025-02-15", method: "naqd",  note: "",          status: "overdue" },
  { id: 7,  studentId: 5, courseId: 2, amount: 300000, date: "2025-02-15", method: "naqd",  note: "",          status: "overdue" },
  { id: 8,  studentId: 6, courseId: 2, amount: 300000, date: "2025-03-03", method: "karta", note: "",          status: "paid" },
  { id: 9,  studentId: 6, courseId: 3, amount: 500000, date: "2025-03-03", method: "karta", note: "",          status: "paid" },
  { id: 10, studentId: 7, courseId: 1, amount: 350000, date: "2025-03-02", method: "naqd",  note: "",          status: "pending" },
];

// ===================== RASXODLAR =====================
export const INITIAL_EXPENSES = [
  { id: 1, category: "Ijara",       amount: 3000000, date: "2025-03-01", note: "Mart oyi ijarasi",         createdBy: 1 },
  { id: 2, category: "Kommunal",    amount: 450000,  date: "2025-03-02", note: "Elektr va suv",            createdBy: 4 },
  { id: 3, category: "Ish haqi",    amount: 5500000, date: "2025-03-05", note: "O'qituvchilar ish haqi",  createdBy: 1 },
  { id: 4, category: "Jihozlar",    amount: 800000,  date: "2025-02-20", note: "Marker va doskalar",       createdBy: 4 },
  { id: 5, category: "Marketing",   amount: 600000,  date: "2025-02-25", note: "Instagram reklama",        createdBy: 1 },
  { id: 6, category: "Boshqa",      amount: 200000,  date: "2025-03-03", note: "Kantselyariya buyumlari",  createdBy: 4 },
];

// ===================== SOVG'ALAR (GAMIFIKATSIYA) =====================
export const INITIAL_REWARDS = [
  { id: 1, name: "Kitob sovg'a",        points: 100, icon: "📚", stock: 10, claimed: 2,  description: "Istalgan kitob sovg'a" },
  { id: 2, name: "Kino chipta",          points: 200, icon: "🎬", stock: 5,  claimed: 1,  description: "Kinoteatra 2 ta chipta" },
  { id: 3, name: "Kurs chegirmasi 20%",  points: 300, icon: "🎓", stock: 15, claimed: 3,  description: "Keyingi oy kursga 20% chegirma" },
  { id: 4, name: "Smartfon qoplamasi",   points: 250, icon: "📱", stock: 8,  claimed: 0,  description: "Brend smartfon qoplamasi" },
  { id: 5, name: "Yakshanba sertifikat", points: 500, icon: "🏆", stock: 3,  claimed: 1,  description: "O'quv markaz nomidan maxsus sertifikat" },
  { id: 6, name: "Kafeye sertifikat",    points: 150, icon: "☕", stock: 20, claimed: 5,  description: "50,000 so'mlik kafe sertifikati" },
];

// ===================== BAL TARIXI =====================
export const INITIAL_POINT_HISTORY = [
  { id: 1, studentId: 1, points: 50,  reason: "Darsda faol ishtirok",    date: "2025-03-01", type: "earn",  givenBy: 2 },
  { id: 2, studentId: 1, points: 100, reason: "Olimpiadada 1-o'rin",     date: "2025-03-02", type: "earn",  givenBy: 1 },
  { id: 3, studentId: 3, points: 150, reason: "Barcha topshiriqlar 100%", date: "2025-03-01", type: "earn",  givenBy: 3 },
  { id: 4, studentId: 6, points: 200, reason: "Oyning eng faol talabasi", date: "2025-03-03", type: "earn",  givenBy: 1 },
  { id: 5, studentId: 6, points: -200, reason: "Kino chipta oldi",       date: "2025-03-03", type: "redeem", givenBy: 1 },
  { id: 6, studentId: 2, points: 80,  reason: "Uy vazifalarini topshirdi",date: "2025-03-02", type: "earn",  givenBy: 2 },
  { id: 7, studentId: 3, points: 100, reason: "Test sinovida 95 ball",   date: "2025-03-04", type: "earn",  givenBy: 3 },
  { id: 8, studentId: 4, points: 90,  reason: "Darsda faol ishtirok",    date: "2025-03-03", type: "earn",  givenBy: 2 },
];

// ===================== AUDIT LOG =====================
export const AUDIT_LOG_INIT = [
  { id: 1, userId: 1, action: "Tizimga kirdi",            target: "",                  time: "2025-03-04 08:00" },
  { id: 2, userId: 2, action: "Dars jadvalini yangiladi", target: "IELTS Tayyorlov",   time: "2025-03-04 09:15" },
  { id: 3, userId: 1, action: "Yangi talaba qo'shdi",     target: "Sherzod Tursunov",  time: "2025-03-04 10:30" },
];
