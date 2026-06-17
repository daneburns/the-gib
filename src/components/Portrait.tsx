import { useRef, useState } from 'react'

/** Longest edge of a stored likeness. Records live in localStorage; keep them light. */
const MAX_EDGE = 480

/**
 * Read an image File, downscale it to fit within MAX_EDGE, and return a JPEG
 * data URL. Downscaling matters: localStorage holds the whole roster, and an
 * untouched phone photo would blow the quota in two or three Persons.
 */
function fileToPortrait(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error('Could not read the file.'))
    reader.onload = () => {
      const img = new Image()
      img.onerror = () => reject(new Error('That file is not an image we can read.'))
      img.onload = () => {
        const scale = Math.min(1, MAX_EDGE / Math.max(img.width, img.height))
        const w = Math.round(img.width * scale)
        const h = Math.round(img.height * scale)
        const canvas = document.createElement('canvas')
        canvas.width = w
        canvas.height = h
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          reject(new Error('Could not prepare the likeness.'))
          return
        }
        ctx.drawImage(img, 0, 0, w, h)
        resolve(canvas.toDataURL('image/jpeg', 0.82))
      }
      img.src = reader.result as string
    }
    reader.readAsDataURL(file)
  })
}

interface Props {
  value: string
  onChange: (dataUrl: string) => void
  /** A note printed under the frame when empty. */
  caption?: string
}

export default function Portrait({ value, onChange, caption }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function handleFile(file: File | undefined) {
    if (!file) return
    setBusy(true)
    setError('')
    try {
      onChange(await fileToPortrait(file))
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not attach that image.')
    } finally {
      setBusy(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  return (
    <div className="portrait">
      <div className={`portrait-frame${value ? ' has-likeness' : ''}`}>
        {value ? (
          <img className="portrait-img" src={value} alt="Likeness on file" />
        ) : (
          <div className="portrait-empty" aria-hidden="true">
            <span className="portrait-empty-mark">◻</span>
            <span className="portrait-empty-note">{caption || 'No likeness on file'}</span>
          </div>
        )}
      </div>

      <div className="portrait-actions no-print">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="portrait-input"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
        <button
          type="button"
          className="ghost-btn"
          disabled={busy}
          onClick={() => inputRef.current?.click()}
        >
          {busy ? 'Affixing…' : value ? 'Replace' : 'Affix a likeness'}
        </button>
        {value && (
          <button type="button" className="ghost-btn" onClick={() => onChange('')}>
            Remove
          </button>
        )}
      </div>
      {error && <p className="warn no-print">{error}</p>}
    </div>
  )
}
