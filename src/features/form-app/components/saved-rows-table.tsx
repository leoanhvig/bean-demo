import { Button } from '@/components/ui/button'

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
  if (savedRows.length === 0) return null

  return (
    <div className='rounded-md border border-border bg-muted/30 p-4 md:col-span-2'>
      <p className='mb-3 text-sm font-semibold text-muted-foreground'>
        Dữ liệu đã lưu ({savedRows.length} dòng)
      </p>
      <div className='max-h-96 overflow-auto rounded-md border border-border bg-background'>
        <table className='min-w-full text-sm'>
          <thead className='bg-muted text-muted-foreground'>
            <tr>
              <th className='px-3 py-2 text-left font-semibold'>Hộp số</th>
              <th className='px-3 py-2 text-left font-semibold'>Hồ sơ số</th>
              <th className='px-3 py-2 text-left font-semibold'>Tổng TLHS</th>
              <th className='px-3 py-2 text-left font-semibold'>STT VB</th>
              <th className='px-3 py-2 text-left font-semibold'>Loại VB</th>
              <th className='px-3 py-2 text-left font-semibold'>Số VB</th>
              <th className='px-3 py-2 text-left font-semibold'>Ký hiệu</th>
              <th className='px-3 py-2 text-left font-semibold'>
                Ngày ban hành
              </th>
              <th className='px-3 py-2 text-left font-semibold'>Cơ quan BH</th>
              <th className='px-3 py-2 text-left font-semibold'>Trích yếu</th>
              <th className='px-3 py-2 text-left font-semibold'>Số trang</th>
              <th className='px-3 py-2 text-left font-semibold'>Số tờ</th>
              <th className='px-3 py-2 text-left font-semibold'>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {savedRows.map((row, index) => (
              <tr
                key={`${row.savedAt}-${index}`}
                className='border-t border-border align-top'
              >
                <td className='px-3 py-2'>{row.hopSo}</td>
                <td className='px-3 py-2'>{row.hoSoSo}</td>
                <td className='px-3 py-2'>{row.tongTLHS}</td>
                <td className='px-3 py-2'>{row.soThuTuVB}</td>
                <td className='px-3 py-2'>
                  {getDocumentTypeLabel(row.tenLoaiVB)}
                </td>
                <td className='px-3 py-2'>{row.soVanBan}</td>
                <td className='px-3 py-2'>{row.kyHieuVB}</td>
                <td className='px-3 py-2'>{row.ngayBanHanh}</td>
                <td className='px-3 py-2'>{row.coQuanBanHanh}</td>
                <td className='min-w-48 px-3 py-2 whitespace-pre-wrap'>
                  {row.trichYeu}
                </td>
                <td className='px-3 py-2'>{row.soTrang}</td>
                <td className='px-3 py-2'>{row.soTo}</td>
                <td className='px-3 py-2'>
                  <Button
                    type='button'
                    size='sm'
                    variant={
                      editingRowIndex === index ? 'secondary' : 'outline'
                    }
                    onClick={() => onEditRow(row, index)}
                  >
                    {editingRowIndex === index ? 'Đang sửa' : 'Edit'}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
