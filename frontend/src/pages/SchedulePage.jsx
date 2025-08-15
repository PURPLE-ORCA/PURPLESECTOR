import React, { useState, useEffect, useRef } from "react";
import { getSchedule } from "../services/api";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import LoadingIndicator from "../components/ui/LoadingIndicator";
import ErrorDisplay from "../components/ui/ErrorDisplay"; 
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CalendarView from "../components/schedule/CalendarView"; 
import ListView from "../components/schedule/ListView"; 
import { getMonthAndYear } from "../utils/helpers"; 

export default function SchedulePage() {
  const [schedule, setSchedule] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState("calendar");

  const [groupedRaces, setGroupedRaces] = useState({});

  useEffect(() => {
    const fetchScheduleData = async () => {
      setIsLoading(true);
      setError(null);
      setSchedule([]);
      setGroupedRaces({}); 
      try {
        const data = await getSchedule();
        if (data && Array.isArray(data)) {
          setSchedule(data); // Set the raw schedule

          // Group data after fetching
          const grouped = {};
          data.forEach((race) => {
            if (race.schedule?.race?.date) {
              const monthYear = getMonthAndYear(race.schedule.race.date);
              if (monthYear) {
                if (!grouped[monthYear]) grouped[monthYear] = [];
                grouped[monthYear].push(race);
              }
            }
          });
          setGroupedRaces(grouped);
        } else {
          setError("Could not load schedule data.");
        }
      } catch (err) {
        setError("An error occurred loading schedule.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchScheduleData();
  }, []);

  const handleTabChange = (value) => setViewMode(value);

  if (isLoading) {
    return <LoadingIndicator message="Loading Schedule..." />; // Use LoadingIndicator
  }

  if (error) {
    return <ErrorDisplay title="Schedule Unavailable" message={error} />; // Use ErrorDisplay
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-7xl mx-auto px-2 sm:px-4 py-8 text-gray-900 dark:text-white"
    >
      <motion.div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-2 bg-gradient-to-r from-[#2f024f] via-[#4a037a] to-[#2f024f] text-transparent bg-clip-text">
          2025 FORMULA 1 SEASON
        </h1>
        <div className="h-1.5 w-40 mx-auto mb-3 bg-gradient-to-r from-[#2f024f] via-[#4a037a] to-[#2f024f]"></div>
        <p className="text-gray-600 dark:text-gray-400">
          Official Race Calendar{" "}
          <span className="text-xs">(Times shown in GMT+1)</span>
        </p>
      </motion.div>

      <div className="mb-8">
        <Tabs
          defaultValue="calendar"
          className="w-full"
          onValueChange={handleTabChange}
        >
          <TabsList className="grid w-full max-w-xs mx-auto grid-cols-2 mb-8 bg-gray-200 dark:bg-black border border-gray-300 dark:border-gray-700 rounded-lg p-1">
            <TabsTrigger value="calendar" className="...">
              {" "}
              <Icon
                icon="mdi:calendar-month-outline"
                className="w-5 h-5 mr-2"
              />{" "}
              Calendar{" "}
            </TabsTrigger>
            <TabsTrigger value="list" className="...">
              {" "}
              <Icon
                icon="mdi:format-list-bulleted"
                className="w-5 h-5 mr-2"
              />{" "}
              Race List{" "}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="calendar" className="mt-0">
            {Object.keys(groupedRaces).length > 0 ? (
              <CalendarView groupedRaces={groupedRaces} />
            ) : (
              !isLoading && (
                <div className="text-center p-10 bg-gray-100 dark:bg-gray-900 rounded-lg">
                  <p className="text-gray-600 dark:text-gray-400">
                    No schedule data available.
                  </p>
                </div>
              )
            )}
          </TabsContent>

          <TabsContent value="list" className="mt-0">
            {schedule.length > 0 ? (
              <ListView schedule={schedule} />
            ) : (
              !isLoading && (
                <div className="text-center p-10 bg-gray-100 dark:bg-gray-900 rounded-lg">
                  <p className="text-gray-600 dark:text-gray-400">
                    No schedule data available.
                  </p>
                </div>
              )
            )}
          </TabsContent>
        </Tabs>
      </div>
    </motion.div>
  );
}
