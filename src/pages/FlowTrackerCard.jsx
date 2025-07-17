import { useState, useEffect } from "react";
import {
  useCreatePeriodDayMutation,
  useGetPeriodDaysQuery,
} from "../app/periodDaysApi";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const FLOW_LABELS = {
  25: "spotting",
  50: "light",
  75: "medium",
  100: "heavy",
};

export function FlowTrackerSliderCard({ userId, cycleId }) {
  const today = new Date().toISOString().split("T")[0];

  const { data: periodDaysData, isLoading } = useGetPeriodDaysQuery({
    limit: 1000,
    user_id: userId,
  });

  const [value, setValue] = useState(25);
  const [submitted, setSubmitted] = useState(false);

  const [createPeriodDay] = useCreatePeriodDayMutation();

  useEffect(() => {
    console.log("Today's date:", today);
    console.log("Period days data:", periodDaysData?.data);

    if (periodDaysData?.data) {
      const todayEntry = periodDaysData.data.find((entry) => {
        const entryDate = new Date(entry.date).toISOString().split("T")[0];
        console.log("Checking entry date:", entryDate, "against today:", today);
        return entryDate === today;
      });

      console.log("Today entry found:", todayEntry);

      if (todayEntry) {
        const foundKey = Object.entries(FLOW_LABELS).find(
          ([, label]) => label === todayEntry.flow_level
        )?.[0];

        if (foundKey) {
          setValue(parseInt(foundKey));
        }
        console.log("Setting submitted to true");
        setSubmitted(true);
      } else {
        console.log("No entry for today, setting submitted to false");
        setSubmitted(false);
      }
    }
  }, [periodDaysData, today]);

  const handleChange = (e) => {
    if (!submitted) {
      setValue(parseInt(e.target.value));
    }
  };

  const handleSubmit = async () => {
    if (submitted) {
      return;
    }

    try {
      await createPeriodDay({
        user_id: userId,
        cycle_id: cycleId,
        date: new Date().toISOString(),
        flow_level: FLOW_LABELS[value] || "medium",
      }).unwrap();
      setSubmitted(true);
    } catch (err) {
      console.error("Error submitting flow data:", err);
      alert(
        err?.data?.message ||
          "Failed to submit. You may have already submitted today."
      );
    }
  };

  if (isLoading) {
    return (
      <Card className="bg-white w-full sm:w-120 mb-3 shadow-md rounded-2xl">
        <CardContent className="flex items-center justify-center h-32">
          <p className="text-gray-500">Loading...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white w-full sm:w-120 mb-3 shadow-md rounded-2xl">
      <CardHeader>
        <CardTitle className="text-base md:text-lg font-semibold text-gray-800">
          How's your flow today?
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col items-center gap-4">
        <input
          type="range"
          min="25"
          max="100"
          step="25"
          value={value}
          onChange={handleChange}
          disabled={submitted}
          className="w-full h-2 bg-rose-100 rounded-lg appearance-none cursor-pointer accent-rose-500 disabled:opacity-50"
        />

        <div className="w-full flex justify-between text-xs text-gray-600 font-medium px-1">
          {Object.entries(FLOW_LABELS).map(([val, label]) => (
            <span
              key={val}
              className={
                parseInt(val) === value ? "text-rose-600 font-bold" : ""
              }
            >
              {label.charAt(0).toUpperCase() + label.slice(1)}
            </span>
          ))}
        </div>

        {!submitted ? (
          <Button
            onClick={handleSubmit}
            className="mt-2 bg-rose-500 text-white hover:bg-rose-600"
          >
            Submit Today's Flow
          </Button>
        ) : (
          <div className="text-center">
            <p className="text-sm text-rose-600 font-medium mb-1">
              Today's flow recorded ✅
            </p>
            <p className="text-xs text-gray-500">
              Current:{" "}
              {FLOW_LABELS[value]?.charAt(0).toUpperCase() +
                FLOW_LABELS[value]?.slice(1)}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
