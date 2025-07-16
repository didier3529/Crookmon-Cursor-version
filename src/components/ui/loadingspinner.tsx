import { FC, useId } from 'react'

interface LoadingSpinnerProps {
  size?: number
  color?: string
  label?: string
}

const LoadingSpinner: FC<LoadingSpinnerProps> = ({
  size = 40,
  color = '#3498db',
  label = 'Loading',
}) => {
  const titleId = useId()

  return (
    <svg
      role="status"
      width={size}
      height={size}
      viewBox="0 0 50 50"
      aria-labelledby={titleId}
    >
      <title id={titleId}>{label}</title>
      <circle
        cx="25"
        cy="25"
        r="20"
        fill="none"
        stroke="rgba(0,0,0,0.1)"
        strokeWidth="5"
      />
      <circle
        cx="25"
        cy="25"
        r="20"
        fill="none"
        stroke={color}
        strokeWidth="5"
        strokeLinecap="round"
        strokeDasharray="31.415 31.415"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          values="0 25 25;360 25 25"
          dur="1s"
          repeatCount="indefinite"
        />
      </circle>
    </svg>
  )
}

export default LoadingSpinner
