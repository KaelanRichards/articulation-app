import * as SelectPrimitive from "@radix-ui/react-select";
import React from "react";

export const Select = SelectPrimitive.Root;

export const SelectTrigger = React.forwardRef(
  ({ className, children, ...props }, ref) => (
    <SelectPrimitive.Trigger
      ref={ref}
      className={`inline-flex items-center justify-between rounded-md px-3 py-2 text-sm bg-white border border-gray-300 hover:bg-gray-50 ${className}`}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon className="ml-2">
        <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
          <path d="M10 12l-6-6h12l-6 6z" />
        </svg>
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  )
);

export const SelectValue = SelectPrimitive.Value;

export const SelectContent = React.forwardRef(
  ({ className, ...props }, ref) => (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        ref={ref}
        className={`bg-white rounded-md shadow-lg ${className}`}
        {...props}
      />
    </SelectPrimitive.Portal>
  )
);

export const SelectItem = React.forwardRef(
  ({ className, children, ...props }, ref) => (
    <SelectPrimitive.Item
      ref={ref}
      className={`text-sm leading-none rounded-md flex items-center h-8 pr-8 pl-8 relative select-none hover:bg-gray-100 ${className}`}
      {...props}
    >
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  )
);
