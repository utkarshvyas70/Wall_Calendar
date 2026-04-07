"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useCalendar, MONTH_IMAGES, HOLIDAYS_2025 } from '@/hooks/useCalendar';
import { useNotes } from '@/hooks/useNotes';

export default function WallCalendar() {
  const {
    currentMonth, currentYear, startDate, endDate, hoverDate, days, renderKey,
    nextMonth, prevMonth, goToToday, handleDateClick, setHoverDate, handleKeyDown, slideDirection, isAnimating
  } = useCalendar();

  const {
    activeTab, switchTab, hasRange, currentNote, handleNoteChange, clearNote, isFading
  } = useNotes(currentYear, currentMonth, startDate, endDate);

  const [isNotesExpanded, setIsNotesExpanded] = useState(false);
  const [isNotesFocused, setIsNotesFocused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  // Phase 5: Image Upload Logic
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [customHero, setCustomHero] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState("");
  const heroStorageKey = `hero-${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`;

  // Load custom image if it exists for this month
  useEffect(() => {
    setCustomHero(localStorage.getItem(heroStorageKey));
    setUploadError("");
  }, [heroStorageKey]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 1.5 * 1024 * 1024) {
      setUploadError("Image too large — try a smaller file (<1.5MB)");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setCustomHero(base64);
      localStorage.setItem(heroStorageKey, base64);
      setUploadError("");
    };
    reader.readAsDataURL(file);
  };

  // Touch Handlers
  const handleTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const deltaX = touchStartX.current - e.changedTouches[0].clientX;
    if (deltaX > 60) nextMonth();
    else if (deltaX < -60) prevMonth();
    touchStartX.current = null;
  };

  const daysOfWeek = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
  const monthNames = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];

  return (
    <div 
      className="animate-page-load w-full bg-white max-w-[var(--cal-max-width)] mx-auto rounded-[2px] premium-shadow md:mt-6 relative focus:outline-none opacity-0"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {/* Physical Spiral Binding - Staggered fade in */}
      <div className="absolute top-[-6px] left-[4%] right-[4%] flex justify-between z-20 pointer-events-none">
        {Array.from({ length: 36 }).map((_, i) => (
          <div key={i} className="w-[12px] h-[12px] rounded-full opacity-0" 
               style={{ background: 'radial-gradient(circle, #888888 35%, transparent 40%)', animation: 'fade-in 0.2s forwards', animationDelay: `${i * 15}ms` }} />
        ))}
      </div>

      {/* 1. Hero Panel */}
      <div className="relative h-[200px] md:aspect-video w-full rounded-t-[2px] overflow-hidden bg-[#111] group">
        <img 
          key={renderKey} // Forces re-trigger of CSS crossfade
          src={customHero || MONTH_IMAGES[currentMonth]} 
          alt={monthNames[currentMonth]} 
          className="absolute inset-0 w-full h-full object-cover opacity-80 animate-crossfade"
        />
        <div className="absolute inset-x-0 bottom-0 h-[40%] bg-[#1B2D4F] chevron-cut"></div>
        
        {/* Hover Upload Interaction */}
        <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageUpload} className="hidden" />
        <button 
          onClick={() => fileInputRef.current?.click()}
          className="absolute top-6 right-6 w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/60 z-20 cursor-pointer text-white"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
        </button>
        {uploadError && <span className="absolute top-16 right-6 text-[10px] text-red-300 font-bold tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">{uploadError}</span>}

        <div className="absolute bottom-4 md:bottom-6 w-full flex flex-col items-center text-white z-10">
          <span className="font-serif text-xs md:text-sm tracking-[0.4em] opacity-80 mb-1">{currentYear}</span>
          <h1 className="font-serif text-[40px] md:text-[52px] font-bold leading-none tracking-wide">{monthNames[currentMonth]}</h1>
        </div>
      </div>

      {/* 2. Content Area */}
      <div className="flex flex-col md:flex-row p-[var(--pad-mobile)] md:p-[var(--pad-desktop)] gap-8 md:gap-10">
        
        {/* Left Column: Notes */}
        <div className="order-2 md:order-1 w-full md:w-[30%] flex flex-col md:pr-4">
          <div className="md:hidden flex justify-between items-center mb-2 cursor-pointer border-b border-[#E8E4DC] pb-2" onClick={() => setIsNotesExpanded(!isNotesExpanded)}>
            <h2 className="font-serif text-[18px] text-[#1B2D4F] leading-none">Notes {isNotesExpanded ? '↑' : '↓'}</h2>
          </div>

          <div className={`flex flex-col overflow-hidden transition-[max-height] duration-300 ease-in-out ${isNotesExpanded ? 'max-h-[500px]' : 'max-h-0'} md:max-h-none`}>
            <div className="hidden md:block mb-4">
              <h2 className="font-serif text-[18px] text-[#1B2D4F] leading-none mb-1">Notes</h2>
            </div>

            <div className="flex gap-4 mb-5 mt-4 md:mt-0">
              <button onClick={() => switchTab('month')} className={`text-[9px] tracking-[0.15em] font-bold uppercase transition-colors ${activeTab === 'month' ? 'text-[#1B2D4F]' : 'text-[#BBBBBB] hover:text-[#9A9A9A]'}`}>Month</button>
              <button onClick={() => hasRange && switchTab('range')} disabled={!hasRange} className={`text-[9px] tracking-[0.15em] font-bold uppercase transition-colors ${activeTab === 'range' ? 'text-[#1B2D4F]' : 'text-[#BBBBBB] hover:text-[#9A9A9A]'} ${!hasRange ? 'opacity-40 cursor-not-allowed' : ''}`}>Range</button>
            </div>
            
            {/* Focus tint background logic */}
            <div 
              className="flex-grow flex flex-col relative min-h-[200px] transition-colors duration-200"
              style={{ backgroundColor: isNotesFocused ? '#F5F0E8' : 'transparent', opacity: isFading ? 0 : 1 }}
            >
              <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(transparent, transparent 27px, #E8E4DC 27px, #E8E4DC 28px)', backgroundPosition: 'top left', top: '2px' }}></div>
              <textarea
                value={currentNote} onChange={(e) => handleNoteChange(e.target.value)} disabled={activeTab === 'range' && !hasRange}
                onFocus={() => setIsNotesFocused(true)} onBlur={() => setIsNotesFocused(false)}
                placeholder="Write something..."
                className="w-full flex-grow bg-transparent border-none outline-none resize-none text-[13px] text-[#3A3A3A] font-sans placeholder:italic placeholder:text-[#BBBBBB] z-10 p-0 leading-[28px] overflow-hidden"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Calendar Grid */}
        <div className="order-1 md:order-2 w-full md:w-[70%]" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
          <div className="flex justify-between items-center mb-6">
            <button onClick={goToToday} className="px-4 py-1.5 rounded-[2px] border border-[#E8E4DC] text-[10px] font-bold tracking-wider text-[#1B2D4F] hover:bg-[#F7F4EF] transition-colors">TODAY</button>
            <div className="flex gap-4">
              <button onClick={prevMonth} className="text-[#9A9A9A] hover:text-[#1B2D4F] transition-colors font-bold text-lg leading-none">&larr;</button>
              <button onClick={nextMonth} className="text-[#9A9A9A] hover:text-[#1B2D4F] transition-colors font-bold text-lg leading-none">&rarr;</button>
            </div>
          </div>

          <div className="grid grid-cols-7 mb-4">
            {daysOfWeek.map((day, index) => <div key={day} className={`text-center text-[10px] tracking-[0.15em] font-bold ${index >= 5 ? 'text-[#1B2D4F]' : 'text-[#9A9A9A]'}`}>{day}</div>)}
          </div>

          <div className={`grid grid-cols-7 gap-y-2 gap-x-0 ${isAnimating && slideDirection === 'left' ? 'animate-slide-in-left' : ''} ${isAnimating && slideDirection === 'right' ? 'animate-slide-in-right' : ''}`}>
            {days.map((day, index) => {
              const ts = day.timestamp;
              const startTs = startDate?.getTime() || null;
              const endTs = endDate?.getTime() || null;
              const hoverTs = hoverDate?.getTime() || null;

              const isStart = startTs === ts;
              const isEnd = endTs === ts;
              const isSelectedNode = isStart || isEnd;
              
              const isBetweenSelected = startTs && endTs && ts > startTs && ts < endTs;
              const isBetweenHover = startTs && !endTs && hoverTs && ts > startTs && ts < hoverTs;
              const isHoverEnd = startTs && !endTs && hoverTs === ts && ts > startTs;
              
              const inSelectedRange = isBetweenSelected;
              const inHoverRange = isBetweenHover || isHoverEnd;

              const drawLeftBand = isBetweenSelected || isEnd || isBetweenHover || isHoverEnd;
              const drawRightBand = isBetweenSelected || (isStart && (endTs || hoverTs)) || isBetweenHover;

              // Ink Spread stagger calculation
              const staggerDelayMs = startTs && ts > startTs ? Math.abs((ts - startTs) / (1000 * 60 * 60 * 24)) * 10 : 0;
              const bandClass = inSelectedRange || isEnd || (isStart && endTs) ? 'animate-ink-spread' : 'bg-[#E8EFF7]';

              // Holidays
              const holidayKey = `${day.date.getMonth()}-${day.date.getDate()}`;
              const holidayName = day.isCurrentMonth && currentYear === 2025 ? HOLIDAYS_2025[holidayKey] : null;

              return (
                <div key={index} className="relative h-11 md:h-10 w-full flex items-center justify-center">
                  
                  {drawLeftBand && <div className={`absolute left-0 top-0 bottom-0 w-1/2 ${bandClass}`} style={{ animationDelay: `${staggerDelayMs}ms` }} />}
                  {drawRightBand && <div className={`absolute right-0 top-0 bottom-0 w-1/2 ${bandClass}`} style={{ animationDelay: `${staggerDelayMs}ms` }} />}

                  <button
                    onClick={() => day.isCurrentMonth && handleDateClick(day.date)}
                    onFocus={() => day.isCurrentMonth && setHoverDate(day.date)}
                    disabled={!day.isCurrentMonth}
                    tabIndex={day.isCurrentMonth ? 0 : -1}
                    data-tooltip={holidayName || undefined}
                    className={`
                      relative z-10 flex flex-col items-center justify-center rounded-full text-[15px] font-sans font-medium transition-transform duration-75
                      h-10 w-10 md:h-9 md:w-9 
                      ${holidayName ? 'holiday-tooltip cursor-help' : ''}
                      ${!day.isCurrentMonth ? 'text-[#C8C8C8] cursor-default' : 'text-gray-800 hover:scale-105 cursor-pointer hover:bg-[#F7F4EF]'}
                      ${isSelectedNode ? 'bg-[#1B2D4F] text-white animate-pop-in' : ''}
                      ${!isSelectedNode && (inSelectedRange || inHoverRange) ? 'bg-transparent hover:bg-transparent' : ''}
                    `}
                  >
                    {day.date.getDate()}
                    
                    {day.isToday && !isSelectedNode && !holidayName && <span className="absolute bottom-1.5 w-3 border-b-[3px] border-[#1B2D4F] rounded-full"></span>}
                    {holidayName && <span className={`absolute bottom-1.5 w-[4px] h-[4px] rounded-full ${isSelectedNode ? 'bg-white' : 'bg-[#1B2D4F]'}`}></span>}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}