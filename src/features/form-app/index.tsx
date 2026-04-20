import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { useLocalStorageExcelExport } from '@/lib/use-localstorage-excel-export.ts'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { SavedRowsTable } from '@/features/form-app/components/saved-rows-table'

const documentTypeOptions = [
  { value: '01', label: 'Nghị quyết' },
  { value: '02', label: 'Quyết định' },
  { value: '03', label: 'Chỉ thị' },
  { value: '04', label: 'Quy chế' },
  { value: '05', label: 'Quy định' },
  { value: '06', label: 'Thông cáo' },
  { value: '07', label: 'Thông báo' },
  { value: '08', label: 'Hướng dẫn' },
  { value: '09', label: 'Chương trình' },
  { value: '10', label: 'Kế hoạch' },
  { value: '11', label: 'Phương án' },
  { value: '12', label: 'Đề án' },
  { value: '13', label: 'Dự án' },
  { value: '14', label: 'Báo cáo' },
  { value: '15', label: 'Tờ trình' },
  { value: '16', label: 'Giấy ủy quyền' },
  { value: '17', label: 'Phiếu gửi' },
  { value: '18', label: 'Phiếu chuyển' },
  { value: '19', label: 'Phiếu báo' },
  { value: '20', label: 'Biên bản' },
  { value: '21', label: 'Hợp đồng' },
  { value: '22', label: 'Công văn' },
  { value: '23', label: 'Công điện' },
  { value: '24', label: 'Bản ghi nhớ' },
  { value: '25', label: 'Bản thỏa thuận' },
  { value: '26', label: 'Giấy mời' },
  { value: '27', label: 'Giấy giới thiệu' },
  { value: '28', label: 'Giấy nghỉ phép' },
  { value: '29', label: 'Thư công' },
  { value: '30', label: 'Bản đồ' },
  { value: '31', label: 'Bản vẽ kỹ thuật' },
  { value: '32', label: 'Khác' },
]

const LOCAL_STORAGE_ROWS_KEY = 'document_form_rows'

type DocumentFormData = {
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
}

type SavedDocumentRow = DocumentFormData & {
  savedAt: string
}

const defaultValues: DocumentFormData = {
  hopSo: '',
  hoSoSo: '',
  tongTLHS: '',
  soThuTuVB: '0000001',
  tenLoaiVB: '',
  soVanBan: '',
  kyHieuVB: '',
  ngayBanHanh: '',
  coQuanBanHanh: '',
  trichYeu: '',
  soTrang: '',
  soTo: '',
}

function getNextSoThuTuVB(value: string) {
  const current = Number.parseInt(value || '0', 10)
  const next = Number.isNaN(current) ? 1 : current + 1
  return String(next).padStart(7, '0')
}

function getResetValuesAfterAddRow(
  formData: Pick<DocumentFormData, 'hopSo' | 'hoSoSo' | 'soThuTuVB'>
): DocumentFormData {
  return {
    ...defaultValues,
    hopSo: formData.hopSo,
    hoSoSo: formData.hoSoSo,
    soThuTuVB: getNextSoThuTuVB(formData.soThuTuVB),
  }
}

function getSavedRowsFromLocalStorage(): SavedDocumentRow[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_ROWS_KEY)
    if (!raw) return []
    return JSON.parse(raw) as SavedDocumentRow[]
  } catch {
    return []
  }
}

function getDocumentTypeLabel(value: string) {
  return (
    documentTypeOptions.find((option) => option.value === value)?.label ?? value
  )
}

function DocumentForm() {
  const initialRows = useMemo(() => getSavedRowsFromLocalStorage(), [])

  const initialFormValues = useMemo(() => {
    const lastRow = initialRows[initialRows.length - 1]
    if (!lastRow) return defaultValues

    return getResetValuesAfterAddRow(lastRow)
  }, [initialRows])

  const form = useForm<DocumentFormData>({
    defaultValues: initialFormValues,
  })
  const [documentTypeQuery, setDocumentTypeQuery] = useState('')
  const [savedRows, setSavedRows] = useState<SavedDocumentRow[]>(initialRows)
  const [editingRowIndex, setEditingRowIndex] = useState<number | null>(null)

  const { exportExcel } = useLocalStorageExcelExport<SavedDocumentRow>({
    storageKey: LOCAL_STORAGE_ROWS_KEY,
    fileNamePrefix: 'du-lieu-ho-so',
    columns: [
      { header: 'Hộp số', getValue: (row: SavedDocumentRow) => row.hopSo },
      { header: 'Hồ sơ số', getValue: (row: SavedDocumentRow) => row.hoSoSo },
      {
        header: 'Tổng TLHS',
        getValue: (row: SavedDocumentRow) => row.tongTLHS,
      },
      { header: 'STT VB', getValue: (row: SavedDocumentRow) => row.soThuTuVB },
      {
        header: 'Loại VB',
        getValue: (row: SavedDocumentRow) =>
          getDocumentTypeLabel(row.tenLoaiVB),
      },
      { header: 'Số VB', getValue: (row: SavedDocumentRow) => row.soVanBan },
      { header: 'Ký hiệu', getValue: (row: SavedDocumentRow) => row.kyHieuVB },
      {
        header: 'Ngày ban hành',
        getValue: (row: SavedDocumentRow) => row.ngayBanHanh,
      },
      {
        header: 'Cơ quan BH',
        getValue: (row: SavedDocumentRow) => row.coQuanBanHanh,
      },
      {
        header: 'Trích yếu',
        getValue: (row: SavedDocumentRow) => row.trichYeu,
      },
      { header: 'Số trang', getValue: (row: SavedDocumentRow) => row.soTrang },
      { header: 'Số tờ', getValue: (row: SavedDocumentRow) => row.soTo },
    ],
  })

  const filteredDocumentTypeOptions = useMemo(() => {
    const query = documentTypeQuery.trim().toLowerCase()
    if (!query) return documentTypeOptions

    return documentTypeOptions.filter(
      (option) =>
        option.label.toLowerCase().startsWith(query) ||
        option.value.startsWith(query)
    )
  }, [documentTypeQuery])

  const normalizeFieldValue = (
    name: keyof DocumentFormData,
    value: string
  ): string => {
    if (['hopSo', 'hoSoSo', 'tongTLHS', 'soTrang', 'soTo'].includes(name)) {
      if (value && Number(value) < 10) {
        return value.padStart(2, '0')
      }
    }

    if (name === 'soThuTuVB' && value) {
      return value.padStart(7, '0')
    }

    return value
  }

  const handleSubmit = () => {
    exportExcel()
  }

  const handleAddRow = (formData: DocumentFormData) => {
    try {
      const currentRows = getSavedRowsFromLocalStorage()
      let nextRows: SavedDocumentRow[]

      if (editingRowIndex !== null && currentRows[editingRowIndex]) {
        const existingRow = currentRows[editingRowIndex]
        const updatedRow: SavedDocumentRow = {
          ...formData,
          savedAt: existingRow.savedAt,
        }
        nextRows = currentRows.map((row, index) =>
          index === editingRowIndex ? updatedRow : row
        )
      } else {
        const rowToSave: SavedDocumentRow = {
          ...formData,
          savedAt: new Date().toISOString(),
        }
        nextRows = [...currentRows, rowToSave]
      }

      localStorage.setItem(LOCAL_STORAGE_ROWS_KEY, JSON.stringify(nextRows))
      setSavedRows(nextRows)

      form.reset(getResetValuesAfterAddRow(formData))
      setEditingRowIndex(null)

      setDocumentTypeQuery('')
      toast.success(
        editingRowIndex !== null
          ? 'Đã cập nhật dòng thành công'
          : 'Đã thêm dòng thành công'
      )
    } catch {
      toast.error('Lưu dòng thất bại. Vui lòng thử lại.')
    }
  }

  const handleEditRow = (row: SavedDocumentRow, index: number) => {
    setEditingRowIndex(index)
    setDocumentTypeQuery(getDocumentTypeLabel(row.tenLoaiVB))
    form.reset({
      hopSo: row.hopSo,
      hoSoSo: row.hoSoSo,
      tongTLHS: row.tongTLHS,
      soThuTuVB: row.soThuTuVB,
      tenLoaiVB: row.tenLoaiVB,
      soVanBan: row.soVanBan,
      kyHieuVB: row.kyHieuVB,
      ngayBanHanh: row.ngayBanHanh,
      coQuanBanHanh: row.coQuanBanHanh,
      trichYeu: row.trichYeu,
      soTrang: row.soTrang,
      soTo: row.soTo,
    })
  }

  return (
    <Card className='shadow-lg'>
      <CardHeader>
        <CardTitle className='text-2xl'>
          Biểu mẫu hồ sơ ({savedRows.length} dòng)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <FormField
              control={form.control}
              name='hopSo'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hộp số</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      onChange={(e) =>
                        field.onChange(
                          normalizeFieldValue('hopSo', e.target.value)
                        )
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='hoSoSo'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hồ sơ số</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      onChange={(e) =>
                        field.onChange(
                          normalizeFieldValue('hoSoSo', e.target.value)
                        )
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='soThuTuVB'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số thứ tự văn bản</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      onChange={(e) =>
                        field.onChange(
                          normalizeFieldValue('soThuTuVB', e.target.value)
                        )
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='tenLoaiVB'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên loại văn bản</FormLabel>
                  <div className='flex items-center gap-2'>
                    <Input
                      value={documentTypeQuery}
                      onChange={(e) => setDocumentTypeQuery(e.target.value)}
                      placeholder='Gõ để lọc (ví dụ: Q)'
                      className='w-40'
                    />
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || undefined}
                    >
                      <FormControl>
                        <SelectTrigger className='flex-1'>
                          <SelectValue placeholder='--Chọn loại--' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {filteredDocumentTypeOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='soVanBan'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số văn bản</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='kyHieuVB'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ký hiệu văn bản</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='ngayBanHanh'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ngày ban hành</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder='dd/mm/yyyy'
                      inputMode='numeric'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='coQuanBanHanh'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cơ quan ban hành</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='trichYeu'
              render={({ field }) => (
                <FormItem className='md:col-span-2'>
                  <FormLabel>Trích yếu</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={3} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='soTrang'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số trang</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      onChange={(e) =>
                        field.onChange(
                          normalizeFieldValue('soTrang', e.target.value)
                        )
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='soTo'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số tờ</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      onChange={(e) =>
                        field.onChange(
                          normalizeFieldValue('soTo', e.target.value)
                        )
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='tongTLHS'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tổng TLHS</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      onChange={(e) =>
                        field.onChange(
                          normalizeFieldValue('tongTLHS', e.target.value)
                        )
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='pt-2 md:col-span-2'>
              <div className='flex items-center gap-2'>
                <Button
                  type='button'
                  onClick={form.handleSubmit(handleAddRow)}
                  variant='secondary'
                >
                  {editingRowIndex !== null ? 'Update row' : 'Add row'}
                </Button>
                {savedRows.length > 0 && (
                  <Button type='button' onClick={handleSubmit}>
                    Lưu excel
                  </Button>
                )}
                {editingRowIndex !== null && (
                  <Button
                    type='button'
                    variant='outline'
                    onClick={() => {
                      setEditingRowIndex(null)
                      setDocumentTypeQuery('')
                      form.reset(getResetValuesAfterAddRow(form.getValues()))
                    }}
                  >
                    Hủy sửa
                  </Button>
                )}
              </div>
            </div>

            <SavedRowsTable
              savedRows={savedRows}
              getDocumentTypeLabel={getDocumentTypeLabel}
              onEditRow={handleEditRow}
              editingRowIndex={editingRowIndex}
            />
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

export default function FormApp() {
  return (
    <div className='min-h-screen bg-background'>
      <div className='flex'>
        <div className='flex-1 p-8 lg:p-12'>
          <div className='mx-auto max-w-4xl space-y-12'>
            <DocumentForm />
          </div>
        </div>
      </div>
    </div>
  )
}
