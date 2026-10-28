import { Radio, RadioGroup as RadioGroupPrimitive } from "@base-ui/react";
import type { ComponentProps } from "react";

function RadioGroup({ className, ...props }: ComponentProps<typeof RadioGroupPrimitive>) {
  return (
    <RadioGroupPrimitive
      data-slot="radio-group"
      className={`grid gap-3 ${className ?? ""}`}
      {...props}
    />
  );
}

function RadioGroupItem({
  className,
  ...props
}: ComponentProps<typeof Radio.Root>) {
  return (
    <Radio.Root
      data-slot="radio-group-item"
      className={`flex size-4 shrink-0 items-center justify-center rounded-full border border-input text-primary outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/50 data-[checked]:border-primary ${className ?? ""}`}
      {...props}
    >
      <Radio.Indicator className="size-2 rounded-full bg-current" />
    </Radio.Root>
  );
}

export { RadioGroup, RadioGroupItem };
