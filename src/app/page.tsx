"use client";
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

// ✅ UK Cities - 18 Feb se start
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

// ✅ Animation styles
const styles = `
  @keyframes walkFromRight {
    0% { transform: translateX(100%); opacity: 0; }
    10% { transform: translateX(0); opacity: 1; }
    90% { transform: translateX(0); opacity: 1; }
    100% { transform: translateX(-100%); opacity: 0; }
  }
  @keyframes glow {
    0%, 100% { text-shadow: 0 0 10px #FFD700, 0 0 20px #FFA500; }
    50% { text-shadow: 0 0 20px #FFD700, 0 0 40px #FFA500; }
  }
  .walk-animation { animation: walkFromRight 22s ease-in-out forwards; }
  .ramzan-glow { animation: glow 2s ease-in-out infinite; }
`;

const RamzanCalendar = () => {
  const [year] = useState<number>(2026);
  const [country, setCountry] = useState<string>('UK');
  const [city, setCity] = useState<string>('Scunthorpe');
  const [ramzanDates, setRamzanDates] = useState<RamzanDate[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [ashraColors, setAshraColors] = useState<boolean>(false);
  const [weather, setWeather] = useState<WeatherData>({
    temperature: 11,
    description: 'Partly cloudy',
    humidity: 78,
    windSpeed: 4.0,
    icon: '03d'
  });
  const [locationLoading, setLocationLoading] = useState<boolean>(false);
  const [userLocation, setUserLocation] = useState<{country: string, city: string}>({
    country: 'UK',
    city: 'Scunthorpe'
  });
  const [timeToSehri, setTimeToSehri] = useState<string>('');
  const [timeToIftar, setTimeToIftar] = useState<string>('');
  const [currentPrayer, setCurrentPrayer] = useState<string>('');
  const [showCustomLocationModal, setShowCustomLocationModal] = useState<boolean>(false);
  const [customCity, setCustomCity] = useState<string>('Scunthorpe');
  const [customCountry, setCustomCountry] = useState<string>('UK');
  const [ramzanStarted, setRamzanStarted] = useState<boolean>(false);
  const [daysUntilRamzan, setDaysUntilRamzan] = useState<number>(0);
  const [hoursUntilRamzan, setHoursUntilRamzan] = useState<number>(0);
  const [minutesUntilRamzan, setMinutesUntilRamzan] = useState<number>(0);
  const [ashraToggle, setAshraToggle] = useState<boolean>(false);
  const [bismillahColor, setBismillahColor] = useState<string>('text-gray-900 dark:text-white');
  const [showRamzanMubarak, setShowRamzanMubarak] = useState<boolean>(false);
  const [animationCity, setAnimationCity] = useState<string>('');
  const [currentDay, setCurrentDay] = useState<number>(1);
  
  const currentCityRef = useRef<string>('Scunthorpe');

  const cities = {
    Pakistan: ['Islamabad', 'Karachi', 'Lahore', 'Faisalabad'],
    UK: ['Coventry', 'London', 'Birmingham', 'Scunthorpe'],
  };

  const get2026ManualTimetable = useCallback((city: string): RamzanDate[] => {
    if (cities.UK.includes(city)) {
      return ukCityRamzanData[city] || ukCityRamzanData['Scunthorpe'];
    }
    return pakistanCityRamzanData[city] || pakistanCityRamzanData['Islamabad'];
  }, []);

  const calculateTimeRemaining = useCallback(() => {
    const cityToUse = currentCityRef.current;
    const currentTimetable = get2026ManualTimetable(cityToUse);
    if (currentTimetable.length === 0) return;

    const now = new Date();
    const todayDateStr = now.toLocaleDateString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });

    const todaySchedule = currentTimetable.find(d => d.date === todayDateStr);

    if (!todaySchedule) {
      const firstDayStr = currentTimetable[0]?.date;
      if (!firstDayStr) return;
      
      const firstDay = new Date(firstDayStr);
      const diffTime = firstDay.getTime() - now.getTime();
      
      if (diffTime > 0) {
        setRamzanStarted(false);
        setDaysUntilRamzan(Math.floor(diffTime / (1000 * 60 * 60 * 24)));
        setHoursUntilRamzan(Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
        setMinutesUntilRamzan(Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60)));
        setTimeToSehri(''); setTimeToIftar(''); setCurrentPrayer('');
      }
      return;
    }

    setRamzanStarted(true);
    setCurrentDay(todaySchedule.day);

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
      sehriTime.setDate(sehriTime.getDate() + 1);
      timeToSehriMs = sehriTime.getTime() - now.getTime();
    }

    let timeToIftarMs = iftarTime.getTime() - now.getTime();
    if (timeToIftarMs < 0) {
      iftarTime.setDate(iftarTime.getDate() + 1);
      timeToIftarMs = iftarTime.getTime() - now.getTime();
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
      if (hours > 0) return `${hours}h ${minutes}m`;
      if (minutes > 0) return `${minutes}m ${seconds}s`;
      return `${seconds}s`;
    }
  }, [get2026ManualTimetable]);

  // ✅ Animation Effect
  useEffect(() => {
    if (!city) return;
    const checkAnimation = () => {
      const now = new Date();
      const todayDateStr = now.toLocaleDateString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
      });
      const animationTime = animationStartTimes[city];
      if (!animationTime) return;
      if (animationTime.date === todayDateStr) {
        const [time, modifier] = animationTime.time.split(' ');
        const [hoursStr, minutesStr] = time.split(':');
        let startHours = parseInt(hoursStr, 10);
        const startMinutes = parseInt(minutesStr, 10);
        if (modifier === 'PM' && startHours < 12) startHours += 12;
        if (modifier === 'AM' && startHours === 12) startHours = 0;
        const startTime = new Date();
        startTime.setHours(startHours, startMinutes, 0, 0);
        if (now.getTime() >= startTime.getTime() && animationCity !== city) {
          setShowRamzanMubarak(true);
          setAnimationCity(city);
          setTimeout(() => setShowRamzanMubarak(false), 22000);
        }
      }
    };
    checkAnimation();
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
      if (!response.ok) throw new Error('Weather data not available');
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
        'Scunthorpe': { temperature: 11, description: 'Partly cloudy', humidity: 78, windSpeed: 4.0, icon: '03d' },
        'London': { temperature: 14, description: 'Light rain', humidity: 85, windSpeed: 3.8, icon: '10d' },
        'Coventry': { temperature: 12, description: 'Cloudy', humidity: 80, windSpeed: 4.2, icon: '03d' },
        'Birmingham': { temperature: 13, description: 'Overcast', humidity: 82, windSpeed: 3.5, icon: '04d' },
      };
      setWeather(cityWeather[cityName] || cityWeather['Scunthorpe']);
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
              let userCountry = data.address.country || 'UK';
              let userCity = data.address.city || data.address.town || data.address.village || 'Scunthorpe';
              if (userCountry.includes('UK') || userCountry.includes('England')) userCountry = 'UK';
              if (userCountry.includes('Pakistan')) userCountry = 'Pakistan';
              else userCountry = 'UK';
              userCity = userCity.replace(' Division', '').split(',')[0].trim();
              currentCityRef.current = userCity;
              setUserLocation({ country: userCountry, city: userCity });
              setCountry(userCountry);
              setCity(userCity);
              fetchWeather(userCity, userCountry);
              loadCalendarData();
            } else throw new Error('Location not found');
          } catch (error) {
            console.error('Error getting location:', error);
            currentCityRef.current = 'Scunthorpe';
            setUserLocation({ country: 'UK', city: 'Scunthorpe' });
            setCountry('UK'); setCity('Scunthorpe');
            fetchWeather('Scunthorpe', 'UK');
            loadCalendarData();
          } finally {
            setLocationLoading(false);
          }
        },
        (error) => {
          console.error('Geolocation error:', error);
          currentCityRef.current = 'Scunthorpe';
          setUserLocation({ country: 'UK', city: 'Scunthorpe' });
          setCountry('UK'); setCity('Scunthorpe');
          fetchWeather('Scunthorpe', 'UK');
          loadCalendarData();
          setLocationLoading(false);
        }
      );
    } else {
      console.log('Geolocation not supported');
      currentCityRef.current = 'Scunthorpe';
      setUserLocation({ country: 'UK', city: 'Scunthorpe' });
      setCountry('UK'); setCity('Scunthorpe');
      fetchWeather('Scunthorpe', 'UK');
      loadCalendarData();
      setLocationLoading(false);
    }
  }, [loadCalendarData]);

  const applyCustomLocation = () => {
    if (!customCity.trim()) return;
    currentCityRef.current = customCity;
    setCountry(customCountry);
    setCity(customCity);
    setUserLocation({ country: customCountry, city: customCity });
    fetchWeather(customCity, customCountry);
    loadCalendarData();
    setShowCustomLocationModal(false);
  };

  const toggleAshra = () => {
    const newAshraState = !ashraToggle;
    setAshraToggle(newAshraState);
    setAshraColors(newAshraState);
    setBismillahColor(newAshraState ? 'text-green-500 dark:text-green-400' : 'text-gray-900 dark:text-white');
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
    if (day <= 10) return darkMode ? 'bg-green-900' : 'bg-green-100';
    if (day <= 20) return darkMode ? 'bg-blue-900' : 'bg-blue-100';
    return darkMode ? 'bg-purple-900' : 'bg-purple-100';
  };

  const handlePrint = () => window.print();

  useEffect(() => {
    currentCityRef.current = 'Scunthorpe';
    loadCalendarData();
    getUserLocation();
  }, [getUserLocation, loadCalendarData]);

  useEffect(() => {
    const interval = setInterval(calculateTimeRemaining, 1000);
    calculateTimeRemaining();
    return () => clearInterval(interval);
  }, [calculateTimeRemaining]);

  useEffect(() => {
    loadCalendarData();
  }, [city, loadCalendarData]);

  const getSehriTime = (): string => {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    return ramzanDates.find(d => d.date === today)?.sehri || '05:38 AM';
  };

  const getIftarTime = (): string => {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    return ramzanDates.find(d => d.date === today)?.iftar || '05:24 PM';
  };

  return (
    <div className={`p-4 font-sans min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-800'}`}>
      <style>{styles}</style>

      {/* Header */}
      <div className="text-center mb-6">
        <div className="text-5xl md:text-6xl mb-2" dir="rtl">﷽</div>
        <h1 className="text-3xl md:text-4xl font-bold">Ramzan Calendar {year}</h1>
      </div>

      {/* Location & Weather Card */}
      <div className={`p-4 md:p-5 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm mb-6`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex-1 w-full">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg md:text-xl font-bold">{userLocation.city}, {userLocation.country}</h2>
              <div className="flex gap-2">
                <button onClick={handleEditLocation} className={`px-3 py-1 text-sm rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>Edit</button>
                <button onClick={refreshLocation} className={`p-1.5 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`} disabled={locationLoading}>
                  {locationLoading ? <div className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin" /> : <span>🔄</span>}
                </button>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xl">
                {weather.icon.includes('01d') ? '☀️' : weather.icon.includes('01n') ? '🌙' : 
                 weather.icon.includes('02') ? '⛅' : weather.icon.includes('03') ? '☁️' : 
                 weather.icon.includes('10') ? '🌧️' : '🌡️'}
              </span>
              <span className="capitalize">{weather.description}</span>
              <span>🌡️ {weather.temperature}°C</span>
              <span>💧 {weather.humidity}%</span>
              <span>💨 {weather.windSpeed.toFixed(1)} m/s</span>
            </div>
          </div>

          {/* Countdown / Animation Display */}
          <div className="w-full sm:w-auto sm:border-l sm:pl-6 border-gray-300 dark:border-gray-700 min-h-[100px] flex items-center justify-center">
            {showRamzanMubarak ? (
              <div className="walk-animation text-center">
                <div className="text-2xl md:text-3xl font-bold ramzan-glow text-green-600">🌙 RAMZAN MUBARAK 🌙</div>
                <div className="text-sm">{city} | 1447 AH</div>
              </div>
            ) : ramzanStarted ? (
              <div className="text-center">
                <div className="text-xs text-green-600 font-semibold">🌙 Ramzan Mubarak! Day {currentDay} 🌙</div>
                {currentPrayer === 'sehri' && timeToSehri ? (
                  <>
                    <p className="text-sm text-gray-500">{new Date().getHours() >= 17 ? '🌅 Next Sehri in' : '⏳ Time until Sehri'}</p>
                    <p className="text-2xl font-bold text-blue-600">{timeToSehri}</p>
                    <p className="text-xs">Iftar was at {getIftarTime()}</p>
                  </>
                ) : currentPrayer === 'iftar' && timeToIftar ? (
                  <>
                    <p className="text-sm text-gray-500">⏳ Time until Iftar</p>
                    <p className="text-2xl font-bold text-orange-600">{timeToIftar}</p>
                    <p className="text-xs">Sehri was at {getSehriTime()}</p>
                  </>
                ) : (
                  <p className="text-xs">Sehri: {getSehriTime()} | Iftar: {getIftarTime()}</p>
                )}
              </div>
            ) : (
              <div className="text-center">
                <p className="text-sm text-gray-500">⏳ Ramzan starts in</p>
                <p className="text-2xl font-bold text-green-600">{daysUntilRamzan}d {hoursUntilRamzan}h {minutesUntilRamzan}m</p>
                <p className="text-xs">Starts on {ramzanDates[0]?.date}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between gap-2 mb-6">
        <button onClick={handlePrint} className={`px-4 py-2 rounded text-sm font-medium ${darkMode ? 'bg-green-600' : 'bg-green-500'} text-white`}>
          Print Calendar
        </button>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs">Ashra Colors</span>
            <button onClick={toggleAshra} className={`relative inline-flex h-6 w-11 rounded-full ${ashraToggle ? 'bg-green-500' : 'bg-gray-300'}`}>
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${ashraToggle ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs">Dark Mode</span>
            <button onClick={toggleDarkMode} className={`relative inline-flex h-8 w-14 rounded-full ${darkMode ? 'bg-blue-600' : 'bg-gray-300'}`}>
              <div className="absolute left-1.5"><span className="text-sm">🌙</span></div>
              <div className="absolute right-1.5"><span className="text-sm">☀️</span></div>
              <div className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-md transition-transform ${darkMode ? 'translate-x-8' : 'translate-x-1'}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Location Modal */}
      {showCustomLocationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`p-6 rounded-xl max-w-md w-full ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h3 className="text-xl font-bold mb-4">Edit Location</h3>
            <div className="space-y-4">
              <select value={customCountry} onChange={(e) => { setCustomCountry(e.target.value); setCustomCity(cities[e.target.value as keyof typeof cities][0]); }} 
                className={`w-full p-2 border rounded ${darkMode ? 'bg-gray-700 border-gray-600' : 'border-gray-300'}`}>
                <option value="Pakistan">Pakistan</option>
                <option value="UK">United Kingdom</option>
              </select>
              <select value={customCity} onChange={(e) => setCustomCity(e.target.value)} 
                className={`w-full p-2 border rounded ${darkMode ? 'bg-gray-700 border-gray-600' : 'border-gray-300'}`}>
                {cities[customCountry as keyof typeof cities].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowCustomLocationModal(false)} className={`px-4 py-2 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>Cancel</button>
              <button onClick={applyCustomLocation} className="px-4 py-2 rounded bg-green-500 text-white">Apply</button>
            </div>
          </div>
        </div>
      )}

      {/* Duas Section */}
      <div className={`mb-6 p-4 md:p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <h2 className="text-xl font-bold mb-4 text-right">روزے کی نیت (افطار کی دعا)</h2>
        <div className="space-y-4">
          <div>
            <p className="text-right text-xl font-arabic">وَبِصَوْمٍ غَدٍ نَوَيْتُ مِنْ شَهْرِ رَمَضَانِ</p>
            <p className="text-sm text-gray-500 text-right">(نیت: میں نے کل کے روزے کی نیت کی)</p>
          </div>
          <div>
            <p className="text-right text-xl font-arabic">اللَّهُمَّ إِنِّي لَكَ صُمْتُ وَبِكَ آمَنْتُ وَعَلَيْكَ تَوَكَّلْتُ وَعَلَى رِزْقِكَ أَفْطَرْتُ</p>
            <p className="text-sm text-gray-500 text-right">(افطار کی دعا)</p>
          </div>
        </div>
      </div>

      {/* Calendar Table */}
      {loading ? <p className="text-center">Loading...</p> : ramzanDates.length > 0 ? (
        <div className="overflow-x-auto">
          <table className={`min-w-full border ${darkMode ? 'border-gray-700' : 'border-gray-200'} rounded-lg`}>
            <thead className={darkMode ? 'bg-gray-800' : 'bg-gray-100'}>
              <tr>
                <th className="py-2 px-3 border-b text-left">Day</th>
                <th className="py-2 px-3 border-b text-left">Date</th>
                <th className="py-2 px-3 border-b text-left">Sehri</th>
                <th className="py-2 px-3 border-b text-left">Iftar</th>
              </tr>
            </thead>
            <tbody>
              {ramzanDates.map(({ day, date, sehri, iftar }) => (
                <tr key={day} className={getAshraColor(day)}>
                  <td className="py-2 px-3 border-b">Day {day}</td>
                  <td className="py-2 px-3 border-b">{date}</td>
                  <td className="py-2 px-3 border-b">{sehri}</td>
                  <td className="py-2 px-3 border-b">{iftar}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : <p className="text-center text-red-600">No data available.</p>}

      {/* Ashra Duas */}
      <div className={`mt-6 p-4 md:p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <h2 className="text-xl font-bold mb-4 text-right">Ashra Duas</h2>
        <div className="space-y-4">
          <div>
            <p className="text-right text-xl font-arabic">رَبِّ اغْفِرُ وَارْحَمُ وَأَنْتَ خَيْرُ الرَّحِمِينَ</p>
            <p className="text-sm text-gray-500">(پہلا عشرہ - رحمت)</p>
          </div>
          <div>
            <p className="text-right text-xl font-arabic">أَسْتَغْفِرُ اللهَ رَبِّي مِنْ كُلِّ ذَنْبٍ وَأَتُوبُ إِلَيْهِ</p>
            <p className="text-sm text-gray-500">(دوسرا عشرہ - مغفرت)</p>
          </div>
          <div>
            <p className="text-right text-xl font-arabic">اللَّهُمَّ أَجِرْنِي مِنَ النَّارِ</p>
            <p className="text-sm text-gray-500">(تیسرا عشرہ - نجات)</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RamzanCalendar;
