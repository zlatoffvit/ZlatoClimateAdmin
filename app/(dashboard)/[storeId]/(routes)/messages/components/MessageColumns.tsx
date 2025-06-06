"use client"

import { ColumnDef } from "@tanstack/react-table";
import CellAction from "./CellAction"
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";


// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type MessageColumn = {
  id: string
  phone: string
  name: string
  email?: string
  query: string
  createdAt: string
}

export const columns: ColumnDef<MessageColumn>[] = [
  {
    accessorKey: "name",
    header:"Name",
  },
  {
    accessorKey: "phone",
    header:"Phone",
  },
  {
    accessorKey: "email",
    header:"Email",
  },
  {
    accessorKey: "query",
    header:"Query",
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />
  }
]
