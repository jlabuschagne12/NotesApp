import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

type IconTooltipProps = {
  tooltipText: string;
  children: React.ReactNode;
}

export const IconTooltip = ({tooltipText, children}: IconTooltipProps) =>
  <Tooltip>
    <TooltipTrigger asChild>
        {children}
    </TooltipTrigger>
    <TooltipContent>
      <p>{tooltipText}</p>
    </TooltipContent>
  </Tooltip>