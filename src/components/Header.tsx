import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

const Header = ({
  sizeFactor,
  onSizeFactorChange,
  cellWidth,
  onWidthChange,
}: HeaderProps) => {
  const { sortLabel, sortAlph, sortTime } = useSort();
  const { deleteAllNotes, notes } = useNotes();

  const sortNotes = (sortVal: string) => {
    if (sortVal === "alphAsc") return sortAlph(true);
    if (sortVal === "timeAsc") return sortTime(true);
    if (sortVal === "alphDes") return sortAlph(false);
    if (sortVal === "timeDes") return sortTime(false);
  };

  return (
    <header className="flex flex-col md:flex-row-reverse justify-between items-stretch md:items-center px-10 py-5">
      <div className="flex justify-between mb-4 md:mb-0">
        <Tabs
          defaultValue="none"
          value={sortLabel}
          onValueChange={sortNotes}
          className="mr-8"
        >
          <TabsList>
            <TabsTrigger value="alphAsc">
              <ArrowDownAZ />
            </TabsTrigger>
            <TabsTrigger value="alphDes">
              <ArrowUpZA />
            </TabsTrigger>
            <TabsTrigger value="timeDes">
              <ClockArrowUp />
            </TabsTrigger>
            <TabsTrigger value="timeAsc">
              <ClockArrowDown />
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <IconTooltip tooltipText="Delete All Notes">
          <Button
            onClick={deleteAllNotes}
            variant="destructive"
            size="icon"
            disabled={notes.length < 2}
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
            max={25}
            min={6}
            step={1}
            onValueChange={(val) => onSizeFactorChange(val[0])}
          />
        </div>
        <div className="flex items-center">
          <LayoutGrid className="mr-4 text-muted-foreground" />
          <Slider
            defaultValue={[cellWidth]}
            max={600}
            min={80}
            step={10}
            onValueChange={(val) => onWidthChange(val[0])}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
