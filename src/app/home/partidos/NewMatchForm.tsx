"use client"

import { X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { FormSelect } from "@/components/FormSelect";
import { Square } from "lucide-react";
import { Input } from "@/components/ui/input";
import { FormText } from "@/components/FormText";
import Image from "next/image";

const groups = [
    { icon: <Square />, label: "Grupo A" },
    { icon: <Square />, label: "Grupo B" },
];

const sedes = [
    {
        icon: '',
        label: "Canada"
    },
    {
        icon: '',
        label: "USA"
    },
]

export default function NewMatchForm() {
    const [showForm, setShowForm] = useState(false);
    const [values, setValues] = useState({
        group: "",
        home: "",
        away: "",
        date: "",
        time: "",
    });
    return (
        <div className="flex flex-col w-full p-2">
            <Button
                variant={showForm ? "outline" : "default"}
                className="w-full"
                size="sm"
                onClick={() => setShowForm(!showForm)}>
                {showForm ? <X /> : <Plus />}
                {showForm ? "Close" : "Nuevo Partido"}
            </Button>
            {showForm && <div className="h-80 flex flex-col py-3">
                <h1 className="font-bold text-end">Agregar Partido</h1>
                <form action="" className="flex flex-col gap-2">
                    <FormSelect
                        label="Fase"
                        options={groups}
                        value={values.group}
                        onChange={(value: string) => setValues({ ...values, group: value })}
                    />
                </form>
            </div>}
        </div>
    );
}