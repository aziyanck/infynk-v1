// components/EditableField.jsx
import React from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const EditableField = ({
  label,
  type = 'text',
  name,
  placeholder,
  value,
  icon,
  visibility,
  onChange,
  onToggle,
  color = "#0A66C2"
}) => {
  
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-white rounded-md shadow-sm w-full">
      
      {/* Left Section: Icon + Input */}
      <div className="flex items-center gap-3 w-full sm:w-auto flex-grow">
        {/* Icon */}
        <label htmlFor={name} className="shrink-0 text-gray-700">
          <FontAwesomeIcon icon={icon} size="lg" color={color} />
        </label>

        {/* Input */}
        <input
          type={type}
          id={name}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="w-full px-2 py-2 border border-gray-300 rounded-md focus:ring-violet-500 focus:border-violet-500 text-sm"
        />
      </div>

      {/* Right Section: Toggle */}
      <div className="flex items-center justify-end shrink-0">
        <button
          onClick={() => onToggle(name)}
          className={`relative inline-flex h-6 w-10 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 ${
            visibility ? 'bg-violet-600' : 'bg-gray-300'
          }`}
        >
          <span className="sr-only">Toggle {name} visibility</span>
          <span
            className={`transform transition ease-in-out duration-200 ${
              visibility ? 'translate-x-5' : 'translate-x-1'
            } inline-block h-4 w-4 rounded-full bg-white`}
          />
        </button>
        {/* Optional icon feedback */}
        <span className="ml-2 text-sm text-gray-500 hidden sm:inline">
          {visibility ? <Eye size={18} /> : <EyeOff size={18} />}
        </span>
      </div>
    </div>
  );
};

export default EditableField;
