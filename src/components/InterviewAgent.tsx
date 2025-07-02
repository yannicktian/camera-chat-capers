import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { VideoRecorder } from './VideoRecorder';
import { cn } from '@/lib/utils';

const INTERVIEW_QUESTIONS = [
  {
    id: 1,
    question: "Tell me about yourself and your background.",
    category: "Introduction",
  },
  {
    id: 2,
    question: "What interests you most about this opportunity?",
    category: "Motivation",
  },
  {
    id: 3,
    question: "Describe a challenging project you've worked on and how you overcame obstacles.",
    category: "Experience",
  },
  {
    id: 4,
    question: "Where do you see yourself in the next 5 years?",
    category: "Goals",
  },
  {
    id: 5,
    question: "What questions do you have for us?",
    category: "Closing",
  },
];

export const InterviewAgent = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [recordings, setRecordings] = useState<{ [key: number]: Blob }>({});
  const [isComplete, setIsComplete] = useState(false);

  const currentQuestion = INTERVIEW_QUESTIONS[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / INTERVIEW_QUESTIONS.length) * 100;

  const handleRecordingComplete = (videoBlob: Blob) => {
    setRecordings(prev => ({
      ...prev,
      [currentQuestion.id]: videoBlob,
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < INTERVIEW_QUESTIONS.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setIsComplete(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
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
            Thank you for completing the video interview. Your responses have been recorded successfully.
          </p>
          
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>Total questions answered: {Object.keys(recordings).length}</p>
            <p>Total recording time: ~{Object.keys(recordings).length * 2} minutes</p>
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
          <h1 className="text-3xl font-bold text-foreground">Video Interview</h1>
          <div className="space-y-2">
            <Progress value={progress} className="w-full max-w-md mx-auto" />
            <p className="text-muted-foreground">
              Question {currentQuestionIndex + 1} of {INTERVIEW_QUESTIONS.length}
            </p>
          </div>
        </div>

        {/* Current Question */}
        <Card className="p-6 bg-card border-border">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="bg-secondary text-secondary-foreground">
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
              Take your time to think about your response, then press record when you're ready.
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
              {hasRecordingForCurrentQuestion ? 'Ready to continue' : 'Record your response to continue'}
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
            {currentQuestionIndex === INTERVIEW_QUESTIONS.length - 1 ? 'Complete' : 'Next'}
          </Button>
        </div>
      </div>
    </div>
  );
};