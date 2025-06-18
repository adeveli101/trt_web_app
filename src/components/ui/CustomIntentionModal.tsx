import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import Button from "@/components/ui/button";

interface CustomIntentionModalProps {
  open: boolean;
  onClose: () => void;
  value: string;
  onChange: (val: string) => void;
  onConfirm: () => void;
  placeholder: string;
  confirmLabel: string;
  maxLength?: number;
}

export default function CustomIntentionModal({
  open,
  onClose,
  value,
  onChange,
  onConfirm,
  placeholder,
  confirmLabel,
  maxLength = 250,
}: CustomIntentionModalProps) {
  const [touched, setTouched] = React.useState(false);
  const isValid = value.trim().length > 0 && value.length <= maxLength;
  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="max-w-md w-full rounded-2xl bg-gradient-to-br from-[#180026] via-[#3B006A] to-[#7A2062] border-2 border-accent-gold p-6 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-accent-gold font-cinzel text-lg md:text-xl mb-2">Kendi Sorunuzu Yazın</DialogTitle>
        </DialogHeader>
        <textarea
          className="w-full min-h-[90px] max-h-40 rounded-lg border-2 border-[var(--accent-color)] bg-black/30 text-white font-cabin p-3 text-base focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-gold resize-none transition"
          placeholder={placeholder}
          value={value}
          maxLength={maxLength}
          onChange={e => { onChange(e.target.value); setTouched(true); }}
          aria-label={placeholder}
        />
        <div className="flex justify-between items-center mt-2 text-xs text-gray-400">
          <span>{value.length}/{maxLength}</span>
          {!isValid && touched && <span className="text-red-400">Lütfen bir niyet girin.</span>}
        </div>
        <DialogFooter className="mt-4 flex flex-row gap-2 justify-end">
          <Button variant="ghost" onClick={onClose} className="font-cabin">İptal</Button>
          <Button onClick={onConfirm} disabled={!isValid} className="bg-accent-gold text-black font-cabin font-bold hover:bg-yellow-400 transition">{confirmLabel}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 