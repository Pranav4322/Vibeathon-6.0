"use client";

import { useRef, useState, useCallback, type KeyboardEvent } from "react";
import { Input } from "@/components/ui/input";

interface OtpInputProps {
  length?: number;
  onComplete: (otp: string) => void;
  disabled?: boolean;
}

/**
 * OTP verification input — 6 individual digit boxes with auto-focus
 * advancement and backspace handling.
 */
export function OtpInput({
  length = 6,
  onComplete,
  disabled = false,
}: OtpInputProps) {
  const [values, setValues] = useState<string[]>(Array(length).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const focusInput = useCallback(
    (index: number) => {
      if (index >= 0 && index < length) {
        inputRefs.current[index]?.focus();
      }
    },
    [length]
  );

  const handleChange = useCallback(
    (index: number, value: string) => {
      // Only allow single digits
      const digit = value.replace(/\D/g, "").slice(-1);

      const newValues = [...values];
      newValues[index] = digit;
      setValues(newValues);

      if (digit && index < length - 1) {
        focusInput(index + 1);
      }

      // Check if all digits are filled
      if (digit && newValues.every((v) => v !== "")) {
        onComplete(newValues.join(""));
      }
    },
    [values, length, focusInput, onComplete]
  );

  const handleKeyDown = useCallback(
    (index: number, e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace" && !values[index] && index > 0) {
        focusInput(index - 1);
      }
      if (e.key === "ArrowLeft" && index > 0) {
        e.preventDefault();
        focusInput(index - 1);
      }
      if (e.key === "ArrowRight" && index < length - 1) {
        e.preventDefault();
        focusInput(index + 1);
      }
    },
    [values, length, focusInput]
  );

  const handlePaste = useCallback(
    (e: React.ClipboardEvent) => {
      e.preventDefault();
      const pastedData = e.clipboardData
        .getData("text")
        .replace(/\D/g, "")
        .slice(0, length);

      if (pastedData) {
        const newValues = [...values];
        pastedData.split("").forEach((digit, i) => {
          newValues[i] = digit;
        });
        setValues(newValues);

        // Focus the next empty field or the last one
        const nextEmpty = newValues.findIndex((v) => v === "");
        focusInput(nextEmpty === -1 ? length - 1 : nextEmpty);

        if (newValues.every((v) => v !== "")) {
          onComplete(newValues.join(""));
        }
      }
    },
    [values, length, focusInput, onComplete]
  );

  return (
    <div className="flex items-center justify-center gap-2 sm:gap-3">
      {Array.from({ length }, (_, i) => (
        <Input
          key={i}
          ref={(el) => {
            inputRefs.current[i] = el;
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={values[i]}
          disabled={disabled}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          className="h-12 w-12 rounded-lg border-2 border-white/10 bg-white/5 text-center text-xl font-semibold text-white transition-all duration-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/30 sm:h-14 sm:w-14"
          aria-label={`Digit ${i + 1}`}
        />
      ))}
    </div>
  );
}
