import * as React from "react"

import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";
import { Asterisk, Info, TriangleAlert } from "lucide-react";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-card! px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      )}
      {...props}
    />
  )
}

function InputWithInsetLabel({
  id,
  className,
  type,
  isLoading = false,
  isRequired = false,
  label,
  description,
  optionalText,
  error,
  leading,
  onClear,
  onChange,
  ...props
}: React.ComponentProps<"input"> & {
  id?: string;
  isLoading?: boolean;
  isRequired?: boolean;
  label?: React.ReactNode;
  description?: React.ReactNode;
  optionalText?: string;
  error?: string;
  leading?: React.ReactNode;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear?: () => void;
}) {

  return (
    <div data-slot="input-inset-label-wrapper" className={cn(
      "border-input bg-card dark:bg-input/30 focus-within:border-ring focus-within:ring-ring/50 has-aria-invalid:ring-destructive/20 dark:has-aria-invalid:ring-destructive/40 has-aria-invalid:border-destructive relative w-full rounded-md border shadow-xs transition-[color,box-shadow] outline-none focus-within:ring-[3px] has-disabled:pointer-events-none has-disabled:cursor-not-allowed has-disabled:opacity-50 has-[input:is(:disabled)]:*:pointer-events-none has-[input:is(:disabled)]:*:cursor-not-allowed overflow-hidden",
      className)}>
      <label htmlFor={id} className={cn('text-foreground block text-xs font-medium')}>
        <div className="flex items-center justify-between gap-base px-base pt-1.5">
          <span className="truncate inline-flex items-center gap-1 select-none pointer-events-none">
            {label}
            {isRequired &&
              <Asterisk className="size-3 text-destructive" />
            }
          </span>
          <span className="text-muted-foreground text-xs truncate font-mono select-none pointer-events-none">
            {optionalText}
          </span>
        </div>
        <div className="flex items-center gap-2 px-base">
          {leading && leading}
          <input
            id={id}
            type={type}
            disabled={props.disabled || isLoading}
            className={cn('text-foreground placeholder:text-muted-foreground flex h-9 w-full bg-transparent text-base placeholder:text-sm focus-visible:outline-none', className)}
            onChange={onChange}
            {...props}
          />
          {(error || description) && (
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="w-8 h-8 flex items-center justify-end">
                  {error
                    ? <TriangleAlert className="size-4 text-destructive" />
                    : description
                      ? <Info className="size-4 text-muted-foreground" />
                      : null
                  }
                </span>
              </TooltipTrigger>
              <TooltipContent
                align="end"
                side="bottom"
                className={cn(
                  error ? "bg-destructive " : description ? "bg-muted-foreground" : "bg-foreground",
                )}
              >
                <p className={cn(
                  error ? "text-destructive-foreground dark:text-foreground" : description ? "text-background" : "text-foreground",
                )}>{error ?? description}</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </label>
    </div>
  )
}

export { Input, InputWithInsetLabel };
