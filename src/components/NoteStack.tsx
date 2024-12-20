import { colors } from '@/constants';

type NoteProps = {
  colorIndex: number;
  stackNumber: number;
  notesTotal: number;
  sizeFactor: number;
};

export const Note = ({
  colorIndex,
  stackNumber,
  sizeFactor
}: NoteProps) => {
  
  const arr = new Array(stackNumber).fill(0)

  return (
    <div className='relative'>
      {arr.map((_, i) => 
        <div key={i} className="h-48 w-48 transition-transform duration-300 ease-in-out absolute border bg-background rounded-xl" style={{
              borderColor: colors[colorIndex],
              top: `${(stackNumber - i)/6}rem`,
              left: `${(stackNumber - i)/6}rem`,
              transformOrigin: "0 0",
              transform: `scale(${sizeFactor/10})`
            }
          }
        />
      )}
    </div>
  )
}

export default Note

