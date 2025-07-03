import './Swatch.component.scss';

const Swatch = ({ backgroundColor }: { backgroundColor?: string }) => {
  if (!backgroundColor) {
    backgroundColor = '#FFFFFF'; // Default to white if no color is provided
  }

  return (
    <div
      role="img"
      className="swatch"
      style={{ backgroundColor }}
      aria-label={`Color swatch: ${backgroundColor}`}
    ></div>
  );
};

export default Swatch;
