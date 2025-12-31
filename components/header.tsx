interface HeadingProps {
  title: string;
  description: string;
}

export function Header({ title, description }: HeadingProps) {
  return (
    <div className="space-y-1">
      <h2 className="text-2xl font-bold tracking-tight md:text-3xl">{title}</h2>
      <p className="text-xs text-muted-foreground sm:text-sm">{description}</p>
    </div>
  );
}
