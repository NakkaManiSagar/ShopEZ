import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal, X, ChevronLeft, ChevronRight } from "lucide-react";
import API from "../api/axios";
import ProductCard from "../components/ProductCard";
import Loader from "../components/Loader";

const CATEGORIES = ["Electronics", "Clothing", "Footwear", "Home & Living", "Books", "Beauty", "Sports", "Toys", "Other"];
const SORT_OPTIONS = [
  { value: "",           label: "Default" },
  { value: "newest",     label: "Newest First" },
  { value: "price_asc",  label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "rating",     label: "Top Rated" },
];

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [total, setTotal]       = useState(0);
  const [loading, setLoading]   = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const page     = Number(searchParams.get("page"))     || 1;
  const category = searchParams.get("category")         || "";
  const search   = searchParams.get("search")           || "";
  const sort     = searchParams.get("sort")             || "";
  const LIMIT    = 12;
  const totalPages = Math.ceil(total / LIMIT);

  useEffect(() => {
    setLoading(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
    const params = { page, limit: LIMIT };
    if (category) params.category = category;
    if (search)   params.search   = search;
    if (sort)     params.sort     = sort;

    API.get("/products", { params })
      .then(({ data }) => { setProducts(data.products); setTotal(data.total); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [page, category, search, sort]);

  const setParam = (key, val) => {
    const next = new URLSearchParams(searchParams);
    if (val) next.set(key, val); else next.delete(key);
    if (key !== "page") next.delete("page");
    setSearchParams(next);
  };

  const clearFilters = () => setSearchParams({});

  const hasFilters = category || search || sort;

  return (
    <div className="products-page container">
      <div className="page-header">
        <h1 className="page-title">
          {search ? `Results for "${search}"` : category ? category : "All "}
          {!search && !category && <span>Products</span>}
        </h1>
        <p className="page-subtitle">{total} product{total !== 1 ? "s" : ""} found</p>
      </div>

      {/* Toolbar */}
      <div className="products-toolbar">
        <button className="filter-toggle-btn" onClick={() => setFiltersOpen(!filtersOpen)}>
          <SlidersHorizontal size={16} />
          Filters
          {hasFilters && <span className="filter-dot" />}
        </button>

        <div className="sort-wrap">
          <select
            className="sort-select"
            value={sort}
            onChange={(e) => setParam("sort", e.target.value)}
          >
            {SORT_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Filter Panel */}
      {filtersOpen && (
        <div className="filter-panel">
          <div className="filter-section">
            <h4>Category</h4>
            <div className="filter-chips">
              <button
                className={`filter-chip ${!category ? "active" : ""}`}
                onClick={() => setParam("category", "")}
              >All</button>
              {CATEGORIES.map(c => (
                <button
                  key={c}
                  className={`filter-chip ${category === c ? "active" : ""}`}
                  onClick={() => setParam("category", c)}
                >{c}</button>
              ))}
            </div>
          </div>

          {hasFilters && (
            <button className="clear-filters-btn" onClick={clearFilters}>
              <X size={14} /> Clear all filters
            </button>
          )}
        </div>
      )}

      {/* Active filter tags */}
      {hasFilters && (
        <div className="active-filters">
          {category && (
            <span className="active-tag">
              {category}
              <button onClick={() => setParam("category", "")}><X size={11}/></button>
            </span>
          )}
          {search && (
            <span className="active-tag">
              "{search}"
              <button onClick={() => setParam("search", "")}><X size={11}/></button>
            </span>
          )}
          {sort && (
            <span className="active-tag">
              {SORT_OPTIONS.find(o => o.value === sort)?.label}
              <button onClick={() => setParam("sort", "")}><X size={11}/></button>
            </span>
          )}
        </div>
      )}

      {/* Products */}
      {loading ? <Loader /> : (
        products.length > 0 ? (
          <>
            <div className="products-grid">
              {products.map(p => <ProductCard key={p._id} product={p} />)}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination">
                <button
                  className="page-btn"
                  disabled={page === 1}
                  onClick={() => setParam("page", page - 1)}
                >
                  <ChevronLeft size={16} />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                  <button
                    key={n}
                    className={`page-btn ${n === page ? "active" : ""}`}
                    onClick={() => setParam("page", n)}
                  >{n}</button>
                ))}

                <button
                  className="page-btn"
                  disabled={page === totalPages}
                  onClick={() => setParam("page", page + 1)}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="empty-state">
            <X size={48} />
            <h3>No products found</h3>
            <p>Try adjusting your search or filters</p>
            <button className="btn btn-outline" onClick={clearFilters}>Clear Filters</button>
          </div>
        )
      )}
    </div>
  );
};

export default Products;