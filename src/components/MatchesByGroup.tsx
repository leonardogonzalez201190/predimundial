"use client"

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchGroups } from "@/actions";

export default function MatchesByGroup() {

    const [options, setOptions] = useState<string[]>([]);
    const patchName = usePathname();
    const route = useRouter();

    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const groups = await fetchGroups();
                setOptions(groups);
            } catch (error) {
                console.error(error);
            }
        };
        fetchOptions();
    }, []);

    const handleGroupChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const group = e.target.value;
        const searchParams = new URLSearchParams(window.location.search);
        if (group) {
            searchParams.set("group", group);
        } else {
            searchParams.delete("group");
        }
        const newUrl = `${patchName}?${searchParams.toString()}`;
        route.push(newUrl);
    };

    return (
        <section className="flex items-center justify-end gap-2">
            <h2>Filtrar por grupo:</h2>
            <select name="" id="" onChange={handleGroupChange}>
                <option value="">Todos</option>
                {options.map((option: string) => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </select>
        </section>
    );
}
