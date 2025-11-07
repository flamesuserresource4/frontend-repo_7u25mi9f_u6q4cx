import React from 'react';

export default function Modal({ open, title, onClose, onSubmit, children, submitText = 'Submit' }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="px-5 py-4 border-b">
          <h3 className="text-lg font-semibold text-emerald-900">{title}</h3>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); onSubmit?.(); }} className="p-5 space-y-4">
          {children}
          <div className="flex items-center justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-md border border-emerald-200 text-emerald-700 hover:bg-emerald-50">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded-md bg-emerald-600 text-white hover:bg-emerald-700">{submitText}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
