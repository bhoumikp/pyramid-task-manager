import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

/**
 * Common CSS class string to remove focus borders/rings from InputGroup and Inputs.
 */
export const NO_FOCUS_BORDER_CLASS =
	"border-0 focus-within:ring-0 focus-within:border-transparent [&:has([data-slot=input-group-control]:focus-visible)]:ring-0 [&:has([data-slot=input-group-control]:focus-visible)]:border-transparent focus-visible:ring-0 focus-visible:border-transparent";
