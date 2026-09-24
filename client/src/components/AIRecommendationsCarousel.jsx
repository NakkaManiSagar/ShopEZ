import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useAI } from "../context/AIContext";

const AIRecommendationsCarousel = () => {
  const { user } = useAuth();
  const { recommendations, loadRecommendations, loading } = useAI();

  useEffect(() => {
    if (!user) return;
    const fetchRecommendations = async () => {
      await loadRecommendations(5);
    };
    fetchRecommendations().catch(() => null);
  }, [user, loadRecommendations]);

  if (!user) return null;

  return (
    <section className="section container">
      <div className="section-header">
        <div>
          <h2 className="section-title">AI <span>Recommendations</span></h2>
          <p className="section-subtitle">Personalized picks based on your purchase history</p>
        </div>
      </div>

      {loading && recommendations.length === 0 ? (
        <p className="text-muted">Loading recommendations...</p>
      ) : recommendations.length > 0 ? (
        <div className="ai-carousel">
          {recommendations.map((product) => (
            <Link to={`/products/${product._id}`} key={product._id} className="ai-result-card">
              <img src={product.thumbnail || product.images?.[0]} alt={product.name} />
              <p>{product.name}</p>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-muted">No recommendations yet. Place an order to personalize suggestions.</p>
      )}
    </section>
  );
};

export default AIRecommendationsCarousel;
