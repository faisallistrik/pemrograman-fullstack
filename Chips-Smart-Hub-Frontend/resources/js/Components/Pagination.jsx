export default function Pagination({ currentPage, lastPage, total, onPageChange }) {
  if (!lastPage || lastPage <= 1) return null

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
      <p className="text-sm text-gray-500">
        Halaman {currentPage} dari {lastPage}{typeof total === 'number' ? ` (${total} data)` : ''}
      </p>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
        >
          Sebelumnya
        </button>
        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= lastPage}
          className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
        >
          Berikutnya
        </button>
      </div>
    </div>
  )
}
