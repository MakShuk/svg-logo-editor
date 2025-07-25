import './LoadingSpinner.css';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: 'primary' | 'secondary' | 'white';
  text?: string;
  overlay?: boolean;
}

export const LoadingSpinner = ({
  size = 'medium',
  color = 'primary',
  text,
  overlay = false,
}: LoadingSpinnerProps) => {
  const spinnerContent = (
    <div
      className={`loading-spinner loading-spinner--${size} loading-spinner--${color}`}
    >
      <div className="loading-spinner__circle">
        <div className="loading-spinner__path"></div>
      </div>
      {text && <div className="loading-spinner__text">{text}</div>}
    </div>
  );

  if (overlay) {
    return <div className="loading-overlay">{spinnerContent}</div>;
  }

  return spinnerContent;
};
