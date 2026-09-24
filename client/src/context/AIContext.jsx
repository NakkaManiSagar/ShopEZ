import { createContext, useCallback, useContext, useState } from "react";
import API from "../api/axios";

const AIContext = createContext();

export const AIProvider = ({ children }) => {
  const [visualResults, setVisualResults] = useState([]);
  const [moodResults, setMoodResults] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [lastQuery, setLastQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const searchByImage = useCallback(async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    setLoading(true);
    try {
      const { data } = await API.post("/ai/visual-search", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setVisualResults(data.products || []);
      setLastQuery(data.query || "");
      return data;
    } finally {
      setLoading(false);
    }
  }, []);

  const searchByMood = useCallback(async (mood) => {
    setLoading(true);
    try {
      const { data } = await API.post("/ai/mood-search", { mood });
      setMoodResults(data.products || []);
      setLastQuery(data.query || mood);
      return data;
    } finally {
      setLoading(false);
    }
  }, []);

  const loadRecommendations = useCallback(async (limit = 5) => {
    setLoading(true);
    try {
      const { data } = await API.post("/ai/recommendations", { limit });
      setRecommendations(data.products || []);
      setLastQuery(data.query || "");
      return data;
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <AIContext.Provider
      value={{
        visualResults,
        moodResults,
        recommendations,
        lastQuery,
        loading,
        searchByImage,
        searchByMood,
        loadRecommendations,
      }}
    >
      {children}
    </AIContext.Provider>
  );
};

export const useAI = () => useContext(AIContext);
