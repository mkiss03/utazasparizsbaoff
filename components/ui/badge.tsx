import * as React from "react"

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary'
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className = "", variant = "default", ...props }, ref) => {
    const baseStyles = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2"

    const variants = {
      default: "bg-parisian-beige-100 text-parisian-grey-800 hover:bg-parisian-beige-200",
      destructive: "bg-red-100 text-red-800 hover:bg-red-200",
      outline: "border border-parisian-beige-300 text-parisian-grey-700 hover:bg-parisian-beige-50",
      secondary: "bg-parisian-cream-100 text-parisian-grey-700 hover:bg-parisian-cream-200",
    }

    return (
      <div
        className={`${baseStyles} ${variants[variant]} ${className}`}
        ref={ref}
        {...props}
      />
    )
  }
)
Badge.displayName = "Badge"

export { Badge }
