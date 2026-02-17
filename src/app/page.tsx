 'use client';
import { useState, useEffect, useRef, useCallback } from 'react';

interface RamzanDate {
  day: number;
  date: string;
  sehri: string;
  iftar: string;
}

interface WeatherData {
  temperature: number;
  description: string;
  humidity: number;
  windSpeed: number;
  icon: string;
}

const RamzanCalendar = () => {
  const [year] = useState<number>(2026);
  const [country, setCountry] = useState<string>('Pakistan');
  const [city, setCity] = useState<string>('Islamabad');
  const [ramzanDates, setRamzanDates] = useState<RamzanDate[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [ashraColors, setAshraColors] = useState<boolean>(false);
  const [weather, setWeather] = useState<WeatherData>({
    temperature: 25,
    description: 'Partly cloudy',
    humidity: 65,
    windSpeed: 3.5,
    icon: '04d'
  });
  const [locationLoading, setLocationLoading] = useState<boolean>(false);
  const [userLocation, setUserLocation] = useState<{country: string, city: string}>({
    country: 'Pakistan',
    city: 'Islamabad'
  });
  const [timeToSehri, setTimeToSehri] = useState<string>('');
  const [timeToIftar, setTimeToIftar] = useState<string>('');
  const [currentPrayer, setCurrentPrayer] = useState<string>('');
  const [showCustomLocationModal, setShowCustomLocationModal] = useState<boolean>(false);
  const [customCity, setCustomCity] = useState<string>('Islamabad');
  const [customCountry, setCustomCountry] = useState<string>('Pakistan');
  const [ramzanStarted, setRamzanStarted] = useState<boolean>(false);
  const [daysUntilRamzan, setDaysUntilRamzan] = useState<number>(12);
  const [hoursUntilRamzan, setHoursUntilRamzan] = useState<number>(3);
  const [minutesUntilRamzan, setMinutesUntilRamzan] = useState<number>(12);
  const [ashraToggle, setAshraToggle] = useState<boolean>(false);
  const [bismillahColor, setBismillahColor] = useState<string>('text-gray-900 dark:text-white');
  
  const currentCityRef = useRef<string>('Islamabad');

  const cities = {
    Pakistan: ['Islamabad', 'Karachi', 'Lahore', 'Faisalabad'],
    UK: ['Coventry', 'London', 'Birmingham', 'Scunthorpe'], // ✅ Scunthorpe added
  };

  const get2026ManualTimetable = useCallback((city: string): RamzanDate[] => {
    const islamabadTimetable: RamzanDate[] = [
      { day: 1, date: 'Thursday, February 19, 2026', sehri: '05:25 AM', iftar: '05:56 PM' },
      { day: 2, date: 'Friday, February 20, 2026', sehri: '05:24 AM', iftar: '05:56 PM' },
      { day: 3, date: 'Saturday, February 21, 2026', sehri: '05:23 AM', iftar: '05:57 PM' },
      { day: 4, date: 'Sunday, February 22, 2026', sehri: '05:22 AM', iftar: '05:58 PM' },
      { day: 5, date: 'Monday, February 23, 2026', sehri: '05:21 AM', iftar: '05:59 PM' },
      { day: 6, date: 'Tuesday, February 24, 2026', sehri: '05:20 AM', iftar: '06:00 PM' },
      { day: 7, date: 'Wednesday, February 25, 2026', sehri: '05:19 AM', iftar: '06:01 PM' },
      { day: 8, date: 'Thursday, February 26, 2026', sehri: '05:17 AM', iftar: '06:01 PM' },
      { day: 9, date: 'Friday, February 27, 2026', sehri: '05:16 AM', iftar: '06:02 PM' },
      { day: 10, date: 'Saturday, February 28, 2026', sehri: '05:15 AM', iftar: '06:03 PM' },
      { day: 11, date: 'Sunday, March 1, 2026', sehri: '05:14 AM', iftar: '06:04 PM' },
      { day: 12, date: 'Monday, March 2, 2026', sehri: '05:12 AM', iftar: '06:05 PM' },
      { day: 13, date: 'Tuesday, March 3, 2026', sehri: '05:11 AM', iftar: '06:06 PM' },
      { day: 14, date: 'Wednesday, March 4, 2026', sehri: '05:10 AM', iftar: '06:06 PM' },
      { day: 15, date: 'Thursday, March 5, 2026', sehri: '05:09 AM', iftar: '06:07 PM' },
      { day: 16, date: 'Friday, March 6, 2026', sehri: '05:08 AM', iftar: '06:08 PM' },
      { day: 17, date: 'Saturday, March 7, 2026', sehri: '05:07 AM', iftar: '06:09 PM' },
      { day: 18, date: 'Sunday, March 8, 2026', sehri: '05:05 AM', iftar: '06:10 PM' },
      { day: 19, date: 'Monday, March 9, 2026', sehri: '05:04 AM', iftar: '06:11 PM' },
      { day: 20, date: 'Tuesday, March 10, 2026', sehri: '05:03 AM', iftar: '06:11 PM' },
      { day: 21, date: 'Wednesday, March 11, 2026', sehri: '05:01 AM', iftar: '06:12 PM' },
      { day: 22, date: 'Thursday, March 12, 2026', sehri: '05:00 AM', iftar: '06:13 PM' },
      { day: 23, date: 'Friday, March 13, 2026', sehri: '04:58 AM', iftar: '06:14 PM' },
      { day: 24, date: 'Saturday, March 14, 2026', sehri: '04:57 AM', iftar: '06:15 PM' },
      { day: 25, date: 'Sunday, March 15, 2026', sehri: '04:56 AM', iftar: '06:15 PM' },
      { day: 26, date: 'Monday, March 16, 2026', sehri: '04:54 AM', iftar: '06:16 PM' },
      { day: 27, date: 'Tuesday, March 17, 2026', sehri: '04:53 AM', iftar: '06:17 PM' },
      { day: 28, date: 'Wednesday, March 18, 2026', sehri: '04:51 AM', iftar: '06:18 PM' },
      { day: 29, date: 'Thursday, March 19, 2026', sehri: '04:50 AM', iftar: '06:19 PM' },
      { day: 30, date: 'Friday, March 20, 2026', sehri: '04:48 AM', iftar: '06:20 PM' },
    ];

    const karachiTimetable: RamzanDate[] = [
      { day: 1, date: 'Thursday, February 19, 2026', sehri: '05:47 AM', iftar: '06:28 PM' },
      { day: 2, date: 'Friday, February 20, 2026', sehri: '05:46 AM', iftar: '06:29 PM' },
      { day: 3, date: 'Saturday, February 21, 2026', sehri: '05:45 AM', iftar: '06:30 PM' },
      { day: 4, date: 'Sunday, February 22, 2026', sehri: '05:45 AM', iftar: '06:30 PM' },
      { day: 5, date: 'Monday, February 23, 2026', sehri: '05:44 AM', iftar: '06:31 PM' },
      { day: 6, date: 'Tuesday, February 24, 2026', sehri: '05:43 AM', iftar: '06:31 PM' },
      { day: 7, date: 'Wednesday, February 25, 2026', sehri: '05:42 AM', iftar: '06:32 PM' },
      { day: 8, date: 'Thursday, February 26, 2026', sehri: '05:42 AM', iftar: '06:32 PM' },
      { day: 9, date: 'Friday, February 27, 2026', sehri: '05:41 AM', iftar: '06:33 PM' },
      { day: 10, date: 'Saturday, February 28, 2026', sehri: '05:40 AM', iftar: '06:33 PM' },
      { day: 11, date: 'Sunday, March 1, 2026', sehri: '05:39 AM', iftar: '06:34 PM' },
      { day: 12, date: 'Monday, March 2, 2026', sehri: '05:38 AM', iftar: '06:34 PM' },
      { day: 13, date: 'Tuesday, March 3, 2026', sehri: '05:37 AM', iftar: '06:35 PM' },
      { day: 14, date: 'Wednesday, March 4, 2026', sehri: '05:36 AM', iftar: '06:35 PM' },
      { day: 15, date: 'Thursday, March 5, 2026', sehri: '05:35 AM', iftar: '06:36 PM' },
      { day: 16, date: 'Friday, March 6, 2026', sehri: '05:34 AM', iftar: '06:36 PM' },
      { day: 17, date: 'Saturday, March 7, 2026', sehri: '05:33 AM', iftar: '06:37 PM' },
      { day: 18, date: 'Sunday, March 8, 2026', sehri: '05:32 AM', iftar: '06:37 PM' },
      { day: 19, date: 'Monday, March 9, 2026', sehri: '05:31 AM', iftar: '06:38 PM' },
      { day: 20, date: 'Tuesday, March 10, 2026', sehri: '05:31 AM', iftar: '06:38 PM' },
      { day: 21, date: 'Wednesday, March 11, 2026', sehri: '05:30 AM', iftar: '06:39 PM' },
      { day: 22, date: 'Thursday, March 12, 2026', sehri: '05:29 AM', iftar: '06:39 PM' },
      { day: 23, date: 'Friday, March 13, 2026', sehri: '05:28 AM', iftar: '06:40 PM' },
      { day: 24, date: 'Saturday, March 14, 2026', sehri: '05:27 AM', iftar: '06:40 PM' },
      { day: 25, date: 'Sunday, March 15, 2026', sehri: '05:26 AM', iftar: '06:41 PM' },
      { day: 26, date: 'Monday, March 16, 2026', sehri: '05:25 AM', iftar: '06:41 PM' },
      { day: 27, date: 'Tuesday, March 17, 2026', sehri: '05:23 AM', iftar: '06:42 PM' },
      { day: 28, date: 'Wednesday, March 18, 2026', sehri: '05:22 AM', iftar: '06:42 PM' },
      { day: 29, date: 'Thursday, March 19, 2026', sehri: '05:21 AM', iftar: '06:43 PM' },
      { day: 30, date: 'Friday, March 20, 2026', sehri: '05:20 AM', iftar: '06:43 PM' },
    ];

    // ✅ ACTUAL Coventry timetable (NEW)
    const coventryTimetable: RamzanDate[] = [
      { day: 1, date: 'Tuesday, February 17, 2026', sehri: '05:34 AM', iftar: '05:24 PM' },
      { day: 2, date: 'Wednesday, February 18, 2026', sehri: '05:32 AM', iftar: '05:26 PM' },
      { day: 3, date: 'Thursday, February 19, 2026', sehri: '05:30 AM', iftar: '05:28 PM' },
      { day: 4, date: 'Friday, February 20, 2026', sehri: '05:28 AM', iftar: '05:30 PM' },
      { day: 5, date: 'Saturday, February 21, 2026', sehri: '05:26 AM', iftar: '05:32 PM' },
      { day: 6, date: 'Sunday, February 22, 2026', sehri: '05:24 AM', iftar: '05:34 PM' },
      { day: 7, date: 'Monday, February 23, 2026', sehri: '05:21 AM', iftar: '05:36 PM' },
      { day: 8, date: 'Tuesday, February 24, 2026', sehri: '05:19 AM', iftar: '05:38 PM' },
      { day: 9, date: 'Wednesday, February 25, 2026', sehri: '05:17 AM', iftar: '05:40 PM' },
      { day: 10, date: 'Thursday, February 26, 2026', sehri: '05:15 AM', iftar: '05:41 PM' },
      { day: 11, date: 'Friday, February 27, 2026', sehri: '05:12 AM', iftar: '05:43 PM' },
      { day: 12, date: 'Saturday, February 28, 2026', sehri: '05:10 AM', iftar: '05:45 PM' },
      { day: 13, date: 'Sunday, March 1, 2026', sehri: '05:08 AM', iftar: '05:47 PM' },
      { day: 14, date: 'Monday, March 2, 2026', sehri: '05:06 AM', iftar: '05:49 PM' },
      { day: 15, date: 'Tuesday, March 3, 2026', sehri: '05:04 AM', iftar: '05:51 PM' },
      { day: 16, date: 'Wednesday, March 4, 2026', sehri: '05:01 AM', iftar: '05:52 PM' },
      { day: 17, date: 'Thursday, March 5, 2026', sehri: '04:59 AM', iftar: '05:54 PM' },
      { day: 18, date: 'Friday, March 6, 2026', sehri: '04:57 AM', iftar: '05:56 PM' },
      { day: 19, date: 'Saturday, March 7, 2026', sehri: '04:55 AM', iftar: '05:58 PM' },
      { day: 20, date: 'Sunday, March 8, 2026', sehri: '04:51 AM', iftar: '06:00 PM' },
      { day: 21, date: 'Monday, March 9, 2026', sehri: '04:50 AM', iftar: '06:01 PM' },
      { day: 22, date: 'Tuesday, March 10, 2026', sehri: '04:48 AM', iftar: '06:03 PM' },
      { day: 23, date: 'Wednesday, March 11, 2026', sehri: '04:46 AM', iftar: '06:05 PM' },
      { day: 24, date: 'Thursday, March 12, 2026', sehri: '04:43 AM', iftar: '06:07 PM' },
      { day: 25, date: 'Friday, March 13, 2026', sehri: '04:41 AM', iftar: '06:09 PM' },
      { day: 26, date: 'Saturday, March 14, 2026', sehri: '04:39 AM', iftar: '06:10 PM' },
      { day: 27, date: 'Sunday, March 15, 2026', sehri: '04:36 AM', iftar: '06:12 PM' },
      { day: 28, date: 'Monday, March 16, 2026', sehri: '04:34 AM', iftar: '06:14 PM' },
      { day: 29, date: 'Tuesday, March 17, 2026', sehri: '04:32 AM', iftar: '06:17 PM' },
      { day: 30, date: 'Wednesday, March 18, 2026', sehri: '04:30 AM', iftar: '06:19 PM' },
    ];

    // ✅ Scunthorpe timetable (existing Coventry ka timetable rename kiya)
    const scunthorpeTimetable: RamzanDate[] = [
      { day: 1, date: 'Tuesday, February 17, 2026', sehri: '05:40 AM', iftar: '05:22 PM' },
      { day: 2, date: 'Wednesday, February 18, 2026', sehri: '05:38 AM', iftar: '05:24 PM' },
      { day: 3, date: 'Thursday, February 19, 2026', sehri: '05:36 AM', iftar: '05:26 PM' },
      { day: 4, date: 'Friday, February 20, 2026', sehri: '05:34 AM', iftar: '05:28 PM' },
      { day: 5, date: 'Saturday, February 21, 2026', sehri: '05:32 AM', iftar: '05:30 PM' },
      { day: 6, date: 'Sunday, February 22, 2026', sehri: '05:30 AM', iftar: '05:32 PM' },
      { day: 7, date: 'Monday, February 23, 2026', sehri: '05:28 AM', iftar: '05:34 PM' },
      { day: 8, date: 'Tuesday, February 24, 2026', sehri: '05:26 AM', iftar: '05:36 PM' },
      { day: 9, date: 'Wednesday, February 25, 2026', sehri: '05:23 AM', iftar: '05:37 PM' },
      { day: 10, date: 'Thursday, February 26, 2026', sehri: '05:21 AM', iftar: '05:39 PM' },
      { day: 11, date: 'Friday, February 27, 2026', sehri: '05:19 AM', iftar: '05:41 PM' },
      { day: 12, date: 'Saturday, February 28, 2026', sehri: '05:17 AM', iftar: '05:43 PM' },
      { day: 13, date: 'Sunday, March 1, 2026', sehri: '05:15 AM', iftar: '05:45 PM' },
      { day: 14, date: 'Monday, March 2, 2026', sehri: '05:13 AM', iftar: '05:47 PM' },
      { day: 15, date: 'Tuesday, March 3, 2026', sehri: '05:10 AM', iftar: '05:49 PM' },
      { day: 16, date: 'Wednesday, March 4, 2026', sehri: '05:08 AM', iftar: '05:51 PM' },
      { day: 17, date: 'Thursday, March 5, 2026', sehri: '05:06 AM', iftar: '05:53 PM' },
      { day: 18, date: 'Friday, March 6, 2026', sehri: '05:04 AM', iftar: '05:55 PM' },
      { day: 19, date: 'Saturday, March 7, 2026', sehri: '05:01 AM', iftar: '05:57 PM' },
      { day: 20, date: 'Sunday, March 8, 2026', sehri: '04:59 AM', iftar: '05:59 PM' },
      { day: 21, date: 'Monday, March 9, 2026', sehri: '04:57 AM', iftar: '06:00 PM' },
      { day: 22, date: 'Tuesday, March 10, 2026', sehri: '04:54 AM', iftar: '06:02 PM' },
      { day: 23, date: 'Wednesday, March 11, 2026', sehri: '04:52 AM', iftar: '06:04 PM' },
      { day: 24, date: 'Thursday, March 12, 2026', sehri: '04:50 AM', iftar: '06:04 PM' },
      { day: 25, date: 'Friday, March 13, 2026', sehri: '04:47 AM', iftar: '06:08 PM' },
      { day: 26, date: 'Saturday, March 14, 2026', sehri: '04:45 AM', iftar: '06:10 PM' },
      { day: 27, date: 'Sunday, March 15, 2026', sehri: '04:43 AM', iftar: '06:12 PM' },
      { day: 28, date: 'Monday, March 16, 2026', sehri: '04:41 AM', iftar: '06:14 PM' },
      { day: 29, date: 'Tuesday, March 17, 2026', sehri: '04:38 AM', iftar: '06:15 PM' },
      { day: 30, date: 'Wednesday, March 18, 2026', sehri: '04:36 AM', iftar: '06:17 PM' },
    ];

    // ✅ London timetable (separate, adjustTime function nahi use karna)
    const londonTimetable: RamzanDate[] = [
      { day: 1, date: 'Tuesday, February 17, 2026', sehri: '05:35 AM', iftar: '05:27 PM' },
      { day: 2, date: 'Wednesday, February 18, 2026', sehri: '05:33 AM', iftar: '05:29 PM' },
      { day: 3, date: 'Thursday, February 19, 2026', sehri: '05:31 AM', iftar: '05:31 PM' },
      { day: 4, date: 'Friday, February 20, 2026', sehri: '05:29 AM', iftar: '05:33 PM' },
      { day: 5, date: 'Saturday, February 21, 2026', sehri: '05:27 AM', iftar: '05:35 PM' },
      { day: 6, date: 'Sunday, February 22, 2026', sehri: '05:25 AM', iftar: '05:37 PM' },
      { day: 7, date: 'Monday, February 23, 2026', sehri: '05:23 AM', iftar: '05:39 PM' },
      { day: 8, date: 'Tuesday, February 24, 2026', sehri: '05:21 AM', iftar: '05:41 PM' },
      { day: 9, date: 'Wednesday, February 25, 2026', sehri: '05:18 AM', iftar: '05:42 PM' },
      { day: 10, date: 'Thursday, February 26, 2026', sehri: '05:16 AM', iftar: '05:44 PM' },
      { day: 11, date: 'Friday, February 27, 2026', sehri: '05:14 AM', iftar: '05:46 PM' },
      { day: 12, date: 'Saturday, February 28, 2026', sehri: '05:12 AM', iftar: '05:48 PM' },
      { day: 13, date: 'Sunday, March 1, 2026', sehri: '05:10 AM', iftar: '05:50 PM' },
      { day: 14, date: 'Monday, March 2, 2026', sehri: '05:08 AM', iftar: '05:52 PM' },
      { day: 15, date: 'Tuesday, March 3, 2026', sehri: '05:05 AM', iftar: '05:54 PM' },
      { day: 16, date: 'Wednesday, March 4, 2026', sehri: '05:03 AM', iftar: '05:56 PM' },
      { day: 17, date: 'Thursday, March 5, 2026', sehri: '05:01 AM', iftar: '05:58 PM' },
      { day: 18, date: 'Friday, March 6, 2026', sehri: '04:59 AM', iftar: '06:02 PM' },
      { day: 19, date: 'Saturday, March 7, 2026', sehri: '04:56 AM', iftar: '06:04 PM' },
      { day: 20, date: 'Sunday, March 8, 2026', sehri: '04:54 AM', iftar: '06:05 PM' },
      { day: 21, date: 'Monday, March 9, 2026', sehri: '04:52 AM', iftar: '06:07 PM' },
      { day: 22, date: 'Tuesday, March 10, 2026', sehri: '04:49 AM', iftar: '06:09 PM' },
      { day: 23, date: 'Wednesday, March 11, 2026', sehri: '04:47 AM', iftar: '06:11 PM' },
      { day: 24, date: 'Thursday, March 12, 2026', sehri: '04:45 AM', iftar: '06:13 PM' },
      { day: 25, date: 'Friday, March 13, 2026', sehri: '04:42 AM', iftar: '06:15 PM' },
      { day: 26, date: 'Saturday, March 14, 2026', sehri: '04:40 AM', iftar: '06:17 PM' },
      { day: 27, date: 'Sunday, March 15, 2026', sehri: '04:38 AM', iftar: '06:19 PM' },
      { day: 28, date: 'Monday, March 16, 2026', sehri: '04:36 AM', iftar: '06:20 PM' },
      { day: 29, date: 'Tuesday, March 17, 2026', sehri: '04:33 AM', iftar: '06:22 PM' },
      { day: 30, date: 'Wednesday, March 18, 2026', sehri: '04:31 AM', iftar: '06:24 PM' },
    ];

    // ✅ REMOVED: adjustTime function completely (ESLint error fix)
    // const adjustTime = (time: string, adjustmentMinutes: number): string => { ... }

    switch(city) {
      case 'Islamabad': return islamabadTimetable;
      case 'Karachi': return karachiTimetable;
      case 'Lahore': return karachiTimetable;
      case 'Faisalabad': return karachiTimetable;
      case 'Coventry': return coventryTimetable; // ✅ NEW Coventry timetable
      case 'Scunthorpe': return scunthorpeTimetable; // ✅ Scunthorpe timetable
      case 'London': return londonTimetable; // ✅ Separate London timetable
      case 'Birmingham': return londonTimetable;
      default: return islamabadTimetable;
    }
  }, []);

  // ✅ NO adjustTime function - ESLint error solved

  const calculateTimeRemaining = useCallback(() => {
    const cityToUse = currentCityRef.current;
    
    const currentTimetable = get2026ManualTimetable(cityToUse);
    if (currentTimetable.length === 0) return;

    const today = new Date();
    const todayDateStr = today.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const foundSchedule = currentTimetable.find(date => 
      date.date.trim() === todayDateStr.trim()
    );

    if (!foundSchedule) {
      const firstDayStr = currentTimetable[0]?.date;
      if (!firstDayStr) return;
      
      const firstDay = new Date(firstDayStr);
      const diffTime = firstDay.getTime() - today.getTime();
      
      if (diffTime > 0) {
        setRamzanStarted(false);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        const diffHours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const diffMinutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));
        
        setDaysUntilRamzan(diffDays);
        setHoursUntilRamzan(diffHours);
        setMinutesUntilRamzan(diffMinutes);
        
        setTimeToSehri('');
        setTimeToIftar('');
        setCurrentPrayer('');
      } else {
        setRamzanStarted(true);
        setDaysUntilRamzan(0);
        setHoursUntilRamzan(0);
        setMinutesUntilRamzan(0);
      }
      return;
    }

    setRamzanStarted(true);

    const parseTime = (timeStr: string): Date => {
      const [time, modifier] = timeStr.split(' ');
      const [hoursStr, minutesStr] = time.split(':');
      let hours = parseInt(hoursStr, 10);
      const minutes = parseInt(minutesStr, 10);
      
      if (modifier === 'PM' && hours < 12) hours += 12;
      if (modifier === 'AM' && hours === 12) hours = 0;
      
      const timeDate = new Date();
      timeDate.setHours(hours, minutes, 0, 0);
      return timeDate;
    };

    const sehriTime = parseTime(foundSchedule.sehri);
    const iftarTime = parseTime(foundSchedule.iftar);
    const now = new Date();

    let timeToSehriMs = sehriTime.getTime() - now.getTime();
    if (timeToSehriMs < 0) {
      sehriTime.setDate(sehriTime.getDate() + 1);
      timeToSehriMs = sehriTime.getTime() - now.getTime();
    }

    let timeToIftarMs = iftarTime.getTime() - now.getTime();
    if (timeToIftarMs < 0) {
      iftarTime.setDate(iftarTime.getDate() + 1);
      timeToIftarMs = iftarTime.getTime() - now.getTime();
    }

    const isAfterSehri = now.getTime() > parseTime(foundSchedule.sehri).getTime();
    const isAfterIftar = now.getTime() > parseTime(foundSchedule.iftar).getTime();
    
    if (isAfterIftar) {
      setCurrentPrayer('sehri');
      setTimeToIftar('');
      setTimeToSehri(formatTimeRemaining(timeToSehriMs));
    } else if (isAfterSehri) {
      setCurrentPrayer('iftar');
      setTimeToSehri('');
      setTimeToIftar(formatTimeRemaining(timeToIftarMs));
    } else {
      setCurrentPrayer('sehri');
      setTimeToSehri(formatTimeRemaining(timeToSehriMs));
      setTimeToIftar('');
    }

    function formatTimeRemaining(ms: number): string {
      if (ms <= 0) return "0h 0m";
      
      const hours = Math.floor(ms / (1000 * 60 * 60));
      const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((ms % (1000 * 60)) / 1000);

      if (hours > 0) {
        return `${hours}h ${minutes}m`;
      } else if (minutes > 0) {
        return `${minutes}m ${seconds}s`;
      } else {
        return `${seconds}s`;
      }
    }
  }, [get2026ManualTimetable]);

  const loadCalendarData = useCallback(() => {
    setLoading(true);
    try {
      const cityToLoad = currentCityRef.current;
      const timetable = get2026ManualTimetable(cityToLoad);
      setRamzanDates(timetable);
    } catch (error) {
      console.error('Error loading calendar:', error);
      setRamzanDates([]);
    } finally {
      setLoading(false);
    }
  }, [get2026ManualTimetable]);

  const fetchWeather = async (cityName: string, countryName: string) => {
    try {
      const apiKey = '799516eb838144f36c9cd7c6e8017e80';
      const cleanCityName = cityName.replace(' Division', '').split(',')[0].trim();
      
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cleanCityName},${countryName}&appid=${apiKey}&units=metric`
      );
      
      if (!response.ok) {
        const fallbackResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${cleanCityName}&appid=${apiKey}&units=metric`
        );
        
        if (!fallbackResponse.ok) {
          throw new Error('Weather data not available');
        }
        
        const fallbackData = await fallbackResponse.json();
        setWeather({
          temperature: Math.round(fallbackData.main.temp),
          description: fallbackData.weather[0].description,
          humidity: fallbackData.main.humidity,
          windSpeed: fallbackData.wind.speed,
          icon: fallbackData.weather[0].icon,
        });
        return;
      }
      
      const data = await response.json();
      setWeather({
        temperature: Math.round(data.main.temp),
        description: data.weather[0].description,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        icon: data.weather[0].icon,
      });
    } catch (error) {
      console.error('Error fetching weather:', error);
      // ✅ UPDATED: Weather data for all cities including Scunthorpe
      const cityWeather = {
        'Islamabad': { temperature: 20, description: 'Clear', humidity: 55, windSpeed: 1.8, icon: '01d' },
        'Karachi': { temperature: 32, description: 'Sunny', humidity: 70, windSpeed: 2.5, icon: '01d' },
        'Lahore': { temperature: 28, description: 'Hazy', humidity: 65, windSpeed: 2.0, icon: '50d' },
        'Faisalabad': { temperature: 26, description: 'Partly cloudy', humidity: 60, windSpeed: 1.5, icon: '04d' },
        'Coventry': { temperature: 12, description: 'Cloudy', humidity: 80, windSpeed: 4.2, icon: '03d' },
        'Scunthorpe': { temperature: 11, description: 'Partly cloudy', humidity: 78, windSpeed: 4.0, icon: '03d' },
        'London': { temperature: 14, description: 'Light rain', humidity: 85, windSpeed: 3.8, icon: '10d' },
        'Birmingham': { temperature: 13, description: 'Overcast', humidity: 82, windSpeed: 3.5, icon: '04d' },
      };
      
      const weatherData = cityWeather[cityName as keyof typeof cityWeather] || cityWeather['Islamabad'];
      setWeather(weatherData);
    }
  };

  const refreshLocation = () => {
    setLocationLoading(true);
    getUserLocation();
  };

  const getUserLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            
            if (response.ok) {
              const data = await response.json();
              const userCountry = data.address.country || 'Pakistan';
              let userCity = data.address.city || data.address.town || data.address.village || data.address.county || 'Islamabad';
              
              userCity = userCity.replace(' Division', '').split(',')[0].trim();
              
              const updatedLocation = {
                country: userCountry,
                city: userCity
              };
              
              currentCityRef.current = userCity;
              
              setUserLocation(updatedLocation);
              setCountry(userCountry);
              setCity(userCity);
              fetchWeather(userCity, userCountry);
              
              loadCalendarData();
            } else {
              throw new Error('Location not found');
            }
          } catch (error) {
            console.error('Error getting location:', error);
            const defaultLoc = { country: 'Pakistan', city: 'Islamabad' };
            
            currentCityRef.current = 'Islamabad';
            
            setUserLocation(defaultLoc);
            setCountry('Pakistan');
            setCity('Islamabad');
            fetchWeather('Islamabad', 'Pakistan');
            loadCalendarData();
          } finally {
            setLocationLoading(false);
          }
        },
        (error) => {
          console.error('Geolocation error:', error);
          const defaultLoc = { country: 'Pakistan', city: 'Islamabad' };
          
          currentCityRef.current = 'Islamabad';
          
          setUserLocation(defaultLoc);
          setCountry('Pakistan');
          setCity('Islamabad');
          fetchWeather('Islamabad', 'Pakistan');
          loadCalendarData();
          setLocationLoading(false);
        }
      );
    } else {
      console.log('Geolocation not supported');
      const defaultLoc = { country: 'Pakistan', city: 'Islamabad' };
      
      currentCityRef.current = 'Islamabad';
      
      setUserLocation(defaultLoc);
      setCountry('Pakistan');
      setCity('Islamabad');
      fetchWeather('Islamabad', 'Pakistan');
      loadCalendarData();
      setLocationLoading(false);
    }
  }, [loadCalendarData]);

  const applyCustomLocation = () => {
    if (!customCity.trim()) return;

    currentCityRef.current = customCity;
    
    setCountry(customCountry);
    setCity(customCity);
    
    const updatedLocation = {
      country: customCountry,
      city: customCity
    };
    
    setUserLocation(updatedLocation);
    fetchWeather(customCity, customCountry);
    loadCalendarData();
    
    setShowCustomLocationModal(false);
  };

  const toggleAshra = () => {
    const newAshraState = !ashraToggle;
    setAshraToggle(newAshraState);
    setAshraColors(newAshraState);
    
    if (newAshraState) {
      setBismillahColor('text-green-500 dark:text-green-400');
    } else {
      setBismillahColor('text-gray-900 dark:text-white');
    }
  };

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    
    if (ashraToggle) {
      setBismillahColor(newDarkMode ? 'text-green-400' : 'text-green-500');
    } else {
      setBismillahColor(newDarkMode ? 'text-white' : 'text-gray-900');
    }
  };

  const handleEditLocation = () => {
    setCustomCountry(country);
    setCustomCity(city);
    setShowCustomLocationModal(true);
  };

  const getAshraColor = (day: number): string => {
    if (!ashraColors) return darkMode ? 'bg-gray-800' : 'bg-white';
    if (day <= 10) {
      return darkMode ? 'bg-green-900' : 'bg-green-100';
    } else if (day <= 20) {
      return darkMode ? 'bg-blue-900' : 'bg-blue-100';
    } else {
      return darkMode ? 'bg-purple-900' : 'bg-purple-100';
    }
  };

  const handlePrint = () => {
    window.print();
  };

  useEffect(() => {
    currentCityRef.current = 'Islamabad';
    loadCalendarData();
    getUserLocation();
  }, [getUserLocation, loadCalendarData]);

  useEffect(() => {
    const interval = setInterval(() => {
      calculateTimeRemaining();
    }, 1000);
    
    calculateTimeRemaining();
    
    return () => clearInterval(interval);
  }, [calculateTimeRemaining]);

  useEffect(() => {
    loadCalendarData();
  }, [city, loadCalendarData]);

  return (
    <div className={`p-4 font-sans min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-800'}`}>
      
      <div className="text-center mb-6">
        <div className="text-center mb-2">
          <div className={`text-5xl md:text-6xl mb-1 md:mb-2 ${bismillahColor}`}>
            ﷽
          </div>
          <h1 className={`text-xl md:text-3xl font-arabic mb-1 ${bismillahColor}`}>
            بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
          </h1>
          <p className="italic text-sm md:text-base text-gray-600 dark:text-gray-400">
            In the name of Allah, the Most Gracious, the Most Merciful
          </p>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold mt-2">Ramzan Calendar {year}</h1>
      </div>

      <div className={`p-4 md:p-5 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm mb-6`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          
          <div className="flex-1 w-full sm:w-auto">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <h2 className="text-lg md:text-xl font-bold">{userLocation.city}, {userLocation.country}</h2>
                <span className="text-xs text-gray-500 dark:text-gray-400">(Current)</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleEditLocation}
                  className={`px-3 py-1 text-sm rounded ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} transition-colors whitespace-nowrap`}
                  title="Edit location"
                >
                  Edit
                </button>
                <button
                  onClick={refreshLocation}
                  className={`p-1.5 rounded-full ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} transition-colors`}
                  title="Refresh location"
                  disabled={locationLoading}
                >
                  {locationLoading ? (
                    <div className="w-4 h-4 border-2 border-gray-300 dark:border-gray-600 border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <span className="text-sm">🔄</span>
                  )}
                </button>
              </div>
            </div>
            
            <div className="flex flex-col xs:flex-row xs:items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">
                  {weather.icon.includes('01d') ? '☀️' : 
                   weather.icon.includes('01n') ? '🌙' :
                   weather.icon.includes('02') ? '⛅' :
                   weather.icon.includes('03') || weather.icon.includes('04') ? '☁️' :
                   weather.icon.includes('09') || weather.icon.includes('10') ? '🌧️' :
                   weather.icon.includes('11') ? '⛈️' :
                   weather.icon.includes('13') ? '❄️' :
                   weather.icon.includes('50') ? '🌫️' : '🌡️'}
                </span>
                <span className="text-base md:text-lg whitespace-nowrap capitalize">
                  {weather.description}
                </span>
              </div>
              
              <div className="flex items-center gap-3 xs:gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🌡️</span>
                  <span className="text-base md:text-lg font-medium whitespace-nowrap">{weather.temperature}°C</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-xl">💧</span>
                  <span className="text-base md:text-lg whitespace-nowrap">{weather.humidity}%</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-xl">💨</span>
                  <span className="text-base md:text-lg whitespace-nowrap">{weather.windSpeed.toFixed(1)} m/s</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="w-full sm:w-auto text-center sm:text-right sm:border-l sm:pl-6 border-gray-300 dark:border-gray-700">
            <div>
              {ramzanStarted ? (
                <div>
                  {currentPrayer === 'sehri' && timeToSehri ? (
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">⏳ Time until Sehri</p>
                      <p className="text-2xl md:text-3xl font-bold text-blue-600 dark:text-blue-400">{timeToSehri}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Next: Iftar</p>
                    </div>
                  ) : currentPrayer === 'iftar' && timeToIftar ? (
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">⏳ Time until Iftar</p>
                      <p className="text-2xl md:text-3xl font-bold text-orange-600 dark:text-orange-400">{timeToIftar}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Next: Sehri</p>
                    </div>
                  ) : timeToSehri ? (
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">⏳ Time until Sehri</p>
                      <p className="text-2xl md:text-3xl font-bold text-blue-600 dark:text-blue-400">{timeToSehri}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Next: Iftar</p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Ramzan starts in</p>
                      <p className="text-2xl md:text-3xl font-bold text-green-600 dark:text-green-400">
                        {daysUntilRamzan}d {hoursUntilRamzan}h {minutesUntilRamzan}m
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Prepare for blessed month</p>
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">⏳ Ramzan starts in</p>
                  <p className="text-2xl md:text-3xl font-bold text-green-600 dark:text-green-400">
                    {daysUntilRamzan}d {hoursUntilRamzan}h {minutesUntilRamzan}m
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {currentCityRef.current} starts on {ramzanDates[0]?.date}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Buttons Row */}
      <div className="flex items-center justify-between gap-2 mb-6">
        <button
          onClick={handlePrint}
          className={`px-4 py-2 rounded text-sm font-medium ${darkMode ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'} text-white transition-colors print:hidden`}
        >
          Print Calendar
        </button>

        <div className="flex items-center gap-4">
          {/* Ashra Colors Toggle */}
          <div className="flex items-center gap-2">
            <span className="text-xs whitespace-nowrap">Ashra Colors</span>
            <button
              onClick={toggleAshra}
              className={`relative inline-flex h-6 w-11 items-center rounded-full ${ashraToggle ? 'bg-green-500' : 'bg-gray-300'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${ashraToggle ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>

          {/* Perfect Dark Mode Toggle */}
<div className="flex items-center gap-2">
  <span className="text-xs whitespace-nowrap">Dark Mode</span>
  <button
    onClick={toggleDarkMode}
    className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
      darkMode ? 'bg-blue-600' : 'bg-gray-300'
    }`}
  >
    {/* Sun Icon - Left side */}
    <div className="absolute left-1.5">
      <span className="text-sm">🌙</span>
    </div>
    
    {/* Moon Icon - Right side */}
    <div className="absolute right-1.5">
      <span className="text-sm">☀️</span>
    </div>
    
    {/* Toggle Circle - Exact positioning */}
    <div className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-md transition-transform duration-300 ${
      darkMode ? 'translate-x-8' : 'translate-x-1'
    }`} />
  </button>
</div>
        </div>
      </div>

      {showCustomLocationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`p-6 rounded-xl shadow-lg max-w-md w-full ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              Edit Location
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Country
                </label>
                <select
                  value={customCountry}
                  onChange={(e) => {
                    const newCountry = e.target.value;
                    setCustomCountry(newCountry);
                    setCustomCity(cities[newCountry as keyof typeof cities][0]);
                  }}
                  className={`w-full p-2 border rounded-lg ${darkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300'}`}
                >
                  <option value="Pakistan">Pakistan</option>
                  <option value="UK">United Kingdom</option>
                </select>
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  City
                </label>
                <select
                  value={customCity}
                  onChange={(e) => setCustomCity(e.target.value)}
                  className={`w-full p-2 border rounded-lg ${darkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300'}`}
                >
                  {cities[customCountry as keyof typeof cities].map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowCustomLocationModal(false)}
                className={`px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
              >
                Cancel
              </button>
              <button
                onClick={applyCustomLocation}
                className={`px-4 py-2 rounded-lg ${darkMode ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'} text-white`}
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      <div className={`mb-6 p-4 md:p-6 rounded-lg shadow-sm ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'} dua-section`}>
        <h2 className={`text-xl md:text-2xl font-bold mb-4 text-right ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          روزے کی نیت (افطار کی دعا)
        </h2>
        <div className="space-y-4">
          <div>
            <h3 className={`text-lg md:text-xl font-semibold text-right ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              روزے کی نیت
            </h3>
            <div className="flex flex-col">
              <p className="mt-2 text-right text-xl md:text-2xl font-arabic">
              وَبِصَوْمٍ غَدٍ نَوَيْتُ مِنْ شَهْرِ رَمَضَانِ
              </p>
              <p className={`mt-2 text-right text-sm md:text-base ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                (ترجمہ: میں نے رمضان کے مہینے میں کل کے روزے کی نیت کی۔)
              </p>
              <p className={`mt-2 text-left text-sm md:text-base ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                (Translation: I intend to keep the fast for tomorrow in the month of Ramadan.)
              </p>
            </div>
          </div>
          <div>
            <h3 className={`text-lg md:text-xl font-semibold text-right ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              (افطار کی دعا)
            </h3>
            <div className="flex flex-col">
              <p className="mt-2 text-right text-xl md:text-2xl font-arabic">
                اللَّهُمَّ إِنِّي لَكَ صُمْتُ وَ بِكَ آمَنْتُ وَ عَلَيْكَ تَوَكَّلْتُ وَعَلَى رِزْقِكَ أَفْطَرْتُ
              </p>
              <p className={`mt-2 text-right text-sm md:text-base ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                (ترجمہ: اے اللہ، میں نے تیرے لیے روزہ رکھا اور تیرے رزق سے افطار کیا۔)
              </p>
              <p className={`mt-2 text-left text-sm md:text-base ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                (Translation: O Allah, I fasted for You and I break my fast with Your sustenance.)
              </p>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : ramzanDates.length > 0 ? (
        <div className="overflow-x-auto">
          <table className={`min-w-full ${darkMode ? 'border border-gray-700' : 'border border-gray-200'} shadow-sm rounded-lg`}>
            <thead className={`${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
              <tr>
                <th className={`py-2 px-3 border-b text-left text-xs md:text-sm font-semibold ${darkMode ? 'border-gray-700 text-white' : 'border-gray-200'}`}>
                  Day
                </th>
                <th className={`py-2 px-3 border-b text-left text-xs md:text-sm font-semibold ${darkMode ? 'border-gray-700 text-white' : 'border-gray-200'}`}>
                  Date
                </th>
                <th className={`py-2 px-3 border-b text-left text-xs md:text-sm font-semibold ${darkMode ? 'border-gray-700 text-white' : 'border-gray-200'}`}>
                  Sehri Time
                </th>
                <th className={`py-2 px-3 border-b text-left text-xs md:text-sm font-semibold ${darkMode ? 'border-gray-700 text-white' : 'border-gray-200'}`}>
                  Iftar Time
                </th>
              </tr>
            </thead>
            <tbody>
              {ramzanDates.map(({ day, date, sehri, iftar }) => (
                <tr
                  key={day}
                  className={`${getAshraColor(day)} ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}
                >
                  <td className={`py-2 px-3 border-b text-xs md:text-sm ${darkMode ? 'border-gray-700 text-white' : 'border-gray-200 text-gray-800'}`}>
                    Day {day}
                  </td>
                  <td className={`py-2 px-3 border-b text-xs md:text-sm ${darkMode ? 'border-gray-700 text-gray-300' : 'border-gray-200 text-gray-700'}`}>
                    {date}
                  </td>
                  <td className={`py-2 px-3 border-b text-xs md:text-sm ${darkMode ? 'border-gray-700 text-gray-300' : 'border-gray-200 text-gray-800'}`}>
                    {sehri}
                  </td>
                  <td className={`py-2 px-3 border-b text-xs md:text-sm ${darkMode ? 'border-gray-700 text-gray-300' : 'border-gray-200 text-gray-800'}`}>
                    {iftar}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center text-red-600">No data available.</p>
      )}

      <div className={`mt-6 p-4 md:p-6 rounded-lg shadow-sm ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'}`}>
        <h2 className={`text-xl md:text-2xl font-bold mb-4 text-right ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          Ashra Duas
        </h2>
        <div className="space-y-4">
          <div>
            <h3 className={`text-lg md:text-xl font-semibold text-right ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              پہلا عشرہ رحمت
            </h3>
            <div className="flex flex-col">
              <p className="mt-2 text-right text-xl md:text-2xl font-arabic">
               رَبِّ اغْفِرُ وَارْحَمُ وَأَنْتَ خَيْرُ الرَّحِمِينَ
              </p>
              <p className={`mt-2 text-right text-sm md:text-base ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                (ترجمہ: اے میرے رب مجھے بخش دے مجھ پر رحم فرما تو سب سے بہتر رحم فرمانے والا ہے۔)
              </p>
              <p className={`mt-2 text-left text-sm md:text-base ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                (Translation: My Lord, forgive me and have mercy upon me, for You are the best of the merciful.)
              </p>
            </div>
          </div>
          <div>
            <h3 className={`text-lg md:text-xl font-semibold text-right ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              دوسرا عشرہ مغفرت
            </h3>
            <div className="flex flex-col">
              <p className="mt-2 text-right text-xl md:text-2xl font-arabic">
               أسْتَغْفِرُ اللهَ رَبي مِنْ كُلِ ذَنبٍ وَأتُوبُ إلَيهِ
              </p>
              <p className={`mt-2 text-right text-sm md:text-base ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                (ترجمہ: میں اپنے رب اللہ سے ہر گناہ کی معافی مانگتا ہوں اور اس کی طرف توبہ کرتا ہوں۔)
              </p>
              <p className={`mt-2 text-left text-sm md:text-base ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                (Translation: I seek forgiveness from Allah, my Lord, for every sin, and I turn to Him in repentance.)
              </p>
            </div>
          </div>
          <div>
            <h3 className={`text-lg md:text-xl font-semibold text-right ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              تیسرا عشرہ نجات
            </h3>
            <div className="flex flex-col">
              <p className="mt-2 text-right text-xl md:text-2xl font-arabic">
                اللَّهُمَّ أَجِرْنِي مِنَ النَّارِ
              </p>
              <p className={`mt-2 text-right text-sm md:text-base ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                (ترجمہ: اے اللہ، مجھے دوزخ کی آگ سے بچا۔)
              </p>
              <p className={`mt-2 text-left text-sm md:text-base ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                (Translation: O Allah, save me from the fire of Hell.)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RamzanCalendar;




