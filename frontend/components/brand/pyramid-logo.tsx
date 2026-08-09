type PyramidLogoProps = {
  className?: string;
};

export function PyramidLogo({ className }: PyramidLogoProps) {
  return (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		fill="none"
		className={className}
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
	>
		<path d="M 11.18 2.43 A1 1 0 0 1 12.82 2.43" />
		<path d="M 12.82 2.43 L 21.82 15.44" />
		<path d="M 2.18 15.45 L 11.18 2.43" />
		<path d="M 2.5 16.88 A1 1 0 0 1 2.18 15.45" />
		<path d="M 21.82 15.44 A1 1 0 0 1 21.5 16.88" />
		<path d="M10.5 21.5 A2.57 2.57 0 0 1 7.5 21" />
		<path d="M12 2 L9 21" />
		<path d="M21.5 16.88 L10.5 21.5" />
		<path d="M7.5 21 L2.5 16.88" />
	</svg>
  );
}