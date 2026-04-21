import { useMemo } from 'react'
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

type SavedRow = {
  hopSo: string
  hoSoSo: string
  tongTLHS: string
  soThuTuVB: string
  tenLoaiVB: string
  soVanBan: string
  kyHieuVB: string
  ngayBanHanh: string
  coQuanBanHanh: string
  trichYeu: string
  soTrang: string
  soTo: string
  savedAt: string
}

type SavedRowsTableProps = {
  savedRows: SavedRow[]
  getDocumentTypeLabel: (value: string) => string
  onEditRow: (row: SavedRow, index: number) => void
  editingRowIndex: number | null
}

export function SavedRowsTable({
  savedRows,
  getDocumentTypeLabel,
  onEditRow,
  editingRowIndex,
}: SavedRowsTableProps) {
  const columns = useMemo<ColumnDef<SavedRow>[]>(
    () => [
      { accessorKey: 'hopSo', header: 'Hộp số' },
      { accessorKey: 'hoSoSo', header: 'Hồ sơ số' },
      { accessorKey: 'tongTLHS', header: 'Tổng TLHS' },
      { accessorKey: 'soThuTuVB', header: 'STT VB' },
      // {
      //   accessorKey: 'tenLoaiVB',
      //   header: 'Loại VB',
      //   cell: ({ row }) => getDocumentTypeLabel(row.original.tenLoaiVB),
      // },
      // { accessorKey: 'soVanBan', header: 'Số VB' },
      // { accessorKey: 'kyHieuVB', header: 'Ký hiệu' },
      // { accessorKey: 'ngayBanHanh', header: 'Ngày ban hành' },
      // { accessorKey: 'coQuanBanHanh', header: 'Cơ quan BH' },
      // {
      //   accessorKey: 'trichYeu',
      //   header: 'Trích yếu',
      //   cell: ({ row }) => (
      //     <div className='min-w-48 whitespace-pre-wrap'>
      //       {row.original.trichYeu}
      //     </div>
      //   ),
      // },
      // { accessorKey: 'soTrang', header: 'Số trang' },
      // { accessorKey: 'soTo', header: 'Số tờ' },
      {
        id: 'actions',
        header: 'Thao tác',
        cell: ({ row }) => (
          <Button
            type='button'
            size='sm'
            variant={editingRowIndex === row.index ? 'secondary' : 'outline'}
            onClick={() => onEditRow(row.original, row.index)}
          >
            {editingRowIndex === row.index ? 'Đang sửa' : 'Edit'}
          </Button>
        ),
      },
    ],
    [editingRowIndex, getDocumentTypeLabel, onEditRow]
  )

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: savedRows,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  if (savedRows.length === 0) return null

  return (
    <div className='rounded-md border border-border bg-muted/30 p-4'>
      <p className='mb-3 text-sm font-semibold text-muted-foreground'>
        Dữ liệu đã lưu ({savedRows.length} dòng)
      </p>
      <div className='rounded-md border border-border bg-background'>
        <div className='max-h-96 overflow-y-auto'>
          <Table className='w-full'>
            <TableHeader className='bg-muted text-muted-foreground'>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className='align-top'>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
