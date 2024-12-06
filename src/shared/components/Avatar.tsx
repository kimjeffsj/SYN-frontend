interface AvatarProps {
  name: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Avatar({ name, size = "md", className = "" }: AvatarProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base",
  };

  return (
    <div
      className={`
        rounded-full 
        bg-primary-100 
        text-primary-700 
        font-medium 
        flex 
        items-center 
        justify-center 
        ${sizeClasses[size]} 
        ${className}
      `}
    >
      {getInitials(name)}
    </div>
  );
}
