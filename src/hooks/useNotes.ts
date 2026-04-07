import { useState, useEffect } from 'react';

export function useNotes(currentYear: number, currentMonth: number, startDate: Date | null, endDate: Date | null) {
  const [activeTab, setActiveTab] = useState<'month' | 'range'>('month');
  const [monthNote, setMonthNote] = useState('');
  const [rangeNote, setRangeNote] = useState('');
  const [isFading, setIsFading] = useState(false);

  const monthKey = `notes-${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`;
  const rangeKey = startDate && endDate ? `notes-${startDate.getTime()}-${endDate.getTime()}` : null;
  const hasRange = !!rangeKey;

  useEffect(() => { switchTab(hasRange ? 'range' : 'month'); }, [hasRange]);
  useEffect(() => { setMonthNote(localStorage.getItem(monthKey) || ''); }, [monthKey]);
  useEffect(() => { setRangeNote(rangeKey ? localStorage.getItem(rangeKey) || '' : ''); }, [rangeKey]);

  const switchTab = (tab: 'month' | 'range') => {
    if (tab === activeTab) return;
    setIsFading(true);
    setTimeout(() => { setActiveTab(tab); setIsFading(false); }, 150);
  };

  const handleNoteChange = (val: string) => {
    if (val.length > 300) return;
    if (activeTab === 'month') { setMonthNote(val); localStorage.setItem(monthKey, val); }
    else if (activeTab === 'range' && rangeKey) { setRangeNote(val); localStorage.setItem(rangeKey, val); }
  };

  const clearNote = () => {
    if (activeTab === 'month') { setMonthNote(''); localStorage.removeItem(monthKey); }
    else if (activeTab === 'range' && rangeKey) { setRangeNote(''); localStorage.removeItem(rangeKey); }
  };

  return { activeTab, switchTab, hasRange, currentNote: activeTab === 'month' ? monthNote : rangeNote, handleNoteChange, clearNote, isFading };
}