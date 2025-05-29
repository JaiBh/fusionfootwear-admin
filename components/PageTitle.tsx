interface PageTitleProps {
  title: string;
  desc?: string;
}

function PageTitle({ title, desc }: PageTitleProps) {
  return (
    <div className="pt-6 pb-4 space-y-2">
      <h1 className="text-2xl md:text-3xl font-bold">{title}</h1>
      <p className="max-md:text-sm text-muted-foreground">{desc}</p>
    </div>
  );
}
export default PageTitle;
