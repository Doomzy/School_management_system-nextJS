"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

interface ExpandableRowProps {
  title: string;
  subtitle: string;
  stats?: React.ReactNode;
  children?: React.ReactNode;
  isExpandable: boolean;
  indentation?: string;
}

export function ExpandableRow({
  title,
  subtitle,
  stats,
  children,
  isExpandable = false,
  indentation = "p-6",
}: ExpandableRowProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div
        className={`${indentation} hover:bg-gray-50 cursor-pointer border-b border-gray-200`}
        onClick={() => isExpandable && setIsOpen(!isOpen)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            {isExpandable && (
              <button className="text-gray-400">
                {isOpen ? (
                  <ChevronDown className="w-5 h-5" />
                ) : (
                  <ChevronRight className="w-5 h-5" />
                )}
              </button>
            )}
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
              <p className="text-sm text-gray-600">{subtitle}</p>
            </div>
          </div>
          {stats}
        </div>
      </div>
      {isExpandable && isOpen && children}
    </>
  );
}
