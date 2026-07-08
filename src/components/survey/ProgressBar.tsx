interface ProgressBarProps {
   current: number;
   total: number;
}

export const ProgressBar = ({ current, total }: ProgressBarProps) => {
   const percent = Math.round((current / total) * 100);

   return (
      <div className="mb-8" data-testid="progress-bar">
         <div className="mb-2 flex items-center justify-between text-sm text-slate-500">
            <span>
               Frage {current} von {total}
            </span>
            <span>{percent}%</span>
         </div>
         <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div
               className="h-full rounded-full bg-blue-600 transition-all duration-300"
               style={{ width: `${percent}%` }}
               data-testid="progress-bar-fill"
            />
         </div>
      </div>
   );
};
