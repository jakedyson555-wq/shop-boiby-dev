import { fmt } from "../utils/formatters";
import type { ModalData } from "../types";

interface ModalProps {
  data:     ModalData;
  onClose:  () => void;
  onAccept: () => void;
}

/**
 * Overlay modal that presents a summary of forced configuration changes
 * (e.g. upgrading a chip to unlock a higher memory tier) and lets the
 * user accept or cancel before anything is committed.
 */
export function Modal({ data, onClose, onAccept }: ModalProps) {
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[600] bg-black/[0.36] flex items-center justify-center p-4 animate-overlay-in"
    >
      <div
        onClick={e => e.stopPropagation()}
        className="bg-white rounded-[20px] p-6 max-w-[580px] w-full shadow-[0_24px_64px_rgba(0,0,0,0.16)] animate-modal-in"
      >
        <h3 className="text-[26px] font-bold mb-3 tracking-[-0.018em] leading-[1.15] text-t1">
          Review changes to your selection
        </h3>
        <p className="text-[14px] text-t2 mb-6 leading-[1.4]">
          Selecting {data.targetLabel} requires some changes. Please review before accepting.
        </p>

        {/* Change table */}
        <div className="config-card mb-6">
          <div className="grid grid-cols-[300px_1fr_1fr] items-center">
            <div className="text-[14px] text-t2 font-semibold">Current</div>
            <div className="text-[14px] text-t2 font-semibold">After change</div>
          </div>
          {data.changes.map((ch, i) => (
            <div
              key={i}
              className={[
                "grid grid-cols-[300px_1fr_1fr] items-center",
                i > 0 ? "pt-[12px]" : "",
              ].join(" ")}
            >
              <div className="text-[16px] text-t2 font-semibold">{ch.from}</div>
              <div className="text-[16px] text-t1 font-semibold">{ch.to}</div>
            </div>
          ))}
        </div>

        {/* Price comparison */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-surface rounded-xl p-4">
            <div className="text-[13px] font-semibold text-t2 mb-1">Current total</div>
            <div className="text-[18px] font-semibold text-t1 tracking-[-0.012em]">
              {fmt(data.oldTotal)}
            </div>
          </div>
          <div className="bg-surface rounded-xl p-4">
            <div className="text-[13px] font-semibold text-t2 mb-1">New total</div>
            <div className="text-[18px] font-semibold text-t1 tracking-[-0.012em]">
              {fmt(data.newTotal)}
            </div>
            {data.diff !== 0 && (
              <div className="text-xs text-t2 mt-[3px]">
                {data.diff > 0
                  ? `+ ${fmt(data.diff)}`
                  : `− ${fmt(Math.abs(data.diff))}`}
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <button onClick={onClose}   className="modal-cancel-btn">Cancel</button>
          <button onClick={onAccept}  className="modal-accept-btn">Accept changes</button>
        </div>
      </div>
    </div>
  );
}