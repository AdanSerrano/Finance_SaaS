import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import { Button } from '@/components/ui/button'
import { ImportTable } from './import-table'
import { Plus } from 'lucide-react'
import { useState } from 'react'

const dateFormat = 'yyyy-MM-dd HH:mm:ss'
const outputFormat = 'yyyy-MM-dd'

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
  return (
    <div className='max-w-screen-2xl mx-auto w-full pb-10 -mt-24'>
      <Card className='!border-none !drop-shadow-xs'>
        <CardHeader className='gap-y-2 lg:flex-row lg:items-center lg:justify-between'>
          <CardTitle className='text-xl line-clamp-1'>
            Import transactions
          </CardTitle>
          <div className='flex items-center gap-x-2'>
            <Button
              size={'sm'}
              onClick={onCancel}
            >
              <Plus className='size-4 mr-2' />
              Cancel
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ImportTable
            headers={headers}
            body={body}
            selectedColumns={selectColumns}
            onTableHeadSelectChange={(columnIndex, value) => {
              setSelectColumns({
                ...selectColumns,
                [columnIndex]: value
              })
            }}
          />
        </CardContent>
      </Card>
    </div>
  )
}
