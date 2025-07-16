import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CyclePhaseCard } from "./CyclePhaseCard";
import { format, differenceInDays, addDays } from "date-fns";
import {
  useCreateCycleMutation,
  useUpdateCycleMutation,
  useGetCyclesQuery,
} from "../app/cyclesApi";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { FlowTrackerSliderCard } from "./FlowTrackerCard";
import { useNavigate } from "react-router-dom";
// import { C } from "@fullcalendar/core/internal-common";

export function Dashboard({ user }) {
  const avgCycleLength = user?.avg_cycle_length || 28;
  const avgPeriodLength = user?.avg_period_length || 5;

  const [lastPeriodStart, setLastPeriodStart] = useState(
    addDays(new Date(), -15)
  );

  const { data: cycleResponse = { data: [] }, refetch: refetchCycles } =
    useGetCyclesQuery({
      page: 1,
      limit: 1000,
    });

  console.log("Cycle Response:", cycleResponse);

  const cycles = cycleResponse.data;

  const today = new Date();
  const currentMonth = today.getMonth() + 1;
  const currentYear = today.getFullYear();

  // Find cycles that started in the current month and year
  const cyclesInCurrentMonth = cycles.filter((cycle) => {
    if (!cycle.start_date) return false;
    const startDate = new Date(cycle.start_date);
    return (
      startDate.getFullYear() === currentYear &&
      startDate.getMonth() + 1 === currentMonth
    );
  });

  // Get the latest cycle in the current month (by start_date)
  const latestCycle =
    cyclesInCurrentMonth.length > 0
      ? cyclesInCurrentMonth.reduce((latest, current) =>
          new Date(current.start_date) > new Date(latest.start_date)
            ? current
            : latest
        )
      : null;

  const [createCycle] = useCreateCycleMutation();
  const [updateCycle] = useUpdateCycleMutation();

  const [cycleData, setCycleData] = useState({
    averageCycleLength: avgCycleLength,
    lastPeriodStart,
    currentPhase: "ovulation",
    nextPeriodDate: addDays(lastPeriodStart, avgCycleLength),
    ovulationDate: addDays(lastPeriodStart, avgCycleLength - 14),
    dayOfCycle: 15,
  });

  const [flowLevel, setFlowLevel] = useState(null);

  console.log("Latest Cycle:", latestCycle);

  // Update lastPeriodStart from latestCycle
  useEffect(() => {
    if (latestCycle?.start_date) {
      const startDate = new Date(latestCycle.start_date);
      setLastPeriodStart(startDate);
    }
  }, [latestCycle]);

  // Calculate cycle details
  useEffect(() => {
    const today = new Date();
    const dayOfCycle = differenceInDays(today, lastPeriodStart) + 1;

    const nextPeriodDate = addDays(
      lastPeriodStart,
      cycleData.averageCycleLength
    );
    const ovulationDate = addDays(
      lastPeriodStart,
      cycleData.averageCycleLength - 14
    );

    let currentPhase = "follicular";
    if (dayOfCycle <= avgPeriodLength) currentPhase = "menstrual";
    else if (
      dayOfCycle >= cycleData.averageCycleLength - 14 - 2 &&
      dayOfCycle <= cycleData.averageCycleLength - 14 + 1
    )
      currentPhase = "ovulation";
    else if (dayOfCycle > cycleData.averageCycleLength - 14 + 1)
      currentPhase = "luteal";

    setCycleData((prev) => ({
      ...prev,
      dayOfCycle,
      lastPeriodStart,
      nextPeriodDate,
      ovulationDate,
      currentPhase,
    }));
  }, [lastPeriodStart, cycleData.averageCycleLength, avgPeriodLength]);

  // Handle first period start
  const handlePeriodStart = async (clickedDate) => {
    const newStartDate = new Date(clickedDate);

    try {
      if (latestCycle) {
        await updateCycle({
          id: latestCycle.id,
          start_date: newStartDate.toISOString(),
          predicted_start_date: newStartDate.toISOString(),
        });
      } else {
        await createCycle({
          user_id: user.id,
          start_date: newStartDate.toISOString(),
          predicted_start_date: newStartDate.toISOString(),
        });
      }

      setLastPeriodStart(newStartDate);
      refetchCycles();
    } catch (error) {
      console.error("Failed to update/start cycle:", error);
    }
  };

  const daysUntilNextPeriod = differenceInDays(
    cycleData.nextPeriodDate,
    new Date()
  );
  const cycleProgress =
    (cycleData.dayOfCycle / cycleData.averageCycleLength) * 100;

  // ============================
  // 🎯 Real chart data building
  // ============================
  const formatMonth = (date) => format(new Date(date), "MMM");

  const lineData = cycles
    .filter((c) => c.start_date)
    .map((cycle) => {
      const start = new Date(cycle.start_date);

      let length;
      if (cycle.end_date) {
        const end = new Date(cycle.end_date);
        length = differenceInDays(end, start) + 1;
      } else {
        length = avgCycleLength;
      }

      return { name: formatMonth(start), length };
    })
    .reverse();

  const flowWeights = {
    spotting: 1,
    light: 2,
    medium: 3,
    heavy: 4,
  };

  const barDataMap = {};

  console.log("cycles:", cycles);
  console.log("line data", lineData);

  cycles.forEach((cycle) => {
    const month = formatMonth(cycle.start_date);

    console.log("flow data", cycle);

    let flowData = cycle.flow_data || cycle.flowData || cycle.flow || [];

    if (flowData && flowData.length > 0) {
      const totalWeight = flowData.reduce((sum, entry) => {
        const flowLevel =
          entry.flow_level || entry.flowLevel || entry.level || entry.flow;
        return sum + (flowWeights[flowLevel] || 0);
      }, 0);

      const avgFlow = totalWeight / flowData.length;

      barDataMap[month] = barDataMap[month]
        ? {
            flowSum: barDataMap[month].flowSum + avgFlow,
            count: barDataMap[month].count + 1,
          }
        : { flowSum: avgFlow, count: 1 };
    }
  });

  const barData = Object.entries(barDataMap).map(
    ([month, { flowSum, count }]) => ({
      name: month,
      flow: parseFloat((flowSum / count).toFixed(1)),
    })
  );
  console.log("bar data", barData);

  const showGraphs = lineData.length >= 3;
  const isMenstrualPhase = cycleData.currentPhase === "menstrual";
  console.log("cd", cycleData);

  const navigate = useNavigate();

  const handleCalender = () => {
    navigate("/calendar");
  };

  return (
    <div className="min-h-screen bg-white">
      <main className="container mx-auto px-4 py-8">
        {!latestCycle ? (
          <div className="max-w-3xl mx-auto text-center py-5 px-2 bg-rose-50 rounded-lg shadow-md">
            <h2 className="text-3xl font-extrabold text-primary mb-4">
              Welcome to Luna — Your Best Friend for Period Tracking 🌙
            </h2>
            <p className="text-lg text-rose-800 mb-6 leading-relaxed">
              Track your period on a monthly basis, monitor your flow levels,
              and get alerts to detect irregularities early — all in one
              easy-to-use webapp.
            </p>
            <ul className="text-left list-disc list-inside mb-6 text-rose-700">
              <li>Keep an accurate monthly period calendar</li>
              <li>Record and analyze your flow intensity</li>
              <li>Detect irregularities and stay informed</li>
            </ul>
            <button
              onClick={() => {
                handleCalender();
              }}
              className="px-6 py-3 bg-rose-600 text-white rounded-md font-semibold hover:bg-rose-700 transition"
            >
              Log Your First Period
            </button>
            <p className="mt-8 text-sm text-rose-600 italic">
              Your data is private and secure. You’re in control at all times.
            </p>
          </div>
        ) : (
          <>
            {/* Top Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              <Card className="bg-yellow-50 text-gray-700 shadow-md">
                <CardHeader>
                  <CardTitle>Cycle Day 📆</CardTitle>
                  <CardDescription>Current cycle progress</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-2xl font-bold text-gray-700">
                      Day {cycleData.dayOfCycle}
                    </span>
                    <Badge variant="secondary" size="sm">
                      {cycleData.averageCycleLength} day cycle
                    </Badge>
                  </div>
                  <Progress
                    value={cycleProgress}
                    className="h-2 bg-orange-100"
                  />
                </CardContent>
              </Card>

              <Card className="bg-rose-50 text-gray-700 shadow-md">
                <CardHeader className="pb-2">
                  <CardTitle>Next Predicted Period 🩸</CardTitle>
                  <CardDescription>
                    {daysUntilNextPeriod > 0
                      ? `In ${daysUntilNextPeriod} days`
                      : daysUntilNextPeriod === 0
                      ? "Today"
                      : "Overdue"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-2xl font-bold text-gray-700">
                      {format(cycleData.nextPeriodDate, "MMMM dd, yyyy")}
                    </span>
                    <Badge variant="secondary" size="sm">
                      Predicted
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500">
                    {format(cycleData.nextPeriodDate, "EEEE")}
                  </p>
                </CardContent>
              </Card>

              <div className="md:col-span-1">
                <CyclePhaseCard currentPhase={cycleData.currentPhase} />
              </div>

              <Card className="bg-red-50 text-gray-700 shadow-md">
                <CardHeader className="pb-2">
                  <CardTitle>Irregularity Detected ⚠️</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between  items-center mb-2">
                    <span className="text-3xl font-bold text-green-600">
                      No
                    </span>
                    <Badge variant="secondary" size="lg">
                      Stable
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500 pt-3 ">
                    Tip: Consistent tracking helps detect irregularities early.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            {showGraphs ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                <Card className="bg-white shadow">
                  <CardHeader>
                    <CardTitle>Historical Cycle Lengths</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={200}>
                      <LineChart data={lineData}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey="length"
                          stroke="#af4349"
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card className="bg-white shadow">
                  <CardHeader>
                    <CardTitle>Flow Trends Over Time</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={barData}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="flow" fill="#d5595f" barSize={30} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card className="text-center p-6 mb-10 bg-white shadow">
                <p className="text-gray-500">
                  Graphs will appear after logging at least 3 cycles 📊
                </p>
              </Card>
            )}

            {/* Flow Tracker during menstruation */}
            {!isMenstrualPhase && (
              <FlowTrackerSliderCard
                selectedFlow={flowLevel}
                onSelect={setFlowLevel}
              />
            )}
          </>
        )}
      </main>

      <footer className="bg-white/90 text-center py-1 mt-1 shadow-inner">
        <p className="text-sm text-gray-500">
          🌷 Tip: Stay hydrated and track your mood daily for better cycle
          insights!
        </p>
        <p className="text-xs text-gray-400">You're doing amazing 💪</p>
      </footer>
    </div>
  );
}
