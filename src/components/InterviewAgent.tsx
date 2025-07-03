import { useEffect, useState, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { VideoRecorder } from "./VideoRecorder";
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
    question: "Tell me about yourself and your background.",
    category: "Introduction",
  },
  // {
  //   id: 2,
  //   question: "What interests you most about this opportunity?",
  //   category: "Motivation",
  // },
  // {
  //   id: 3,
  //   question:
  //     "Describe a challenging project you've worked on and how you overcame obstacles.",
  //   category: "Experience",
  // },
  // {
  //   id: 4,
  //   question: "Where do you see yourself in the next 5 years?",
  //   category: "Goals",
  // },
  // {
  //   id: 5,
  //   question: "What questions do you have for us?",
  //   category: "Closing",
  // },
];

export const InterviewAgent = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [recordings, setRecordings] = useState<{ [key: number]: {file: Blob, question: string} }>({});
  const [isComplete, setIsComplete] = useState(false);
  const [analysis, setAnalysis] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      const geminiEvaluationText = geminiResponse.candidates[0].content.parts[0].text;
      const parsedEvaluationText = geminiEvaluationText.replace(/^```json|```$/g, "");
      const evaluationObject: EvaluationObject = JSON.parse(parsedEvaluationText);

      setAnalysis(resultText);
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
  }, [recordings, currentQuestion.id]);

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
            Interview Complete!
          </h2>

          <p className="text-muted-foreground mb-6">
            Thank you for completing the video interview. Your responses have
            been recorded successfully.
          </p>

          <div className="space-y-2 text-sm text-muted-foreground">
            <p>Total questions answered: {Object.keys(recordings).length}</p>
            <p>
              Total recording time: ~{Object.keys(recordings).length * 2}{" "}
              minutes
            </p>
          </div>

          <div className="mt-4 border rounded max-w-xl mx-auto mt-8">
            <h2 className="text-lg font-bold mb-2">Interview Agent</h2>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
              onClick={handleAnalyze}
              disabled={loading}
            >
              {loading ? "Analyzing..." : "Analyze Interview (Demo)"}
            </button>
            {error && <div className="text-red-600 mt-2">{error}</div>}
            {analysis && (
              <div className="mt-4 whitespace-pre-wrap bg-gray-100 text-black p-3 rounded">
                <strong>Analysis Result:</strong>
                <div>{analysis}</div>
              </div>
            )}
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
            Video Interview
          </h1>
          <div className="space-y-2">
            <Progress value={progress} className="w-full max-w-md mx-auto" />
            <p className="text-muted-foreground">
              Question {currentQuestionIndex + 1} of{" "}
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
                  Recorded ✓
                </Badge>
              )}
            </div>

            <h2 className="text-xl font-semibold text-card-foreground">
              {currentQuestion.question}
            </h2>

            <p className="text-muted-foreground">
              Take your time to think about your response, then press record
              when you're ready.
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
        <div className="flex justify-between items-center">
          <Button
            onClick={handlePrevious}
            variant="outline"
            disabled={currentQuestionIndex === 0}
            className="px-6"
          >
            Previous
          </Button>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              {hasRecordingForCurrentQuestion
                ? "Ready to continue"
                : "Record your response to continue"}
            </p>
          </div>

          <Button
            onClick={handleNext}
            disabled={!hasRecordingForCurrentQuestion}
            className={cn(
              "px-6",
              hasRecordingForCurrentQuestion
                ? "bg-primary hover:bg-primary/90"
                : "opacity-50 cursor-not-allowed"
            )}
          >
            {currentQuestionIndex === INTERVIEW_QUESTIONS.length - 1
              ? "Complete"
              : "Next"}
          </Button>
        </div>
      </div>
    </div>
  );
};
