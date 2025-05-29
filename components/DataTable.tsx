"use client";

import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
  useReactTable,
  SortingState,
  getSortedRowModel,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import AlertModal from "./AlertModal";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import axios from "axios";
import { cn } from "@/lib/utils";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  api: string;
  data: TData[];
  searchKey: string;
  searchKey2?: string;
  searchKey3?: string;
  searchKey4?: string;
  dataName: string;
  dataName2?: string;
  dataName3?: string;
  dataName4?: string;
  hideDeleteSelected?: boolean;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  api,
  searchKey,
  searchKey2,
  searchKey3,
  searchKey4,
  dataName,
  dataName2,
  dataName3,
  dataName4,
  hideDeleteSelected,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = React.useState({});
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      columnFilters,
      sorting,
      rowSelection,
    },
  });

  const onDelete = async () => {
    try {
      setLoading(true);
      for (const row of table.getFilteredSelectedRowModel().rows) {
        // @ts-expect-error
        const id = row.original.id;
        await axios.delete(`/api/${api}/${id}`);
      }
      setRowSelection({});
      router.refresh();
      toast.success("Selected items deleted!");
      setOpen(false);
    } catch (error) {
      toast.error(
        `Something went wrong. Have you checked that you deleted anything that is linked to this item?`
      );
      console.log("Error deleting item(s)", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        action={onDelete}
        setOpen={() => setOpen(!open)}
        title="Are you sure you want to proceed with deleting the selected?"
        desc="This action cannot be reversed."
        disabled={loading}
      ></AlertModal>
      <div>
        <div className="md:flex items-center py-4 md:space-x-4 max-md:space-y-4">
          <Input
            placeholder={`Filter ${dataName}...`}
            value={
              (table.getColumn(searchKey)?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn(searchKey)?.setFilterValue(event.target.value)
            }
            className="md:max-w-sm"
          />
          {searchKey2 && (
            <Input
              placeholder={`Filter ${dataName2}...`}
              value={
                (table.getColumn(searchKey2)?.getFilterValue() as string) ?? ""
              }
              onChange={(event) =>
                table.getColumn(searchKey2)?.setFilterValue(event.target.value)
              }
              className="md:max-w-sm"
            />
          )}
          {searchKey3 && (
            <Input
              placeholder={`Filter ${dataName3}...`}
              value={
                (table.getColumn(searchKey3)?.getFilterValue() as string) ?? ""
              }
              onChange={(event) =>
                table.getColumn(searchKey3)?.setFilterValue(event.target.value)
              }
              className="md:max-w-sm"
            />
          )}
          {searchKey4 && (
            <Input
              placeholder={`Filter ${dataName4}...`}
              value={
                (table.getColumn(searchKey4)?.getFilterValue() as string) ?? ""
              }
              onChange={(event) =>
                table.getColumn(searchKey4)?.setFilterValue(event.target.value)
              }
              className="md:max-w-sm"
            />
          )}
          <Button
            variant={"destructive"}
            className={cn("max-md:w-full", hideDeleteSelected && "hidden")}
            disabled={
              loading || !table.getFilteredSelectedRowModel().rows.length
            }
            onClick={() => setOpen(true)}
          >
            Delete selected
          </Button>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead
                        key={header.id}
                        className={cn`${header.column.columnDef.meta}`}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className={cn(`${cell.column.columnDef.meta}`)}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </>
  );
}
