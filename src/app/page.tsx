'use client';
import { useState, useEffect } from 'react';

interface RamzanDate {
  day: number;
  date: string;
  sehri: string;
  iftar: string;
}

const RamzanCalendar = () => {
  const [year, setYear] = useState<number>(2025);
  const [country, setCountry] = useState<string>('Pakistan');
  const [city, setCity] = useState<string>('Karachi');
  const [ramzanDates, setRamzanDates] = useState<RamzanDate[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [ashraColors, setAshraColors] = useState<boolean>(false);

  // Cities for Pakistan and UK
  const cities = {
    Pakistan: ['Karachi', 'Islamabad'],
    UK: ['Coventry', 'London'],
  };

  // ✅ Check if 2026 theme should be applied
  const is2026Theme = year === 2026;

  // ✅ MANUAL TIMETABLES for 2026
  const get2026ManualTimetable = (city: string): RamzanDate[] => {
    // ✅ Coventry, UK - Exact from your timetable
    const coventryTimetable: RamzanDate[] = [
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
      { day: 18, date: 'Friday, March 6, 2026', sehri: '05:04 AM', iftar: '05:57 PM' },
      { day: 19, date: 'Saturday, March 7, 2026', sehri: '05:01 AM', iftar: '05:59 PM' },
      { day: 20, date: 'Sunday, March 8, 2026', sehri: '04:59 AM', iftar: '06:00 PM' },
      { day: 21, date: 'Monday, March 9, 2026', sehri: '04:57 AM', iftar: '06:02 PM' },
      { day: 22, date: 'Tuesday, March 10, 2026', sehri: '04:54 AM', iftar: '06:04 PM' },
      { day: 23, date: 'Wednesday, March 11, 2026', sehri: '04:52 AM', iftar: '06:06 PM' },
      { day: 24, date: 'Thursday, March 12, 2026', sehri: '04:50 AM', iftar: '06:08 PM' },
      { day: 25, date: 'Friday, March 13, 2026', sehri: '04:47 AM', iftar: '06:10 PM' },
      { day: 26, date: 'Saturday, March 14, 2026', sehri: '04:45 AM', iftar: '06:12 PM' },
      { day: 27, date: 'Sunday, March 15, 2026', sehri: '04:43 AM', iftar: '06:14 PM' },
      { day: 28, date: 'Monday, March 16, 2026', sehri: '04:41 AM', iftar: '06:15 PM' },
      { day: 29, date: 'Tuesday, March 17, 2026', sehri: '04:38 AM', iftar: '06:17 PM' },
      { day: 30, date: 'Wednesday, March 18, 2026', sehri: '04:36 AM', iftar: '06:19 PM' },
    ];

    // ✅ Islamabad, Pakistan - Exact from your timetable
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

    // ✅ Karachi, Pakistan - Exact from your timetable
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

    // ✅ London, UK - Approximate (based on Coventry)
    const londonTimetable: RamzanDate[] = coventryTimetable.map(day => ({
      ...day,
      sehri: adjustTime(day.sehri, 5), // 5 minutes later than Coventry
      iftar: adjustTime(day.iftar, 5), // 5 minutes later than Coventry
    }));

    // Return appropriate timetable
    switch(city) {
      case 'Coventry': return coventryTimetable;
      case 'London': return londonTimetable;
      case 'Islamabad': return islamabadTimetable;
      case 'Karachi': return karachiTimetable;
      default: return karachiTimetable;
    }
  };

  // ✅ 2025 FAKE TIMES (same as before)
  const get2025FakeTimes = (city: string): RamzanDate[] => {
    const ramzanStart = new Date(2025, 2, 2); // March 2, 2025
    const calendar: RamzanDate[] = [];
    
    // Base times for different cities
    const firstDayTimes: { [key: string]: { sehri: string, iftar: string } } = {
      'Karachi': { sehri: '05:38', iftar: '18:45' },
      'Islamabad': { sehri: '05:13', iftar: '18:20' },
      'Coventry': { sehri: '05:00', iftar: '18:15' },
      'London': { sehri: '04:55', iftar: '18:10' },
    };
    
    const baseTimes = firstDayTimes[city] || { sehri: '05:00', iftar: '18:30' };
    
    for (let day = 0; day < 30; day++) {
      const currentDate = new Date(ramzanStart);
      currentDate.setDate(ramzanStart.getDate() + day);

      // Convert to 12-hour format
      const convertTo12Hour = (time: string): string => {
        const [hour, minute] = time.split(':').map(Number);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const formattedHour = hour % 12 || 12;
        return `${formattedHour}:${minute.toString().padStart(2, '0')} ${ampm}`;
      };

      // Adjust Sehri time (earlier by 1 minute each day)
      const [sehriHour, sehriMinute] = baseTimes.sehri.split(':').map(Number);
      const adjustedSehriMinute = sehriMinute - day;
      const sehriTime = `${sehriHour}:${Math.max(0, adjustedSehriMinute).toString().padStart(2, '0')}`;

      // Adjust Iftar time (later by 1 minute every 2 days)
      const [iftarHour, iftarMinute] = baseTimes.iftar.split(':').map(Number);
      const adjustedIftarMinute = iftarMinute + Math.floor(day / 2);
      const iftarTime = `${iftarHour}:${adjustedIftarMinute.toString().padStart(2, '0')}`;

      calendar.push({
        day: day + 1,
        date: currentDate.toLocaleDateString('en-US', { 
          weekday: 'long',
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        }),
        sehri: convertTo12Hour(sehriTime),
        iftar: convertTo12Hour(iftarTime),
      });
    }
    
    return calendar;
  };

  // Helper function to adjust time
  const adjustTime = (time: string, minutes: number): string => {
    const [timePart, ampm] = time.split(' ');
    const [hour, minute] = timePart.split(':').map(Number);
    
    let newHour = hour;
    let newMinute = minute + minutes;
    
    while (newMinute >= 60) {
      newHour++;
      newMinute -= 60;
    }
    
    while (newMinute < 0) {
      newHour--;
      newMinute += 60;
    }
    
    // Handle AM/PM changes
    if (newHour >= 12) {
      if (ampm === 'AM' && newHour >= 12) {
        const formattedHour = newHour % 12 || 12;
        return `${formattedHour}:${newMinute.toString().padStart(2, '0')} PM`;
      }
    }
    
    if (newHour < 12 && ampm === 'PM') {
      const formattedHour = newHour % 12 || 12;
      return `${formattedHour}:${newMinute.toString().padStart(2, '0')} AM`;
    }
    
    const formattedHour = newHour % 12 || 12;
    return `${formattedHour}:${newMinute.toString().padStart(2, '0')} ${ampm}`;
  };

  // ✅ Function to get Bismillah color based on Ashra colors
  const getBismillahColor = (): string => {
    if (!is2026Theme) return 'text-gray-800';
    
    if (ashraColors) {
      // When Ashra colors are enabled
      if (darkMode) {
        return 'text-green-300';
      } else {
        return 'text-green-700';
      }
    } else {
      // When Ashra colors are disabled
      if (darkMode) {
        return 'text-white';
      } else {
        return 'text-gray-800';
      }
    }
  };

  // ✅ MAIN FUNCTION - LOAD MANUAL TIMES
  const loadCalendarData = () => {
    setLoading(true);
    try {
      if (year === 2026) {
        // Use EXACT manual timetables for 2026
        const timetable = get2026ManualTimetable(city);
        setRamzanDates(timetable);
      } else {
        // Use fake logic for 2025
        const fakeTimes = get2025FakeTimes(city);
        setRamzanDates(fakeTimes);
      }
    } catch (error) {
      console.error('Error loading calendar:', error);
      setRamzanDates([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCalendarData();
  }, [year, country, city]);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Toggle Ashra colors
  const toggleAshraColors = () => {
    setAshraColors(!ashraColors);
  };

  // Function to get Ashra color based on day
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

  // Function to handle printing
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className={`p-5 font-sans min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-800'}`}>
      
      {is2026Theme && (
  <div className={`text-center mb-6 py-4 ${darkMode ? 'border-b border-gray-700' : 'border-b border-green-200'}`}>
    
    {/* ﷽ Symbol */}
    <div className={`text-5xl mb-2 transition-colors duration-300 ${getBismillahColor()}`}>
      ﷽
    </div>

    {/* Bismillah Arabic */}
    <h1 className={`text-4xl font-arabic mb-2 transition-colors duration-300 ${getBismillahColor()}`}>
      بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ
    </h1>

    {/* English Translation */}
    <p className={`italic ${ashraColors ? 'text-green-600' : darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
      In the name of Allah, the Most Gracious, the Most Merciful
    </p>
  </div>
)}


      {/* Print Button */}
      <div className="flex justify-end mb-4 print:hidden">
        <button
          onClick={handlePrint}
          className={`p-2 rounded-lg ${darkMode ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'} text-white`}
        >
          Print Calendar
        </button>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold print:text-2xl">Ramzan Calendar {year}</h1>
        <div className="flex gap-4 print:hidden">
          <button
            onClick={toggleAshraColors}
            className={`p-2 rounded-lg ${darkMode ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-yellow-500 hover:bg-yellow-600'} text-white`}
          >
            {ashraColors ? 'Disable Ashra Colors' : 'Enable Ashra Colors'}
          </button>
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-lg ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
          >
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>
      </div>
      <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-6 print:hidden">
        <div>
          <label htmlFor="year" className="mr-2 text-lg">
            Select Year:
          </label>
          <input
            type="number"
            id="year"
            value={year}
            onChange={(e) => setYear(parseInt(e.target.value))}
            min="2025"
            max="2026"
            className={`p-2 border ${darkMode ? 'border-gray-700 bg-gray-800 text-white' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 ${darkMode ? 'focus:ring-blue-600' : 'focus:ring-blue-500'}`}
          />
        </div>
        <div>
          <label htmlFor="country" className="mr-2 text-lg">
            Select Country:
          </label>
          <select
            id="country"
            value={country}
            onChange={(e) => {
              const selectedCountry = e.target.value as keyof typeof cities;
              setCountry(selectedCountry);
              setCity(cities[selectedCountry][0]);
            }}
            className={`p-2 border ${darkMode ? 'border-gray-700 bg-gray-800 text-white' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 ${darkMode ? 'focus:ring-blue-600' : 'focus:ring-blue-500'}`}
          >
            <option value="Pakistan">Pakistan</option>
            <option value="UK">UK</option>
          </select>
        </div>
        <div>
          <label htmlFor="city" className="mr-2 text-lg">
            Select City:
          </label>
          <select
            id="city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className={`p-2 border ${darkMode ? 'border-gray-700 bg-gray-800 text-white' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 ${darkMode ? 'focus:ring-blue-600' : 'focus:ring-blue-500'}`}
          >
            {cities[country as keyof typeof cities].map((cityName) => (
              <option key={cityName} value={cityName}>
                {cityName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Roza Ki Niyat Aur Iftar Ki Niyat Ki Dua */}
      <div className={`mb-6 p-6 rounded-lg shadow-sm ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'} dua-section`}>
        <h2 className={`text-2xl font-bold mb-4 text-right print:text-xl ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          روزے کی نیت (افطار کی دعا)
        </h2>
        <div className="space-y-4">
          <div>
            <h3 className={`text-xl font-semibold text-right print:text-lg ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              روزے کی نیت
            </h3>
            <div className="flex flex-col">
              <p className="mt-2 text-right text-2xl font-arabic">
              وَبِصَوْمٍ غَدٍ نَوَيْتُ مِنْ شَهْرِ رَمَضَانِ
              </p>
              <p className={`mt-2 text-right ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                (ترجمہ: میں نے رمضان کے مہینے میں کل کے روزے کی نیت کی۔)
              </p>
              <p className={`mt-2 text-left ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                (Translation: I intend to keep the fast for tomorrow in the month of Ramadan.)
              </p>
            </div>
          </div>
          <div>
            <h3 className={`text-xl font-semibold text-right print:text-lg ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              (افطار کی دعا)
            </h3>
            <div className="flex flex-col">
              <p className="mt-2 text-right text-2xl font-arabic">
                اللَّهُمَّ إِنِّي لَكَ صُمْتُ وَ بِكَ آمَنْتُ وَ عَلَيْكَ تَوَكَّلْتُ وَعَلَى رِزْقِكَ أَفْطَرْتُ
              </p>
              <p className={`mt-2 text-right ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                (ترجمہ: اے اللہ، میں نے تیرے لیے روزہ رکھا اور تیرے رزق سے افطار کیا۔)
              </p>
              <p className={`mt-2 text-left ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
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
          <table
            className={`min-w-full ${darkMode ? 'border border-gray-700' : 'border border-gray-200'} shadow-sm rounded-lg overflow-hidden print:border-collapse print:w-full`}
          >
            <thead className={`${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
              <tr>
                <th className={`py-3 px-4 border-b text-left text-sm font-semibold print:py-2 print:px-2 print:text-xs ${darkMode ? 'border-gray-700 text-white' : 'border-gray-200'}`}>
                  Day
                </th>
                <th className={`py-3 px-4 border-b text-left text-sm font-semibold print:py-2 print:px-2 print:text-xs ${darkMode ? 'border-gray-700 text-white' : 'border-gray-200'}`}>
                  Date
                </th>
                <th className={`py-3 px-4 border-b text-left text-sm font-semibold print:py-2 print:px-2 print:text-xs ${darkMode ? 'border-gray-700 text-white' : 'border-gray-200'}`}>
                  Sehri Time
                </th>
                <th className={`py-3 px-4 border-b text-left text-sm font-semibold print:py-2 print:px-2 print:text-xs ${darkMode ? 'border-gray-700 text-white' : 'border-gray-200'}`}>
                  Iftar Time
                </th>
              </tr>
            </thead>
            <tbody>
              {ramzanDates.map(({ day, date, sehri, iftar }) => (
                <tr
                  key={day}
                  className={`${getAshraColor(day)} ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} transition-colors`}
                >
                  <td className={`py-3 px-4 border-b text-sm print:py-2 print:px-2 print:text-xs ${darkMode ? 'border-gray-700 text-white' : 'border-gray-200 text-gray-800'}`}>
                    Day {day}
                  </td>
                  <td className={`py-3 px-4 border-b text-sm print:py-2 print:px-2 print:text-xs ${darkMode ? 'border-gray-700 text-gray-300' : 'border-gray-200 text-gray-700'}`}>
                    {date}
                  </td>
                  <td className={`py-3 px-4 border-b text-sm print:py-2 print:px-2 print:text-xs ${darkMode ? 'border-gray-700 text-gray-300' : 'border-gray-200 text-gray-800'}`}>
                    {sehri}
                  </td>
                  <td className={`py-3 px-4 border-b text-sm print:py-2 print:px-2 print:text-xs ${darkMode ? 'border-gray-700 text-gray-300' : 'border-gray-200 text-gray-800'}`}>
                    {iftar}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center text-red-600">No data available. Please try again.</p>
      )}

      {/* Ashra Duas Section */}
      <div className={`mt-8 p-6 rounded-lg shadow-sm ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'} dua-section`}>
        <h2 className={`text-2xl font-bold mb-4 text-right print:text-xl ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          Ashra Duas
        </h2>
        <div className="space-y-4">
          <div>
            <h3 className={`text-xl font-semibold text-right print:text-lg ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              پہلا عشرہ رحمت
            </h3>
            <div className="flex flex-col">
              <p className="mt-2 text-right text-2xl font-arabic">
               رَبِّ اغْفِرُ وَارْحَمُ وَأَنْتَ خَيْرُ الرَّحِمِينَ
              </p>
              <p className={`mt-2 text-right ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                (ترجمہ: اے میرے رب مجھے بخش دے مجھ پر رحم فرما تو سب سے بہتر رحم فرمانے والا ہے۔)
              </p>
              <p className={`mt-2 text-left ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                (Translation: My Lord, forgive me and have mercy upon me, for You are the best of the merciful.)
              </p>
            </div>
          </div>
          <div>
            <h3 className={`text-xl font-semibold text-right print:text-lg ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              دوسرا عشرہ مغفرت
            </h3>
            <div className="flex flex-col">
              <p className="mt-2 text-right text-2xl font-arabic">
               أسْتَغْفِرُ اللهَ رَبي مِنْ كُلِ ذَنبٍ وَأتُوبُ إلَيهِ
              </p>
              <p className={`mt-2 text-right ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                (ترجمہ: میں اپنے رب اللہ سے ہر گناہ کی معافی مانگتا ہوں اور اس کی طرف توبہ کرتا ہوں۔)
              </p>
              <p className={`mt-2 text-left ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                (Translation: I seek forgiveness from Allah, my Lord, for every sin, and I turn to Him in repentance.)
              </p>
            </div>
          </div>
          <div>
            <h3 className={`text-xl font-semibold text-right print:text-lg ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              تیسرا عشرہ نجات
            </h3>
            <div className="flex flex-col">
              <p className="mt-2 text-right text-2xl font-arabic">
                اللَّهُمَّ أَجِرْنِي مِنَ النَّارِ
              </p>
              <p className={`mt-2 text-right ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                (ترجمہ: اے اللہ، مجھے دوزخ کی آگ سے بچا۔)
              </p>
              <p className={`mt-2 text-left ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                (Translation: O Allah, save me from the fire of Hell.)
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Print-Specific Styles */}
      <style jsx>{`
        @media print {
          body {
            background: white;
            color: black;
            font-size: 8pt;
            margin: 0;
            padding: 0;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .print-hidden {
            display: none;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            font-size: 8pt;
          }
          th, td {
            border: 1px solid #000;
            padding: 2px;
            text-align: left;
          }
          th {
            background-color: #f2f2f2;
          }
          .dua-section {
            page-break-inside: avoid;
            margin-bottom: 4px;
          }
          .dua-section h2 {
            font-size: 10pt;
            margin-bottom: 2px;
          }
          .dua-section h3 {
            font-size: 9pt;
            margin-bottom: 2px;
          }
          .dua-section p {
            font-size: 8pt;
            margin-bottom: 2px;
          }
          .text-right {
            text-align: right;
          }
          .text-left {
            text-align: left;
          }
          .bg-green-100 {
            background-color: #f0fff4 !important;
          }
          .bg-blue-100 {
            background-color: #ebf8ff !important;
          }
          .bg-purple-100 {
            background-color: #faf5ff !important;
          }
        }
      `}</style>
    </div>
  );
};

export default RamzanCalendar;
