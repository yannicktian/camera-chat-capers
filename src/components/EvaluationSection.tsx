import { Star } from "lucide-react";
import { Card } from "@/components/ui/card";

type EvaluationSectionProps = {
  title: string;
  note: number;
  conseil: string;
};

export const EvaluationSection = ({
  title,
  note,
  conseil,
}: EvaluationSectionProps) => {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-6 h-6 ${
          index < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <div className="bg-white rounded-3xl shadow-lg p-8 border border-gray-100">
      <h3 className="text-2xl font-bold text-gray-800 capitalize mb-6">{title}</h3>
      
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-1">
          {renderStars(note)}
        </div>
        <span className="text-lg font-semibold text-gray-600">{note}/5</span>
      </div>
      
      <div className="bg-gradient-to-r from-blue-50 to-emerald-50 rounded-2xl p-6 border border-blue-100">
        <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
          Conseil personnalisé
        </h4>
        <p className="text-gray-700 leading-relaxed">{conseil}</p>
      </div>
    </div>
  );
};
