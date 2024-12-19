import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Button } from '@/components/ui'
import { Trash, Plus, Clock8, Bomb } from 'lucide-react';

export const LastUpdatedIcon = ({updatedAt}: {updatedAt: string}) => 
  <Tooltip>
    <TooltipTrigger asChild>
        <Clock8 className='text-muted-foreground' size={14}/>
    </TooltipTrigger>
    <TooltipContent>
      <p>Last updated: {new Date(updatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
    </TooltipContent>
  </Tooltip>

export const AddNoteButton = ({handleAddNote}: {handleAddNote: () => void}) => 
  <Tooltip>
    <TooltipTrigger asChild>
      <Button onClick={handleAddNote} variant="ghost" size="iconSmall" role="addNote">
        <Plus/>
      </Button>
    </TooltipTrigger>
    <TooltipContent>
      <p>Add Note</p>
    </TooltipContent>
  </Tooltip>

export const DeleteNoteButton = ({deleteNote, id}: {deleteNote: (id: string) => void, id: string}) => 
  <Tooltip>
    <TooltipTrigger asChild>
      <Button onClick={() => deleteNote(id)} variant="ghost" size="iconSmall" role="deleteNote">
        <Trash/>
      </Button>
    </TooltipTrigger>
    <TooltipContent>
      <p>Delete Note</p>
    </TooltipContent>
  </Tooltip>

export const DeleteAllButton = ({deleteAllNotes, disabled}: {deleteAllNotes: () => void, disabled: boolean}) => 
  <Tooltip>
    <TooltipTrigger asChild>
      <Button onClick={deleteAllNotes} variant="destructive" size="icon" disabled={disabled}>
        <Bomb/>
      </Button>
    </TooltipTrigger>
    <TooltipContent>
      <p>Delete All Notes</p>
    </TooltipContent>
  </Tooltip>