
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl mx-auto space-y-8">
        {/* Video Player */}
        <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-2xl bg-black">
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
            className="px-8 py-3 text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
          >
            Start Interview
          </Button>
        </div>

        {/* Welcome Text */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
            Welcome to Camera Chat Capers
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get ready for your interview experience. Watch the introduction video above and click the button when you're ready to begin.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
