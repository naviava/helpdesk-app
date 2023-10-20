interface SidebarPanelHeaderProps {
  text: string;
}

export default function SidebarPanelHeader({ text }: SidebarPanelHeaderProps) {
  return (
    <h3 className="select-none bg-slate-300 py-2 text-center font-semibold tracking-wide dark:bg-slate-700">
      {text}
    </h3>
  );
}
