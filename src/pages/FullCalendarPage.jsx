import React, { useState, useMemo, useCallback, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useGetPeriodDaysQuery } from "../app/periodDaysApi";
import {
  useCreateCycleMutation,
  useDeleteCycleMutation,
  useGetCyclesQuery,
  // useGetCyclesQuery,
  useLazyGetCyclesQuery,
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
  const {
    data: periodDays = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useGetPeriodDaysQuery({ limit: 1000 });

  const [createCycle] = useCreateCycleMutation();
  const [deleteCycle] = useDeleteCycleMutation();

  const [startingPeriod, setStartingPeriod] = useState(false);
  const [lastCreatedCycleId, setLastCreatedCycleId] = useState(null);
  const [isUndoing, setIsUndoing] = useState(false);
  const [cycle, setCycle] = useState({});

  const { data: cyclesData } = useGetCyclesQuery({
    page: 1,
    limit: 1,
    date: new Date().toDateString(),
  });

  const phaseEvents = useMemo(() => {
    if (!cycle?.phases) return [];

    return cycle.phases.flatMap((phase) => {
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
  }, [cycle]);

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
    today.setHours(0, 0, 0, 0); // reset to midnight
    const selected = new Date(selectInfo.startStr);
    selected.setHours(0, 0, 0, 0); // also reset selected date
    return selected <= today; // allow today and past
  }, []);

  /**
   * UseEffect
   * based on selected month of the calendar
   * calls findAll api of the cycles
   * take the 0 index from the cycle and update the setCycle state
   */
  useEffect(() => {
    setCycle(cyclesData?.data[0]);
  }, [cyclesData]);

  const handleDateSelect = (selectInfo) => {
    const selectedDate = selectInfo.startStr;

    toast(`Start your period on ${selectedDate}?`, {
      description: "This will begin a new cycle from the selected date.",
      action: {
        label: "Confirm",
        onClick: async () => {
          setStartingPeriod(true);
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

            setCycle(response);
            setLastCreatedCycleId(response.id);
            await refetch();
            toast.success("Cycle started successfully.");
          } catch (err) {
            console.error("Error starting cycle:", err);
            toast.error("Failed to start cycle.");
          } finally {
            setStartingPeriod(false);
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
            setCycle({});
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
    <Card className="mx-3 border-0 bg-gradient-to-b from-rose-100 to-pink-50 shadow-lg">
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
