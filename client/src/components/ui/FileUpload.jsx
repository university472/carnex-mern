// client/src/components/ui/FileUpload.jsx
import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import clsx from 'clsx'

export function FileUpload({
  onFiles,
  accept = { 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] },
  maxFiles = 10,
  maxSize = 5 * 1024 * 1024, // 5MB
  multiple = true,
  label = 'Upload images',
  className
}) {
  const onDrop = useCallback(
    (accepted) => {
      if (onFiles) onFiles(accepted)
    },
    [onFiles]
  )

  const { getRootProps, getInputProps, isDragActive, fileRejections } =
    useDropzone({
      onDrop,
      accept,
      maxFiles,
      maxSize,
      multiple
    })

  return (
    <div className={className}>
      {label && (
        <p className="text-xs font-medium text-brand-secondary mb-1">{label}</p>
      )}

      <div
        {...getRootProps()}
        className={clsx(
          'border-2 border-dashed rounded-md p-6 text-center cursor-pointer transition-colors',
          isDragActive
            ? 'border-brand-primary bg-red-50'
            : 'border-brand-border hover:border-brand-primary/60 hover:bg-brand-surface'
        )}
      >
        <input {...getInputProps()} />
        <svg
          className="mx-auto mb-2 text-brand-muted"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
        <p className="text-xs text-brand-muted">
          {isDragActive
            ? 'Drop files here…'
            : `Drag & drop or click to upload (max ${maxFiles} file${maxFiles > 1 ? 's' : ''}, up to 5 MB each)`}
        </p>
      </div>

      {fileRejections.length > 0 && (
        <ul className="mt-2 space-y-0.5">
          {fileRejections.map(({ file, errors }) => (
            <li key={file.name} className="text-xs text-red-600">
              {file.name}: {errors.map((e) => e.message).join(', ')}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
