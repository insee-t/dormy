export default function ScrollAnimationWrapper({children, className, ...props}) {
  return (
    <div
      className={className}
      {...props}
    >
      {children}
    </div>
  )
}