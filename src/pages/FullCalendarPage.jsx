import React, { useState, useMemo, useCallback } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useGetPeriodDaysQuery } from "../app/periodDaysApi";
import {
  useCreateCycleMutation,
  useDeleteCycleMutation,
  useGetCyclesQuery,
} from "../app/cyclesApi";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

const getPhaseClass = (type) => {
  switch (type) {
    case "menstruation":
      return "bg-red-200 text-red-800";
    case "follicular":
      return "bg-yellow-200 text-yellow-800";
    case "ovulation":
      return "bg-green-200 text-green-800";
    case "luteal":
      return "bg-gray-300 text-gray-800";
    default:
      return "";
  }
};

const FullCalendarPage = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentDay, setCurrentDay] = useState(new Date().getDate());

  const {
    data: periodDays = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useGetPeriodDaysQuery({ limit: 1000 });

  const [createCycle] = useCreateCycleMutation();
  const [deleteCycle] = useDeleteCycleMutation();

  const [lastCreatedCycleId, setLastCreatedCycleId] = useState(null);
  const [isUndoing, setIsUndoing] = useState(false);

  const { data: cyclesData } = useGetCyclesQuery({
    page: 1,
    limit: 1000,
  });

  const handleDatesSet = useCallback(
    (dateInfo) => {
      const newDate = new Date(dateInfo.start);
      newDate.setDate(15);
      const newMonth = newDate.getMonth() + 2;
      const newYear = newDate.getFullYear();
      const newDay = newDate.getDate();

      if (
        newMonth !== currentMonth ||
        newYear !== currentYear ||
        newDay !== currentDay
      ) {
        setCurrentMonth(newMonth);
        setCurrentYear(newYear);
        setCurrentDay(newDay);
      }
    },
    [currentMonth, currentYear, currentDay]
  );

  const phaseEvents = useMemo(() => {
    if (!cyclesData?.data) return [];

    const today = new Date();
    const currentRealMonth = today.getMonth() + 1;
    const currentRealYear = today.getFullYear();

    const isCurrentMonthAndYear =
      currentMonth === currentRealMonth && currentYear === currentRealYear;

    let latestCycleInCurrentMonth = null;

    if (isCurrentMonthAndYear) {
      const currentMonthStart = new Date(currentYear, currentMonth - 1, 1);
      const currentMonthEnd = new Date(
        currentYear,
        currentMonth,
        0,
        23,
        59,
        59,
        999
      );

      const cyclesInCurrentMonth = cyclesData.data.filter((cycle) => {
        const cycleStartDate = new Date(cycle.start_date);
        return (
          cycleStartDate >= currentMonthStart &&
          cycleStartDate <= currentMonthEnd
        );
      });

      if (cyclesInCurrentMonth.length > 0) {
        latestCycleInCurrentMonth = cyclesInCurrentMonth.reduce(
          (latest, current) => {
            return new Date(current.start_date) > new Date(latest.start_date)
              ? current
              : latest;
          }
        );
      }
    }

    return cyclesData.data.flatMap((cycle) => {
      if (!cycle?.phases) return [];

      return cycle.phases.flatMap((phase) => {
        if (isCurrentMonthAndYear) {
          const isLatestCycle =
            latestCycleInCurrentMonth &&
            cycle.id === latestCycleInCurrentMonth.id;

          if (!isLatestCycle && phase.type !== "menstruation") {
            return [];
          }
        } else {
          if (phase.type !== "menstruation") {
            return [];
          }
        }

        const start = new Date(phase.start_date);
        const end = new Date(phase.end_date);
        const days = [];

        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
          days.push({
            id: `phase-${phase.id}-${d.toISOString()}`,
            title: phase.type.charAt(0).toUpperCase() + phase.type.slice(1),
            date: format(d, "yyyy-MM-dd"),
            className: getPhaseClass(phase.type),
          });
        }

        return days;
      });
    });
  }, [cyclesData, currentMonth, currentYear]);

  const events = useMemo(() => {
    const periodEvents = Array.isArray(periodDays)
      ? periodDays.map(({ date, type, id }) => ({
          id: String(id),
          title: type.charAt(0).toUpperCase() + type.slice(1),
          date: date.split("T")[0],
        }))
      : [];

    return [...periodEvents, ...phaseEvents];
  }, [periodDays, phaseEvents]);

  const renderEventContent = useCallback((eventInfo) => {
    return (
      <div
        className={cn(
          "w-full h-full text-[10px] flex items-center justify-center rounded",
          eventInfo.event.classNames.join(" ")
        )}
      >
        {eventInfo.event.title}
      </div>
    );
  }, []);

  const isDateSelectable = useCallback((selectInfo) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selected = new Date(selectInfo.startStr);
    selected.setHours(0, 0, 0, 0);
    return selected <= today;
  }, []);

  const handleDateSelect = (selectInfo) => {
    const selectedDate = selectInfo.startStr;

    toast(`Start your period on ${selectedDate}?`, {
      description: "This will begin a new cycle from the selected date.",
      action: {
        label: "Confirm",
        onClick: async () => {
          try {
            const response = await createCycle({
              start_date: selectedDate,
              predicted_start_date: selectedDate,
              predicted_end_date: new Date(
                new Date(selectedDate).setDate(
                  new Date(selectedDate).getDate() + 5
                )
              ).toISOString(),
              description: "User started a new period cycle",
            }).unwrap();

            setLastCreatedCycleId(response.id);
            await refetch();
            toast.success("Cycle started successfully.");
          } catch (err) {
            console.error("Error starting cycle:", err);
            toast.error("Failed to start cycle.");
          }
        },
      },
    });
  };

  const handleUndoCycle = () => {
    toast("Undo last period?", {
      description: "This will remove the most recent period cycle.",
      action: {
        label: "Confirm",
        onClick: async () => {
          setIsUndoing(true);
          try {
            await deleteCycle(lastCreatedCycleId).unwrap();
            toast.success("Last period removed.");
            setLastCreatedCycleId(null);
            await refetch();
          } catch (err) {
            console.error("Error deleting cycle:", err);
            toast.error("Failed to undo period.");
          } finally {
            setIsUndoing(false);
          }
        },
      },
    });
  };

  if (isLoading) {
    return (
      <div className="text-center py-10 text-gray-500">Loading calendar...</div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-10 text-red-600">
        Error loading calendar:{" "}
        {error?.data || error?.message || "Unknown error"}
      </div>
    );
  }

  return (
    <Card className="mx-3 border-0 shadow-lg">
      <CardHeader className="bg-transparent p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <CardTitle className="text-4xl text-rose-700 hover:text-primary font-bold">
            Full Period Calendar
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent className="bg-transparent ">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={events}
          eventClassNames={(arg) => arg.event.classNames}
          eventContent={renderEventContent}
          height="auto"
          selectable={true}
          select={handleDateSelect}
          selectAllow={isDateSelectable}
          editable={true}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "",
          }}
          dayMaxEventRows={true}
          fixedWeekCount={false}
          datesSet={handleDatesSet}
        />
        {lastCreatedCycleId && (
          <Button
            variant="outline"
            className="mt-4 text-xs bg-white border border-rose-300 text-rose-600 hover:bg-rose-50"
            onClick={handleUndoCycle}
            disabled={isUndoing}
          >
            Undo Last Period
          </Button>
        )}

        {/* Legend */}
        <div className="flex flex-wrap gap-4 text-xs pt-6 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-200 border border-red-300 rounded"></div>
            <span>Period</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-200 border border-orange-300 rounded"></div>
            <span>Ovulation</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-200 border border-yellow-300 rounded"></div>
            <span>Follicular</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-300 border border-gray-400 rounded"></div>
            <span>Luteal</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FullCalendarPage;
