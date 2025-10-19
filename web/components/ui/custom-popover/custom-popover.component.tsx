"use client";

import { useState, useRef, useEffect, ReactNode } from "react";
import styles from "./custom-popover.styles.module.scss";

type CustomPopoverProps = {
  trigger: ReactNode;
  children: ReactNode;
};

export default function CustomPopover({ trigger, children }: CustomPopoverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  const handleTriggerClick = () => {
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className={styles.popoverContainer} ref={popoverRef}>
      <div className={styles.triggerContainer} onClick={handleTriggerClick}>
        {trigger}
      </div>
      {isOpen && (
        <div className={styles.popoverContent}>
          {children}
        </div>
      )}
    </div>
  );
}
