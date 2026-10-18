import {useState, useRef} from "react";
import {useDebounce} from "use-debounce";
import {X, UserPlus, AlertTriangle} from "lucide-react";
import {Input} from "@/components/ui/input";
import {Badge} from "@/components/ui/badge";
import {StyledAvatar} from "@/components/StyledAvatar";
import {useUserSearch} from "@/hooks/queries/useUserSearch";
import type {UserSummary} from "@/types/user.types";

export interface Recipient {
    id?: string;
    email: string;
    displayName: string;
    isTemporary: boolean;
}

interface RecipientSelectorProps {
    recipients: Recipient[];
    onChange: (recipients: Recipient[]) => void;
}

function isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function RecipientSelector({recipients, onChange}: RecipientSelectorProps) {
    const [query, setQuery] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [debouncedQuery] = useDebounce(query, 500);
    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const {data: searchResults = [], isLoading} = useUserSearch(debouncedQuery);

    const filteredResults = searchResults.filter(
        (user) => !recipients.some((r) => r.id === user.id || r.email === user.email)
    );

    const handleSelectUser = (user: UserSummary) => {
        onChange([
            ...recipients,
            {
                id: user.id,
                email: user.email,
                displayName: user.displayName,
                isTemporary: false,
            },
        ]);
        setQuery("");
        setIsOpen(false);
        inputRef.current?.focus();
    };

    const handleAddEmail = () => {
        if (!isValidEmail(query)) return;
        if (recipients.some((r) => r.email === query)) return;

        onChange([
            ...recipients,
            {
                email: query,
                displayName: query,
                isTemporary: true,
            },
        ]);
        setQuery("");
        setIsOpen(false);
        inputRef.current?.focus();
    };

    const handleRemove = (email: string) => {
        onChange(recipients.filter((r) => r.email !== email));
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault();
            if (filteredResults.length > 0) {
                handleSelectUser(filteredResults[0]);
            } else if (isValidEmail(query)) {
                handleAddEmail();
            }
        }
        if (e.key === "Backspace" && query === "" && recipients.length > 0) {
            handleRemove(recipients[recipients.length - 1].email);
        }
        if (e.key === "Escape") {
            setIsOpen(false);
        }
    };

    const handleBlur = (e: React.FocusEvent) => {
        if (!containerRef.current?.contains(e.relatedTarget)) {
            setIsOpen(false);
        }
    };

    const hasResults = filteredResults.length > 0;
    const showNoUserFound = debouncedQuery.length >= 2 && !isLoading && filteredResults.length === 0;
    const canAddAsEmail = showNoUserFound && isValidEmail(query);
    const showDropdown = isOpen && query.length >= 2 && (isLoading || hasResults || showNoUserFound);

    return (
        <div className="space-y-3">
            <div ref={containerRef} className="relative">
                <Input
                    ref={inputRef}
                    placeholder="Search by name or email"
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setIsOpen(true);
                    }}
                    onFocus={() => setIsOpen(true)}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                />

                {showDropdown && (
                    <div className="absolute top-full left-0 right-0 z-50 mt-1 rounded-lg bg-popover p-1 shadow-md ring-1 ring-foreground/10">
                        {isLoading && (
                            <div className="px-3 py-2 text-sm text-muted-foreground">
                                Searching...
                            </div>
                        )}

                        {filteredResults.map((user) => (
                            <button
                                key={user.id}
                                type="button"
                                className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-muted text-left"
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={() => handleSelectUser(user)}
                            >
                                <StyledAvatar name={user.displayName} size="sm"/>
                                <div className="flex flex-col min-w-0">
                                    <span className="text-sm font-medium truncate">
                                        {user.displayName}
                                    </span>
                                </div>
                            </button>
                        ))}

                        {showNoUserFound && (
                            <div className="px-3 py-2">
                                <p className="text-sm text-muted-foreground mb-2">
                                    No user found with "{debouncedQuery}"
                                </p>
                                {canAddAsEmail && (
                                    <button
                                        type="button"
                                        className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-muted text-left border border-dashed border-amber-500/50"
                                        onMouseDown={(e) => e.preventDefault()}
                                        onClick={handleAddEmail}
                                    >
                                        <div className="size-6 rounded-full bg-amber-500/10 flex items-center justify-center">
                                            <UserPlus className="size-3 text-amber-500"/>
                                        </div>
                                        <div className="flex flex-col min-w-0">
                                            <span className="text-sm font-medium truncate">
                                                Invite {query}
                                            </span>
                                            <span className="text-xs text-amber-600">
                                                A temporary account will be created
                                            </span>
                                        </div>
                                    </button>
                                )}
                                {!canAddAsEmail && debouncedQuery.length >= 2 && (
                                    <p className="text-xs text-muted-foreground">
                                        Enter a valid email to invite a new user
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {recipients.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {recipients.map((recipient) => (
                        <div
                            key={recipient.email}
                            className="flex items-center gap-2 rounded-full border border-border bg-muted/30 pl-1 pr-2 py-1"
                        >
                            <StyledAvatar name={recipient.displayName} size="sm"/>
                            {recipient.isTemporary && (
                                <AlertTriangle className="size-3 text-amber-500"/>
                            )}
                            <span className="text-sm">{recipient.displayName}</span>
                            <button
                                type="button"
                                onClick={() => handleRemove(recipient.email)}
                                className="rounded-full hover:bg-muted p-0.5"
                            >
                                <X className="size-3.5 text-muted-foreground"/>
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
