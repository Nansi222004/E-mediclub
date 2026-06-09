import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiDollarSign, FiShoppingBag, FiUsers, FiCalendar, 
  FiActivity, FiPackage, FiVideo, FiMapPin, FiAlertTriangle, 
  FiArrowUpRight, FiArrowDownRight, FiStar, FiPlus, 
  FiDownload, FiFileText, FiClock, FiX, FiCheck, 
  FiHeart, FiPhone, FiMessageSquare, FiSliders, FiEye, FiCheckCircle, FiPlusCircle, FiTrendingUp
} from 'react-icons/fi';

// Helper function to format Indian locale currencies
const formatIndianCurrency = (num) => {
  return "₹" + num.toLocaleString('en-IN');
};

export default function AdminDashboard() {
  const navigate = useNavigate();

  // Date Filter State (Pills from June 1st to June 7th)
  const [selectedDay, setSelectedDay] = useState(3); // Default June 3rd

  // --- MOCK DATA ---
  
  // Section 1 & 2 Stats
  const section1Stats = [
    { title: "Total Revenue", value: "₹12,45,800", change: "+18% this month", trend: "up", color: "text-emerald-600 bg-emerald-50", icon: FiDollarSign },
    { title: "Total Orders", value: "3,240", change: "+12% vs last month", trend: "up", color: "text-teal bg-teal-light/20", icon: FiShoppingBag },
    { title: "Active Doctors", value: "48", change: "+3 onboarded today", trend: "up", color: "text-blue-600 bg-blue-50", icon: FiHeart },
    { title: "Lab Bookings Today", value: "126", change: "+8% this week", trend: "up", color: "text-orange-600 bg-orange-50", icon: FiActivity }
  ];

  const section2Stats = [
    { title: "Medicines Sold", value: "8,920 units", change: "+22% demand spike", trend: "up", color: "text-emerald-600 bg-emerald-50", icon: FiPackage },
    { title: "Online Consultations", value: "310 bookings", change: "+15% vs yesterday", trend: "up", color: "text-blue-600 bg-blue-50", icon: FiVideo },
    { title: "Offline Consultations", value: "198 clinic visits", change: "+7% scheduling", trend: "up", color: "text-teal bg-teal-light/20", icon: FiMapPin },
    { title: "Pending Refunds", value: "14 tickets", change: "-2 resolved this hr", trend: "down", color: "text-amber-700 bg-amber-50", icon: FiAlertTriangle }
  ];

  // Section 3 Chart Data
  const revenueMonths = ['Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May'];
  const revenueData = {
    medicines: [120000, 150000, 180000, 210000, 250000, 280000],
    labTests: [80000, 90000, 110000, 130000, 160000, 180000],
    consultations: [50000, 60000, 75000, 90000, 110000, 120000]
  };

  // Section 4 Orders
  const [orders, setOrders] = useState([
    { id: '#ORD-1001', patient: 'Rajesh Kumar', category: 'Medicine', vendor: 'HealthRx Pharmacy', amount: 1250, status: 'Completed', date: '03 Jun 2026' },
    { id: '#ORD-1002', patient: 'Priya Patel', category: 'Lab', vendor: 'Medlife Labs', amount: 899, status: 'Confirmed', date: '03 Jun 2026' },
    { id: '#ORD-1003', patient: 'Ananya Singh', category: 'Consultation', vendor: 'CureWell Clinic', amount: 499, status: 'Pending', date: '02 Jun 2026' },
    { id: '#ORD-1004', patient: 'Amit Sharma', category: 'Medicine', vendor: 'Apollo Pharmacy', amount: 2100, status: 'Completed', date: '02 Jun 2026' },
    { id: '#ORD-1005', patient: 'Sunita Devi', category: 'Lab', vendor: 'Apollo Diagnostics', amount: 1500, status: 'Completed', date: '01 Jun 2026' },
    { id: '#ORD-1006', patient: 'Rahul Verma', category: 'Consultation', vendor: 'DocPrime', amount: 600, status: 'Cancelled', date: '01 Jun 2026' }
  ]);

  // Section 5 Appointments & Lab Bookings
  const [appointments, setAppointments] = useState([
    // June 1st Appointments
    {
      id: 'APT-110',
      doctorName: 'Dr. Ramesh Gupta',
      specialty: 'Cardiologist',
      patientName: 'Rohan Malhotra',
      timeSlot: '10:00 AM',
      date: 1,
      dob: '12 Jan 1968',
      gender: 'Male',
      weight: '82 Kg',
      regDate: '08 Jan 2022',
      history: ['CAD', 'Diabetes'],
      phone: '+91 91234 56789',
      email: 'rohan@email.com',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80',
      lastPrescriptions: ['Tab. Aspirin 75mg (daily)', 'Tab. Metformin 500mg'],
      type: 'Online',
      status: 'Done'
    },
    {
      id: 'APT-111',
      doctorName: 'Dr. Neha Sharma',
      specialty: 'Dermatologist',
      patientName: 'Sanjana Sen',
      timeSlot: '11:30 AM',
      date: 1,
      dob: '05 Sep 1983',
      gender: 'Female',
      weight: '68 Kg',
      regDate: '22 Feb 2022',
      history: ['PCOS', 'Acne Vulgaris'],
      phone: '+91 93456 78901',
      email: 'sanjana@email.com',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80',
      lastPrescriptions: ['Calamine Lotion (twice daily)', 'Tab. Spironolactone 50mg'],
      type: 'Offline',
      status: 'Done'
    },
    // June 2nd Appointments
    {
      id: 'APT-120',
      doctorName: 'Dr. S.K. Sen',
      specialty: 'General Physician',
      patientName: 'Karan Johar',
      timeSlot: '09:30 AM',
      date: 2,
      dob: '24 Mar 1992',
      gender: 'Male',
      weight: '72 Kg',
      regDate: '10 Dec 2021',
      history: ['Gastroenteritis', 'Hypertension'],
      phone: '+91 98765 43210',
      email: 'karan@email.com',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&h=150&q=80',
      lastPrescriptions: ['Tab. Pantocid 40mg (before breakfast)', 'Tab. Amlodipine 5mg'],
      type: 'Online',
      status: 'Done'
    },
    // June 3rd Appointments
    {
      id: 'APT-001',
      doctorName: 'Dr. Ramesh Gupta',
      specialty: 'Cardiologist',
      patientName: 'Amit Trivedi',
      timeSlot: '10:00 AM',
      date: 3,
      dob: '12 Jan 1968',
      gender: 'Male',
      weight: '82 Kg',
      regDate: '08 Jan 2022',
      history: ['CAD', 'Post-CABG', 'Hyperlipidemia'],
      phone: '+91 91234 56789',
      email: 'amit.trivedi@email.com',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&h=150&q=80',
      lastPrescriptions: ['Tab. Aspirin 75mg (daily)', 'Tab. Atorvastatin 20mg (nightly)', 'Tab. Metoprolol 25mg (twice daily)'],
      type: 'Online',
      status: 'Upcoming'
    },
    {
      id: 'APT-101',
      doctorName: 'Dr. Martin Deo',
      specialty: 'Cardiologist',
      patientName: 'M.J. Mical',
      timeSlot: '10:30 AM',
      date: 3,
      dob: '20 Aug 1975',
      gender: 'Male',
      weight: '78 Kg',
      regDate: '15 Nov 2021',
      history: ['Chronic Bronchitis', 'Type 2 Diabetes'],
      phone: '+91 98765 43210',
      email: 'mj.mical@email.com',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80',
      lastPrescriptions: ['Inhaler Budecort (2 puffs daily)', 'Tab. Metformin 500mg (twice daily after meals)'],
      type: 'Offline',
      status: 'In Progress'
    },
    {
      id: 'APT-202',
      doctorName: 'Dr. Neha Sharma',
      specialty: 'Dermatologist',
      patientName: 'Priya Sharma',
      timeSlot: '11:30 AM',
      date: 3,
      dob: '05 Sep 1983',
      gender: 'Female',
      weight: '68 Kg',
      regDate: '22 Feb 2022',
      history: ['Type 2 Diabetes', 'PCOS'],
      phone: '+91 93456 78901',
      email: 'priya.sharma@email.com',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80',
      lastPrescriptions: ['Tab. Metformin 1000mg ER (once daily with dinner)', 'Tab. Teneligliptin 20mg (once daily)'],
      type: 'Online',
      status: 'Upcoming'
    },
    {
      id: 'APT-102',
      doctorName: 'Dr. S.K. Sen',
      specialty: 'General Physician',
      patientName: 'Sanath Deo',
      timeSlot: '12:30 PM',
      date: 3,
      dob: '15 May 1989',
      gender: 'Male',
      weight: '69 Kg',
      regDate: '10 Dec 2021',
      history: ['Hypertension', 'Bronchial Asthma', 'Mild Heart Murmur'],
      phone: '+91 90876 54321',
      email: 'sanath.deo@email.com',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80',
      lastPrescriptions: ['Tab. Amlodipine 5mg (once daily)', 'Inhaler Albuterol (as needed for wheezing)'],
      type: 'Offline',
      status: 'Done'
    },
    {
      id: 'APT-103',
      doctorName: 'Dr. Anita Roy',
      specialty: 'Neurologist',
      patientName: 'Loeara Phanj',
      timeSlot: '01:00 PM',
      date: 3,
      dob: '24 Mar 1992',
      gender: 'Female',
      weight: '56 Kg',
      regDate: '04 Aug 2021',
      history: ['Migraine Aura', 'Chronic Anxiety'],
      phone: '+91 99887 76655',
      email: 'loeara.phanj@email.com',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&h=150&q=80',
      lastPrescriptions: ['Tab. Sumatriptan 50mg (upon migraine onset)', 'Tab. Propranolol 40mg (daily preventive)'],
      type: 'Online',
      status: 'Upcoming'
    },
    // June 4th Appointments
    {
      id: 'APT-301',
      doctorName: 'Dr. S.K. Sen',
      specialty: 'General Physician',
      patientName: 'Amit Trivedi',
      timeSlot: '09:00 AM',
      date: 4,
      dob: '12 Jan 1968',
      gender: 'Male',
      weight: '82 Kg',
      regDate: '08 Jan 2022',
      history: ['CAD'],
      phone: '+91 91234 56789',
      email: 'amit.trivedi@email.com',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&h=150&q=80',
      lastPrescriptions: ['Vitamins capsule (daily)'],
      type: 'Online',
      status: 'Upcoming'
    },
    // June 5th Appointments
    {
      id: 'APT-150',
      doctorName: 'Dr. Anita Roy',
      specialty: 'Neurologist',
      patientName: 'Sunita Devi',
      timeSlot: '12:00 PM',
      date: 5,
      dob: '20 Oct 1964',
      gender: 'Female',
      weight: '62 Kg',
      regDate: '19 May 2021',
      history: ['Hypothyroidism', 'Migraines'],
      phone: '+91 98675 43210',
      email: 'sunita@email.com',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&h=150&q=80',
      lastPrescriptions: ['Tab. Thyronorm 50mcg (once daily before breakfast)'],
      type: 'Offline',
      status: 'Upcoming'
    },
    // June 6th Appointments
    {
      id: 'APT-160',
      doctorName: 'Dr. Ramesh Gupta',
      specialty: 'Cardiologist',
      patientName: 'Amit Sharma',
      timeSlot: '02:00 PM',
      date: 6,
      dob: '12 Jan 1968',
      gender: 'Male',
      weight: '82 Kg',
      regDate: '08 Jan 2022',
      history: ['CAD', 'Mild Hypertension'],
      phone: '+91 91234 56789',
      email: 'amit.sharma@email.com',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&h=150&q=80',
      lastPrescriptions: ['Tab. Aspirin 75mg (daily)', 'Tab. Telmisartan 40mg'],
      type: 'Online',
      status: 'Upcoming'
    },
    // June 7th Appointments
    {
      id: 'APT-170',
      doctorName: 'Dr. S.K. Sen',
      specialty: 'General Physician',
      patientName: 'Rahul Verma',
      timeSlot: '04:00 PM',
      date: 7,
      dob: '15 May 1989',
      gender: 'Male',
      weight: '69 Kg',
      regDate: '10 Dec 2021',
      history: ['Hypertension', 'Obesity'],
      phone: '+91 90876 54321',
      email: 'rahul.verma@email.com',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80',
      lastPrescriptions: ['Tab. Metformin 500mg (twice daily after meals)'],
      type: 'Offline',
      status: 'Upcoming'
    }
  ]);

  const [labBookings, setLabBookings] = useState([
    // June 1st Lab Bookings
    { id: 'LAB-110', patientName: 'Rohan Malhotra', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100&q=80', testName: 'Complete Hemogram', lab: 'Apollo Diagnostics', dateTime: '01 Jun 2026, 09:00 AM', status: 'Confirmed', date: 1 },
    // June 2nd Lab Bookings
    { id: 'LAB-120', patientName: 'Karan Johar', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=100&h=100&q=80', testName: 'Vitamin D & B12 Panel', lab: 'SRL Diagnostics', dateTime: '02 Jun 2026, 09:45 AM', status: 'Confirmed', date: 2 },
    // June 3rd Lab Bookings
    { id: 'LAB-901', patientName: 'Rohan Malhotra', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100&q=80', testName: 'Complete Hemogram', lab: 'Apollo Diagnostics', dateTime: '03 Jun 2026, 09:00 AM', status: 'Pending', date: 3 },
    { id: 'LAB-902', patientName: 'Sanjana Sen', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100&q=80', testName: 'HbA1c & Blood Sugar', lab: 'Medlife Labs', dateTime: '03 Jun 2026, 10:30 AM', status: 'Pending', date: 3 },
    { id: 'LAB-903', patientName: 'Vikram Rathore', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&h=100&q=80', testName: 'Thyroid Profile (T3, T4, TSH)', lab: 'Pathkind Labs', dateTime: '03 Jun 2026, 11:00 AM', status: 'Confirmed', date: 3 },
    // June 4th Lab Bookings
    { id: 'LAB-904', patientName: 'Megha Kapoor', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100&q=80', testName: 'Lipid Profile', lab: 'Thyrocare', dateTime: '04 Jun 2026, 08:30 AM', status: 'Pending', date: 4 },
    { id: 'LAB-905', patientName: 'Karan Johar', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=100&h=100&q=80', testName: 'Vitamin D & B12 Panel', lab: 'SRL Diagnostics', dateTime: '04 Jun 2026, 09:45 AM', status: 'Confirmed', date: 4 },
    // June 5th Lab Bookings
    { id: 'LAB-150', patientName: 'Sunita Devi', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&h=100&q=80', testName: 'TSH Thyroid Screening', lab: 'Thyrocare', dateTime: '05 Jun 2026, 08:30 AM', status: 'Pending', date: 5 },
    // June 6th Lab Bookings
    { id: 'LAB-160', patientName: 'Amit Sharma', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=100&h=100&q=80', testName: 'Lipid Profile Core', lab: 'Pathkind Labs', dateTime: '06 Jun 2026, 09:00 AM', status: 'Pending', date: 6 },
    // June 7th Lab Bookings
    { id: 'LAB-170', patientName: 'Rahul Verma', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&h=100&q=80', testName: 'Complete Hemogram', lab: 'Medlife Labs', dateTime: '07 Jun 2026, 10:00 AM', status: 'Pending', date: 7 }
  ]);

  // Section 6 Vendors
  const [vendors, setVendors] = useState([
    { id: 'VND-01', name: 'HealthRx Pharmacy', type: 'Pharmacy', orders: 1240, rev: 482000, rate: 4.8, commission: 15 },
    { id: 'VND-02', name: 'Medlife Labs', type: 'Lab', orders: 890, rev: 312000, rate: 4.6, commission: 18 },
    { id: 'VND-03', name: 'CureWell Clinic', type: 'Clinic', orders: 560, rev: 224000, rate: 4.5, commission: 20 },
    { id: 'VND-04', name: 'Apollo Diagnostics', type: 'Lab', orders: 420, rev: 185000, rate: 4.7, commission: 12 },
    { id: 'VND-05', name: 'DocPrime', type: 'Clinic', orders: 310, rev: 115000, rate: 4.2, commission: 15 }
  ]);

  // Section 7 Column 3: Notifications / Alerts
  const notifications = [
    { text: "[CRITICAL] Payout failure for HealthRx Pharmacy due to bank gateway latency.", time: "2 mins ago", level: "red" },
    { text: "[WARNING] Doctor consultation appointment APT-202 is overdue by 15 mins.", time: "12 mins ago", level: "amber" },
    { text: "[SUCCESS] Settlement batch TXN-93821 successfully wired to CureWell.", time: "1 hr ago", level: "green" },
    { text: "[INFO] New vendor onboarding request received from Metro Labs.", time: "2 hrs ago", level: "green" },
    { text: "[CRITICAL] Critical medicine stock low alert: Budecort Inhaler at HealthRx.", time: "4 hrs ago", level: "red" }
  ];

  // --- INTERACTIVITY STATE ---
  const [toasts, setToasts] = useState([]);
  const triggerToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  // Selected Patient for Diagnostic Drawer
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const selectedPatient = appointments.find(a => a.id === selectedPatientId) || null;

  // Modals
  const [showCallModal, setShowCallModal] = useState(false);
  const [callTimer, setCallTimer] = useState(0);
  const [callConnected, setCallConnected] = useState(false);

  const [showChatModal, setShowChatModal] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { sender: 'patient', text: 'Hello Doctor, I felt slight dizziness after starting the Amlodipine 5mg. Should I be concerned?', time: 'Yesterday' },
    { sender: 'doctor', text: 'Hello Sanath. A minor headache or dizziness is common during the first few days as your body adapts. Make sure you take it at the same time daily and stay well hydrated. Are you monitoring your daily blood pressure?', time: 'Yesterday' }
  ]);
  const [patientTyping, setPatientTyping] = useState(false);

  const [showDocModal, setShowDocModal] = useState(false);
  const [activeDocTab, setActiveDocTab] = useState('Prescriptions');

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [vendorCommissionInput, setVendorCommissionInput] = useState(15);

  // Quick Actions Form Modals
  const [showAddMedicineModal, setShowAddMedicineModal] = useState(false);
  const [showAddLabTestModal, setShowAddLabTestModal] = useState(false);
  const [showAddDoctorModal, setShowAddDoctorModal] = useState(false);
  const [showDownloadLoader, setShowDownloadLoader] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);

  // SVG Chart states
  const [revenueHoverMonth, setRevenueHoverMonth] = useState(null);
  const [donutHoverCategory, setDonutHoverCategory] = useState(null);

  // --- USE EFFECTS ---
  // Telehealth call simulator
  useEffect(() => {
    let interval;
    if (showCallModal) {
      const connTimeout = setTimeout(() => {
        setCallConnected(true);
      }, 2000);

      interval = setInterval(() => {
        if (callConnected) {
          setCallTimer(prev => prev + 1);
        }
      }, 1000);

      return () => {
        clearTimeout(connTimeout);
        clearInterval(interval);
      };
    } else {
      setCallConnected(false);
      setCallTimer(0);
    }
  }, [showCallModal, callConnected]);

  // PDF report downloader
  useEffect(() => {
    let interval;
    if (showDownloadLoader) {
      interval = setInterval(() => {
        setDownloadProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              setShowDownloadLoader(false);
              setDownloadProgress(0);
              triggerToast('System Analytics PDF Report generated and downloaded successfully!');
            }, 550);
            return 100;
          }
          return prev + 20;
        });
      }, 150);
    }
    return () => clearInterval(interval);
  }, [showDownloadLoader]);

  // Handlers
  const handleUpdateOrderStatus = (orderId, newStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    triggerToast(`Order status for ${orderId} updated to ${newStatus}.`);
    setSelectedOrder(null);
  };

  const handleSaveVendorCommission = (vendorId) => {
    setVendors(prev => prev.map(v => v.id === vendorId ? { ...v, commission: parseFloat(vendorCommissionInput) } : v));
    triggerToast(`Commission rate updated to ${vendorCommissionInput}%.`);
    setSelectedVendor(null);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const newMsg = { sender: 'doctor', text: chatInput, time: 'Just Now' };
    setChatMessages(prev => [...prev, newMsg]);
    const typedText = chatInput;
    setChatInput('');
    setPatientTyping(true);

    setTimeout(() => {
      setPatientTyping(false);
      let replyText = "Understood, doctor. I will continue checking my blood pressure daily and keep you updated. Thank you!";
      if (typedText.toLowerCase().includes('dizzy') || typedText.toLowerCase().includes('headache')) {
        replyText = "Yes, doctor. The dizziness has reduced today. I will check my BP again in the evening.";
      }
      setChatMessages(prev => [...prev, { sender: 'patient', text: replyText, time: 'Just Now' }]);
      triggerToast(`New message from ${selectedPatient?.patientName || 'Patient'}`);
    }, 2000);
  };

  const toggleLabBookingStatus = (bookingId, currentStatus) => {
    const nextStatus = currentStatus === 'Pending' ? 'Confirmed' : 'Pending';
    setLabBookings(prev => prev.map(lab => lab.id === bookingId ? { ...lab, status: nextStatus } : lab));
    triggerToast(`Lab booking ${bookingId} marked as ${nextStatus}.`);
  };

  // SVG Line Chart Helpers (r=45, center=75,75)
  const lineChartWidth = 500;
  const lineChartHeight = 180;
  const lineChartPadding = 25;

  const getX = (index) => {
    const w = lineChartWidth - lineChartPadding * 2;
    return lineChartPadding + index * (w / 5);
  };

  const getLineY = (val) => {
    const maxVal = 300000;
    const h = lineChartHeight - lineChartPadding * 2;
    return lineChartHeight - lineChartPadding - (val / maxVal) * h;
  };

  const buildPath = (dataArray) => {
    return dataArray.map((val, idx) => `${idx === 0 ? 'M' : 'L'} ${getX(idx)} ${getLineY(val)}`).join(' ');
  };

  // SVG Donut Chart Helpers
  const radius = 45;
  const circumference = 2 * Math.PI * radius; // ~282.7
  let currentOffset = 0;

  // Filtered lists by selectedDay
  const filteredAppointments = appointments.filter(a => a.date === selectedDay);
  const filteredLabBookings = labBookings.filter(lab => lab.date === selectedDay);

  return (
    <div className="flex flex-col gap-6 animate-fade-in font-sans pb-16 bg-[#F5F7FA] relative min-h-screen">
      
      {/* Date Filter & Title Row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-wide uppercase leading-none">Dashboard</h1>
          <p className="text-[10px] sm:text-xs text-slate-400 font-bold uppercase mt-2 tracking-wider">
            Consolidated clinical metrics, appointments, vendor payouts, and platform analytics.
          </p>
        </div>

        {/* Date Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 bg-white p-1.5 rounded-2xl border border-slate-100 shadow-2xs">
          <span className="text-[8.5px] text-slate-400 font-black uppercase px-2 tracking-wider">Schedule Query:</span>
          {[1, 2, 3, 4, 5, 6, 7].map(day => (
            <button
              key={day}
              type="button"
              onClick={() => {
                setSelectedDay(day);
                triggerToast(`Date filter loaded: June ${day}, 2026.`);
              }}
              className={`px-3 py-1 rounded-xl text-[11px] font-black transition-all cursor-pointer border-0 ${
                selectedDay === day 
                  ? 'bg-[#0D6E56] text-white shadow-sm' 
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-650'
              }`}
            >
              Jun {day}
            </button>
          ))}
        </div>
      </div>

      {/* ==================== SECTION 1 — TOP STATS BAR ==================== */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {section1Stats.map((stat, idx) => (
          <div key={idx} className="bg-white border border-slate-100 p-4 sm:p-5 rounded-3xl shadow-sm hover:shadow-md transition-all duration-150 flex items-center justify-between gap-4 hover:scale-[1.01]">
            <div className="min-w-0">
              <span className="text-[9px] sm:text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">{stat.title}</span>
              <h3 className="text-lg sm:text-2xl font-black text-slate-850 mt-1">{stat.value}</h3>
              <span className="text-[8.5px] sm:text-[9.5px] text-emerald-600 font-bold flex items-center gap-0.5 mt-2 bg-emerald-50 w-fit px-2 py-0.5 rounded-full">
                <FiArrowUpRight /> {stat.change}
              </span>
            </div>
            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl ${stat.color} flex items-center justify-center shrink-0 shadow-inner`}>
              <stat.icon className="text-lg sm:text-xl" />
            </div>
          </div>
        ))}
      </div>

      {/* ==================== SECTION 2 — SECOND STATS ROW ==================== */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {section2Stats.map((stat, idx) => (
          <div key={idx} className="bg-white border border-slate-100 p-4 sm:p-5 rounded-3xl shadow-sm hover:shadow-md transition-all duration-150 flex items-center justify-between gap-4 hover:scale-[1.01]">
            <div className="min-w-0">
              <span className="text-[9px] sm:text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">{stat.title}</span>
              <h3 className="text-lg sm:text-2xl font-black text-slate-850 mt-1">{stat.value}</h3>
              <span className={`text-[8.5px] sm:text-[9.5px] font-bold flex items-center gap-0.5 mt-2 w-fit px-2 py-0.5 rounded-full ${
                stat.trend === 'down' ? 'text-amber-600 bg-amber-50' : 'text-emerald-600 bg-emerald-50'
              }`}>
                {stat.trend === 'down' ? <FiArrowDownRight /> : <FiArrowUpRight />} {stat.change}
              </span>
            </div>
            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl ${stat.color} flex items-center justify-center shrink-0 shadow-inner`}>
              <stat.icon className="text-lg sm:text-xl" />
            </div>
          </div>
        ))}
      </div>

      {/* ==================== SECTION 3 — CHARTS ROW ==================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* LEFT: Revenue Overview (Line chart) */}
        <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-sm flex flex-col justify-between relative">
          <div className="flex items-center justify-between mb-4 border-b border-slate-50 pb-2">
            <div>
              <h3 className="text-xs font-black text-slate-850 uppercase tracking-widest">Revenue Overview</h3>
              <p className="text-[9.5px] text-slate-400 font-bold uppercase mt-0.5">Last 6 months revenue metrics across channels</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[9px] bg-teal/10 text-teal font-black uppercase px-2 py-0.5 rounded-full flex items-center gap-0.5"><FiTrendingUp /> Healthy Growth</span>
            </div>
          </div>

          <div className="relative w-full overflow-hidden">
            {/* Stable Tooltip Overlay centered horizontally, outside document flow */}
            <div 
              className={`absolute top-1 left-1/2 -translate-x-1/2 transition-all duration-150 pointer-events-none z-10 ${
                revenueHoverMonth !== null ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1'
              }`}
            >
              <span className="text-[8.5px] bg-slate-850/95 text-white font-extrabold px-3 py-1.5 rounded-xl shadow-lg whitespace-nowrap flex items-center gap-3 border border-slate-700/30">
                {revenueHoverMonth !== null && (
                  <>
                    <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[#0D6E56]" /> Meds: ₹{revenueData.medicines[revenueHoverMonth].toLocaleString()}</span>
                    <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[#3B82F6]" /> Labs: ₹{revenueData.labTests[revenueHoverMonth].toLocaleString()}</span>
                    <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[#F97316]" /> Consultations: ₹{revenueData.consultations[revenueHoverMonth].toLocaleString()}</span>
                  </>
                )}
              </span>
            </div>

            <svg viewBox={`0 0 ${lineChartWidth} ${lineChartHeight}`} className="w-full overflow-visible select-none">
              {/* Horizontal Gridlines */}
              {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
                const y = lineChartPadding + ratio * (lineChartHeight - lineChartPadding * 2);
                return (
                  <line 
                    key={idx} 
                    x1={lineChartPadding} 
                    y1={y} 
                    x2={lineChartWidth - lineChartPadding} 
                    y2={y} 
                    stroke="#F1F5F9" 
                    strokeWidth="1" 
                    strokeDasharray="4"
                  />
                );
              })}

              {/* Line 1: Medicines (Teal #0D6E56) */}
              <path 
                d={buildPath(revenueData.medicines)} 
                fill="none" 
                stroke="#0D6E56" 
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              {/* Line 2: Lab Tests (Blue #3B82F6) */}
              <path 
                d={buildPath(revenueData.labTests)} 
                fill="none" 
                stroke="#3B82F6" 
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              {/* Line 3: Consultations (Orange #F97316) */}
              <path 
                d={buildPath(revenueData.consultations)} 
                fill="none" 
                stroke="#F97316" 
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              {/* Interactive Hover Hotspots */}
              {revenueMonths.map((m, idx) => {
                const x = getX(idx);
                return (
                  <g key={idx}>
                    <line x1={x} y1={lineChartPadding} x2={x} y2={lineChartHeight - lineChartPadding} stroke="#E2E8F0" strokeWidth={revenueHoverMonth === idx ? "1.5" : "0"} strokeDasharray="3" />
                    <circle 
                      cx={x} 
                      cy={lineChartHeight / 2} 
                      r="20" 
                      fill="white"
                      fillOpacity="0"
                      className="cursor-pointer"
                      onMouseEnter={() => setRevenueHoverMonth(idx)}
                      onMouseLeave={() => setRevenueHoverMonth(null)}
                    />
                    <circle cx={x} cy={getLineY(revenueData.medicines[idx])} r="3" fill="#0D6E56" stroke="#fff" strokeWidth="1" />
                    <circle cx={x} cy={getLineY(revenueData.labTests[idx])} r="3" fill="#3B82F6" stroke="#fff" strokeWidth="1" />
                    <circle cx={x} cy={getLineY(revenueData.consultations[idx])} r="3" fill="#F97316" stroke="#fff" strokeWidth="1" />
                  </g>
                );
              })}

              {/* X Axis Labels */}
              {revenueMonths.map((m, idx) => (
                <text 
                  key={idx} 
                  x={getX(idx)} 
                  y={lineChartHeight - 4} 
                  textAnchor="middle" 
                  fill="#94A3B8" 
                  fontSize="8px" 
                  fontWeight="bold"
                >
                  {m}
                </text>
              ))}
            </svg>
          </div>

          <div className="flex flex-row flex-wrap gap-4 mt-3 text-[9px] font-black uppercase tracking-wider text-slate-500 border-t border-slate-50 pt-2.5">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-1 bg-[#0D6E56] rounded-full" />
              <span>Medicines</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-1 bg-[#3B82F6] rounded-full" />
              <span>Lab Tests</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-1 bg-[#F97316] rounded-full" />
              <span>Consultations</span>
            </div>
          </div>
        </div>

        {/* RIGHT: Orders by Category (Donut/pie chart) */}
        <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-sm flex flex-col justify-between items-center text-center">
          <div className="w-full text-left border-b border-slate-50 pb-2">
            <h3 className="text-xs font-black text-slate-850 uppercase tracking-widest">Orders by Category</h3>
            <p className="text-[9.5px] text-slate-400 font-bold uppercase mt-0.5">Order distribution split across platform offerings</p>
          </div>

          <div className="relative w-36 h-36 my-4 flex items-center justify-center">
            <svg width="120" height="120" className="transform -rotate-90">
              {/* Segment 1: Medicines (52%) */}
              <circle
                cx="60"
                cy="60"
                r={radius}
                fill="transparent"
                stroke="#0D6E56"
                strokeWidth="12"
                strokeDasharray={`${circumference * 0.52} ${circumference}`}
                strokeDashoffset="0"
                className="transition-all duration-150 cursor-pointer hover:stroke-[14px]"
                onMouseEnter={() => setDonutHoverCategory('Medicines')}
                onMouseLeave={() => setDonutHoverCategory(null)}
              />

              {/* Segment 2: Lab Tests (28%) */}
              <circle
                cx="60"
                cy="60"
                r={radius}
                fill="transparent"
                stroke="#3B82F6"
                strokeWidth="12"
                strokeDasharray={`${circumference * 0.28} ${circumference}`}
                strokeDashoffset={-(circumference * 0.52)}
                className="transition-all duration-150 cursor-pointer hover:stroke-[14px]"
                onMouseEnter={() => setDonutHoverCategory('Lab Tests')}
                onMouseLeave={() => setDonutHoverCategory(null)}
              />

              {/* Segment 3: Consultations (20%) */}
              <circle
                cx="60"
                cy="60"
                r={radius}
                fill="transparent"
                stroke="#F97316"
                strokeWidth="12"
                strokeDasharray={`${circumference * 0.20} ${circumference}`}
                strokeDashoffset={-(circumference * 0.80)}
                className="transition-all duration-150 cursor-pointer hover:stroke-[14px]"
                onMouseEnter={() => setDonutHoverCategory('Consultations')}
                onMouseLeave={() => setDonutHoverCategory(null)}
              />
            </svg>

            {/* Inner center text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-[8.5px] text-slate-400 font-extrabold uppercase tracking-widest">
                {donutHoverCategory || 'Total'}
              </span>
              <span className="text-sm font-black text-slate-800 mt-0.5">
                {donutHoverCategory === 'Medicines' ? '52%' : donutHoverCategory === 'Lab Tests' ? '28%' : donutHoverCategory === 'Consultations' ? '20%' : '3,240'}
              </span>
            </div>
          </div>

          {/* Donut Legend */}
          <div className="flex justify-around w-full text-[9px] font-black uppercase tracking-wider text-slate-500 border-t border-slate-50 pt-2.5">
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#0D6E56] block" />
              <span>Meds (52%)</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#3B82F6] block" />
              <span>Labs (28%)</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#F97316] block" />
              <span>Doctors (20%)</span>
            </div>
          </div>
        </div>

      </div>

      {/* ==================== SECTION 4 — RECENT ORDERS TABLE ==================== */}
      <section className="bg-white border border-slate-100 p-5 rounded-3xl shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-50 pb-3 mb-4">
          <div>
            <h3 className="text-xs font-black text-slate-850 uppercase tracking-widest">Recent Orders</h3>
            <p className="text-[9.5px] text-slate-400 font-bold uppercase mt-0.5">Auditing incoming transactions. Click row to modify invoice status.</p>
          </div>
          <span className="text-[8.5px] text-teal bg-teal-light/20 px-2 py-0.5 rounded font-black tracking-wider uppercase">
            Click row to Audit
          </span>
        </div>

        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-400 text-[8px] font-black uppercase tracking-widest">
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Patient Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Vendor Node</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Date</th>
              </tr>
            </thead>
            <tbody className="text-xs font-semibold text-slate-650 divide-y divide-slate-50/50">
              {orders.map((ord) => (
                <tr 
                  key={ord.id} 
                  onClick={() => setSelectedOrder(ord)}
                  className="hover:bg-[#0D6E56]/5 transition-colors cursor-pointer"
                >
                  <td className="py-3 px-4 font-extrabold text-slate-800">{ord.id}</td>
                  <td className="py-3 px-4 text-slate-800 font-bold">{ord.patient}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[8.5px] font-black uppercase tracking-wider ${
                      ord.category === 'Medicine' ? 'bg-emerald-50 text-emerald-600' : ord.category === 'Lab' ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'
                    }`}>
                      {ord.category}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-450">{ord.vendor}</td>
                  <td className="py-3 px-4 font-black text-slate-800">{formatIndianCurrency(ord.amount)}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider ${
                      ord.status === 'Completed' ? 'bg-emerald-50 text-emerald-600' : ord.status === 'Confirmed' ? 'bg-blue-50 text-blue-600' : ord.status === 'Cancelled' ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-650'
                    }`}>
                      {ord.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-400 text-[10px]">{ord.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ==================== SECTION 6 — VENDOR PERFORMANCE TABLE ==================== */}
      <section className="bg-white border border-slate-100 p-5 rounded-3xl shadow-sm">
        <div className="border-b border-slate-50 pb-3 mb-4">
          <h3 className="text-xs font-black text-slate-850 uppercase tracking-widest">Vendor Performance</h3>
          <p className="text-[9.5px] text-slate-400 font-bold uppercase mt-0.5">Commission settlements metrics. Click a row to adjust platform commission cut.</p>
        </div>

        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-400 text-[8px] font-black uppercase tracking-widest">
                <th className="py-3 px-4">Vendor Name</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Orders</th>
                <th className="py-3 px-4">Revenue Generated</th>
                <th className="py-3 px-4">Commission Rate</th>
                <th className="py-3 px-4">Rating</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="text-xs font-semibold text-slate-655 divide-y divide-slate-50/50">
              {vendors.map((vend) => (
                <tr 
                  key={vend.id} 
                  onClick={() => {
                    setSelectedVendor(vend);
                    setVendorCommissionInput(vend.commission);
                  }}
                  className="hover:bg-[#0D6E56]/5 transition-colors cursor-pointer"
                >
                  <td className="py-3 px-4 font-extrabold text-slate-800">{vend.name}</td>
                  <td className="py-3 px-4">
                    <span className="bg-slate-100 border border-slate-200/50 px-2.5 py-0.5 rounded-lg text-[9px] font-black text-slate-600 uppercase tracking-wide">
                      {vend.type}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-extrabold text-slate-700">{vend.orders.toLocaleString()}</td>
                  <td className="py-3 px-4 font-black text-slate-800">{formatIndianCurrency(vend.rev)}</td>
                  <td className="py-3 px-4 font-black text-[#0D6E56]">{vend.commission}% cut</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1 text-amber-500">
                      <FiStar className="fill-amber-500 text-[10px]" />
                      <span className="font-extrabold text-slate-800 text-[11px]">{vend.rate.toFixed(1)}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full text-[8.5px] font-black uppercase tracking-wider">Active Node</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ==================== SECTION 7 — BOTTOM ROW (3 columns) ==================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* COLUMN 1: Patient Activity (Bar Chart) */}
        <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-sm flex flex-col justify-between">
          <div className="border-b border-slate-50 pb-2 mb-4">
            <h3 className="text-xs font-black text-slate-850 uppercase tracking-wider">Patient Activity</h3>
            <p className="text-[9.5px] text-slate-400 font-bold uppercase mt-0.5">New Registrations in the last 7 days</p>
          </div>

          {/* SVG Bar Chart */}
          <div className="relative w-full h-32 flex items-end justify-between px-2">
            {[
              { day: 'M', val: 15 },
              { day: 'T', val: 24 },
              { day: 'W', val: 32 },
              { day: 'T', val: 20 },
              { day: 'F', val: 45 },
              { day: 'S', val: 18 },
              { day: 'S', val: 10 }
            ].map((bar, idx) => {
              const maxVal = 50;
              const percent = (bar.val / maxVal) * 100;
              return (
                <div key={idx} className="flex flex-col items-center gap-2 flex-1 group">
                  {/* Tooltip */}
                  <div className="opacity-0 group-hover:opacity-100 bg-slate-800 text-white text-[8px] font-black px-1.5 py-0.5 rounded absolute -top-4 transition-opacity duration-150">
                    {bar.val}
                  </div>
                  {/* Bar */}
                  <div className="w-5 bg-slate-100 hover:bg-teal-light rounded-t-lg h-24 flex items-end overflow-hidden transition-colors">
                    <div 
                      className="bg-[#0D6E56] rounded-t-lg w-full transition-all duration-500" 
                      style={{ height: `${percent}%` }}
                    />
                  </div>
                  <span className="text-[9px] text-slate-400 font-black">{bar.day}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* COLUMN 2: Quick Actions panel */}
        <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-sm flex flex-col gap-4">
          <div className="border-b border-slate-50 pb-2">
            <h3 className="text-xs font-black text-slate-850 uppercase tracking-wider">Quick Actions</h3>
            <p className="text-[9.5px] text-slate-400 font-bold uppercase mt-0.5">Shortcuts for administrative entries</p>
          </div>

          <div className="flex flex-col gap-2">
            <button 
              onClick={() => setShowAddMedicineModal(true)}
              className="w-full flex items-center justify-between px-4 py-2 bg-transparent border border-[#0D6E56]/30 hover:border-[#0D6E56] hover:bg-[#0D6E56]/5 text-slate-700 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all duration-150 cursor-pointer text-left"
            >
              <span>Add Medicine Formulation</span>
              <FiPackage className="text-[#0D6E56]" />
            </button>
            <button 
              onClick={() => setShowAddLabTestModal(true)}
              className="w-full flex items-center justify-between px-4 py-2 bg-transparent border border-[#0D6E56]/30 hover:border-[#0D6E56] hover:bg-[#0D6E56]/5 text-slate-700 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all duration-150 cursor-pointer text-left"
            >
              <span>Add Lab Test Panel</span>
              <FiActivity className="text-[#0D6E56]" />
            </button>
            <button 
              onClick={() => setShowAddDoctorModal(true)}
              className="w-full flex items-center justify-between px-4 py-2 bg-transparent border border-[#0D6E56]/30 hover:border-[#0D6E56] hover:bg-[#0D6E56]/5 text-slate-700 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all duration-150 cursor-pointer text-left"
            >
              <span>Add Doctor / Clinician</span>
              <FiHeart className="text-[#0D6E56]" />
            </button>
            <button 
              onClick={() => navigate('/admin/bookings')}
              className="w-full flex items-center justify-between px-4 py-2 bg-transparent border border-[#0D6E56]/30 hover:border-[#0D6E56] hover:bg-[#0D6E56]/5 text-slate-700 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all duration-150 cursor-pointer text-left"
            >
              <span>View All Bookings Tab</span>
              <FiCalendar className="text-[#0D6E56]" />
            </button>
            <button 
              onClick={() => setShowDownloadLoader(true)}
              className="w-full flex items-center justify-between px-4 py-2 bg-transparent border border-teal hover:bg-[#0D6E56] hover:text-white text-[#0D6E56] rounded-xl text-[10px] font-black uppercase tracking-wider transition-all duration-150 cursor-pointer text-left"
            >
              <span>Generate Audit PDF Report</span>
              <FiDownload />
            </button>
          </div>
        </div>

        {/* COLUMN 3: Notifications / Alerts Feed */}
        <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-sm flex flex-col gap-4">
          <div className="border-b border-slate-50 pb-2">
            <h3 className="text-xs font-black text-slate-850 uppercase tracking-wider">Alert Center</h3>
            <p className="text-[9.5px] text-slate-400 font-bold uppercase mt-0.5">Critical updates and system audit logs</p>
          </div>

          <div className="flex flex-col gap-3 max-h-56 overflow-y-auto no-scrollbar">
            {notifications.map((notif, idx) => (
              <div key={idx} className="flex gap-2.5 items-start p-1.5 hover:bg-slate-50 rounded-xl transition-colors">
                <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 animate-pulse ${
                  notif.level === 'red' ? 'bg-rose-500' : notif.level === 'amber' ? 'bg-amber-500' : 'bg-emerald-500'
                }`} />
                <div className="min-w-0">
                  <p className="text-[10px] font-bold text-slate-750 leading-snug">{notif.text}</p>
                  <span className="text-[8.5px] text-slate-400 font-bold mt-1 block uppercase tracking-wide">{notif.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ==================== FLOATING NOTIFICATION / TOASTS ==================== */}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              className={`p-4 rounded-2xl shadow-premium border flex items-center justify-between text-xs font-bold gap-3 pointer-events-auto ${
                t.type === 'error' 
                  ? 'bg-rose-50 border-rose-100 text-rose-700' 
                  : 'bg-emerald-50 border-emerald-100 text-emerald-700'
              }`}
            >
              <span>{t.message}</span>
              <button 
                onClick={() => setToasts(prev => prev.filter(toast => toast.id !== t.id))}
                className="text-slate-400 hover:text-slate-700 border-0 bg-transparent cursor-pointer"
              >
                <FiX className="text-sm shrink-0" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* ==================== SLIDE-OVER PATIENT DIAGNOSTIC SHEET ==================== */}
      <AnimatePresence>
        {selectedPatient && (
          <>
            {/* Backdrop overlay */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPatientId(null)}
              className="fixed inset-0 z-40 bg-slate-900/60"
            />
            
            {/* Slide-out Sheet Panel */}
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed top-0 right-0 z-50 h-screen w-full sm:w-[400px] bg-white border-l border-slate-100 shadow-premium p-6 flex flex-col justify-between overflow-y-auto"
            >
              <div>
                {/* Header Profile card */}
                <div className="flex gap-4 items-center border-b border-slate-100 pb-5 mb-5 justify-between">
                  <div className="flex gap-4 items-center">
                    <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-sm bg-slate-50 shrink-0">
                      <img src={selectedPatient.avatar} alt={selectedPatient.patientName} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h3 className="text-base font-black text-slate-800 leading-snug">{selectedPatient.patientName}</h3>
                      <span className="text-[9.5px] text-slate-400 font-bold block mt-1 uppercase">ID: {selectedPatient.id}</span>
                      <span className="text-[9px] text-[#0D6E56] font-black uppercase tracking-widest bg-[#0D6E56]/10 px-2 py-0.5 rounded mt-2 block w-fit">
                        Online Active
                      </span>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedPatientId(null)} 
                    className="p-1.5 hover:bg-slate-50 text-slate-450 hover:text-slate-700 rounded-xl transition-colors cursor-pointer border-0"
                  >
                    <FiX className="text-lg shrink-0" />
                  </button>
                </div>

                {/* Vitals Summary Grid */}
                <div className="grid grid-cols-2 gap-3 text-xs font-semibold text-slate-600 mb-5">
                  <div className="flex flex-col gap-1 bg-slate-50/50 p-3 rounded-2xl border border-slate-100">
                    <span className="text-[8.5px] text-slate-400 font-black uppercase tracking-wider">DOB</span>
                    <span className="font-extrabold text-slate-800">{selectedPatient.dob}</span>
                  </div>
                  <div className="flex flex-col gap-1 bg-slate-50/50 p-3 rounded-2xl border border-slate-100">
                    <span className="text-[8.5px] text-slate-400 font-black uppercase tracking-wider">Gender</span>
                    <span className="font-extrabold text-slate-800">{selectedPatient.gender}</span>
                  </div>
                  <div className="flex flex-col gap-1 bg-slate-50/50 p-3 rounded-2xl border border-slate-100">
                    <span className="text-[8.5px] text-slate-400 font-black uppercase tracking-wider">Weight</span>
                    <span className="font-extrabold text-slate-800">{selectedPatient.weight}</span>
                  </div>
                  <div className="flex flex-col gap-1 bg-slate-50/50 p-3 rounded-2xl border border-slate-100">
                    <span className="text-[8.5px] text-slate-400 font-black uppercase tracking-wider">Reg. Date</span>
                    <span className="font-extrabold text-slate-800">{selectedPatient.regDate}</span>
                  </div>
                </div>

                {/* Patient History Tags */}
                <div className="flex flex-col gap-2 mb-5">
                  <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest">Medical History</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedPatient.history.map((tag, i) => (
                      <span key={i} className="text-[8.5px] font-black bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full uppercase tracking-wider border border-blue-100">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Last Prescription details */}
                <div className="flex flex-col gap-2 bg-[#0D6E56]/5 border border-[#0D6E56]/10 p-4 rounded-3xl mb-5">
                  <span className="text-[9px] text-[#0D6E56] font-black uppercase tracking-widest flex items-center gap-1">
                    <FiFileText /> Current Prescriptions
                  </span>
                  <ul className="list-disc pl-4 text-[10.5px] text-slate-650 font-bold flex flex-col gap-1.5 leading-snug">
                    {selectedPatient.lastPrescriptions.map((pres, i) => (
                      <li key={i}>{pres}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Patient Contact Action controls */}
              <div className="flex gap-2 text-xs font-semibold text-slate-600 mt-4 border-t border-slate-100 pt-4 shrink-0">
                <button
                  onClick={() => setShowCallModal(true)}
                  className="flex-1 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl flex items-center justify-center gap-1.5 font-bold shadow-sm transition-all border-0 cursor-pointer outline-none"
                >
                  <FiPhone className="text-sm shrink-0" /> Call Patient
                </button>
                <button
                  onClick={() => setShowDocModal(true)}
                  className="p-3.5 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-2xl flex items-center justify-center transition-all border border-slate-100 cursor-pointer outline-none"
                  title="Medical Records"
                >
                  <FiFileText className="text-base shrink-0" />
                </button>
                <button
                  onClick={() => setShowChatModal(true)}
                  className="p-3.5 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-2xl flex items-center justify-center transition-all border border-slate-100 cursor-pointer outline-none"
                  title="Live Chat Advice"
                >
                  <FiMessageSquare className="text-base shrink-0" />
                </button>
              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ==================== INTERACTIVE DETAIL MODALS ==================== */}

      {/* 1. Telehealth Live Call */}
      <AnimatePresence>
        {showCallModal && selectedPatient && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/95 backdrop-blur-md z-[80] flex items-center justify-center p-4 text-white select-none"
          >
            <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-[32px] p-6 md:p-8 flex flex-col items-center justify-between min-h-[460px] shadow-2xl">
              
              <div className="w-full flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-teal animate-pulse" />
                  Live Tele-Consultation
                </span>
                <span>HIPAA Compliant</span>
              </div>

              <div className="flex flex-col items-center gap-4 mt-6">
                <div className="relative flex items-center justify-center">
                  {!callConnected && (
                    <>
                      <motion.div
                        animate={{ scale: [1, 1.8], opacity: [0.5, 0] }}
                        transition={{ repeat: Infinity, duration: 2, ease: "easeOut" }}
                        className="absolute w-20 h-20 rounded-full bg-teal/30"
                      />
                      <motion.div
                        animate={{ scale: [1, 1.4], opacity: [0.4, 0] }}
                        transition={{ repeat: Infinity, duration: 2, delay: 0.5, ease: "easeOut" }}
                        className="absolute w-20 h-20 rounded-full bg-teal/20"
                      />
                    </>
                  )}
                  {callConnected && (
                    <div className="absolute -inset-2 bg-gradient-to-r from-teal to-forest rounded-full opacity-35 blur animate-pulse" />
                  )}
                  <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-teal shadow-xl bg-slate-800 shrink-0 z-10">
                    <img src={selectedPatient.avatar} alt={selectedPatient.patientName} className="w-full h-full object-cover" />
                  </div>
                </div>

                <div className="text-center">
                  <h3 className="text-lg font-black tracking-wide">{selectedPatient.patientName}</h3>
                  <span className="text-[10px] text-slate-400 font-extrabold uppercase mt-1 block tracking-wider">{selectedPatient.phone}</span>
                  <p className="text-xs font-bold text-teal mt-3">
                    {!callConnected ? 'Calling secure telehealth gateway...' : 'Connected • Encryption Active'}
                  </p>
                </div>
              </div>

              <div className="w-full flex flex-col items-center gap-4 mt-4">
                {callConnected ? (
                  <>
                    <div className="text-2xl font-black font-mono text-emerald-400 tracking-wider">
                      {(() => {
                        const mins = Math.floor(callTimer / 60).toString().padStart(2, '0');
                        const secs = (callTimer % 60).toString().padStart(2, '0');
                        return `${mins}:${secs}`;
                      })()}
                    </div>
                    <div className="flex items-center gap-1.5 h-8">
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((bar) => (
                        <motion.div
                          key={bar}
                          animate={{ height: [8, Math.random() * 24 + 8, 8] }}
                          transition={{ repeat: Infinity, duration: 0.4 + Math.random() * 0.4 }}
                          className="w-1 bg-teal rounded-full"
                        />
                      ))}
                    </div>
                  </>
                ) : (
                  <span className="text-slate-450 text-xs italic">Dialing logs entry...</span>
                )}
              </div>

              <div className="mt-6">
                <button
                  onClick={() => {
                    setShowCallModal(false);
                    triggerToast(`Telehealth call with ${selectedPatient.patientName} logged in system.`);
                  }}
                  className="w-14 h-14 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center border-0 cursor-pointer shadow-lg transform active:scale-95 transition-all text-xl"
                  title="Hang Up"
                >
                  📞
                </button>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Interactive Live Chat Advice */}
      <AnimatePresence>
        {showChatModal && selectedPatient && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[80] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white rounded-[32px] overflow-hidden max-w-md w-full shadow-premium border border-slate-100 h-[500px] flex flex-col justify-between"
            >
              <div className="bg-gradient-to-r from-teal to-teal-dark p-4.5 text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={selectedPatient.avatar} alt={selectedPatient.patientName} className="w-9 h-9 rounded-full object-cover border border-white/20" />
                  <div>
                    <h3 className="font-extrabold text-xs uppercase tracking-wider">{selectedPatient.patientName}</h3>
                    <p className="text-[9px] text-teal-light/80 font-black uppercase mt-0.5">Clinical chat channel</p>
                  </div>
                </div>
                <button onClick={() => setShowChatModal(false)} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center border-0 cursor-pointer">
                  <FiX className="text-lg" />
                </button>
              </div>

              <div className="flex-1 p-4 overflow-y-auto bg-slate-50 flex flex-col gap-3">
                {chatMessages.map((msg, i) => {
                  const isDoctor = msg.sender === 'doctor';
                  return (
                    <div key={i} className={`flex flex-col max-w-[80%] ${isDoctor ? 'self-end items-end' : 'self-start items-start'}`}>
                      <div className={`p-3 rounded-2xl text-xs font-bold ${
                        isDoctor ? 'bg-[#0D6E56] text-white rounded-tr-none' : 'bg-white text-slate-805 rounded-tl-none border border-slate-100 shadow-2xs'
                      }`}>
                        {msg.text}
                      </div>
                      <span className="text-[8px] text-slate-400 font-bold mt-1 px-1">{msg.time}</span>
                    </div>
                  );
                })}
                {patientTyping && (
                  <div className="self-start bg-white border border-slate-100 p-2.5 rounded-2xl rounded-tl-none text-[10px] text-slate-400 font-bold italic shadow-2xs flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-350 animate-bounce" />
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-350 animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-350 animate-bounce [animation-delay:0.4s]" />
                  </div>
                )}
              </div>

              <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-slate-100 flex gap-2">
                <input
                  type="text"
                  placeholder="Type medical instructions..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  className="flex-1 px-4 py-2 border border-slate-200 focus:border-teal rounded-xl text-xs font-semibold outline-none"
                />
                <button type="submit" className="px-4 bg-[#0D6E56] hover:bg-[#0D6E56]/90 text-white rounded-xl text-xs font-black uppercase tracking-wider border-0 cursor-pointer">
                  Send
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. Document / Medical Records Viewer */}
      <AnimatePresence>
        {showDocModal && selectedPatient && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[80] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white rounded-[32px] overflow-hidden max-w-md w-full shadow-premium border border-slate-100 max-h-[85vh] flex flex-col"
            >
              <div className="bg-[#0D6E56] p-4 text-white flex items-center justify-between shrink-0">
                <h3 className="font-extrabold text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <FiFileText /> Clinical File Records
                </h3>
                <button onClick={() => setShowDocModal(false)} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center border-0 cursor-pointer">
                  <FiX className="text-lg" />
                </button>
              </div>

              <div className="flex border-b border-slate-100 text-center shrink-0">
                {['Prescriptions', 'Lab Reports', 'Scans'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveDocTab(tab)}
                    className={`flex-1 py-3 text-xs font-black uppercase tracking-wider border-b-2 transition-all cursor-pointer bg-transparent border-0 ${
                      activeDocTab === tab ? 'border-teal text-teal font-extrabold' : 'border-transparent text-slate-400 hover:text-slate-655'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="flex-1 p-5 overflow-y-auto flex flex-col gap-3 bg-slate-50 min-h-[250px]">
                {activeDocTab === 'Prescriptions' && (
                  <>
                    <div className="bg-white border border-slate-100 p-3.5 rounded-2xl shadow-2xs flex justify-between items-center gap-2">
                      <div className="min-w-0 text-left">
                        <h4 className="text-xs font-extrabold text-slate-805 truncate">Amlodipine_EHR_Jun2026.pdf</h4>
                        <span className="text-[9px] text-slate-400 font-bold block mt-1">Dr. S.K. Sen • 02 Jun 2026</span>
                      </div>
                      <button onClick={() => triggerToast('Prescription PDF loaded successfully.')} className="p-2 bg-slate-50 hover:bg-teal-light text-teal hover:text-teal-dark rounded-xl border-0 cursor-pointer"><FiEye /></button>
                    </div>
                    <div className="bg-white border border-slate-100 p-3.5 rounded-2xl shadow-2xs flex justify-between items-center gap-2">
                      <div className="min-w-0 text-left">
                        <h4 className="text-xs font-extrabold text-slate-805 truncate">Metformin_Registry_Audit.pdf</h4>
                        <span className="text-[9px] text-slate-400 font-bold block mt-1">Dr. Martin Deo • 15 May 2026</span>
                      </div>
                      <button onClick={() => triggerToast('Prescription PDF loaded successfully.')} className="p-2 bg-slate-50 hover:bg-teal-light text-teal hover:text-teal-dark rounded-xl border-0 cursor-pointer"><FiEye /></button>
                    </div>
                  </>
                )}
                {activeDocTab === 'Lab Reports' && (
                  <div className="bg-white border border-slate-100 p-3.5 rounded-2xl shadow-2xs flex justify-between items-center gap-2">
                    <div className="min-w-0 text-left">
                      <h4 className="text-xs font-extrabold text-slate-805 truncate">Complete_Hemogram_Apollo.pdf</h4>
                      <span className="text-[9px] text-slate-400 font-bold block mt-1">Apollo Diagnostics • NABL certified</span>
                    </div>
                    <button onClick={() => triggerToast('Lab Report PDF loaded.')} className="p-2 bg-slate-50 hover:bg-teal-light text-teal hover:text-teal-dark rounded-xl border-0 cursor-pointer"><FiEye /></button>
                  </div>
                )}
                {activeDocTab === 'Scans' && (
                  <div className="bg-white border border-slate-100 p-3.5 rounded-2xl shadow-2xs flex justify-between items-center gap-2">
                    <div className="min-w-0 text-left">
                      <h4 className="text-xs font-extrabold text-slate-805 truncate">Chest_Xray_Scan_Diagnostics.png</h4>
                      <span className="text-[9px] text-slate-400 font-bold block mt-1">Imaging Center • 28 Apr 2026</span>
                    </div>
                    <button onClick={() => triggerToast('Chest X-Ray PNG loaded.')} className="p-2 bg-slate-50 hover:bg-teal-light text-teal hover:text-teal-dark rounded-xl border-0 cursor-pointer"><FiEye /></button>
                  </div>
                )}
              </div>

              <div className="p-4 border-t border-slate-100 bg-white flex justify-end shrink-0">
                <button onClick={() => setShowDocModal(false)} className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl border-0 cursor-pointer">
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. Invoice / Order Details Modifier */}
      <AnimatePresence>
        {selectedOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[80] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white rounded-[32px] overflow-hidden max-w-md w-full shadow-premium border border-slate-100 text-left"
            >
              <div className="bg-[#0D6E56] p-4.5 text-white flex justify-between items-center">
                <div>
                  <h3 className="font-extrabold text-xs uppercase tracking-wider">Order Invoice Details</h3>
                  <span className="text-[9px] text-slate-300 font-bold">{selectedOrder.id} • {selectedOrder.date}</span>
                </div>
                <button onClick={() => setSelectedOrder(null)} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center border-0 cursor-pointer">
                  <FiX className="text-lg" />
                </button>
              </div>

              <div className="p-6 flex flex-col gap-4 text-xs font-bold text-slate-700">
                <div className="flex justify-between border-b border-slate-50 pb-2">
                  <span className="text-slate-400">Patient Name:</span>
                  <span className="text-slate-800 font-extrabold">{selectedOrder.patient}</span>
                </div>
                <div className="flex justify-between border-b border-slate-50 pb-2">
                  <span className="text-slate-400">Vendor Node:</span>
                  <span className="text-slate-800 font-extrabold">{selectedOrder.vendor}</span>
                </div>
                <div className="flex justify-between border-b border-slate-50 pb-2">
                  <span className="text-slate-400">Category:</span>
                  <span className="text-slate-850 font-extrabold uppercase">{selectedOrder.category}</span>
                </div>
                <div className="flex justify-between border-b border-slate-50 pb-2">
                  <span className="text-slate-400">Total Price:</span>
                  <span className="text-[#0D6E56] font-black text-sm">{formatIndianCurrency(selectedOrder.amount)}</span>
                </div>

                <div className="flex flex-col gap-1.5 mt-2">
                  <label className="text-[8.5px] font-black uppercase text-slate-400 tracking-wider">Audit Status Triage</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Completed', 'Confirmed', 'Pending', 'Cancelled'].map((stat) => (
                      <button
                        key={stat}
                        type="button"
                        onClick={() => handleUpdateOrderStatus(selectedOrder.id, stat)}
                        className={`py-2 border rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                          selectedOrder.status === stat 
                            ? 'bg-forest/10 border-forest text-forest font-extrabold' 
                            : 'bg-slate-50 border-slate-100 hover:border-slate-350 text-slate-500'
                        }`}
                      >
                        {stat}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-slate-50 bg-slate-50/50 flex justify-end">
                <button onClick={() => setSelectedOrder(null)} className="px-5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-xl border-0 cursor-pointer">
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 5. Vendor Details / Commission rate modifier */}
      <AnimatePresence>
        {selectedVendor && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[80] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white rounded-[32px] overflow-hidden max-w-md w-full shadow-premium border border-slate-100 text-left"
            >
              <div className="bg-[#0D6E56] p-4.5 text-white flex justify-between items-center">
                <div>
                  <h3 className="font-extrabold text-xs uppercase tracking-wider">Vendor Commission Settings</h3>
                  <span className="text-[9px] text-slate-300 font-bold">{selectedVendor.id} • {selectedVendor.name}</span>
                </div>
                <button onClick={() => setSelectedVendor(null)} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center border-0 cursor-pointer">
                  <FiX className="text-lg" />
                </button>
              </div>

              <div className="p-6 flex flex-col gap-4 text-xs font-bold text-slate-700">
                <div className="flex justify-between border-b border-slate-50 pb-2">
                  <span className="text-slate-400">Total Fulfilled Orders:</span>
                  <span className="text-slate-800 font-extrabold">{selectedVendor.orders.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-b border-slate-50 pb-2">
                  <span className="text-slate-400">Revenue Generated:</span>
                  <span className="text-slate-800 font-extrabold">{formatIndianCurrency(selectedVendor.rev)}</span>
                </div>

                <div className="flex flex-col gap-2.5 mt-2">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-400 tracking-wider">
                    <span>Platform Commission Cut</span>
                    <span className="text-teal font-black">{vendorCommissionInput}%</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="30"
                    step="1"
                    value={vendorCommissionInput}
                    onChange={(e) => setVendorCommissionInput(parseInt(e.target.value))}
                    className="w-full accent-[#0D6E56] cursor-pointer"
                  />
                  <p className="text-[9.5px] text-slate-450 font-bold leading-normal uppercase">
                    Platform takes this percentage of revenue from vendor settlements automatically.
                  </p>
                </div>
              </div>

              <div className="p-4 border-t border-slate-50 bg-slate-50/50 flex gap-2.5 justify-end">
                <button onClick={() => setSelectedVendor(null)} className="px-5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-705 text-xs font-bold rounded-xl border-0 cursor-pointer">
                  Cancel
                </button>
                <button onClick={() => handleSaveVendorCommission(selectedVendor.id)} className="px-5 py-2 bg-[#0D6E56] hover:bg-[#0D6E56]/90 text-white text-xs font-black uppercase rounded-xl border-0 cursor-pointer">
                  Save Changes
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 6. Quick Action: Add Medicine */}
      <AnimatePresence>
        {showAddMedicineModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[80] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white rounded-[32px] overflow-hidden max-w-md w-full shadow-premium border border-slate-100 text-left"
            >
              <div className="bg-[#0D6E56] p-4 text-white flex justify-between items-center">
                <h3 className="font-extrabold text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <FiPlusCircle /> Add Medicine Formulation
                </h3>
                <button onClick={() => setShowAddMedicineModal(false)} className="text-white hover:opacity-80 border-0 bg-transparent cursor-pointer">
                  <FiX className="text-lg" />
                </button>
              </div>

              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  setShowAddMedicineModal(false);
                  triggerToast('Medicine formulation registered successfully.');
                }}
                className="p-5 flex flex-col gap-3 text-xs font-bold text-slate-650"
              >
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] text-slate-400 uppercase">Product Formulation Name</label>
                  <input required type="text" placeholder="e.g. Paracetamol 650mg" className="px-3 py-2 border rounded-xl outline-none" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] text-slate-400 uppercase">Manufacturer / Brand</label>
                  <input required type="text" placeholder="e.g. Cipla Ltd" className="px-3 py-2 border rounded-xl outline-none" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] text-slate-400 uppercase">Pack Size</label>
                    <input required type="text" placeholder="e.g. Strip of 10 tablets" className="px-3 py-2 border rounded-xl outline-none" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] text-slate-400 uppercase">Therapy Class</label>
                    <select className="px-3 py-2 border rounded-xl outline-none bg-white">
                      <option value="Allopathy">Allopathy</option>
                      <option value="Ayurveda">Ayurveda</option>
                      <option value="Homeopathy">Homeopathy</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] text-slate-400 uppercase">MRP Price (INR)</label>
                    <input required type="number" placeholder="MRP Price" className="px-3 py-2 border rounded-xl outline-none" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] text-slate-400 uppercase">Discount (%)</label>
                    <input type="number" placeholder="e.g. 10" className="px-3 py-2 border rounded-xl outline-none" />
                  </div>
                </div>

                <div className="flex gap-2.5 mt-3 justify-end">
                  <button type="button" onClick={() => setShowAddMedicineModal(false)} className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl border-0 cursor-pointer">
                    Cancel
                  </button>
                  <button type="submit" className="px-5 py-2.5 bg-[#0D6E56] hover:bg-[#0D6E56]/90 text-white rounded-xl uppercase tracking-wider border-0 cursor-pointer">
                    Add Formulation
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 7. Quick Action: Add Lab Test */}
      <AnimatePresence>
        {showAddLabTestModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[80] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white rounded-[32px] overflow-hidden max-w-md w-full shadow-premium border border-slate-100 text-left"
            >
              <div className="bg-[#0D6E56] p-4 text-white flex justify-between items-center">
                <h3 className="font-extrabold text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <FiPlusCircle /> Create Lab Test Panel
                </h3>
                <button onClick={() => setShowAddLabTestModal(false)} className="text-white hover:opacity-80 border-0 bg-transparent cursor-pointer">
                  <FiX className="text-lg" />
                </button>
              </div>

              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  setShowAddLabTestModal(false);
                  triggerToast('Lab test panel created and added to clinical listings.');
                }}
                className="p-5 flex flex-col gap-3 text-xs font-bold text-slate-650"
              >
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] text-slate-400 uppercase">Test Package Name</label>
                  <input required type="text" placeholder="e.g. Basic Blood Screen" className="px-3 py-2 border rounded-xl outline-none" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] text-slate-400 uppercase">Instructions</label>
                  <input required type="text" placeholder="e.g. 12 hrs fasting required" className="px-3 py-2 border rounded-xl outline-none" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] text-slate-400 uppercase">MRP Price (INR)</label>
                    <input required type="number" placeholder="MRP Price" className="px-3 py-2 border rounded-xl outline-none" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] text-slate-400 uppercase">Report Delivery Time</label>
                    <input required type="text" placeholder="e.g. Reports in 24 Hrs" className="px-3 py-2 border rounded-xl outline-none" />
                  </div>
                </div>

                <div className="flex gap-2.5 mt-3 justify-end">
                  <button type="button" onClick={() => setShowAddLabTestModal(false)} className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl border-0 cursor-pointer">
                    Cancel
                  </button>
                  <button type="submit" className="px-5 py-2.5 bg-[#0D6E56] hover:bg-[#0D6E56]/90 text-white rounded-xl uppercase tracking-wider border-0 cursor-pointer">
                    Create Test
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 8. Quick Action: Add Doctor */}
      <AnimatePresence>
        {showAddDoctorModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[80] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white rounded-[32px] overflow-hidden max-w-md w-full shadow-premium border border-slate-100 text-left"
            >
              <div className="bg-[#0D6E56] p-4 text-white flex justify-between items-center">
                <h3 className="font-extrabold text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <FiPlusCircle /> Onboard Doctor/Clinician
                </h3>
                <button onClick={() => setShowAddDoctorModal(false)} className="text-white hover:opacity-80 border-0 bg-transparent cursor-pointer">
                  <FiX className="text-lg" />
                </button>
              </div>

              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  setShowAddDoctorModal(false);
                  triggerToast('Doctor registered successfully in clinician database.');
                }}
                className="p-5 flex flex-col gap-3 text-xs font-bold text-slate-655"
              >
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] text-slate-400 uppercase">Doctor Full Name</label>
                  <input required type="text" placeholder="Dr. " className="px-3 py-2 border rounded-xl outline-none" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] text-slate-400 uppercase">Clinician Specialty</label>
                    <input required type="text" placeholder="e.g. Pediatrician" className="px-3 py-2 border rounded-xl outline-none" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] text-slate-400 uppercase">License / Reg Number</label>
                    <input required type="text" placeholder="e.g. REG-9831" className="px-3 py-2 border rounded-xl outline-none" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] text-slate-400 uppercase">Experience (Years)</label>
                    <input required type="number" placeholder="Experience" className="px-3 py-2 border rounded-xl outline-none" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] text-slate-400 uppercase">Consultation Fee (INR)</label>
                    <input required type="number" placeholder="Fee in INR" className="px-3 py-2 border rounded-xl outline-none" />
                  </div>
                </div>

                <div className="flex gap-2.5 mt-3 justify-end">
                  <button type="button" onClick={() => setShowAddDoctorModal(false)} className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl border-0 cursor-pointer">
                    Cancel
                  </button>
                  <button type="submit" className="px-5 py-2.5 bg-[#0D6E56] hover:bg-[#0D6E56]/90 text-white rounded-xl uppercase tracking-wider border-0 cursor-pointer">
                    Onboard Clinician
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 9. Report Download Progress Loader Overlay */}
      <AnimatePresence>
        {showDownloadLoader && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[90] flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-3xl p-6 md:p-8 max-w-sm w-full shadow-premium text-center flex flex-col items-center gap-4">
              <div className="relative w-16 h-16 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-4 border-slate-100 border-t-[#0D6E56] animate-spin" />
                <span className="text-[11px] font-black text-[#0D6E56]">{downloadProgress}%</span>
              </div>
              <div>
                <h4 className="font-extrabold text-slate-800 text-sm">Generating Clinical Registry PDF...</h4>
                <p className="text-[10px] text-slate-400 font-bold mt-1.5 leading-normal uppercase">
                  Compiling clinical logs, vendor payouts, audit trails, and financial growth metrics.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
