import { useEffect, useRef, useState } from "react";
import { InputGroup, InputGroupAddon, InputGroupInput } from "../ui/input-group";
import { Button } from "../ui/button";
import { Kbd } from "../ui/kbd";
import { Search } from "lucide-react";

export function AppSearchBar() {
	const [open, setOpen] = useState(false);
	const [value, setValue] = useState("");
	const [keyType, setKeyType] = useState("");
	const inputRef = useRef<HTMLInputElement>(null);
	const closeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

	const openSearch = () => {
		setOpen(true);
		setTimeout(() => inputRef.current?.focus(), 10);
	};

	const handleMouseEnter = () => {
		if (closeTimeout.current) clearTimeout(closeTimeout.current);
		setOpen(true);
		inputRef.current?.focus();
	};

	const handleBlur = () => {
		if (value.trim() === "") {
			setOpen(false);
		}
	};

	const closeSearch = () => {
		setOpen(false);
		setValue("");
		inputRef.current?.blur();
	};

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			const isModF = (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "f";
			if(e.metaKey) setKeyType("meta");
			if(e.ctrlKey) setKeyType("ctrl");
			if (isModF) {
				e.preventDefault();
				setOpen((prev) => {
				const next = !prev;
				if (next) {
					setTimeout(() => inputRef.current?.focus(), 10);
				} else {
					setValue("");
					inputRef.current?.blur();
				}
				return next;
				});
			}

			if (e.key === "Escape" && open) {
				closeSearch();
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [open]);

	return (
		<>
			<InputGroup 
				className={`max-w-xs rounded h-full -mr-10 z-1 overflow-hidden transition-all duration-300 ease-in-out  ${
					open ? "opacity-100 " : "opacity-0 "
				}`}
			>
				<InputGroupInput
					ref={inputRef}
					value={value}
					onChange={(e) => setValue(e.target.value)}
					onBlur={handleBlur}
					className="text-accent-foreground" 
					placeholder="Search..." 
				/>
				<InputGroupAddon>
					<Search className="text-accent-foreground" />
				</InputGroupAddon>
				<InputGroupAddon align="inline-end">
					<Kbd className="text-accent-foreground">{keyType==='meta' ? "⌘" : "⇧"}F</Kbd>
				</InputGroupAddon>
			</InputGroup>

			<Button 
				variant={"outline"} 
				size={"icon-lg"}
				onClick={openSearch}
				onMouseEnter={handleMouseEnter}
				className={`px-3 rounded z-2 transition-all duration-300 ease-in-out ${open ? "opacity-0": "opacity-100"}`}>
					<Search/>
			</Button>
		</>
	)
}