'use client';

import { useState, useEffect } from 'react';

const RamzanCalendar = () => {
  const [year, setYear] = useState(2025); // Default year set to 2025
  const [country, setCountry] = useState('Pakistan'); // Default country
  const [city, setCity] = useState('Karachi'); // Default city
  const [ramzanDates, setRamzanDates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false); // Dark mode state
  const [ashraColors, setAshraColors] = useState(false); // Ashra colors state

  // Cities for Pakistan and UK
  const cities = {
    Pakistan: ['Karachi', 'Lahore', 'Islamabad', 'Peshawar', 'Quetta'],
    UK: ['London', 'Birmingham', 'Manchester', 'Glasgow', 'Edinburgh'],
  };

  // Function to convert 24-hour time to 12-hour time
  const convertTo12HourFormat = (time) => {
    const [hour, minute] = time.split(':');
    const parsedHour = parseInt(hour);
    const ampm = parsedHour >= 12 ? 'PM' : 'AM';
    const formattedHour = parsedHour % 12 || 12; // Convert 0 to 12 for 12 AM
    return `${formattedHour}:${minute} ${ampm}`;
  };

  // Function to fetch Sehri and Iftar times from Aladhan API
  const fetchPrayerTimes = async (year, country, city) => {
    setLoading(true);
    try {
      // Set method based on country
      const method = country === 'Pakistan' ? 2 : 1; // Use method=2 for Pakistan, method=1 for UK
      const response = await fetch(
        `https://api.aladhan.com/v1/calendarByCity?city=${city}&country=${country}&method=${method}&month=3&year=${year}`
      );
      if (!response.ok) {
        throw new Error('API call failed');
      }
      const data = await response.json();
      console.log('API Response:', data); // Log API response
      const ramzanStart = new Date(year, 2, 2); // Ramzan starts on March 2, 2025
      const calendar = [];

      for (let day = 0; day < 30; day++) {
        const currentDate = new Date(ramzanStart);
        currentDate.setDate(ramzanStart.getDate() + day);
        const prayerTimes = data.data[day].timings;
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
  };

  useEffect(() => {
    fetchPrayerTimes(year, country, city);
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
  const getAshraColor = (day) => {
    if (!ashraColors) return darkMode ? 'bg-gray-800' : 'bg-white'; // Default color
    if (day <= 10) {
      return darkMode ? 'bg-green-900' : 'bg-green-100'; // First Ashra
    } else if (day <= 20) {
      return darkMode ? 'bg-blue-900' : 'bg-blue-100'; // Second Ashra
    } else {
      return darkMode ? 'bg-purple-900' : 'bg-purple-100'; // Third Ashra
    }
  };

  return (
    <div className={`p-5 font-sans min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-800'}`}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Ramzan Calendar {year}</h1>
        <div className="flex gap-4">
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
      <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-6">
        <div>
          <label htmlFor="year" className="mr-2 text-lg">Select Year:</label>
          <input
            type="number"
            id="year"
            value={year}
            onChange={(e) => setYear(parseInt(e.target.value))}
            min="2020"
            max="2030"
            className={`p-2 border ${darkMode ? 'border-gray-700 bg-gray-800 text-white' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
        </div>
        <div>
          <label htmlFor="country" className="mr-2 text-lg">Select Country:</label>
          <select
            id="country"
            value={country}
            onChange={(e) => {
              setCountry(e.target.value);
              setCity(cities[e.target.value][0]); // Reset city to first city of selected country
            }}
            className={`p-2 border ${darkMode ? 'border-gray-700 bg-gray-800 text-white' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
          >
            <option value="Pakistan">Pakistan</option>
            <option value="UK">UK</option>
          </select>
        </div>
        <div>
          <label htmlFor="city" className="mr-2 text-lg">Select City:</label>
          <select
            id="city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className={`p-2 border ${darkMode ? 'border-gray-700 bg-gray-800 text-white' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
          >
            {cities[country].map((cityName) => (
              <option key={cityName} value={cityName}>
                {cityName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Roza Ki Niyat Aur Iftar Ki Niyat Ki Dua */}
      <div className={`mb-6 p-6 rounded-lg shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <h2 className="text-2xl font-bold mb-4"> روزے کی نیت (افطار کی دعا)</h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-semibold">روزے کی نیت</h3>
            <p className="mt-2">
            وَبِصَوْمٍ غَدٍ نَوَيْتُ مِنْ شَهْرِ رَمَضَانِ 
              <br />
              (Translation: I intend to keep the fast for tomorrow in the month of Ramadan.)
              <br />
              (ترجمہ: میں نے رمضان کے مہینے میں کل کے روزے کی نیت کی۔)
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold">(افطار کی دعا)</h3>
            <p className="mt-2">
            اللَّهُمَّ إِنِّي لَكَ صُمْتُ وَ بِكَ آمَنْتُ وَ عَلَيْكَ تَوَكَّلْتُ وَعَلَى رِزْقِكَ أَفْطَرْتُ
              <br />
              (Translation: O Allah, I fasted for You and I break my fast with Your sustenance.)
              <br />
              (ترجمہ: اے اللہ، میں نے تیرے لیے روزہ رکھا اور تیرے رزق سے افطار کیا۔)
            </p>
          </div>
        </div>
      </div>

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : ramzanDates.length > 0 ? (
        <div className="overflow-x-auto">
          <table className={`min-w-full border ${darkMode ? 'border-gray-700' : 'border-gray-200'} shadow-sm rounded-lg overflow-hidden`}>
            <thead className={`${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
              <tr>
                <th className="py-3 px-4 border-b text-left text-sm font-semibold">Day</th>
                <th className="py-3 px-4 border-b text-left text-sm font-semibold">Date</th>
                <th className="py-3 px-4 border-b text-left text-sm font-semibold">Sehri Time</th>
                <th className="py-3 px-4 border-b text-left text-sm font-semibold">Iftar Time</th>
              </tr>
            </thead>
            <tbody>
              {ramzanDates.map(({ day, date, sehri, iftar }) => (
                <tr key={day} className={`${getAshraColor(day)} ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} transition-colors`}>
                  <td className={`py-3 px-4 border-b text-sm ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>Day {day}</td>
                  <td className={`py-3 px-4 border-b text-sm ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>{date}</td>
                  <td className={`py-3 px-4 border-b text-sm ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>{sehri}</td>
                  <td className={`py-3 px-4 border-b text-sm ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>{iftar}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center text-red-600">No data available. Please try again.</p>
      )}

      {/* Ashra Duas Section */}
      <div className={`mt-8 p-6 rounded-lg shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <h2 className="text-2xl font-bold mb-4">Ashra Duas</h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-semibold">First Ashra Dua</h3>
            <p className="mt-2">
            رَبِّ اغْفِرُ وَارْحَمُ وَأَنْتَ خَيْرُ الرَّحِمِينَ 
              <br />
              (Translation: My Lord, forgive me and have mercy upon me, for You are the best of the merciful.)
              <br />
              (ترجمہ: اے میرے رب مجھے بخش دے مجھ پر رحم فرما تو سب سے بہتر رحم فرمانے والا ہے۔)
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold">Second Ashra Dua</h3>
            <p className="mt-2">
              أسْتَغْفِرُ اللهَ رَبي مِنْ كُلِ ذَنبٍ وَأتُوبُ إلَيهِ
              <br />
              (Translation:   I seek forgiveness from Allah, my Lord, for every sin, and I turn to Him in repentance..)
              <br />
              (ترجمہ: میں اپنے رب اللہ سے ہر گناہ کی معافی مانگتا ہوں اور اس کی طرف توبہ کرتا ہوں۔)
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold">Third Ashra Dua</h3>
            <p className="mt-2">
              اللَّهُمَّ أَجِرْنِي مِنَ النَّارِ
              <br />
              (Translation: "O Allah, save me from the fire of Hell.".)
              <br />
              (ترجمہ: اے اللہ، مجھے دوزخ کی آگ سے بچا۔)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RamzanCalendar;