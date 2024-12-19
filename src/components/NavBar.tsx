import { Slider } from "@/components/ui/slider"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowDownAZ, ArrowUpZA, ClockArrowDown, ClockArrowUp } from 'lucide-react';
import { DeleteAllButton } from "./IconButtons";
import { Scaling, LayoutGrid } from 'lucide-react';

type NavBarProps = {
  sizeFactor: number;
  onSizeFactorChange: (value: number) => void;
  cellWidth: number;
  onWidthChange: (value: number) => void;
  sort: string;
  onSortChange: (value: string) => void;
  deleteAllNotes: () => void;
  notesLength: number;
};

const NavBar = ({sizeFactor, onSizeFactorChange, cellWidth, onWidthChange, sort, onSortChange, deleteAllNotes, notesLength}: NavBarProps) => {
  return (
    <div className="h-24 flex flex-reverse justify-start items-center px-10">
      <div className='w-36 flex flex-col h-full justify-center mr-8'>
        <div className='flex items-center'>
          <Scaling className="mr-4 text-muted-foreground"/>
          <Slider defaultValue={[sizeFactor]} max={25} min={6} step={1} onValueChange={(val) => onSizeFactorChange(val[0])} />
        </div>
        <div className='flex items-center'>
          <LayoutGrid className="mr-4 text-muted-foreground"/>
          <Slider defaultValue={[cellWidth]} max={600} min={80} step={10} onValueChange={(val) => onWidthChange(val[0])} />
        </div>
      </div>
      <div className='w-auto flex justify-between'>
        <Tabs defaultValue="none" value={sort} onValueChange={onSortChange} className="mr-8">
          <TabsList>
            <TabsTrigger value="alphAsc"><ArrowDownAZ/></TabsTrigger>
            <TabsTrigger value="alphDes"><ArrowUpZA/></TabsTrigger>
            <TabsTrigger value="timeDes"><ClockArrowUp/></TabsTrigger>
            <TabsTrigger value="timeAsc"><ClockArrowDown/></TabsTrigger>
          </TabsList>
        </Tabs>
        <DeleteAllButton deleteAllNotes={deleteAllNotes} disabled={notesLength < 2} />
      </div>
    </div>
  )
}

export default NavBar