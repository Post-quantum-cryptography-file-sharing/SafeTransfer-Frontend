import {Link} from "react-router-dom";
import {ArrowLeft} from "lucide-react";

interface BackLinkProps {
    to: string;
    label: string;
}

export function BackLink({to, label}: BackLinkProps) {
    return (
        <Link
            to={to}
            className="inline-flex flex-row items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
            <ArrowLeft/>
            <span>{label}</span>
        </Link>
    )
}
