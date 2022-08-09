import defaultSettings from '@/settings'

const title = defaultSettings.title || 'ink_book'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
