import React from 'react';
import { Star, StarHalf } from 'lucide-react';
import { cn } from '../lib/utils';

interface StarsProps {
  rating: number;
  count?: number;
  className?: string;
  starClassName?: string;
  showText?: boolean;
}

export function Stars({ rating, count, className, starClassName, showText = true }: StarsProps) {
  // Normalize rating between 0 and 5
  const normalizedRating = Math.max(0, Math.min(5, rating));
  const fullStars = Math.floor(normalizedRating);
  const hasHalfStar = normalizedRating % 1 >= 0.4 && normalizedRating % 1 <= 0.8;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className={cn('flex items-center gap-1.5', className)}>
      <div className="flex items-center gap-0.5 text-amber-500">
        {/* Full Stars */}
        {Array.from({ length: fullStars }).map((_, idx) => (
          <Star
            key={`full-${idx}`}
            className={cn('h-4 w-4 fill-current stroke-current', starClassName)}
          />
        ))}

        {/* Half Star */}
        {hasHalfStar && (
          <div className="relative">
            <StarHalf
              className={cn('h-4 w-4 fill-current stroke-current', starClassName)}
            />
          </div>
        )}

        {/* Empty Stars */}
        {Array.from({ length: emptyStars }).map((_, idx) => (
          <Star
            key={`empty-${idx}`}
            className={cn('h-4 w-4 text-zinc-300 dark:text-zinc-700 stroke-current', starClassName)}
          />
        ))}
      </div>

      {showText && (
        <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
          {normalizedRating.toFixed(1)}{' '}
          {count !== undefined && count > 0 && `(${count} reviews)`}
        </span>
      )}
    </div>
  );
}
