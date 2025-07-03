import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

export const AnalysisPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const analysis = location.state?.analysis;

  React.useEffect(() => {
    if (!analysis) {
      navigate("/");
    }
  }, [analysis, navigate]);

  if (!analysis) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background p-8 flex flex-col items-center">
      <h1 className="text-4x1 font-bold mb-6">
        Résultat de l'analyse de l'entretien
      </h1>

      <pre
        className="bg-gray-100 text-black p-6 rounded max-w-4xl w-full overflow-auto whitespace-pre-wrap"
        style={{ maxHeight: "70vh" }}
      >
        {analysis}
      </pre>

      <button
        onClick={() => navigate("/")}
        className="mt-8 px-6 py-3 bg-primary text-white rounded hover:bg-primary/90"
      >
        Retour à l'entretien
      </button>
    </div>
  );
};

const Analysis = () => {
  return <AnalysisPage />;
};

export default Analysis;
