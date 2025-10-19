"use client";

import styles from "./popover-menu.styles.module.scss";
import { ReactNode } from "react";

type MenuItem = {
  label: string;
  onClick: () => void;
  icon?: ReactNode;
};

type PopoverMenuProps = {
  items: MenuItem[];
};

export default function PopoverMenu({ items }: PopoverMenuProps) {
  return (
    <div className={styles.menuContainer}>
      {items.map((item, index) => (
        <button
          key={index}
          className={styles.menuItem}
          onClick={item.onClick}
        >
          {item.icon && <span className={styles.icon}>{item.icon}</span>}
          <span>{item.label}</span>
        </button>
      ))}
    </div>
  );
}
