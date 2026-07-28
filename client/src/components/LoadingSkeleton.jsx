import React from 'react';

export const CourseSkeletonCard = () => {
  return (
    <div className="glass-card rounded-2xl p-6 animate-pulse space-y-4 border border-slate-200/60 dark:border-slate-800/60">
      <div className="flex justify-between items-center">
        <div className="h-5 w-24 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
        <div className="h-8 w-8 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
      </div>
      <div className="h-6 w-3/4 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
      <div className="h-4 w-1/2 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
      <div className="flex gap-2">
        <div className="h-5 w-16 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
        <div className="h-5 w-16 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
      </div>
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex gap-2">
        <div className="h-9 flex-1 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
        <div className="h-9 w-9 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
      </div>
    </div>
  );
};

export const DiscussionSkeletonCard = () => {
  return (
    <div className="glass-card rounded-2xl p-6 animate-pulse space-y-4 border border-slate-200/60 dark:border-slate-800/60">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
        <div className="space-y-2">
          <div className="h-4 w-32 bg-slate-200 dark:bg-slate-800 rounded"></div>
          <div className="h-3 w-20 bg-slate-200 dark:bg-slate-800 rounded"></div>
        </div>
      </div>
      <div className="h-5 w-2/3 bg-slate-200 dark:bg-slate-800 rounded"></div>
      <div className="h-4 w-full bg-slate-200 dark:bg-slate-800 rounded"></div>
    </div>
  );
};
