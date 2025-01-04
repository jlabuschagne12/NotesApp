import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui";
import {
  ArrowDownAZ,
  ArrowUpZA,
  ClockArrowDown,
  ClockArrowUp,
} from "lucide-react";
import { IconTooltip } from "./IconButtons";
import { Bomb } from "lucide-react";
import { Scaling, LayoutGrid } from "lucide-react";
import { useSort, useNotes } from "../hooks";

type HeaderProps = {
  sizeFactor: number;
  onSizeFactorChange: (value: number) => void;
  cellWidth: number;
  onWidthChange: (value: number) => void;
};

const SLIDER_SIZE_MAX = 25;
const SLIDER_SIZE_MIN = 6;
const SLIDER_SIZE_STEP = 1;

const SLIDER_WIDTH_MAX = 600;
const SLIDER_WIDTH_MIN = 80;
const SLIDER_WIDTH_STEP = 10;

const Header = ({
  sizeFactor,
  onSizeFactorChange,
  cellWidth,
  onWidthChange,
}: HeaderProps) => {
  const { sortAlph, sortTime } = useSort();
  const { deleteAllNotes, notes } = useNotes();

  return (
    <header className="flex flex-col md:flex-row-reverse justify-between items-stretch md:items-center px-10 py-5">
      <div className="flex justify-between mb-4 md:mb-0">
        <div className="space-x-2 mr-8">
          <Button
            aria-label="sortAlphAsc"
            onClick={() => sortAlph(true)}
            variant="outline"
            size="icon"
          >
            <ArrowDownAZ />
          </Button>
          <Button
            aria-label="sortAlphDes"
            onClick={() => sortAlph(false)}
            variant="outline"
            size="icon"
          >
            <ArrowUpZA />
          </Button>
          <Button
            aria-label="sortTimeDes"
            onClick={() => sortTime(false)}
            variant="outline"
            size="icon"
          >
            <ClockArrowUp />
          </Button>
          <Button
            aria-label="sortTimeAsc"
            onClick={() => sortTime(true)}
            variant="outline"
            size="icon"
          >
            <ClockArrowDown />
          </Button>
        </div>
        <IconTooltip tooltipText="Delete All Notes">
          <Button
            onClick={deleteAllNotes}
            variant="destructive"
            size="icon"
            disabled={notes.length < 2}
            aria-label="deleteAll"
          >
            <Bomb />
          </Button>
        </IconTooltip>
      </div>
      <div className="w-full md: max-w-60 flex flex-col h-full justify-center mr-8">
        <div className="flex items-center">
          <Scaling className="mr-4 text-muted-foreground" />
          <Slider
            defaultValue={[sizeFactor]}
            max={SLIDER_SIZE_MAX}
            min={SLIDER_SIZE_MIN}
            step={SLIDER_SIZE_STEP}
            onValueChange={(val) => onSizeFactorChange(val[0])}
          />
        </div>
        <div className="flex items-center">
          <LayoutGrid className="mr-4 text-muted-foreground" />
          <Slider
            defaultValue={[cellWidth]}
            max={SLIDER_WIDTH_MAX}
            min={SLIDER_WIDTH_MIN}
            step={SLIDER_WIDTH_STEP}
            onValueChange={(val) => onWidthChange(val[0])}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
