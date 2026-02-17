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

// ✅ Animation start times for each city
const animationStartTimes: Record<string, { date: string; time: string }> = {
  // UK Cities - 18 Feb se
  'Scunthorpe': { date: 'Wednesday, February 18, 2026', time: '05:24 PM' },
  'Coventry': { date: 'Wednesday, February 18, 2026', time: '05:26 PM' },
  'London': { date: 'Wednesday, February 18, 2026', time: '05:21 PM' },
  'Birmingham': { date: 'Wednesday, February 18, 2026', time: '05:21 PM' },
  
  // Pakistan Cities - 19 Feb se
  'Islamabad': { date: 'Thursday, February 19, 2026', time: '05:56 PM' },
  'Karachi': { date: 'Thursday, February 19, 2026', time: '06:28 PM' },
  'Lahore': { date: 'Thursday, February 19, 2026', time: '06:28 PM' },
  'Faisalabad': { date: 'Thursday, February 19, 2026', time: '06:28 PM' },
};

// ✅ UK Cities - Sab 18 Feb se start
const ukCityRamzanData: Record<string, RamzanDate[]> = {
  'Scunthorpe': [
    { day: 1, date: 'Wednesday, February 18, 2026', sehri: '05:38 AM', iftar: '05:24 PM' },
    { day: 2, date: 'Thursday, February 19, 2026', sehri: '05:36 AM', iftar: '05:26 PM' },
    { day: 3, date: 'Friday, February 20, 2026', sehri: '05:34 AM', iftar: '05:28 PM' },
    { day: 4, date: 'Saturday, February 21, 2026', sehri: '05:32 AM', iftar: '05:30 PM' },
    { day: 5, date: 'Sunday, February 22, 2026', sehri: '05:30 AM', iftar: '05:32 PM' },
    { day: 6, date: 'Monday, February 23, 2026', sehri: '05:28 AM', iftar: '05:34 PM' },
    { day: 7, date: 'Tuesday, February 24, 2026', sehri: '05:26 AM', iftar: '05:36 PM' },
    { day: 8, date: 'Wednesday, February 25, 2026', sehri: '05:23 AM', iftar: '05:37 PM' },
    { day: 9, date: 'Thursday, February 26, 2026', sehri: '05:21 AM', iftar: '05:39 PM' },
    { day: 10, date: 'Friday, February 27, 2026', sehri: '05:19 AM', iftar: '05:41 PM' },
    { day: 11, date: 'Saturday, February 28, 2026', sehri: '05:17 AM', iftar: '05:43 PM' },
    { day: 12, date: 'Sunday, March 1, 2026', sehri: '05:15 AM', iftar: '05:45 PM' },
    { day: 13, date: 'Monday, March 2, 2026', sehri: '05:13 AM', iftar: '05:47 PM' },
    { day: 14, date: 'Tuesday, March 3, 2026', sehri: '05:10 AM', iftar: '05:49 PM' },
    { day: 15, date: 'Wednesday, March 4, 2026', sehri: '05:08 AM', iftar: '05:51 PM' },
    { day: 16, date: 'Thursday, March 5, 2026', sehri: '05:06 AM', iftar: '05:53 PM' },
    { day: 17, date: 'Friday, March 6, 2026', sehri: '05:04 AM', iftar: '05:55 PM' },
    { day: 18, date: 'Saturday, March 7, 2026', sehri: '05:01 AM', iftar: '05:57 PM' },
    { day: 19, date: 'Sunday, March 8, 2026', sehri: '04:59 AM', iftar: '05:59 PM' },
    { day: 20, date: 'Monday, March 9, 2026', sehri: '04:57 AM', iftar: '06:00 PM' },
    { day: 21, date: 'Tuesday, March 10, 2026', sehri: '04:54 AM', iftar: '06:02 PM' },
    { day: 22, date: 'Wednesday, March 11, 2026', sehri: '04:52 AM', iftar: '06:04 PM' },
    { day: 23, date: 'Thursday, March 12, 2026', sehri: '04:50 AM', iftar: '06:04 PM' },
    { day: 24, date: 'Friday, March 13, 2026', sehri: '04:47 AM', iftar: '06:08 PM' },
    { day: 25, date: 'Saturday, March 14, 2026', sehri: '04:45 AM', iftar: '06:10 PM' },
    { day: 26, date: 'Sunday, March 15, 2026', sehri: '04:43 AM', iftar: '06:12 PM' },
    { day: 27, date: 'Monday, March 16, 2026', sehri: '04:41 AM', iftar: '06:14 PM' },
    { day: 28, date: 'Tuesday, March 17, 2026', sehri: '04:38 AM', iftar: '06:15 PM' },
    { day: 29, date: 'Wednesday, March 18, 2026', sehri: '04:36 AM', iftar: '06:17 PM' },
    { day: 30, date: 'Thursday, March 19, 2026', sehri: '04:34 AM', iftar: '06:19 PM' },
  ],
  'Coventry': [
    { day: 1, date: 'Wednesday, February 18, 2026', sehri: '05:32 AM', iftar: '05:26 PM' },
    { day: 2, date: 'Thursday, February 19, 2026', sehri: '05:30 AM', iftar: '05:28 PM' },
    { day: 3, date: 'Friday, February 20, 2026', sehri: '05:28 AM', iftar: '05:30 PM' },
    { day: 4, date: 'Saturday, February 21, 2026', sehri: '05:26 AM', iftar: '05:32 PM' },
    { day: 5, date: 'Sunday, February 22, 2026', sehri: '05:24 AM', iftar: '05:34 PM' },
    { day: 6, date: 'Monday, February 23, 2026', sehri: '05:21 AM', iftar: '05:36 PM' },
    { day: 7, date: 'Tuesday, February 24, 2026', sehri: '05:19 AM', iftar: '05:38 PM' },
    { day: 8, date: 'Wednesday, February 25, 2026', sehri: '05:17 AM', iftar: '05:40 PM' },
    { day: 9, date: 'Thursday, February 26, 2026', sehri: '05:15 AM', iftar: '05:41 PM' },
    { day: 10, date: 'Friday, February 27, 2026', sehri: '05:12 AM', iftar: '05:43 PM' },
    { day: 11, date: 'Saturday, February 28, 2026', sehri: '05:10 AM', iftar: '05:45 PM' },
    { day: 12, date: 'Sunday, March 1, 2026', sehri: '05:08 AM', iftar: '05:47 PM' },
    { day: 13, date: 'Monday, March 2, 2026', sehri: '05:06 AM', iftar: '05:49 PM' },
    { day: 14, date: 'Tuesday, March 3, 2026', sehri: '05:04 AM', iftar: '05:51 PM' },
    { day: 15, date: 'Wednesday, March 4, 2026', sehri: '05:01 AM', iftar: '05:52 PM' },
    { day: 16, date: 'Thursday, March 5, 2026', sehri: '04:59 AM', iftar: '05:54 PM' },
    { day: 17, date: 'Friday, March 6, 2026', sehri: '04:57 AM', iftar: '05:56 PM' },
    { day: 18, date: 'Saturday, March 7, 2026', sehri: '04:55 AM', iftar: '05:58 PM' },
    { day: 19, date: 'Sunday, March 8, 2026', sehri: '04:51 AM', iftar: '06:00 PM' },
    { day: 20, date: 'Monday, March 9, 2026', sehri: '04:50 AM', iftar: '06:01 PM' },
    { day: 21, date: 'Tuesday, March 10, 2026', sehri: '04:48 AM', iftar: '06:03 PM' },
    { day: 22, date: 'Wednesday, March 11, 2026', sehri: '04:46 AM', iftar: '06:05 PM' },
    { day: 23, date: 'Thursday, March 12, 2026', sehri: '04:43 AM', iftar: '06:07 PM' },
    { day: 24, date: 'Friday, March 13, 2026', sehri: '04:41 AM', iftar: '06:09 PM' },
    { day: 25, date: 'Saturday, March 14, 2026', sehri: '04:39 AM', iftar: '06:10 PM' },
    { day: 26, date: 'Sunday, March 15, 2026', sehri: '04:36 AM', iftar: '06:12 PM' },
    { day: 27, date: 'Monday, March 16, 2026', sehri: '04:34 AM', iftar: '06:14 PM' },
    { day: 28, date: 'Tuesday, March 17, 2026', sehri: '04:32 AM', iftar: '06:17 PM' },
    { day: 29, date: 'Wednesday, March 18, 2026', sehri: '04:30 AM', iftar: '06:19 PM' },
    { day: 30, date: 'Thursday, March 19, 2026', sehri: '04:28 AM', iftar: '06:21 PM' },
  ],
  'London': [
    { day: 1, date: 'Wednesday, February 18, 2026', sehri: '05:17 AM', iftar: '05:21 PM' },
    { day: 2, date: 'Thursday, February 19, 2026', sehri: '05:15 AM', iftar: '05:23 PM' },
    { day: 3, date: 'Friday, February 20, 2026', sehri: '05:13 AM', iftar: '05:25 PM' },
    { day: 4, date: 'Saturday, February 21, 2026', sehri: '05:11 AM', iftar: '05:26 PM' },
    { day: 5, date: 'Sunday, February 22, 2026', sehri: '05:09 AM', iftar: '05:28 PM' },
    { day: 6, date: 'Monday, February 23, 2026', sehri: '05:07 AM', iftar: '05:30 PM' },
    { day: 7, date: 'Tuesday, February 24, 2026', sehri: '05:05 AM', iftar: '05:32 PM' },
    { day: 8, date: 'Wednesday, February 25, 2026', sehri: '05:03 AM', iftar: '05:34 PM' },
    { day: 9, date: 'Thursday, February 26, 2026', sehri: '05:01 AM', iftar: '05:35 PM' },
    { day: 10, date: 'Friday, February 27, 2026', sehri: '04:59 AM', iftar: '05:37 PM' },
    { day: 11, date: 'Saturday, February 28, 2026', sehri: '04:57 AM', iftar: '05:39 PM' },
    { day: 12, date: 'Sunday, March 1, 2026', sehri: '04:55 AM', iftar: '05:41 PM' },
    { day: 13, date: 'Monday, March 2, 2026', sehri: '04:53 AM', iftar: '05:42 PM' },
    { day: 14, date: 'Tuesday, March 3, 2026', sehri: '04:51 AM', iftar: '05:44 PM' },
    { day: 15, date: 'Wednesday, March 4, 2026', sehri: '04:48 AM', iftar: '05:46 PM' },
    { day: 16, date: 'Thursday, March 5, 2026', sehri: '04:46 AM', iftar: '05:48 PM' },
    { day: 17, date: 'Friday, March 6, 2026', sehri: '04:44 AM', iftar: '05:49 PM' },
    { day: 18, date: 'Saturday, March 7, 2026', sehri: '04:42 AM', iftar: '05:51 PM' },
    { day: 19, date: 'Sunday, March 8, 2026', sehri: '04:39 AM', iftar: '05:53 PM' },
    { day: 20, date: 'Monday, March 9, 2026', sehri: '04:37 AM', iftar: '05:55 PM' },
    { day: 21, date: 'Tuesday, March 10, 2026', sehri: '04:35 AM', iftar: '05:56 PM' },
    { day: 22, date: 'Wednesday, March 11, 2026', sehri: '04:32 AM', iftar: '05:58 PM' },
    { day: 23, date: 'Thursday, March 12, 2026', sehri: '04:30 AM', iftar: '06:00 PM' },
    { day: 24, date: 'Friday, March 13, 2026', sehri: '04:27 AM', iftar: '06:01 PM' },
    { day: 25, date: 'Saturday, March 14, 2026', sehri: '04:25 AM', iftar: '06:03 PM' },
    { day: 26, date: 'Sunday, March 15, 2026', sehri: '04:22 AM', iftar: '06:05 PM' },
    { day: 27, date: 'Monday, March 16, 2026', sehri: '04:20 AM', iftar: '06:07 PM' },
    { day: 28, date: 'Tuesday, March 17, 2026', sehri: '04:17 AM', iftar: '06:08 PM' },
    { day: 29, date: 'Wednesday, March 18, 2026', sehri: '04:15 AM', iftar: '06:10 PM' },
    { day: 30, date: 'Thursday, March 19, 2026', sehri: '04:12 AM', iftar: '06:12 PM' },
  ],
  'Birmingham': [
    { day: 1, date: 'Wednesday, February 18, 2026', sehri: '05:17 AM', iftar: '05:21 PM' },
    { day: 2, date: 'Thursday, February 19, 2026', sehri: '05:15 AM', iftar: '05:23 PM' },
    { day: 3, date: 'Friday, February 20, 2026', sehri: '05:13 AM', iftar: '05:25 PM' },
    { day: 4, date: 'Saturday, February 21, 2026', sehri: '05:11 AM', iftar: '05:26 PM' },
    { day: 5, date: 'Sunday, February 22, 2026', sehri: '05:09 AM', iftar: '05:28 PM' },
    { day: 6, date: 'Monday, February 23, 2026', sehri: '05:07 AM', iftar: '05:30 PM' },
    { day: 7, date: 'Tuesday, February 24, 2026', sehri: '05:05 AM', iftar: '05:32 PM' },
    { day: 8, date: 'Wednesday, February 25, 2026', sehri: '05:03 AM', iftar: '05:34 PM' },
    { day: 9, date: 'Thursday, February 26, 2026', sehri: '05:01 AM', iftar: '05:35 PM' },
    { day: 10, date: 'Friday, February 27, 2026', sehri: '04:59 AM', iftar: '05:37 PM' },
    { day: 11, date: 'Saturday, February 28, 2026', sehri: '04:57 AM', iftar: '05:39 PM' },
    { day: 12, date: 'Sunday, March 1, 2026', sehri: '04:55 AM', iftar: '05:41 PM' },
    { day: 13, date: 'Monday, March 2, 2026', sehri: '04:53 AM', iftar: '05:42 PM' },
    { day: 14, date: 'Tuesday, March 3, 2026', sehri: '04:51 AM', iftar: '05:44 PM' },
    { day: 15, date: 'Wednesday, March 4, 2026', sehri: '04:48 AM', iftar: '05:46 PM' },
    { day: 16, date: 'Thursday, March 5, 2026', sehri: '04:46 AM', iftar: '05:48 PM' },
    { day: 17, date: 'Friday, March 6, 2026', sehri: '04:44 AM', iftar: '05:49 PM' },
    { day: 18, date: 'Saturday, March 7, 2026', sehri: '04:42 AM', iftar: '05:51 PM' },
    { day: 19, date: 'Sunday, March 8, 2026', sehri: '04:39 AM', iftar: '05:53 PM' },
    { day: 20, date: 'Monday, March 9, 2026', sehri: '04:37 AM', iftar: '05:55 PM' },
    { day: 21, date: 'Tuesday, March 10, 2026', sehri: '04:35 AM', iftar: '05:56 PM' },
    { day: 22, date: 'Wednesday, March 11, 2026', sehri: '04:32 AM', iftar: '05:58 PM' },
    { day: 23, date: 'Thursday, March 12, 2026', sehri: '04:30 AM', iftar: '06:00 PM' },
    { day: 24, date: 'Friday, March 13, 2026', sehri: '04:27 AM', iftar: '06:01 PM' },
    { day: 25, date: 'Saturday, March 14, 2026', sehri: '04:25 AM', iftar: '06:03 PM' },
    { day: 26, date: 'Sunday, March 15, 2026', sehri: '04:22 AM', iftar: '06:05 PM' },
    { day: 27, date: 'Monday, March 16, 2026', sehri: '04:20 AM', iftar: '06:07 PM' },
    { day: 28, date: 'Tuesday, March 17, 2026', sehri: '04:17 AM', iftar: '06:08 PM' },
    { day: 29, date: 'Wednesday, March 18, 2026', sehri: '04:15 AM', iftar: '06:10 PM' },
    { day: 30, date: 'Thursday, March 19, 2026', sehri: '04:12 AM', iftar: '06:12 PM' },
  ],
};

// ✅ Pakistan Cities - 19 Feb se start
const pakistanCityRamzanData: Record<string, RamzanDate[]> = {
  'Islamabad': [
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
  ],
  'Karachi': [
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
  ],
  'Lahore': [
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
  ],
  'Faisalabad': [
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
  ],
};

const RamzanCalendar = () => {
  const [year] = useState<number>(2026);
  const [country, setCountry] = useState<string>('Pakistan');
  const [city, setCity] = useState<string>('Islamabad');
  const [ramzanDates, setRamzanDates] = useState<RamzanDate[]>([]);
  // Loading is used, so we keep it - but we'll use it in the UI
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
  // showCustomLocationModal is used, so we keep it
  const [showCustomLocationModal, setShowCustomLocationModal] = useState<boolean>(false);
  const [customCity, setCustomCity] = useState<string>('Islamabad');
  const [customCountry, setCustomCountry] = useState<string>('Pakistan');
  const [ramzanStarted, setRamzanStarted] = useState<boolean>(false);
  const [daysUntilRamzan, setDaysUntilRamzan] = useState<number>(0);
  const [hoursUntilRamzan, setHoursUntilRamzan] = useState<number>(0);
  const [minutesUntilRamzan, setMinutesUntilRamzan] = useState<number>(0);
  const [ashraToggle, setAshraToggle] = useState<boolean>(false);
  const [bismillahColor, setBismillahColor] = useState<string>('text-gray-900 dark:text-white');
  
  // Animation states
  const [showRamzanMubarak, setShowRamzanMubarak] = useState<boolean>(false);
  const [animationCity, setAnimationCity] = useState<string>('');
  
  const currentCityRef = useRef<string>('Islamabad');

  // Animation styles - 22 seconds
  const styles = `
    @keyframes walkFromRight {
      0% {
        transform: translateX(100%);
        opacity: 0;
      }
      10% {
        transform: translateX(0);
        opacity: 1;
      }
      90% {
        transform: translateX(0);
        opacity: 1;
      }
      100% {
        transform: translateX(-100%);
        opacity: 0;
      }
    }
    
    @keyframes glow {
      0%, 100% { text-shadow: 0 0 10px #FFD700, 0 0 20px #FFA500; }
      50% { text-shadow: 0 0 20px #FFD700, 0 0 40px #FFA500; }
    }
    
    .walk-animation {
      animation: walkFromRight 22s ease-in-out forwards;
    }
    
    .ramzan-glow {
      animation: glow 2s ease-in-out infinite;
    }
  `;

  const cities = {
    Pakistan: ['Islamabad', 'Karachi', 'Lahore', 'Faisalabad'],
    UK: ['Coventry', 'London', 'Birmingham', 'Scunthorpe'],
  };

  const get2026ManualTimetable = useCallback((city: string): RamzanDate[] => {
    // Check if city is in UK
    if (cities.UK.includes(city)) {
      return ukCityRamzanData[city] || ukCityRamzanData['Scunthorpe'];
    }
    // Default to Pakistan cities
    return pakistanCityRamzanData[city] || pakistanCityRamzanData['Islamabad'];
  }, [cities.UK]); // Added cities.UK as dependency

  // ✅ FIXED: calculateTimeRemaining function
  const calculateTimeRemaining = useCallback(() => {
    const cityToUse = currentCityRef.current;
    
    const currentTimetable = get2026ManualTimetable(cityToUse);
    if (currentTimetable.length === 0) return;

    const now = new Date();
    const todayDateStr = now.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Check if today is in Ramzan
    const todaySchedule = currentTimetable.find(d => d.date === todayDateStr);

    if (!todaySchedule) {
      // Ramzan start nahi hua
      const firstDayStr = currentTimetable[0]?.date;
      if (!firstDayStr) return;
      
      // Parse first day
      const firstDayParts = firstDayStr.split(', ');
      const firstDayDate = new Date(firstDayParts[1] + ' 00:00:00');
      
      // Calculate days until Ramzan
      const diffTime = firstDayDate.getTime() - now.getTime();
      
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
      }
      return;
    }

    // ✅ Ramzan start ho chuka hai
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

    const sehriTime = parseTime(todaySchedule.sehri);
    const iftarTime = parseTime(todaySchedule.iftar);

    let timeToSehriMs = sehriTime.getTime() - now.getTime();
    if (timeToSehriMs < 0) {
      const nextDaySehri = new Date(sehriTime);
      nextDaySehri.setDate(nextDaySehri.getDate() + 1);
      timeToSehriMs = nextDaySehri.getTime() - now.getTime();
    }

    let timeToIftarMs = iftarTime.getTime() - now.getTime();
    if (timeToIftarMs < 0) {
      const nextDayIftar = new Date(iftarTime);
      nextDayIftar.setDate(nextDayIftar.getDate() + 1);
      timeToIftarMs = nextDayIftar.getTime() - now.getTime();
    }

    const isAfterSehri = now.getTime() > parseTime(todaySchedule.sehri).getTime();
    const isAfterIftar = now.getTime() > parseTime(todaySchedule.iftar).getTime();
    
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

  // ✅ ANIMATION - Sirf specified date and time se chalegi!
  useEffect(() => {
    if (!city) return;
    
    const checkAnimation = () => {
      const now = new Date();
      const todayDateStr = now.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      const animationTime = animationStartTimes[city];
      if (!animationTime) return;

      // Check if today is the animation start date
      if (animationTime.date === todayDateStr) {
        // Parse animation start time
        const [time, modifier] = animationTime.time.split(' ');
        const [hoursStr, minutesStr] = time.split(':');
        let startHours = parseInt(hoursStr, 10);
        const startMinutes = parseInt(minutesStr, 10);
        
        if (modifier === 'PM' && startHours < 12) startHours += 12;
        if (modifier === 'AM' && startHours === 12) startHours = 0;
        
        const startTime = new Date();
        startTime.setHours(startHours, startMinutes, 0, 0);
        
        // Show animation if current time >= start time AND not shown for this city yet
        if (now.getTime() >= startTime.getTime() && animationCity !== city) {
          setShowRamzanMubarak(true);
          setAnimationCity(city);
          
          // Hide animation after 22 seconds
          setTimeout(() => {
            setShowRamzanMubarak(false);
          }, 22000);
        }
      }
    };

    checkAnimation();
    
    // Check every minute
    const interval = setInterval(checkAnimation, 60000);
    
    return () => clearInterval(interval);
  }, [city, animationCity]);

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
      const cityWeather: Record<string, WeatherData> = {
        'Islamabad': { temperature: 20, description: 'Clear', humidity: 55, windSpeed: 1.8, icon: '01d' },
        'Karachi': { temperature: 32, description: 'Sunny', humidity: 70, windSpeed: 2.5, icon: '01d' },
        'Lahore': { temperature: 28, description: 'Hazy', humidity: 65, windSpeed: 2.0, icon: '50d' },
        'Faisalabad': { temperature: 26, description: 'Partly cloudy', humidity: 60, windSpeed: 1.5, icon: '04d' },
        'Coventry': { temperature: 12, description: 'Cloudy', humidity: 80, windSpeed: 4.2, icon: '03d' },
        'Scunthorpe': { temperature: 11, description: 'Partly cloudy', humidity: 78, windSpeed: 4.0, icon: '03d' },
        'London': { temperature: 14, description: 'Light rain', humidity: 85, windSpeed: 3.8, icon: '10d' },
        'Birmingham': { temperature: 13, description: 'Overcast', humidity: 82, windSpeed: 3.5, icon: '04d' },
      };
      
      const weatherData = cityWeather[cityName] || cityWeather['Islamabad'];
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
              let userCountry = data.address.country || 'Pakistan';
              let userCity = data.address.city || data.address.town || data.address.village || data.address.county || 'Islamabad';
              
              // Convert country names to match cities object
              if (userCountry.includes('United Kingdom') || userCountry.includes('England') || userCountry.includes('UK')) {
                userCountry = 'UK';
              } else if (userCountry.includes('Pakistan')) {
                userCountry = 'Pakistan';
              } else {
                userCountry = 'Pakistan'; // Default
              }
              
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

  // Removed unused functions: applyCustomLocation, getAshraColor
  // These were causing ESLint errors

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

  // This function is used in the UI (commented out in your current code)
  // Uncomment it if you're using it, or remove it completely
  // const getAshraColor = (day: number): string => {
  //   if (!ashraColors) return darkMode ? 'bg-gray-800' : 'bg-white';
  //   if (day <= 10) {
  //     return darkMode ? 'bg-green-900' : 'bg-green-100';
  //   } else if (day <= 20) {
  //     return darkMode ? 'bg-blue-900' : 'bg-blue-100';
  //   } else {
  //     return darkMode ? 'bg-purple-900' : 'bg-purple-100';
  //   }
  // };

  const handlePrint = () => {
    window.print();
  };

  // Helper functions for display
  const getCurrentDay = (): number => {
    const today = new Date();
    const todayStr = today.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    const found = ramzanDates.find(d => d.date === todayStr);
    return found ? found.day : 1;
  };

  const getSehriTime = (): string => {
    const today = new Date();
    const todayStr = today.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    const found = ramzanDates.find(d => d.date === todayStr);
    return found ? found.sehri : '05:40 AM';
  };

  const getIftarTime = (): string => {
    const today = new Date();
    const todayStr = today.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    const found = ramzanDates.find(d => d.date === todayStr);
    return found ? found.iftar : '05:22 PM';
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
      
      <style>{styles}</style>

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
          
          {/* Display Area */}
          <div className="w-full sm:w-auto text-center sm:text-right sm:border-l sm:pl-6 border-gray-300 dark:border-gray-700 min-h-[120px] flex items-center justify-center">
            <div className="w-full overflow-hidden">
              {showRamzanMubarak ? (
                <div className="walk-animation">
                  <div className="text-2xl md:text-3xl font-bold ramzan-glow text-green-600 dark:text-green-400">
                    🌙 RAMZAN MUBARAK 🌙
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {city} | 1447 AH
                  </div>
                </div>
              ) : (
                <div>
                  {ramzanStarted ? (
                    <div>
                      {currentPrayer === 'sehri' && timeToSehri ? (
                        <div>
                          <div className="text-xs text-green-600 dark:text-green-400 font-semibold mb-1">
                            🌙 Ramzan Mubarak! Day {getCurrentDay()} 🌙
                          </div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">⏳ Time until Sehri</p>
                          <p className="text-2xl md:text-3xl font-bold text-blue-600 dark:text-blue-400">{timeToSehri}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Next: Iftar at {getIftarTime()}
                          </p>
                        </div>
                      ) : currentPrayer === 'iftar' && timeToIftar ? (
                        <div>
                          <div className="text-xs text-green-600 dark:text-green-400 font-semibold mb-1">
                            🌙 Ramzan Mubarak! Day {getCurrentDay()} 🌙
                          </div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">⏳ Time until Iftar</p>
                          <p className="text-2xl md:text-3xl font-bold text-orange-600 dark:text-orange-400">{timeToIftar}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Next: Sehri at {getSehriTime()}
                          </p>
                        </div>
                      ) : (
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">🌙 Ramzan Mubarak! Day {getCurrentDay()} 🌙</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Next: Sehri at {getSehriTime()}
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">⏳ Ramzan starts in</p>
                      <p className="text-2xl md:text-3xl font-bold text-green-600 dark:text-green-400">
                        {daysUntilRamzan > 0 ? `${daysUntilRamzan}d ` : ''}{hoursUntilRamzan}h {minutesUntilRamzan}m
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {currentCityRef.current} starts on {ramzanDates[0]?.date}
                      </p>
                    </div>
                  )}
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

          {/* Dark Mode Toggle */}
          <div className="flex items-center gap-2">
            <span className="text-xs whitespace-nowrap">Dark Mode</span>
            <button
              onClick={toggleDarkMode}
              className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                darkMode ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <div className="absolute left-1.5">
                <span className="text-sm">🌙</span>
              </div>
              <div className="absolute right-1.5">
                <span className="text-sm">☀️</span>
              </div>
              <div className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-md transition-transform duration-300 ${
                darkMode ? 'translate-x-8' : 'translate-x-1'
              }`} />
            </button>
          </div>
        </div>
      </div>

      {/* Modal - You'll need to add this back if it was removed */}
      {showCustomLocationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6 max-w-md w-full`}>
            <h3 className="text-lg font-bold mb-4">Edit Location</h3>
            <div className="mb-4">
              <label className="block text-sm mb-1">Country</label>
              <select
                value={customCountry}
                onChange={(e) => setCustomCountry(e.target.value)}
                className={`w-full p-2 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}
              >
                <option value="Pakistan">Pakistan</option>
                <option value="UK">United Kingdom</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm mb-1">City</label>
              <input
                type="text"
                value={customCity}
                onChange={(e) => setCustomCity(e.target.value)}
                placeholder="Enter city name"
                className={`w-full p-2 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowCustomLocationModal(false)}
                className={`px-4 py-2 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (customCity.trim()) {
                    currentCityRef.current = customCity;
                    setCountry(customCountry);
                    setCity(customCity);
                    setUserLocation({
                      country: customCountry,
                      city: customCity
                    });
                    fetchWeather(customCity, customCountry);
                    loadCalendarData();
                    setShowCustomLocationModal(false);
                  }
                }}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rest of your code (table, etc.) goes here */}
      {/* ... */}
    </div>
  );
};

export default RamzanCalendar;
