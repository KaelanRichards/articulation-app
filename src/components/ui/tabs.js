import * as TabsPrimitive from "@radix-ui/react-tabs";
import React from "react";

export const Tabs = TabsPrimitive.Root;

export const TabsList = React.forwardRef(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={`flex border-b border-gray-200 ${className}`}
    {...props}
  />
));

export const TabsTrigger = React.forwardRef(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={`px-4 py-2 -mb-px border-b-2 border-transparent hover:text-blue-600 hover:border-blue-600 ${className}`}
    {...props}
  />
));

export const TabsContent = TabsPrimitive.Content;
