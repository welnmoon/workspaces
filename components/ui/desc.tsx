const Description = ({
  text,
  label,
  className
}: {
  text: string | React.ReactNode;
  label?: string;
  className?: string;
}) => {
  return (
    <div className={className}>
      {label && (
        <div className="text-xs font-medium text-muted-foreground mb-1">
          {label}
        </div>
      )}
      <div className="text-sm text-foreground">{text}</div>
    </div>
  );
};

export default Description;
