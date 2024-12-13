import { formatCurrency } from "@/utils/helpers";
import React from "react";
import { Counter } from "..";

const HostStatistic = ({ title, value, percent, footer, type }) => {
  return (
    <div class="rounded-xl border bg-card text-card-foreground shadow">
      <div class="p-4 flex flex-row items-center justify-between space-y-0 pb-2">
        <div class="tracking-tight text-sm font-medium">{title}</div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          class="h-4 w-4 text-muted-foreground"
        >
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
      </div>
      <div class="p-6 pt-0">
        <div class="text-2xl font-bold">
          <Counter value={value} type={type} />
        </div>
        {percent && (
          <p class="text-xs text-muted-foreground">
            +{percent}% from last month
          </p>
        )}
        {footer && footer}
      </div>
    </div>
  );
};

export default HostStatistic;
