import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

import React from 'react'

interface ImportTableProps {
    headers: string[]
    body: string[][]
    selectedColumns: Record<string, string | null>
    onTableHeadSelectChange: (columnIndex: number, value: string | null) => void
}

export const ImportTable = ({
    headers,
    body,
    selectedColumns,
    onTableHeadSelectChange
}: ImportTableProps) => {
    return (
        <div>
            <Table>
                <TableHeader className='bg-muted'>
                    <TableRow>
                        {headers.map((_item, index) => (
                            <TableHead key={index}>
                                {index}
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {body.map((row: string[], index) => (
                        <TableRow key={index}>
                            {row.map((cell, index) => (
                                <TableCell key={index}>
                                    {cell}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
