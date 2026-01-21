import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface Option {
    icon: React.ReactNode;
    label: string;
}

export function FormSelect({
    label,
    options,
    value,
    onChange,
}: {
    label: string
    options: Option[]
    value: string
    onChange: (value: string) => void
}) {
    return (
        <div className="flex flex-col">
            <label htmlFor="" className="text-sm font-semibold">{label}</label>
            <Select value={value} onValueChange={onChange}>
                <SelectTrigger className="w-full">
                    <SelectValue placeholder={label} />
                </SelectTrigger>

                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>{label}</SelectLabel>

                        {options.map((option) => (
                            <SelectItem key={option.label} value={option.label}>
                                {option.icon}
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>
    )
}
