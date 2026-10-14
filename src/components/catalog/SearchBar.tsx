import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** GET form: submits `q` to `action`, keeping other params via hidden inputs. */
export function SearchBar({
  action,
  placeholder,
  defaultValue,
  hidden = {},
  className,
}: {
  action: string;
  placeholder: string;
  defaultValue?: string;
  hidden?: Record<string, string | undefined>;
  className?: string;
}) {
  return (
    <form
      action={action}
      role="search"
      className={cn(
        "flex w-full max-w-2xl items-center gap-2 rounded-xl bg-background p-2 text-foreground shadow-lg",
        className,
      )}
    >
      {Object.entries(hidden).map(([name, value]) =>
        value ? <input key={name} type="hidden" name={name} value={value} /> : null,
      )}
      <label htmlFor={`search-${action}`} className="sr-only">
        {placeholder}
      </label>
      <input
        id={`search-${action}`}
        name="q"
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="h-10 flex-1 bg-transparent px-3 text-sm outline-none placeholder:text-muted-foreground"
      />
      <Button type="submit">Search</Button>
    </form>
  );
}
