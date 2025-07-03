import { InterviewAgent } from "@/components/InterviewAgent";

import StreamingAvatar, {
  AvatarQuality,
  TaskType,
  VoiceEmotion,
} from "@heygen/streaming-avatar";

const avatar = new StreamingAvatar({
  token: "MzZlNzgxOTllNzM3NDEyODhhOTVjMmJmNmI3YTlhMmYtMTY5NDYwMDg0NQ==",
});

const startSession = async () => {
  const sessionData = await avatar.createStartAvatar({
    // avatarName: "4998c674bcbe4f6e8e85a5bfa8c10b7b", // Pascal
    avatarName: "SilasHR_public",
    // voice: {
    //   voiceId: "944e789fcf7b4dfb9d1bc099fa9b0ab0", // 786a198726974648b125899d391ce688 // 944e789fcf7b4dfb9d1bc099fa9b0ab0
    //   rate: 1.0,
    //   emotion: VoiceEmotion.EXCITED,
    // },
    quality: AvatarQuality.High,
  });

  console.log("Session started:", sessionData.session_id);

  await avatar.speak({
    text: "Hello, world!",
    task_type: TaskType.REPEAT,
  });
};

startSession();

const Index = () => {
  return <InterviewAgent />;
};

export default Index;
