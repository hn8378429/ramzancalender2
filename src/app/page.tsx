'use client';
import { useState, useEffect, useCallback } from 'react';

interface PrayerTimes {
  Fajr: string;
  Maghrib: string;
}

interface RamzanDate {
  day: number;
  date: string;
  sehri: string;
  iftar: string;
}

const RamzanCalendar = () => {
  const [year, setYear] = useState<number>(2025); // Default year set to 2025
  const [country, setCountry] = useState<string>('Pakistan'); // Default country
  const [city, setCity] = useState<string>('Karachi'); // Default city
  const [ramzanDates, setRamzanDates] = useState<RamzanDate[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [darkMode, setDarkMode] = useState<boolean>(false); // Dark mode state
  const [ashraColors, setAshraColors] = useState<boolean>(false); // Ashra colors state

  // Cities for Pakistan and UK
  const cities = {
    Pakistan: ['Karachi', 'Lahore', 'Islamabad', 'Peshawar', 'Quetta'],
    UK: ['London', 'Birmingham', 'Manchester', 'Glasgow', 'Edinburgh'],
  };

  // Function to convert 24-hour time to 12-hour time
  const convertTo12HourFormat = (time: string): string => {
    const [hour, minute] = time.split(':');
    const parsedHour = parseInt(hour);
    const ampm = parsedHour >= 12 ? 'PM' : 'AM';
    const formattedHour = parsedHour % 12 || 12; // Convert 0 to 12 for 12 AM
    return `${formattedHour}:${minute} ${ampm}`;
  };

  // Function to fetch Sehri and Iftar times from Aladhan API
  const fetchPrayerTimes = useCallback(async (year: number, country: string, city: string) => {
    setLoading(true);
    try {
      // Set method based on country
      const method = country === 'Pakistan' ? 2 : 1; // Use method=2 for Pakistan, method=1 for UK
      const apiUrl = `https://api.aladhan.com/v1/calendarByCity?city=${city}&country=${country}&method=${method}&month=3&year=${year}`;
      console.log('API URL:', apiUrl); // Log API URL for debugging

      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error('API call failed');
      }
      const data = await response.json();
      console.log('API Response:', data); // Log API response for debugging

      // Check if data.data exists and is an array
      if (!data.data || !Array.isArray(data.data)) {
        throw new Error('Invalid API response format');
      }

      const ramzanStart = new Date(year, 2, 2); // Ramzan starts on March 2, 2025
      const calendar: RamzanDate[] = [];
      for (let day = 0; day < 30; day++) {
        const currentDate = new Date(ramzanStart);
        currentDate.setDate(ramzanStart.getDate() + day);

        // Check if data.data[day] exists and has timings
        if (!data.data[day] || !data.data[day].timings) {
          console.error(`Invalid data for day ${day + 1}`);
          continue;
        }

        const prayerTimes: PrayerTimes = data.data[day].timings;
        calendar.push({
          day: day + 1,
          date: currentDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
          sehri: convertTo12HourFormat(prayerTimes.Fajr),
          iftar: convertTo12HourFormat(prayerTimes.Maghrib),
        });
      }
      setRamzanDates(calendar);
    } catch (error) {
      console.error('Error fetching prayer times:', error);
      setRamzanDates([]); // Set empty array if API call fails
    } finally {
      setLoading(false); // Ensure loading is set to false
    }
  }, []);

  useEffect(() => {
    fetchPrayerTimes(year, country, city);
  }, [year, country, city, fetchPrayerTimes]);

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
    if (!ashraColors) return darkMode ? 'bg-gray-800' : 'bg-white'; // Default color
    if (day <= 10) {
      return darkMode ? 'bg-green-900' : 'bg-green-100'; // First Ashra
    } else if (day <= 20) {
      return darkMode ? 'bg-blue-900' : 'bg-blue-100'; // Second Ashra
    } else {
      return darkMode ? 'bg-purple-900' : 'bg-purple-100'; // Third Ashra
    }
  };

  // Function to handle printing
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className={`p-5 font-sans min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-800'}`}>
      {/* Print Button */}
      <div className="flex justify-end mb-4 print:hidden">
        <button
          onClick={handlePrint}
          className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
        >
          Print Calendar
        </button>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold print:text-2xl">Ramzan Calendar {year}</h1>
        <div className="flex gap-4 print:hidden">
          <button
            onClick={toggleAshraColors}
            className="p-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
          >
            {ashraColors ? 'Disable Ashra Colors' : 'Enable Ashra Colors'}
          </button>
          <button
            onClick={toggleDarkMode}
            className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
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
            min="2020"
            max="2030"
            className={`p-2 border ${
              darkMode ? 'border-gray-700 bg-gray-800 text-white' : 'border-gray-300'
            } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
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
              setCity(cities[selectedCountry][0]); // Reset city to first city of selected country
            }}
            className={`p-2 border ${
              darkMode ? 'border-gray-700 bg-gray-800 text-white' : 'border-gray-300'
            } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
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
            className={`p-2 border ${
              darkMode ? 'border-gray-700 bg-gray-800 text-white' : 'border-gray-300'
            } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
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
      <div className={`mb-6 p-6 rounded-lg shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'} dua-section`}>
        <h2 className="text-2xl font-bold mb-4 text-right print:text-xl"> روزے کی نیت (افطار کی دعا)</h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-semibold text-right print:text-lg">روزے کی نیت</h3>
            <div className="flex flex-col">
              <p className="mt-2 text-right">وَبِصَوْمٍ غَدٍ نَوَيْتُ مِنْ شَهْرِ رَمَضَانِ</p>
              <p className="mt-2 text-right">(ترجمہ: میں نے رمضان کے مہینے میں کل کے روزے کی نیت کی۔)</p>
              <p className="mt-2 text-left">(Translation: I intend to keep the fast for tomorrow in the month of Ramadan.)</p>
            </div>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-right print:text-lg">(افطار کی دعا)</h3>
            <div className="flex flex-col">
              <p className="mt-2 text-right">اللَّهُمَّ إِنِّي لَكَ صُمْتُ وَ بِكَ آمَنْتُ وَ عَلَيْكَ تَوَكَّلْتُ وَعَلَى رِزْقِكَ أَفْطَرْتُ</p>
              <p className="mt-2 text-right">(ترجمہ: اے اللہ، میں نے تیرے لیے روزہ رکھا اور تیرے رزق سے افطار کیا۔)</p>
              <p className="mt-2 text-left">(Translation: O Allah, I fasted for You and I break my fast with Your sustenance.)</p>
            </div>
          </div>
        </div>
      </div>
      {loading ? (
        <p className="text-center">Loading...</p>
      ) : ramzanDates.length > 0 ? (
        <div className="overflow-x-auto">
          <table
            className={`min-w-full border ${
              darkMode ? 'border-gray-700' : 'border-gray-200'
            } shadow-sm rounded-lg overflow-hidden print:border-collapse print:w-full`}
          >
            <thead className={`${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
              <tr>
                <th className="py-3 px-4 border-b text-left text-sm font-semibold print:py-2 print:px-2 print:text-xs">
                  Day
                </th>
                <th className="py-3 px-4 border-b text-left text-sm font-semibold print:py-2 print:px-2 print:text-xs">
                  Date
                </th>
                <th className="py-3 px-4 border-b text-left text-sm font-semibold print:py-2 print:px-2 print:text-xs">
                  Sehri Time
                </th>
                <th className="py-3 px-4 border-b text-left text-sm font-semibold print:py-2 print:px-2 print:text-xs">
                  Iftar Time
                </th>
              </tr>
            </thead>
            <tbody>
              {ramzanDates.map(({ day, date, sehri, iftar }) => (
                <tr
                  key={day}
                  className={`${getAshraColor(day)} ${
                    darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                  } transition-colors`}
                >
                  <td className={`py-3 px-4 border-b text-sm ${darkMode ? 'border-gray-700' : 'border-gray-200'} print:py-2 print:px-2 print:text-xs`}>
                    Day {day}
                  </td>
                  <td className={`py-3 px-4 border-b text-sm ${darkMode ? 'border-gray-700' : 'border-gray-200'} print:py-2 print:px-2 print:text-xs`}>
                    {date}
                  </td>
                  <td className={`py-3 px-4 border-b text-sm ${darkMode ? 'border-gray-700' : 'border-gray-200'} print:py-2 print:px-2 print:text-xs`}>
                    {sehri}
                  </td>
                  <td className={`py-3 px-4 border-b text-sm ${darkMode ? 'border-gray-700' : 'border-gray-200'} print:py-2 print:px-2 print:text-xs`}>
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
      <div className={`mt-8 p-6 rounded-lg shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'} dua-section`}>
        <h2 className="text-2xl font-bold mb-4 text-right print:text-xl">Ashra Duas</h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-semibold text-right print:text-lg">پہلا عشرہ رحمت</h3>
            <div className="flex flex-col">
              <p className="mt-2 text-right">رَبِّ اغْفِرُ وَارْحَمُ وَأَنْتَ خَيْرُ الرَّحِمِينَ</p>
              <p className="mt-2 text-right">(ترجمہ: اے میرے رب مجھے بخش دے مجھ پر رحم فرما تو سب سے بہتر رحم فرمانے والا ہے۔)</p>
              <p className="mt-2 text-left">(Translation: My Lord, forgive me and have mercy upon me, for You are the best of the merciful.)</p>
            </div>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-right print:text-lg">دوسرا عشرہ مغفرت</h3>
            <div className="flex flex-col">
              <p className="mt-2 text-right">أسْتَغْفِرُ اللهَ رَبي مِنْ كُلِ ذَنبٍ وَأتُوبُ إلَيهِ</p>
              <p className="mt-2 text-right">(ترجمہ: میں اپنے رب اللہ سے ہر گناہ کی معافی مانگتا ہوں اور اس کی طرف توبہ کرتا ہوں۔)</p>
              <p className="mt-2 text-left">(Translation: I seek forgiveness from Allah, my Lord, for every sin, and I turn to Him in repentance.)</p>
            </div>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-right print:text-lg">تیسرا عشرة نجات</h3>
            <div className="flex flex-col">
              <p className="mt-2 text-right">اللَّهُمَّ أَجِرْنِي مِنَ النَّارِ</p>
              <p className="mt-2 text-right">(ترجمہ: اے اللہ، مجھے دوزخ کی آگ سے بچا۔)</p>
              <p className="mt-2 text-left">(Translation: O Allah, save me from the fire of Hell.)</p>
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
            font-size: 8pt; /* Smaller font size for printing */
            margin: 0; /* Remove default margin */
            padding: 0; /* Remove default padding */
          }
          .print-hidden {
            display: none; /* Hide unnecessary elements */
          }
          table {
            width: 100%;
            border-collapse: collapse;
            font-size: 8pt; /* Smaller font size for table */
          }
          th, td {
            border: 1px solid #000;
            padding: 2px; /* Reduce padding */
            text-align: left;
          }
          th {
            background-color: #f2f2f2;
          }
          .dua-section {
            page-break-inside: avoid; /* Prevent duas from splitting across pages */
            margin-bottom: 4px; /* Reduce margin */
          }
          .dua-section h2 {
            font-size: 10pt; /* Smaller heading size */
            margin-bottom: 2px; /* Reduce margin */
          }
          .dua-section h3 {
            font-size: 9pt; /* Smaller subheading size */
            margin-bottom: 2px; /* Reduce margin */
          }
          .dua-section p {
            font-size: 8pt; /* Smaller text size */
            margin-bottom: 2px; /* Reduce margin */
          }
          .text-right {
            text-align: right; /* Ensure Arabic text is right-aligned */
          }
          .text-left {
            text-align: left; /* Ensure translations are left-aligned */
          }
        }
      `}</style>
    </div>
  );
};

export default RamzanCalendar;
