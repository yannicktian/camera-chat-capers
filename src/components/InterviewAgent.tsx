import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { VideoRecorder } from "./VideoRecorder";
import { cn } from "@/lib/utils";
import { analyzeInterview } from "../lib/gemini";
import { ConfettiAnimation } from "./ConfettiAnimation";

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

const INTERVIEW_QUESTIONS = [
  {
    id: 1,
    question: "Présentez-vous et racontez nous votre parcours.",
    category: "Introduction",
  },
  {
    id: 2,
    question: "Avez-vous déjà eu une expérience en contact clientèle ?",
    category: "Expérience",
  },
];

export const InterviewAgent = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [recordings, setRecordings] = useState<{
    [key: number]: { file: Blob; question: string };
  }>({});
  const [isComplete, setIsComplete] = useState(false);
  const [analysis, setAnalysis] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  const navigate = useNavigate();

  const currentQuestion = INTERVIEW_QUESTIONS[currentQuestionIndex];
  const progress =
    ((currentQuestionIndex + 1) / INTERVIEW_QUESTIONS.length) * 100;

  const handleRecordingComplete = (videoBlob: Blob) => {
    setRecordings((prev) => ({
      ...prev,
      [currentQuestion.id]: {
        file: videoBlob,
        question: currentQuestion.question,
      },
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < INTERVIEW_QUESTIONS.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setIsComplete(true);
      setShowConfetti(true);
    }
  };

  const handleAnalyze = useCallback(async () => {
    setLoading(true);
    setError(null);
    setAnalysis("");
    try {
      const videoBlob = recordings[currentQuestion.id];
      console.log(videoBlob);
      const geminiResponse = await analyzeInterview(recordings);
      console.log(geminiResponse);
      const resultText = JSON.stringify(geminiResponse, null, 2);
      const geminiEvaluationText =
        geminiResponse.candidates[0].content.parts[0].text;
      const parsedEvaluationText = geminiEvaluationText.replace(
        /^```json|```$/g,
        ""
      );
      const evaluationObject: EvaluationObject =
        JSON.parse(parsedEvaluationText);

      setAnalysis(resultText);

      navigate("/analysis", { state: { analysis: evaluationObject } });
    } catch (err: unknown) {
      let message = "Error analyzing interview";
      if (
        typeof err === "object" &&
        err &&
        "message" in err &&
        typeof (err as { message?: unknown }).message === "string"
      ) {
        message = (err as { message: string }).message;
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [recordings, currentQuestion.id, navigate]);

  useEffect(() => {
    if (isComplete) {
      handleAnalyze();
    }
  }, [handleAnalyze, isComplete]);

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleRecordingStart = () => {
    setIsRecording(true);
  };

  const handleRecordingStop = () => {
    setIsRecording(false);
  };

  const hasRecordingForCurrentQuestion = recordings[currentQuestion.id];

  if (isComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-emerald-50 p-4">
        <ConfettiAnimation
          isActive={showConfetti}
          onComplete={() => setShowConfetti(false)}
        />

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header avec illustration */}
          <div className="text-center space-y-6 pt-8">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-emerald-300 to-emerald-500 rounded-3xl mx-auto mb-6 shadow-lg transform rotate-12 flex items-center justify-center">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-200 to-emerald-400 rounded-2xl flex items-center justify-center transform -rotate-12">
                  <svg
                    className="w-8 h-8 text-emerald-700"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <h2 className="text-4xl font-bold text-gray-800 mb-2">
              Entretien terminé !
            </h2>

            <p className="text-gray-600 text-lg mb-6">
              Merci d'avoir réalisé votre entretien. Nous allons maintenant
              analyser vos réponses
            </p>

            <div className="space-y-2 text-sm text-gray-500 font-medium">
              <p>
                Vous avez répondu à {Object.keys(recordings).length} questions
              </p>
            </div>
          </div>

          {/* Section d'analyse */}
          <div className="bg-white rounded-3xl shadow-lg p-8 border border-gray-100">
            <div className="flex flex-col items-center space-y-6">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
                <div
                  className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-emerald-500 rounded-full animate-spin"
                  style={{
                    animationDirection: "reverse",
                    animationDuration: "0.8s",
                  }}
                ></div>
              </div>

              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {loading ? "Analyse en cours..." : "Analyse de l'entretien"}
                </h3>
                <p className="text-gray-600">
                  Veuillez patienter pendant que nous analysons vos réponses...
                </p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-center">
                  <p className="text-red-700 font-medium">{error}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-emerald-50 p-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header avec illustration */}
        <div className="text-center space-y-6 pt-8">
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-br from-orange-300 to-orange-500 rounded-3xl mx-auto mb-6 shadow-lg transform rotate-12 flex items-center justify-center">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-200 to-orange-400 rounded-2xl flex items-center justify-center transform -rotate-12">
                <svg
                  className="w-8 h-8 text-orange-700"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
              </div>
            </div>
          </div>

          <h1 className="text-4xl font-bold text-gray-800">
            Simulation d'entretien
          </h1>
          <p className="text-sm text-gray-500 font-medium !mt-0">
            Chargé de clientèle - La Poste - Aix-en-Provence
          </p>

          <div className="space-y-3">
            <div className="w-full max-w-md mx-auto bg-white rounded-full p-1 shadow-sm">
              <div
                className="h-2 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-sm text-gray-500 font-medium">
              Question {currentQuestionIndex + 1} sur{" "}
              {INTERVIEW_QUESTIONS.length}
            </p>
          </div>
        </div>

        {/* Current Question */}
        <div className="bg-white rounded-3xl shadow-lg p-8 border border-gray-100">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="px-4 py-2 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 rounded-full text-sm font-medium">
                  {currentQuestion.category}
                </span>
                {hasRecordingForCurrentQuestion && (
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium flex items-center gap-1">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                    </svg>
                    Enregistré
                  </span>
                )}
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-800 leading-tight">
              {currentQuestion.question}
            </h2>
          </div>
        </div>

        {/* Video Recorder */}
        <div className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100">
          <VideoRecorder
            onRecordingComplete={handleRecordingComplete}
            isRecording={isRecording}
            onRecordingStart={handleRecordingStart}
            onRecordingStop={handleRecordingStop}
          />
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className="px-8 py-3 rounded-2xl border-2 border-gray-200 hover:border-gray-300 disabled:opacity-50 font-medium bg-white text-gray-700 transition-all duration-200"
          >
            Précédent
          </button>

          <button
            onClick={handleNext}
            disabled={!hasRecordingForCurrentQuestion}
            className={`px-8 py-3 rounded-2xl font-semibold transition-all duration-200 transform ${
              hasRecordingForCurrentQuestion
                ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            {currentQuestionIndex === INTERVIEW_QUESTIONS.length - 1
              ? "Voir mes résultats ! →"
              : "Suivant"}
          </button>
        </div>

        <div className="space-y-3 text-center">
          <div className="w-full max-w-md mx-auto bg-white rounded-full p-1 shadow-sm">
            <div
              className="h-2 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-gray-500 font-medium">
            Question {currentQuestionIndex + 1} sur {INTERVIEW_QUESTIONS.length}
          </p>
        </div>
      </div>
    </div>
  );
};
