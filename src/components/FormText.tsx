import { Input } from "@/components/ui/input"


export function FormText({
    label,
    value,
    onChange,
}: {
    label: string
    value: string
    onChange: (value: string) => void
}) {
    return (
        <div className="flex flex-col">
            <label htmlFor="" className="text-sm font-semibold">{label}</label>
            <Input
                value={value}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
            />
        </div>
    )
}
