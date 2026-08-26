import {
  AlertTriangle,
  ImageOff,
  Info,
  Link2Off,
  LoaderCircle,
} from "lucide-react";

type MvpContentStateProps = {
  kind:
    | "loading"
    | "empty"
    | "error"
    | "missing-image"
    | "pending"
    | "link-unavailable";
  title: string;
  description: string;
  action?: React.ReactNode;
  compact?: boolean;
};

const stateIcon = {
  loading: LoaderCircle,
  empty: Info,
  error: AlertTriangle,
  "missing-image": ImageOff,
  pending: Info,
  "link-unavailable": Link2Off,
};

export function MvpContentState({
  kind,
  title,
  description,
  action,
  compact = false,
}: MvpContentStateProps) {
  const Icon = stateIcon[kind];
  return (
    <div
      className={`rounded-[1.5rem] border ${kind === "error" ? "border-[#B9572D]/30 bg-[#FFF5EF]" : "border-[#3C482D]/15 bg-[#FFFDF6]"} ${compact ? "p-4" : "p-6 sm:p-8"}`}
      role={kind === "error" ? "alert" : "status"}
    >
      <div className="flex items-start gap-3">
        <span
          className={`grid shrink-0 place-items-center rounded-full ${compact ? "h-9 w-9" : "h-11 w-11"} ${kind === "error" ? "bg-[#B9572D]/12 text-[#B9572D]" : "bg-[#E9DCC0] text-[#566B37]"}`}
        >
          <Icon
            className={`${compact ? "h-4 w-4" : "h-5 w-5"} ${kind === "loading" ? "animate-spin" : ""}`}
            aria-hidden="true"
          />
        </span>
        <div>
          <p className="font-extrabold text-[#3C482D]">{title}</p>
          <p className="mt-1 text-sm leading-6 text-[#66705E]">{description}</p>
          {action && <div className="mt-4">{action}</div>}
        </div>
      </div>
    </div>
  );
}
