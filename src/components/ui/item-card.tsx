import * as React from "react"
import { cn } from "@/lib/utils"
import Image from "next/image"

export interface ItemCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  description?: string
  imageUrl?: string
  imageAlt?: string
  actions?: React.ReactNode
  isLoading?: boolean
}

export const ItemCard = ({
  className,
  title,
  description,
  imageUrl,
  imageAlt,
  actions,
  isLoading = false,
  ...props
}: ItemCardProps) => {

  return (
<div
  className={cn(
    "group relative overflow-hidden transition-all duration-300",
    "grid grid-rows-[1fr_auto_auto]",
    className
  )}
      tabIndex={0}
      {...props}
    >
      {/* Image container with aspect ratio */}
      <div className={cn("relative w-full overflow-hidden", isLoading && "animate-pulse bg-muted/50")}>
        {imageUrl && (
          <Image
            src={imageUrl}
            alt={imageAlt || title || "Item image"}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            priority={false}
          />
        )}
      </div>

      <div className="truncate p-2">
        <h3
          title={title}
          className={cn(
            "text-sm text-primary font-semibold truncate",
            isLoading && "animate-pulse bg-muted/50 h-6"
          )}
        >
          {title}
        </h3>

        {description && (
          <p
            className={cn(
              "text-xs text-muted-foreground truncate",
              isLoading && "animate-pulse bg-muted/50 h-4"
            )}
          >
            {description}
          </p>
        )}
      </div>

      {/* Actions container */}
      {actions && (
        <div className={cn(isLoading && "animate-pulse bg-muted/50 h-10")}>
          {actions}
        </div>
      )}
    </div>
  )
}

export const ItemCardSkeleton = ({
  className,
  ...props
}: Omit<ItemCardProps, 'title' | 'description' | 'imageUrl' | 'actions'>) => {
  return (
    <ItemCard
      title=""
      description=""
      imageUrl=""
      actions={null}
      isLoading
      className={className}
      {...props}
    />
  )
} 