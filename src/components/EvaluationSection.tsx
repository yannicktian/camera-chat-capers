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
    <Card className="p-6 mb-6">
      <h3 className="text-xl font-semibold mb-4 capitalize">{title}</h3>
      <div className="flex items-center gap-2 mb-4">
        {renderStars(note)}
        <span className="ml-2 text-sm text-muted-foreground">{note}/5</span>
      </div>
      <p className="text-muted-foreground leading-relaxed">{conseil}</p>
    </Card>
  );
};
