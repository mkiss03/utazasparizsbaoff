import * as React from "react"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost'
  size?: 'default' | 'sm' | 'lg'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "default", size = "default", ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center rounded-lg font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-parisian-beige-400 disabled:pointer-events-none disabled:opacity-50"

    const variants = {
      default: "bg-french-blue-500 text-white hover:bg-french-blue-600 shadow-md",
      destructive: "bg-red-600 text-white hover:bg-red-700 shadow-md",
      outline: "border-2 border-french-blue-500 text-french-blue-500 hover:bg-french-blue-50",
      secondary: "bg-parisian-beige-400 text-parisian-grey-800 hover:bg-parisian-beige-500 shadow-md",
      ghost: "hover:bg-parisian-beige-100 text-parisian-grey-700",
    }

    const sizes = {
      default: "h-10 px-4 py-2",
      sm: "h-9 rounded-md px-3 text-sm",
      lg: "h-11 rounded-md px-8 text-lg",
    }

    return (
      <button
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
