import { useEffect, useState } from 'react'
import { Upload, X } from 'lucide-react'

interface ImageUploaderProps {
  onUpload?: (file: File) => Promise<void>
  onFileSelect?: (file: File | null) => void
  currentUrl?: string | null
  deferUpload?: boolean
}

export function ImageUploader({
  onUpload,
  onFileSelect,
  currentUrl,
  deferUpload = false,
}: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(currentUrl || null)
  const [loading, setLoading] = useState(false)
  const [fileName, setFileName] = useState<string | null>(null)

  useEffect(() => {
    if (currentUrl) {
      setPreview(currentUrl)
    }
  }, [currentUrl])

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      return
    }

    setPreview(URL.createObjectURL(file))
    setFileName(file.name)

    if (deferUpload) {
      onFileSelect?.(file)
      return
    }

    if (!onUpload) return

    setLoading(true)
    try {
      await onUpload(file)
      onFileSelect?.(file)
    } finally {
      setLoading(false)
    }
  }

  const handleClear = () => {
    if (preview?.startsWith('blob:')) URL.revokeObjectURL(preview)
    setPreview(currentUrl || null)
    setFileName(null)
    onFileSelect?.(null)
  }

  return (
    <div className="rounded-2xl border-2 border-dashed border-sand bg-cream/30 p-6 text-center">
      {preview ? (
        <div className="relative mx-auto mb-4 inline-block">
          <img src={preview} alt="Product preview" className="h-44 w-44 rounded-xl object-cover shadow-sm" />
          {deferUpload && fileName && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white shadow hover:bg-red-600"
              aria-label="Remove selected image"
            >
              <X size={14} />
            </button>
          )}
        </div>
      ) : (
        <div className="mx-auto mb-4 flex h-44 w-44 items-center justify-center rounded-xl border border-sand bg-white text-earth/40">
          <Upload size={32} />
        </div>
      )}

      <p className="mb-3 text-sm text-earth/60">
        {deferUpload
          ? 'Select a product image (uploaded after you save)'
          : 'Upload or replace product image'}
      </p>

      <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border-2 border-primary bg-primary px-5 py-2.5 font-semibold text-white transition hover:bg-primary-dark">
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          onChange={handleChange}
          disabled={loading}
        />
        {loading ? (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
        ) : (
          <Upload size={18} />
        )}
        {preview ? 'Change Image' : 'Choose Image'}
      </label>

      {fileName && deferUpload && (
        <p className="mt-2 text-xs text-earth/50">{fileName}</p>
      )}
    </div>
  )
}
