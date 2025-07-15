import { useState, useEffect } from "react";
import {
  useCreatePeriodDayMutation,
  useGetTodayPeriodDayQuery,
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
  const { data: todayEntry, isLoading } = useGetTodayPeriodDayQuery(userId);

  // Start value as undefined to wait for backend data
  const [value, setValue] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const [createPeriodDay] = useCreatePeriodDayMutation();

  // Set value and submitted state once backend data arrives
  useEffect(() => {
    if (todayEntry && value === undefined) {
      const foundKey = Object.entries(FLOW_LABELS).find(
        ([, label]) => label === todayEntry.flow_level
      )?.[0];
      if (foundKey) {
        setValue(parseInt(foundKey));
        setSubmitted(true);
      }
    } else if (!todayEntry && value === undefined) {
      setValue(25); // default if no submission
    }
  }, [todayEntry, value]);

  const handleChange = (e) => {
    if (!submitted) {
      setValue(parseInt(e.target.value));
    }
  };

  const handleSubmit = async () => {
    try {
      await createPeriodDay({
        user_id: userId,
        cycle_id: cycleId,
        date: new Date().toISOString(),
        flow_level: FLOW_LABELS[value],
      }).unwrap();
      setSubmitted(true);
    } catch (err) {
      alert(
        err?.data?.message || "Failed to submit. You may have already submitted today."
      );
      setSubmitted(true);
    }
  };

  if (isLoading || value === undefined) {
    return <p>Loading...</p>;
  }

  return (
    <Card className="bg-white w-full sm:w-120 mb-3 shadow-md rounded-2xl">
      <CardHeader>
        <CardTitle className="text-base md:text-lg font-semibold text-gray-800">
          How’s your flow today?
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
              className={parseInt(val) === value ? "text-rose-600 font-bold" : ""}
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
            Submit
          </Button>
        ) : (
          <p className="text-sm text-rose-600 font-medium">Submitted for today ✅</p>
        )}
      </CardContent>
    </Card>
  );
}
