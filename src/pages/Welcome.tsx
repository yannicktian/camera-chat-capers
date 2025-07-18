
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm mx-auto space-y-6">
        {/* Video Player - Optimized for vertical phone videos */}
        <div className="relative w-full aspect-[9/16] rounded-2xl overflow-hidden shadow-2xl bg-black mx-auto max-w-xs border border-border">
          <video
            className="w-full h-full object-cover"
            controls
            preload="metadata"
            poster="/placeholder.svg"
          >
            <source src="/welcome.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

        {/* Navigation Button */}
        <div className="flex justify-center">
          <Button
            onClick={() => navigate('/')}
            size="lg"
            className="px-8 py-3 text-lg font-semibold bg-primary hover:bg-primary/90 transform hover:scale-105 transition-all duration-200 shadow-lg"
          >
            Démarrer mon entretien
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
