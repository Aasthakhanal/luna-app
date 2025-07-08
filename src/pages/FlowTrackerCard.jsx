import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const FLOW_LEVELS = [
  { label: "Spotting", icon: "💧" },
  { label: "Light", icon: "🌸" },
  { label: "Medium", icon: "🌷" },
  { label: "Heavy", icon: "🌹" },
];

export function FlowTrackerCard({ selectedFlow, onSelect }) {
  return (
    <Card className="bg-white mb-1 shadow">
      <CardHeader>
        <CardTitle className="text-15px md:text-18px font-semibold text-gray-800 tracking-tight">
          How’s your flow today? 
        </CardTitle>
      </CardHeader>
      <CardContent className="flex gap-3 flex-wrap h-12">
        {FLOW_LEVELS.map(({ label, icon }) => (
          <button
            key={label}
            onClick={() => onSelect?.(label)}
            className={cn(
              "px-2 py-1 border rounded-xl text-sm font-medium flex items-center gap-2 transition",
              selectedFlow === label
                ? "bg-rose-200 border-rose-500 text-rose-900"
                : "bg-rose-50 border-rose-100 text-rose-700 hover:bg-rose-100"
            )}
          >
            <span className="text-lg">{icon}</span>
            {label}
          </button>
        ))}
      </CardContent>
    </Card>
  );
}
