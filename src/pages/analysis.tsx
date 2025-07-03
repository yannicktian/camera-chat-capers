
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { EvaluationSection } from "@/components/EvaluationSection";
import { Card } from "@/components/ui/card";

type EvaluationObject = {
  posture_reasoning: string;
  posture_note: number;
  posture_conseil: string;
  elocution_reasoning: string;
  elocution_note: number;
  elocution_conseil: string;
  reponse_reasoning: string;
  reponse_note: number;
  reponse_conseil: string;
};

export const AnalysisPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const analysis: EvaluationObject = location.state?.analysis;

  React.useEffect(() => {
    if (!analysis) {
      navigate("/");
    }
  }, [analysis, navigate]);

  if (!analysis) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">
          Résultat de l'analyse de l'entretien
        </h1>

        <EvaluationSection
          title="Élocution"
          note={analysis.elocution_note}
          conseil={analysis.elocution_conseil}
        />

        <EvaluationSection
          title="Posture"
          note={analysis.posture_note}
          conseil={analysis.posture_conseil}
        />

        <EvaluationSection
          title="Réponse"
          note={analysis.reponse_note}
          conseil={analysis.reponse_conseil}
        />

        <Card className="p-6 mb-8">
          <h3 className="text-xl font-semibold mb-6">Analyse détaillée</h3>
          
          <div className="space-y-6">
            <div>
              <h4 className="font-medium mb-2 text-lg">Analyse de l'élocution</h4>
              <p className="text-muted-foreground leading-relaxed">
                {analysis.elocution_reasoning}
              </p>
            </div>

            <div>
              <h4 className="font-medium mb-2 text-lg">Analyse de la posture</h4>
              <p className="text-muted-foreground leading-relaxed">
                {analysis.posture_reasoning}
              </p>
            </div>

            <div>
              <h4 className="font-medium mb-2 text-lg">Analyse de la réponse</h4>
              <p className="text-muted-foreground leading-relaxed">
                {analysis.reponse_reasoning}
              </p>
            </div>
          </div>
        </Card>

        <div className="text-center">
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-primary text-white rounded hover:bg-primary/90"
          >
            Retour à l'entretien
          </button>
        </div>
      </div>
    </div>
  );
};

const Analysis = () => {
  return <AnalysisPage />;
};

export default Analysis;