export function isBlogIndex(slug?: string[]): boolean {
  return slug === undefined || slug.length === 0
}

export function summaryFromFrontmatter(data: { excerpt?: string | undefined; description?: string | undefined }): string | undefined {
  return data.excerpt ?? data.description
}

export function isPublished(data: { published?: boolean }): boolean {
  return data.published !== false
}

export function sortPostsByDateDesc<T extends { data: { date: string | Date } }>(pages: T[]): T[] {
  return [...pages].toSorted((a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime())
}
