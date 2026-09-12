/**
 * Joins class names, dropping anything falsy. Small enough not to warrant
 * a dependency, and it keeps conditional Tailwind classes readable:
 *
 *   cx('px-3', isOpen && 'bg-muted', className)
 */
export const cx = (...parts) => parts.filter(Boolean).join(' ');
