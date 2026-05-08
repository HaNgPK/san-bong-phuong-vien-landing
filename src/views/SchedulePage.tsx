"use client";

import React, { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, ChevronLeft, ShieldCheck, Zap, Info, CalendarDays, ChevronRight, LayoutGrid, List } from 'lucide-react';
import Link from 'next/link';

type TimeSlot = {
  id: string;
  startTime: string;
  endTime: string;
  status: 'booked' | 'available' | 'maintenance';
  team1?: string;
  team2?: string;
};

type Shift = {
  id: string;
  name: string;
  timeRange: string;
  icon: React.ReactNode;
  description: string;
  feeType: string;
  features: string[];
};

const SHIFTS_INFO: Shift[] = [
  {
    id: 'hca',
    name: 'Giờ Hành Chính',
    timeRange: '05:00 - 17:00',
    icon: <Clock className="w-5 h-5 mb-1" />,
    description: 'Dành cho các hoạt động thể thao cá nhân, trường học hoặc các đoàn thể sinh hoạt ngoại khóa. Khu vực sân trống nhiều.',
    feeType: 'MIỄN PHÍ HOẶC PHỤ PHÍ NHẸ',
    features: ['Ánh sáng tự nhiên', 'Thoáng mát'],
  },
  {
    id: 'hpt',
    name: 'Giờ Phong Trào',
    timeRange: '17:00 - 18:00',
    icon: <Clock className="w-5 h-5 mb-1" />,
    description: 'Thời điểm vàng để các đội bóng giao lưu sau giờ làm việc. Cần đặt trước để đảm bảo có sân.',
    feeType: 'CÓ THU PHÍ (ĐỘI THUÊ)',
    features: ['Không khí sôi động', 'Có trọng tài (nếu cần)'],
  },
  {
    id: 'hld',
    name: 'Giờ Lên Đèn',
    timeRange: '18:00 - 22:00',
    icon: <CalendarDays className="w-5 h-5 mb-1" />,
    description: 'Dành cho các đội bóng giao lưu đặt trước. Toàn bộ kinh phí sung vào Quỹ Sân Bóng để duy trì tiền điện chiếu sáng và bảo dưỡng.',
    feeType: 'CÓ THU PHÍ (ĐỘI THUÊ)',
    features: ['Đảm bảo an ninh trật tự', 'Hệ thống đèn LED tự động'],
  }
];

// Helper functions for dates
const getDayName = (date: Date) => {
  const days = ['Chủ Nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
  return days[date.getDay()];
};

const formatDate = (date: Date) => {
  const d = date.getDate().toString().padStart(2, '0');
  const m = (date.getMonth() + 1).toString().padStart(2, '0');
  return `${d}/${m}`;
};

const isSameDay = (d1: Date, d2: Date) => {
  if (!d1 || !d2) return false;
  return d1.getDate() === d2.getDate() && d1.getMonth() === d2.getMonth() && d1.getFullYear() === d2.getFullYear();
};

export default function SchedulePage() {
  const [activeShift, setActiveShift] = useState<string>('hld');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const scrollRef = useRef<HTMLDivElement>(null);

  // Drag to scroll states
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftPos, setScrollLeftPos] = useState(0);

  // View modes
  const [viewMode, setViewMode] = useState<'week' | 'month'>('week');
  const [currentMonthDate, setCurrentMonthDate] = useState<Date>(new Date());

  // Generate 30 days starting from TODAY (no past dates) for week view
  const weekDays = useMemo(() => {
    const days = [];
    const today = new Date();
    for (let i = 0; i <= 30; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      days.push(d);
    }
    return days;
  }, []);

  // Generate month grid
  const monthDays = useMemo(() => {
    const year = currentMonthDate.getFullYear();
    const month = currentMonthDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay(); // 0 is Sunday
    
    const days: (Date | null)[] = [];
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  }, [currentMonthDate]);

  // Mock slot data generator based on date and shift
  const generateSlots = (shiftId: string, date: Date): TimeSlot[] => {
    if (date < new Date(new Date().setHours(0,0,0,0))) return []; // Past dates have no slots in this view

    const seed = date.getDate() + date.getMonth() * 31;
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    
    if (shiftId === 'hca') {
      return [
        { id: 'h1', startTime: '06:00', endTime: '07:30', status: seed % 2 === 0 ? 'booked' : 'available', team1: 'FC Thanh Niên', team2: 'FC Sinh Viên' },
        { id: 'h2', startTime: '07:30', endTime: '09:00', status: 'available' },
        { id: 'h3', startTime: '15:00', endTime: '17:00', status: isWeekend ? 'booked' : 'available', team1: 'Đội trẻ làng', team2: 'Trường THCS' },
      ];
    }
    
    if (shiftId === 'hpt') {
      return [
        { id: 'p1', startTime: '17:00', endTime: '18:00', status: seed % 3 === 0 ? 'available' : 'booked', team1: 'FC Văn Phòng', team2: 'FC Thanh Niên' },
      ];
    }
    
    // Giờ lên đèn
    if (isSameDay(date, new Date())) { // Today exact requested mock
       return [
         { id: 'ld1', startTime: '18:00', endTime: '19:30', status: 'booked', team1: 'FC 2000', team2: 'FC 2001' },
         { id: 'ld2', startTime: '19:30', endTime: '21:00', status: 'booked', team1: 'FC VLC', team2: 'FC Sky King' },
         { id: 'ld3', startTime: '21:00', endTime: '22:00', status: 'available' },
       ];
    }

    // Other days mock
    const slots: TimeSlot[] = [
      { id: 'ld1', startTime: '18:00', endTime: '19:30', status: seed % 4 === 0 ? 'available' : 'booked', team1: 'FC Đồng Hương', team2: 'FC Xóm Đạo' },
      { id: 'ld2', startTime: '19:30', endTime: '21:00', status: (seed + 1) % 3 === 0 ? 'available' : 'booked', team1: 'FC Anh Em', team2: 'FC Phố Huyện' },
      { id: 'ld3', startTime: '21:00', endTime: '22:00', status: isWeekend ? 'booked' : 'available', team1: 'FC Bô Lão', team2: 'FC Khách Mời' },
    ];
    return slots;
  };

  // Calculate booked counts for the selected shift on a specific date
  const getBookedCountForActiveShift = (date: Date) => {
    const slots = generateSlots(activeShift, date);
    return slots.filter(s => s.status === 'booked').length;
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeftPos(scrollRef.current.scrollLeft);
  };
  
  const handleMouseLeave = () => {
    setIsDragging(false);
  };
  
  const handleMouseUp = () => {
    setIsDragging(false);
  };
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Scroll speed multiplier
    scrollRef.current.scrollLeft = scrollLeftPos - walk;
  };

  const currentShift = SHIFTS_INFO.find(s => s.id === activeShift);
  const currentSlots = generateSlots(activeShift, selectedDate);

  const prevMonth = () => {
    const newDate = new Date(currentMonthDate);
    newDate.setMonth(newDate.getMonth() - 1);
    setCurrentMonthDate(newDate);
  };
  
  const nextMonth = () => {
    const newDate = new Date(currentMonthDate);
    newDate.setMonth(newDate.getMonth() + 1);
    setCurrentMonthDate(newDate);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="px-6 py-2 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-500 transition-colors shadow-sm text-sm">
            <ChevronLeft className="w-5 h-5 mr-1" />
            <span className="font-medium hidden sm:inline">Trang chủ</span>
          </Link>
          <h1 className="text-lg font-bold text-gray-800 flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-emerald-600" />
            Lịch Sử Dụng Sân
          </h1>
          <div className="w-10 sm:w-20" /> {/* Spacer for centering */}
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 pt-6">
        
        {/* Main Integrated Container */}
        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden mb-8">
          
          {/* Section 1: Timeline Visualization & Shift Tabs */}
          <div className="p-4 sm:p-6 lg:p-8 bg-white border-b border-gray-100">
            <div className="mb-8 relative hidden md:block">
               <div className="flex justify-between text-sm font-bold text-gray-400 mb-2 px-2 uppercase tracking-wider">
                 <span>05:00</span>
                 <span>17:00</span>
                 <span>18:00</span>
                 <span>22:00</span>
               </div>
               <div className="flex h-3 bg-gray-100 rounded-full overflow-hidden shadow-inner cursor-pointer p-0.5">
                 <div className={`w-[45%] rounded-full transition-colors border-r-2 border-white ${activeShift === 'hca' ? 'bg-sky-400' : 'bg-slate-200 hover:bg-slate-300'}`} onClick={() => setActiveShift('hca')} title="Giờ Hành Chính"></div>
                 <div className={`w-[15%] rounded-full transition-colors border-r-2 border-white ${activeShift === 'hpt' ? 'bg-amber-400' : 'bg-slate-300 hover:bg-slate-400'}`} onClick={() => setActiveShift('hpt')} title="Giờ Phong Trào"></div>
                 <div className={`w-[40%] rounded-full transition-colors ${activeShift === 'hld' ? 'bg-indigo-500' : 'bg-indigo-200 hover:bg-indigo-300'}`} onClick={() => setActiveShift('hld')} title="Giờ Lên Đèn"></div>
               </div>
            </div>

            {/* Shift Tabs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
              {SHIFTS_INFO.map((shift) => {
                const isActive = activeShift === shift.id;
                // Specific active colors based on shift
                let activeColor = 'text-indigo-700';
                let activeBorder = 'border-indigo-500';
                let activeBg = 'bg-indigo-50';
                let iconColor = 'text-indigo-600';

                if (shift.id === 'hca') {
                  activeColor = 'text-sky-700'; activeBorder = 'border-sky-500'; activeBg = 'bg-sky-50'; iconColor = 'text-sky-600';
                } else if (shift.id === 'hpt') {
                  activeColor = 'text-amber-700'; activeBorder = 'border-amber-500'; activeBg = 'bg-amber-50'; iconColor = 'text-amber-600';
                }

                return (
                  <button
                    key={shift.id}
                    onClick={() => setActiveShift(shift.id)}
                    className={`flex flex-col items-center justify-center p-4 sm:p-5 rounded-2xl border-2 transition-all duration-300 ${
                      isActive 
                        ? `${activeBorder} ${activeBg} shadow-md scale-[1.02] ${activeColor}` 
                        : 'border-transparent bg-gray-50 hover:bg-gray-100 text-gray-500'
                    }`}
                  >
                    <div className={`${isActive ? iconColor : 'text-gray-400'} mb-1`}>
                      {shift.icon}
                    </div>
                    <span className={`font-bold text-[15px] ${isActive ? activeColor : 'text-gray-700'}`}>
                      {shift.name}
                    </span>
                    <span className="text-xs mt-1 font-medium opacity-80">{shift.timeRange}</span>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="bg-slate-50/50">
            {/* Section 2: Shift Detail Mini Card */}
            <AnimatePresence mode="wait">
              {currentShift && (
                <motion.div
                  key={`info-${currentShift.id}`}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="px-4 sm:px-6 lg:px-8 pt-6 pb-4"
                >
                  <div className="flex flex-col md:flex-row gap-4 items-start bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex-1">
                       <h3 className="text-lg font-bold text-gray-800 mb-1 flex items-center">
                         Thông tin {currentShift.name}
                       </h3>
                       <p className="text-sm text-gray-600 leading-relaxed">
                         {currentShift.description}
                       </p>
                    </div>
                    <div className="shrink-0 flex flex-wrap gap-2 md:flex-col md:items-end">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-gray-100 text-gray-600 border border-gray-200">
                        {currentShift.feeType}
                      </span>
                      {currentShift.features.map((f, i) => (
                        <span key={i} className="inline-flex items-center text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
                          <ShieldCheck className="w-3 h-3 mr-1" /> {f}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Section 3: Date Picker / Month Grid */}
            <div className="px-4 sm:px-6 lg:px-8 py-6 bg-emerald-50/30 border-y border-emerald-100/50 relative">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
                <h2 className="text-lg font-bold text-gray-800 flex items-center">
                  <CalendarDays className="w-5 h-5 mr-2 text-emerald-600" />
                  Lịch Đặt Của {currentShift?.name}
                </h2>
                
                <div className="flex items-center gap-2">
                  {/* View Mode Toggle */}
                  <div className="flex bg-white rounded-lg p-1 border border-gray-200 shadow-sm">
                    <button 
                      onClick={() => setViewMode('week')}
                      className={`flex items-center px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${viewMode === 'week' ? 'bg-emerald-100 text-emerald-800' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                       <List className="w-4 h-4 mr-1.5" /> Dạng Trượt
                    </button>
                    <button 
                      onClick={() => setViewMode('month')}
                      className={`flex items-center px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${viewMode === 'month' ? 'bg-emerald-100 text-emerald-800' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                       <LayoutGrid className="w-4 h-4 mr-1.5" /> Xem Tháng
                    </button>
                  </div>

                  {viewMode === 'week' && (
                    <div className="hidden sm:flex gap-1 ml-2">
                      <button onClick={() => scroll('left')} className="p-2 rounded-full bg-white border border-gray-200 text-gray-500 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 transition-colors shadow-sm">
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button onClick={() => scroll('right')} className="p-2 rounded-full bg-white border border-gray-200 text-gray-500 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 transition-colors shadow-sm">
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
              
              {viewMode === 'week' ? (
                // Horizontal Weekly Carousel
                <div className="relative">
                  {/* Fade edges */}
                  <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-emerald-50/80 to-transparent z-10 pointer-events-none"></div>
                  <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-emerald-50/80 to-transparent z-10 pointer-events-none"></div>
                  
                  <div 
                    ref={scrollRef}
                    className={`flex space-x-3 overflow-x-auto pb-4 scrollbar-hide px-2 select-none ${isDragging ? 'cursor-grabbing snap-none' : 'cursor-grab snap-x'}`} 
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    onMouseDown={handleMouseDown}
                    onMouseLeave={handleMouseLeave}
                    onMouseUp={handleMouseUp}
                    onMouseMove={handleMouseMove}
                  >
                    {weekDays.map((date, idx) => {
                      const isSelected = isSameDay(date, selectedDate);
                      const isToday = isSameDay(date, new Date());
                      const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                      
                      // Now the booked count only reflects the active shift
                      const bookedCount = getBookedCountForActiveShift(date);
                      
                      return (
                        <button
                          key={idx}
                          onClick={() => setSelectedDate(date)}
                          className={`snap-start shrink-0 flex flex-col items-center relative justify-center w-[90px] h-[100px] rounded-2xl border-2 transition-all duration-200 ${
                            isSelected 
                              ? 'border-emerald-500 bg-emerald-500 text-white shadow-md scale-[1.02]' 
                              : isToday
                                ? 'border-emerald-200 bg-white text-emerald-800 hover:bg-emerald-50'
                                : 'border-gray-200 bg-white text-gray-600 hover:border-emerald-300 hover:bg-emerald-50'
                          }`}
                        >
                          <span className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-1 ${isSelected ? 'text-emerald-100' : isWeekend ? 'text-rose-500' : 'text-gray-500'}`}>
                            {isToday ? 'Hôm nay' : getDayName(date)}
                          </span>
                          <span className={`text-2xl sm:text-3xl font-black ${isSelected ? 'text-white' : 'text-gray-800'}`}>
                            {date.getDate()}
                          </span>
                          <span className={`text-[10px] font-medium ${isSelected ? 'text-emerald-100' : 'text-gray-400'}`}>
                            Tháng {date.getMonth() + 1}
                          </span>

                          {/* Booked Indicator - specifically for this shift */}
                          {bookedCount > 0 && (
                            <div className={`absolute -top-2 -right-2 text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                              isSelected 
                                ? 'bg-white text-emerald-600 border-emerald-100' 
                                : 'bg-emerald-100 text-emerald-700 border-white shadow-sm'
                            }`}>
                              {bookedCount} trận
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                // Full Month Grid View
                <motion.div 
                  initial={{ opacity: 0, y: -10 }} 
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl border border-emerald-200 shadow-sm overflow-hidden"
                >
                  {/* Month Header */}
                  <div className="flex items-center justify-between px-4 py-3 bg-emerald-500 text-white">
                    <button onClick={prevMonth} className="p-1.5 hover:bg-emerald-600 rounded-lg transition-colors">
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <div className="font-bold text-lg">
                      Tháng {currentMonthDate.getMonth() + 1}, {currentMonthDate.getFullYear()}
                    </div>
                    <button onClick={nextMonth} className="p-1.5 hover:bg-emerald-600 rounded-lg transition-colors">
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                  
                  {/* Days of week header */}
                  <div className="grid grid-cols-7 border-b border-gray-100 bg-gray-50">
                    {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map(d => (
                      <div key={d} className="py-2 text-center text-xs font-bold text-gray-500 uppercase">{d}</div>
                    ))}
                  </div>
                  
                  {/* Grid */}
                  <div className="grid grid-cols-7 gap-px bg-gray-100 p-px">
                    {monthDays.map((date, idx) => {
                      if (!date) return <div key={`empty-${idx}`} className="bg-white/50 min-h-[60px] sm:min-h-[80px]"></div>;
                      
                      const isSelected = isSameDay(date, selectedDate);
                      const isToday = isSameDay(date, new Date());
                      const isPast = date < new Date(new Date().setHours(0,0,0,0));
                      const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                      const bookedCount = getBookedCountForActiveShift(date);
                      
                      return (
                        <button
                          key={idx}
                          onClick={() => {
                            if (!isPast) setSelectedDate(date);
                          }}
                          disabled={isPast}
                          className={`min-h-[60px] sm:min-h-[80px] p-1.5 sm:p-2 flex flex-col relative transition-colors ${
                             isSelected ? 'bg-emerald-50 ring-2 ring-emerald-500 ring-inset z-10' : 'bg-white hover:bg-gray-50'
                          } ${isPast ? 'bg-gray-50/80 cursor-not-allowed opacity-60' : ''}`}
                        >
                          <div className="flex items-start justify-between w-full mb-1">
                             <span className={`text-xs sm:text-sm font-bold w-6 h-6 rounded-full flex items-center justify-center ${
                               isToday ? 'bg-emerald-500 text-white' :
                               isSelected ? 'text-emerald-700' : 
                               isWeekend ? 'text-rose-500' : 'text-gray-700'
                             }`}>
                               {date.getDate()}
                             </span>
                          </div>
                          
                          {bookedCount > 0 && !isPast && (
                            <div className="mt-auto w-full text-center">
                              <span className="inline-block bg-emerald-100 text-emerald-800 text-[9px] sm:text-[10px] font-bold px-1 py-0.5 rounded shadow-sm w-full truncate">
                                {bookedCount} trận
                              </span>
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Section 4: Schedule Slots Visualizer */}
            <div className="p-4 sm:p-6 lg:p-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <h3 className="text-xl font-bold text-gray-800 flex items-center">
                  Kết quả cho: <span className="text-emerald-600 ml-2">{isSameDay(selectedDate, new Date()) ? 'Hôm Nay' : `${getDayName(selectedDate)}, ${formatDate(selectedDate)}`}</span>
                </h3>
                
                <div className="flex items-center space-x-2 text-sm bg-white p-1.5 rounded-lg border border-gray-200 shadow-sm shrink-0">
                  <div className="flex items-center px-2 py-1">
                    <div className="w-3 h-3 rounded-full bg-emerald-500 mr-1.5 shadow-sm shadow-emerald-200"></div>
                    <span className="text-gray-700 font-bold">Đã đặt</span>
                  </div>
                  <div className="w-px h-4 bg-gray-200"></div>
                  <div className="flex items-center px-2 py-1">
                    <div className="w-3 h-3 rounded-full bg-white border-2 border-gray-300 mr-1.5"></div>
                    <span className="text-gray-500 font-medium">Trống</span>
                  </div>
                </div>
              </div>
              
              <div className="min-h-[200px]">
                <AnimatePresence mode="wait">
                  <motion.div 
                    key={`${selectedDate.toISOString()}-${activeShift}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4"
                  >
                    {currentSlots.length > 0 ? currentSlots.map((slot, index) => (
                      <motion.div 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        key={slot.id} 
                        className={`relative overflow-hidden rounded-2xl transition-all ${
                          slot.status === 'booked' 
                            ? 'bg-white border-2 border-emerald-100 shadow-md shadow-emerald-50/50 hover:border-emerald-200' 
                            : 'bg-white border-2 border-dashed border-gray-200 opacity-90 hover:opacity-100 hover:border-emerald-300'
                        }`}
                      >
                        {/* Status Indicator Bar */}
                        <div className={`absolute left-0 top-0 bottom-0 w-2 ${slot.status === 'booked' ? 'bg-emerald-500' : 'bg-gray-200'}`}></div>
                        
                        <div className="p-5 pl-7 flex flex-col sm:flex-row sm:items-center gap-4">
                          {/* Time */}
                          <div className="flex items-center sm:w-40 shrink-0">
                            <Clock className={`w-5 h-5 mr-2 ${slot.status === 'booked' ? 'text-emerald-600' : 'text-gray-400'}`} />
                            <span className={`font-black text-lg ${slot.status === 'booked' ? 'text-gray-900' : 'text-gray-500'}`}>
                              {slot.startTime} - {slot.endTime}
                            </span>
                          </div>
                          
                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            {slot.status === 'booked' ? (
                              <div className="flex items-center justify-between sm:justify-start gap-4">
                                 <div className="flex items-center bg-gray-50 px-4 py-2 rounded-xl border border-gray-100 w-full sm:w-auto">
                                   <div className="font-bold text-gray-800 text-lg truncate max-w-[120px] sm:max-w-[200px] text-right">{slot.team1}</div>
                                   <div className="mx-4 text-[10px] font-black text-white bg-rose-500 px-2 py-1 rounded shadow-sm uppercase tracking-wider">VS</div>
                                   <div className="font-bold text-gray-800 text-lg truncate max-w-[120px] sm:max-w-[200px]">{slot.team2}</div>
                                 </div>
                              </div>
                            ) : (
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <span className="text-emerald-600 font-medium flex items-center bg-emerald-50 px-3 py-1.5 rounded-lg w-fit">
                                  <Zap className="w-4 h-4 mr-1.5" /> Khung giờ sân đang trống
                                </span>
                                <button className="bg-gray-900 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md transition-colors focus:ring-4 focus:ring-emerald-100 outline-none w-full sm:w-auto">
                                  Đăng Ký Ngay
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )) : (
                      <div className="text-center py-16 text-gray-500 flex flex-col items-center justify-center bg-white rounded-2xl border-2 border-dashed border-gray-200">
                        <Info className="w-12 h-12 text-gray-300 mb-4" />
                        <p className="text-lg font-medium text-gray-600">Chưa có dữ liệu lịch cho ca này</p>
                        <p className="text-sm text-gray-400 mt-1">Các khung giờ sẽ được cập nhật sớm nhất.</p>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
