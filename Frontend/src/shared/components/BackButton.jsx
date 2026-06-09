import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';

export default function BackButton() {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className="w-10 h-10 sm:w-9 sm:h-9 rounded-full border-[1.5px] border-forest bg-transparent text-forest hover:bg-forest hover:text-white transition-all flex items-center justify-center cursor-pointer outline-none shrink-0"
      aria-label="Go back"
      title="Go back"
    >
      <FiArrowLeft className="w-4 h-4 shrink-0" />
    </button>
  );
}
