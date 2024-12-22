import React, { useState, useRef, useEffect } from "react";
import { Check, ChevronDown, Loader2, Plus } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";
import { employeeApi } from "../api/employeeApi";
import { toast } from "react-toastify";

interface ComboboxProps {
  value: string;
  onChange: (value: string) => void;
  type: "department" | "position";
  placeholder?: string;
  label?: string;
  className?: string;
  required?: boolean;
  disabled?: boolean;
}

export const Combobox: React.FC<ComboboxProps> = ({
  value,
  onChange,
  type,
  placeholder = `Select ${type}`,
  label,
  className = "",
  required = false,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const [options, setOptions] = useState<string[]>([]);
  const [filteredOptions, setFilteredOptions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { accessToken } = useSelector((state: RootState) => state.auth);

  // Load options when component mounts
  useEffect(() => {
    const loadOptions = async () => {
      if (!accessToken) {
        console.error("No access token available");
        return;
      }

      setIsLoading(true);
      try {
        const fetchedOptions =
          type === "department"
            ? await employeeApi.getDepartments(accessToken)
            : await employeeApi.getPositions(accessToken);

        const optionNames = fetchedOptions.map((option) => option.name);
        setOptions(optionNames);
      } catch (error) {
        console.error(`Failed to fetch ${type}s:`, error);
        toast.error(`Failed to load ${type} options`);
      } finally {
        setIsLoading(false);
      }
    };

    loadOptions();
  }, [accessToken, type]);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    const filtered = options.filter((option) =>
      option.toLowerCase().includes(inputValue.toLowerCase())
    );
    setFilteredOptions(filtered);
  }, [inputValue, options]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false);
        // Reset input value if it's not in the options
        if (!options.includes(inputValue)) {
          setInputValue(value);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [options, inputValue, value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setIsOpen(true);
  };

  const handleOptionSelect = (option: string) => {
    setInputValue(option);
    onChange(option);
    setIsOpen(false);
  };

  const handleAddNew = async () => {
    if (!accessToken || !inputValue.trim()) return;

    setIsAdding(true);
    try {
      const newValue =
        type === "department"
          ? await employeeApi.addDepartment(accessToken, inputValue.trim())
          : await employeeApi.addPosition(accessToken, inputValue.trim());

      setOptions((prev) => [...prev, newValue]);
      handleOptionSelect(newValue);
      toast.success(`New ${type} added successfully`);
    } catch (error: unknown) {
      console.error(`Failed to add ${type}:`, error);
      if (error && typeof error === "object" && "response" in error) {
        const apiError = error as { response?: { data?: { detail?: string } } };
        toast.error(
          apiError.response?.data?.detail || `Failed to add new ${type}`
        );
      } else {
        toast.error(`Failed to add new ${type}`);
      }
      setInputValue(value); // Reset input on error
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onFocus={() => setIsOpen(true)}
            placeholder={placeholder}
            disabled={disabled || isLoading}
            className={`
                        w-full border rounded-lg pl-3 pr-10 py-2 
                        focus:ring-2 focus:ring-primary/20 focus:border-primary
                        disabled:bg-gray-100 disabled:cursor-not-allowed
                        ${
                          !options.includes(inputValue) && inputValue !== ""
                            ? "border-yellow-500"
                            : ""
                        }
                    `}
            required={required}
          />
          <button
            type="button"
            onClick={() => !disabled && setIsOpen(!isOpen)}
            disabled={disabled || isLoading}
            className="absolute inset-y-0 right-0 flex items-center px-2 text-gray-400"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </button>
        </div>

        {isOpen && !disabled && (
          <div
            ref={dropdownRef}
            className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-auto"
          >
            {filteredOptions.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => handleOptionSelect(option)}
                className={`
                                w-full px-4 py-2 text-left hover:bg-gray-50 
                                flex items-center justify-between
                                ${option === value ? "bg-primary/5" : ""}
                            `}
              >
                <span>{option}</span>
                {option === value && <Check className="w-4 h-4 text-primary" />}
              </button>
            ))}

            {inputValue && !options.includes(inputValue) && (
              <button
                type="button"
                onClick={handleAddNew}
                disabled={isAdding}
                className={`
                                w-full px-4 py-2 text-left hover:bg-gray-50 
                                flex items-center text-primary
                                disabled:text-gray-400 disabled:cursor-not-allowed
                            `}
              >
                {isAdding ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Add "{inputValue}"
                  </>
                )}
              </button>
            )}

            {filteredOptions.length === 0 && !inputValue && (
              <div className="px-4 py-2 text-gray-500 text-sm">
                No options available
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
