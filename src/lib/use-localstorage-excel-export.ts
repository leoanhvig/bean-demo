import { useCallback } from 'react'
import * as XLSX from 'xlsx'
import { toast } from 'sonner'

type ExcelColumn<T> = {
  header: string
  getValue: (row: T) => string | number | null | undefined
}

type UseLocalStorageExcelExportOptions<T> = {
  storageKey: string
  fileNamePrefix: string
  columns: ExcelColumn<T>[]
}

export function useLocalStorageExcelExport<T>(
  options: UseLocalStorageExcelExportOptions<T>
) {
  const exportExcel = useCallback(() => {
    try {
      const raw = localStorage.getItem(options.storageKey)

      if (!raw) {
        toast.error('Không có dữ liệu để xuất file.')
        return
      }

      const rows = JSON.parse(raw) as T[]

      if (!Array.isArray(rows) || rows.length === 0) {
        toast.error('Không có dữ liệu để xuất file.')
        return
      }

      const header = options.columns.map((column) => column.header)
      const body = rows.map((row) =>
        options.columns.map((column) => {
          const value = column.getValue(row)
          return value ?? ''
        })
      )

      const worksheet = XLSX.utils.aoa_to_sheet([header, ...body])
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Data')

      const now = new Date()
      const stamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}-${String(now.getMinutes()).padStart(2, '0')}`
      const fileName = `${options.fileNamePrefix}-${stamp}.xlsx`

      XLSX.writeFile(workbook, fileName)

      toast.success('Xuất file thành công')
    } catch {
      toast.error('Xuất file thất bại. Vui lòng thử lại.')
    }
  }, [options.columns, options.fileNamePrefix, options.storageKey])

  return { exportExcel }
}
