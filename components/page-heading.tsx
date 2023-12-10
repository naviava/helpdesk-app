interface PageHeadingProps {
  title: string;
  tagline?: string;
}

export default function PageHeading({ title, tagline }: PageHeadingProps) {
  return (
    <div className="flex-1 space-y-1 text-center md:text-left">
      <h1 className="text-xl font-bold tracking-wide lg:text-2xl">{title}</h1>
      {tagline && <p className="text-sm text-gray-400">{tagline}</p>}
    </div>
  );
}
