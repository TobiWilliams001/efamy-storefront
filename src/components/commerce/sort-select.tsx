"use client";

import { useRouter, useSearchParams } from "next/navigation";

import { sortOptions, type SortOption } from "@/lib/product-filters";

export function SortSelect({ value }: { value: SortOption }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function onChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const params = new URLSearchParams(searchParams.toString());
    if (event.target.value === "featured") {
      params.delete("sort");
    } else {
      params.set("sort", event.target.value);
    }
    const query = params.toString();
    router.push(query ? `?${query}` : "?", { scroll: false });
  }

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="sort" className="text-sm text-muted-foreground">
        Sort
      </label>
      <select
        id="sort"
        value={value}
        onChange={onChange}
        className="h-11 rounded-lg border border-input bg-background px-3 text-sm focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
