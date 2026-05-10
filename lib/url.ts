// Many data entries store URLs without a protocol (e.g. "flightradar24.com" or
// "github.com/foo/bar") because that's how the user types/reads them. This
// helper prepends https:// when needed so href="..." actually navigates
// off-site instead of being treated as a relative path.

export function externalHref(url: string): string {
  const trimmed = url.trim()
  if (!trimmed) return '#'
  if (/^https?:\/\//i.test(trimmed)) return trimmed
  if (trimmed.startsWith('//')) return `https:${trimmed}`
  // Some entries list multiple URLs separated by ' / ' or ', ' — take the first.
  const first = trimmed.split(/\s*[/,]\s+/)[0]
  return `https://${first}`
}
