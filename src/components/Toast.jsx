import { useEffect, useState } from "react";

const Toast = ({ message, type, duration = 5000, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const slideInTimer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    const slideOutTimer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        onClose?.();
      }, 300);
    }, duration);

    return () => {
      clearTimeout(slideInTimer);
      clearTimeout(slideOutTimer);
    };
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case "success":
        return "✓";
      case "error":
        return "✕";
      case "warning":
        return "⚠";
      case "info":
        return "ℹ";
      default:
        return "";
    }
  };

  const getToastStyles = () => {
    const baseStyles =
      "fixed z-50 p-4 rounded-lg shadow-lg max-w-sm w-full flex items-center gap-3 transition-all duration-300 ease-in-out transform";
    const positionStyles =
      "md:right-8 md:top-8 sm:right-4 sm:top-4 sm:bottom-auto sm:left-auto bottom-4 left-4 right-4";
    const typeStyles = {
      success: "bg-green-500 text-white",
      error: "bg-red-500 text-white",
      warning: "bg-yellow-500 text-white",
      info: "bg-blue-500 text-white",
    };
    const animationStyles = isVisible
      ? "md:translate-x-0 translate-y-0 opacity-100"
      : "md:translate-x-full translate-y-full opacity-0";

    return `${baseStyles} ${positionStyles} ${typeStyles[type]} ${animationStyles}`;
  };

  return (
    <div className={getToastStyles()}>
      <span className="text-xl font-bold">{getIcon()}</span>
      <span className="text-sm">{message}</span>
    </div>
  );
};

export default Toast;
