'use client'

interface DiffViewerProps {
  diff: string[]
  originalLines: number
  optimizedLines: number
  lineChanges: number
}

export default function DiffViewer({ diff, originalLines, optimizedLines, lineChanges }: DiffViewerProps) {
  if (!diff || diff.length === 0) {
    return (
      <div className="w-full p-4 text-center text-gray-500 dark:text-gray-400">
        No changes detected
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Code Diff</h3>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {originalLines} → {optimizedLines} lines ({lineChanges} changes)
        </div>
      </div>
      <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto max-h-96 overflow-y-auto">
        {diff.map((line, idx) => {
          const isAddition = line.startsWith('+') && !line.startsWith('+++')
          const isDeletion = line.startsWith('-') && !line.startsWith('---')
          const isHeader = line.startsWith('@@') || line.startsWith('+++') || line.startsWith('---')
          
          return (
            <div
              key={idx}
              className={`${
                isAddition
                  ? 'text-green-400 bg-green-900/20'
                  : isDeletion
                  ? 'text-red-400 bg-red-900/20'
                  : isHeader
                  ? 'text-blue-400'
                  : 'text-gray-400'
              } whitespace-pre`}
            >
              {line}
            </div>
          )
        })}
      </div>
    </div>
  )
}

