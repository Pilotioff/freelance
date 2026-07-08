import { Check } from 'lucide-react';

export interface StepperItem {
  label: string;
  icon: React.ReactNode;
}

interface StepperProps {
  items: StepperItem[];
  pasoActual: number;
}

export function Stepper({ items, pasoActual }: StepperProps) {
  return (
    <div className="flex items-center justify-between w-full mb-2">
      {items.map((item, i) => {
        const completado = i < pasoActual;
        const actual = i === pasoActual;

        return (
          <div key={item.label} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition ${
                  completado
                    ? 'bg-primary border-primary text-background'
                    : actual
                      ? 'border-primary text-primary'
                      : 'border-slate-600 text-muted'
                }`}
              >
                {completado ? <Check size={16} /> : item.icon}
              </div>
              <span
                className={`text-xs font-medium hidden sm:block ${
                  completado || actual ? 'text-foreground' : 'text-muted'
                }`}
              >
                {item.label}
              </span>
            </div>
            {i < items.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-2 transition ${
                  completado ? 'bg-primary' : 'bg-slate-700'
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
