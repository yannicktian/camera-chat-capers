
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-emerald-50 p-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header avec illustration */}
        <div className="text-center space-y-6 pt-8">
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-300 to-blue-500 rounded-3xl mx-auto mb-6 shadow-lg transform rotate-12 flex items-center justify-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-200 to-blue-400 rounded-2xl flex items-center justify-center transform -rotate-12">
                <svg
                  className="w-8 h-8 text-blue-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Résultat de votre analyse
          </h1>
          
          <p className="text-gray-600 text-lg">
            Voici le détail de votre performance lors de l'entretien
          </p>
        </div>

        {/* Sections d'évaluation */}
        <div className="space-y-6">
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
        </div>

        {/* Analyse détaillée */}
        <div className="bg-white rounded-3xl shadow-lg p-8 border border-gray-100">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Analyse détaillée</h3>
          
          <div className="space-y-8">
            <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
              <h4 className="font-semibold mb-3 text-lg text-blue-800 flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                Analyse de l'élocution
              </h4>
              <p className="text-gray-700 leading-relaxed">
                {analysis.elocution_reasoning}
              </p>
            </div>

            <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100">
              <h4 className="font-semibold mb-3 text-lg text-emerald-800 flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                Analyse de la posture
              </h4>
              <p className="text-gray-700 leading-relaxed">
                {analysis.posture_reasoning}
              </p>
            </div>

            <div className="bg-orange-50 rounded-2xl p-6 border border-orange-100">
              <h4 className="font-semibold mb-3 text-lg text-orange-800 flex items-center gap-2">
                <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                Analyse de la réponse
              </h4>
              <p className="text-gray-700 leading-relaxed">
                {analysis.reponse_reasoning}
              </p>
            </div>
          </div>
        </div>

        {/* Bouton de retour */}
        <div className="text-center pb-8">
          <button
            onClick={() => navigate("/")}
            className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
          >
            Refaire un entretien
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