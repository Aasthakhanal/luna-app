import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ChevronDown, ChevronUp } from "lucide-react";

const phaseData = {
  menstrual: {
    title: "Menstrual Phase",
    description:
      "Your period has started. Rest, hydrate, and care for yourself.",
    color: "text-red-500",
    emoji: "🩸",
    tips: ["Use a heating pad for cramps", "Drink herbal tea like chamomile"],
    nutrition: [
      "Iron-rich foods like spinach",
      "Hydrating fruits like watermelon",
    ],
    exercise: "Light yoga or walking",
    mood: "Low energy, emotional",
  },
  follicular: {
    title: "Follicular Phase",
    description: "Energy levels begin to rise. Ideal time to set new goals.",
    color: "text-blue-500",
    emoji: "🌱",
    tips: ["Start a new project", "Eat protein-rich foods"],
    nutrition: [
      "Lean meats, eggs, leafy greens",
      "Healthy carbs for sustained energy",
    ],
    exercise: "Cardio, strength training",
    mood: "Motivated and optimistic",
  },
  ovulation: {
    title: "Ovulation Phase",
    description: "Most fertile phase. Hormones are at their peak.",
    color: "text-green-500",
    emoji: "🌸",
    tips: ["Great time for socializing", "Stay hydrated"],
    nutrition: ["Zinc-rich foods like nuts", "Antioxidants like berries"],
    exercise: "High-intensity workouts",
    mood: "Confident, energetic",
  },
  luteal: {
    title: "Luteal Phase",
    description: "Possible PMS symptoms. Self-care is important.",
    color: "text-yellow-500",
    emoji: "🌙",
    tips: ["Practice self-care", "Limit caffeine and sugar"],
    nutrition: ["Magnesium-rich foods like bananas", "Complex carbs like oats"],
    exercise: "Moderate intensity, yoga",
    mood: "Irritable, anxious, fatigued",
  },
};

export const CyclePhaseCard = ({ currentPhase }) => {
  const { title, description, color, emoji, tips, nutrition, exercise, mood } =
    phaseData[currentPhase];

  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card className="bg-sky-50 shadow-md min-h-[250px] transition-transform duration-200 hover:scale-[1.02]">
      <CardHeader
        className="pb-2 cursor-pointer flex justify-between items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2">
          <span className="text-2xl">{emoji}</span>
          <CardTitle className={`${color}`}>{title}</CardTitle>
        </div>
        {isOpen ? (
          <ChevronUp className="w-5 h-5" />
        ) : (
          <ChevronDown className="w-5 h-5" />
        )}
      </CardHeader>

      <CardContent className="text-gray-700 text-sm ">
        <p className="mb-4">{description}</p>
        {/* 💖 Affirmation message */}
        <p className="text-sm text-pink-600  font-medium mt-4 mb-4">
          💖 You're doing great. Listen to your body!
        </p>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              key="content"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4 }}
              className="overflow-hidden space-y-3"
            >
              <div>
                <strong>Mood:</strong> <span>{mood}</span>
              </div>
              <div>
                <strong>Exercise:</strong> <span>{exercise}</span>
              </div>
              <div>
                <strong>Nutrition:</strong>
                <ul className="list-disc ml-5 mt-1">
                  {nutrition.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <strong>Tips:</strong>
                <ul className="list-disc ml-5 mt-1">
                  {tips.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};
