
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { VideoRecorder } from "./VideoRecorder";
import { ConfettiAnimation } from "./ConfettiAnimation";
import { cn } from "@/lib/utils";
import { analyzeInterview } from "../lib/gemini";

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

  const handleEnd = () => {
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
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <ConfettiAnimation 
          isActive={showConfetti} 
          onComplete={() => setShowConfetti(false)} 
        />
        <Card className="p-8 text-center max-w-md w-full bg-card border-border animate-scale-in">
          <div className="w-16 h-16 bg-success rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-success-foreground"
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

          <h2 className="text-2xl font-bold text-card-foreground mb-2">
            Entretien terminé !
          </h2>

          <p className="text-muted-foreground mb-6">
            Merci d'avoir réalisé votre entretien. Nous allons maintenant analyser vos réponses
          </p>

          <div className="space-y-2 text-sm text-muted-foreground">
            <p>Vous avez répondu à {Object.keys(recordings).length} questions</p>
          </div>

          <div className="mt-8 border rounded-lg p-6 border-amber-200">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <div className="w-12 h-12 border-4 border-amber-200 border-t-amber-400 rounded-full animate-spin"></div>
                <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-t-yellow-400 rounded-full animate-spin" style={{animationDirection: 'reverse', animationDuration: '0.8s'}}></div>
              </div>
              
              <div className="text-center">
                <div className="flex items-center space-x-2 text-amber-300">
                  <span className="text-sm font-medium">
                    {loading ? "Analyse en cours..." : "Analyse l'entretien (Demo)"}
                  </span>
                </div>
              </div>
              
              {error && (
                <div className="text-red-600 bg-red-50 border border-red-200 rounded-lg p-3 text-sm">
                  {error}
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-foreground">
            Entretien vidéo
          </h1>
          <div className="space-y-2">
            <Progress value={progress} className="w-full max-w-md mx-auto" />
            <p className="text-muted-foreground">
              Question {currentQuestionIndex + 1} sur{" "}
              {INTERVIEW_QUESTIONS.length}
            </p>
          </div>
        </div>

        {/* Current Question */}
        <Card className="p-6 bg-card border-border">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Badge
                variant="secondary"
                className="bg-secondary text-secondary-foreground"
              >
                {currentQuestion.category}
              </Badge>
              {hasRecordingForCurrentQuestion && (
                <Badge className="bg-success text-success-foreground">
                  Enregistrer ✓
                </Badge>
              )}
            </div>

            <h2 className="text-xl font-semibold text-card-foreground">
              {currentQuestion.question}
            </h2>

            <p className="text-muted-foreground">
              Prenez le temps de réfléchir à votre réponse,puis appuyez sur
              "Enregistrer" lorsque vous êtes prêt.
            </p>
          </div>
        </Card>

        {/* Video Recorder */}
        <VideoRecorder
          onRecordingComplete={handleRecordingComplete}
          isRecording={isRecording}
          onRecordingStart={handleRecordingStart}
          onRecordingStop={handleRecordingStop}
        />

        {/* Navigation */}
        <div className="flex flex-col items-center space-y-2">
          <Button
            onClick={handlePrevious}
            variant="outline"
            disabled={currentQuestionIndex === 0}
            className="px-6"
          >
            Previous
          </Button>

          <Button
            onClick={handleEnd}
            disabled={!hasRecordingForCurrentQuestion}
            className={cn(
              "px-6",
              hasRecordingForCurrentQuestion
                ? "bg-primary hover:bg-primary/90"
                : "opacity-50 cursor-not-allowed"
            )}
          >
            {currentQuestionIndex === INTERVIEW_QUESTIONS.length - 1
              ? "Terminer"
              : "Suivant"}
          </Button>

          <div className="flex-1 text-center">
            <p className="text-sm text-muted-foreground text-center">
              {hasRecordingForCurrentQuestion
                ? "Prêt à continuer ? "
                : "Enregistrez votre réponse pour continuer"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
