import React from 'react';

export default function OptionButton({ label, onClick, disabled, selected, correct }) {
  const base = 'w-full text-sm sm:text-base px-3 py-3 rounded-xl border transition text-center';
  let stateClass = '';

  if (disabled) {
    if (correct) {
      stateClass = 'bg-green-100 border-green-300 text-green-800';
    } else if (selected) {
      stateClass = 'bg-purple-100 border-purple-300 text-purple-800';
    } else {
      stateClass = 'bg-white border-purple-200 text-purple-500 opacity-70';
    }
  } else {
    stateClass = selected
      ? 'bg-purple-100 border-purple-400 text-purple-800'
      : 'bg-white border-purple-200 hover:border-purple-400 hover:bg-purple-50 text-purple-700';
  }

  return (
    <button
      type="button"
      className={`${base} ${stateClass}`}
      disabled={disabled}
      onClick={onClick}
    >
      {label}
    </button>
  );
}
