import { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Video, VideoOff, Camera } from "lucide-react";
import { cn } from "@/lib/utils";

interface VideoRecorderProps {
  onRecordingComplete: (videoBlob: Blob) => void;
  isRecording: boolean;
  onRecordingStart: () => void;
  onRecordingStop: () => void;
}

export const VideoRecorder = ({
  onRecordingComplete,
  isRecording,
  onRecordingStart,
  onRecordingStop,
}: VideoRecorderProps) => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [hasPermission, setHasPermission] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  const startCamera = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: true,
      });

      setStream(mediaStream);
      setHasPermission(true);
      setError(null);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error("Erreur d’accès à la caméra :", err);
      setError(
        "Accès à la caméra refusé. Veuillez autoriser l’accès à la caméra pour enregistrer votre réponse."
      );
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  }, [stream]);

  const startRecording = useCallback(() => {
    if (!stream) return;

    recordedChunksRef.current = [];

    const mediaRecorder = new MediaRecorder(stream, {
      mimeType: "video/webm",
    });

    mediaRecorderRef.current = mediaRecorder;

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        recordedChunksRef.current.push(event.data);
      }
    };

    mediaRecorder.onstop = () => {
      const videoBlob = new Blob(recordedChunksRef.current, {
        type: "video/webm",
      });
      onRecordingComplete(videoBlob);
    };

    mediaRecorder.start();
    onRecordingStart();
  }, [stream, onRecordingStart, onRecordingComplete]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      onRecordingStop();
    }
  }, [isRecording, onRecordingStop]);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  if (error) {
    return (
      <Card className="p-6 text-center bg-card border-border">
        <Camera className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
        <p className="text-card-foreground mb-4">{error}</p>
        <Button onClick={startCamera} variant="outline">
          Réessayer
        </Button>
      </Card>
    );
  }

  if (!hasPermission) {
    return (
      <Card className="p-6 text-center bg-card border-border">
        <Camera className="mx-auto mb-4 h-12 w-12 text-primary" />
        <h3 className="text-lg font-semibold text-card-foreground mb-2">
          Accès à la caméra requis
        </h3>
        <p className="text-muted-foreground mb-4">
          Nous avons besoin de votre caméra pour enregistrer votre réponse
          vidéo.
        </p>
        <Button
          onClick={startCamera}
          className="bg-primary hover:bg-primary/90"
        >
          Activer la caméra
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="overflow-hidden bg-card border-border">
        <div className="relative aspect-video bg-secondary">
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover"
            // style={{ transform: "scaleX(-1)" }}
          />

          {isRecording && (
            <div className="absolute top-4 left-4 flex items-center gap-2 bg-recording/90 text-recording-foreground px-3 py-1 rounded-full">
              <div className="w-2 h-2 bg-recording-foreground rounded-full animate-pulse" />
              <span className="text-sm font-medium">Enregistrement</span>
            </div>
          )}
        </div>
      </Card>

      <div className="flex gap-3 justify-center">
        <Button
          onClick={isRecording ? stopRecording : startRecording}
          size="lg"
          className={cn(
            "h-16 w-16 rounded-full p-0 transition-all duration-300",
            isRecording
              ? "bg-recording hover:bg-recording/90 animate-pulse-glow"
              : "bg-primary hover:bg-primary/90"
          )}
        >
          {isRecording ? (
            <VideoOff className="h-6 w-6" />
          ) : (
            <Video className="h-6 w-6" />
          )}
        </Button>
      </div>
    </div>
  );
};
