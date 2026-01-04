import { Button } from '@/components/ui/button';
import {
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SprintColors } from '@/const/colors/sprint-colors';
import { SprintColorDTO } from '@/types/prisma/DTO/sprint';
import { DropdownMenu } from '@radix-ui/react-dropdown-menu';

export const SprintColorDropdown = ({
  value,
  onChange,
  disabled,
}: {
  value: SprintColorDTO;
  onChange: (color: SprintColorDTO) => void;
  disabled?: boolean;
}) => {
  const colorEntries = Object.entries(SprintColors) as [
    SprintColorDTO,
    string,
  ][];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          className="flex items-center gap-2 shadow-none border-zinc-100"
          disabled={disabled}
        >
          <span
            className="h-3 w-3 rounded-full border "
            style={{ backgroundColor: SprintColors[value] }}
          />
          <span>Цвет спринта</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>Выберите цвет</DropdownMenuLabel>
        <DropdownMenuRadioGroup
          value={value}
          onValueChange={(val) => onChange(val as SprintColorDTO)}
        >
          {colorEntries.map(([colorKey, hex]) => (
            <DropdownMenuRadioItem
              key={colorKey}
              value={colorKey}
              className="flex items-center gap-2"
            >
              <span
                className="h-3 w-3 rounded-full border"
                style={{ backgroundColor: hex }}
              />
              <span className="text-xs font-medium">{colorKey}</span>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
