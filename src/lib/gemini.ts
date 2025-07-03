import { GoogleGenAI, Blob as GeminiBlob } from "@google/genai";

const client = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY,
});

export const deprecatedUploadFileToGemini = async (
  file: Blob,
  fileName = "interview.mp4"
) => {
  const blob = new Blob([file], { type: file.type || "video/mp4" });
  console.log("Uploading...");
  const uploadedFile = await client.files.upload({
    file: blob,
    config: { displayName: fileName },
  });
  console.log("Uploaded.");
  console.log(`Getting... ${uploadedFile.name}`);
  let getFile = await client.files.get({ name: uploadedFile.name });
  while (getFile.state === "PROCESSING") {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    getFile = await client.files.get({ name: uploadedFile.name });
    console.log(`current file status: ${getFile.state}`);
    console.log("File is still processing, retrying in 5 seconds");
  }
  if (getFile.state === "FAILED") {
    throw new Error("File processing failed.");
  }
  console.log(getFile);
  return getFile;
};

async function blobToGeminiBlob(blob: Blob): Promise<GeminiBlob> {
  const base64String: string = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      // The result is something like "data:video/mp4;base64,AAAA..."
      const result = reader.result as string;
      const base64 = result.split(",")[1]; // Get only the base64 part
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });

  return {
    mimeType: blob.type || "video/mp4",
    data: base64String,
  };
}

const systemInstruction = `#Role 
Tu es un expert dans l'analyse vidéo de la réponse des candidats lors d'un entretien d'embauche.
Le candidat postule à un poste de facteur.
Voici une vidéo d'un candidat répondant à la question {question du candidat, ici :Avez-vous de l'expérience au contact du client}

# Réponse 
Analyse l'entretien vidéo pour en ressortir les éléments suivants en JSON uniquement :
{
	"posture_reasoning": <Analyse la posture du candidat. Celle-ci doit être ouverte, professionnelle, avec des expressions faciales adaptées au contexte professionnel. Le candidat doit être habillé de manière correcte et dans un contexte adapté pour un entretien d'embauche.>,
	"posture_note": <Basé sur tes analyses mais une note sur 5 à la posture du candidat>,
	"posture_conseil": <Basé sur tes analyses et sur la note donnée, donne quelques conseils courts d'amélioration de la posture du candidat.>,
	"elocution_reasoning": <Analyse l'élocution en français du candidat, est-ce que le débit est fluide ? y a-t-il des tics de langage ? est-ce que le vocabulaire est adapté...>,
	"elocution_note": <Basé sur tes analyses mais une note sur 5 à la l'elocuation du candidat>,
	"elocution_conseil": <Basé sur tes analyses et sur la note donnée, donne quelques conseils courts d'amélioration de l'élocution du candidat.>,
	"reponse_reasoning": <Analyse la réponse du candidat à la question posée, notamment sa pertinence et la clarté de la réponse.>,
	"reponse_note": <Basé sur tes analyses mais une note sur 5 à la réponse du candidat>,
	"reponse_conseil": <Basé sur tes analyses et sur la note donnée, donne quelques conseils courts d'amélioration de la réponse du candidat.>,
}`;

export async function analyzeInterview(videoBlobs: {
  [key: number]: { file: Blob; question: string };
}) {
  // Uncomment this to upload file to Gemini
  // const geminiFile = await deprecatedUploadFileToGemini(videoBlob);

  const contents = [];

  for (const key in videoBlobs) {
    const { file, question } = videoBlobs[key];
    contents.push({ role: "model", parts: [{ text: question }] });
    const geminiBlob = await blobToGeminiBlob(file);
    contents.push({
      role: "user",
      parts: [{ inlineData: geminiBlob }],
    });
  }

  console.log(contents);

  // const geminiBlob = await blobToGeminiBlob(videoBlob);
  // Call Gemini with the prompt and video file
  const response = await client.models.generateContent({
    model: "gemini-2.5-flash",
    contents,
    config: {
      systemInstruction,
      temperature: 0.5,
      tools: [],
    },
  });
  return response;
}
