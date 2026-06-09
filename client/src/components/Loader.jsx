const Loader = ({ size = 40 }) => (
  <div className="loader-wrap">
    <div className="spinner" style={{ width: size, height: size }} />
  </div>
);

export default Loader;