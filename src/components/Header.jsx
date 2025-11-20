import { User, SlidersHorizontal } from "lucide-react";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <div className="flex justify-between items-center gap-5 text-gray-500 mb-3">
      <User className="w-8 h-8" />

      <Link to="/">
        <img
          src="/eatclub-logo.jpeg"
          alt="eatclub-logo.jpeg"
          className="w-8 h-8 rounded-full object-cover"
        />
      </Link>

      <SlidersHorizontal className="w-8 h-8" />
    </div>
  );
}
