import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { format, isValid, parse } from 'date-fns'

import { Button } from '@/components/ui/button'
import { ImportTable } from './import-table'
import { Plus } from 'lucide-react'
import { convertAmoutToMiliunits } from '@/lib/utils'
import { toast } from 'sonner'
import { useState } from 'react'

const dateFormats = [
  "yyyy-MM-dd'T'HH:mm:ss",
  "yyyy-MM-dd HH:mm:ss",
  "yyyy-MM-dd"
];
const outputFormat = 'yyyy-MM-dd'

const tryParseDate = (dateStr: string, formats: string[]): Date | null => {
  if (!dateStr) return null;
  for (const format of formats) {
    const parsedDate = parse(dateStr, format, new Date());
    if (isValid(parsedDate)) {
      return parsedDate;
    }
  }
  return null;
};

const requiredOptions = [
  'date',
  'payee',
  'amount'
]

interface SelectedColumnsState {
  [key: string]: string | null
}

interface ImportCardProps {
  data: string[][]
  onCancel: () => void
  onSubmit: (data: any) => void
}

export const ImportCard = ({
  data,
  onCancel,
  onSubmit
}: ImportCardProps) => {
  const [selectColumns, setSelectColumns] = useState<SelectedColumnsState>({})
  const headers = data[0];
  const body = data.slice(1);

  const onTableHeadSelectChange = (
    columnIndex: number,
    value: string | null
  ) => {
    setSelectColumns((prev) => {
      const newSelectColumns = { ...prev }

      for (const key in newSelectColumns) {
        if (newSelectColumns[key] === value) {
          newSelectColumns[key] = null
        }
      }

      if (value === 'skip') {
        value = null;
      }

      newSelectColumns[`column_${columnIndex}`] = value;
      return newSelectColumns
    })
  }

  const progress = Object.values(selectColumns).filter(Boolean).length

  const handleContinue = () => {
    const getColumnIndex = (column: string) => {
      return column.split("_")[1]
    }

    const mappedData = {
      headers: headers.map((_header, index) => {
        const columnIndex = getColumnIndex(`column_${index}`)
        return selectColumns[`column_${columnIndex}`] ?? null
      }),
      body: body.map((row) => {
        const transformedRow = row.map((cell, index) => {
          const columnsIndex = getColumnIndex(`column_${index}`)
          return selectColumns[`column_${columnsIndex}`] ? cell : null
        })

        return transformedRow.every((cell) => cell === null) ? [] : transformedRow
      }).filter((row) => row.length > 0)
    }

    const arrayOfData = mappedData.body.map((row) => {
      return row.reduce((acc: any, cell, index) => {
        const header = mappedData.headers[index];
        if (header !== null) {
          if (typeof acc === 'object') {
            acc[header] = cell
          } else {
            toast.error('Se esperaba que acc fuera un objeto, pero obtuve:', acc)
          }
        }
        return acc
      }, {})
    })

    const formattedData = arrayOfData.map((item, index) => {
      const parsedDate = tryParseDate(item.date, dateFormats);
      if (!parsedDate) {
        toast.error(`Failed to parse date for row ${index + 1}: ${item.date}`);
        return null;
      }
      return {
        ...item,
        amount: convertAmoutToMiliunits(parseFloat(item.amount)).toString(),
        date: format(parsedDate, outputFormat)
      };
    }).filter(Boolean);

    if (formattedData.length !== arrayOfData.length) {
      toast.error(`Some rows were skipped due to invalid dates. Please check your data.`);
    }

    onSubmit(formattedData);
  }

  return (
    <div className='max-w-screen-2xl mx-auto w-full pb-10 -mt-24'>
      <Card className='!border-none !drop-shadow-xs'>
        <CardHeader className='gap-y-2 lg:flex-row lg:items-center lg:justify-between'>
          <CardTitle className='text-xl line-clamp-1'>
            Import transactions
          </CardTitle>
          <div className='flex flex-col lg:flex-row gap-y-2 items-center gap-x-2'>
            <Button
              size={'sm'}
              onClick={onCancel}
              className='w-full lg:w-auto'
            >
              <Plus className='size-4 mr-2' />
              Cancel
            </Button>
            <Button
              size={'sm'}
              onClick={handleContinue}
              disabled={progress < requiredOptions.length}
              className='w-full lg:w-auto'
            >
              Continue ({progress}/{requiredOptions.length})
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ImportTable
            headers={headers}
            body={body}
            selectedColumns={selectColumns}
            onTableHeadSelectChange={onTableHeadSelectChange}
          />
        </CardContent>
      </Card>
    </div>
  )
}