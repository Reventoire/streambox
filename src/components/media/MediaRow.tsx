import React, { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "./MediaRow.css";

interface MediaRowProps {
  title: string;
  children: React.ReactNode;
}

export default function MediaRow({ title, children }: MediaRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollTo = direction === "left" 
        ? scrollLeft - clientWidth * 0.75 
        : scrollLeft + clientWidth * 0.75;
      
      rowRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  return (
    <div className="media-row-container">
      <div className="media-row-header">
        <h2 className="media-row-title">{title}</h2>
        <div className="media-row-controls">
          <button className="row-control-btn" onClick={() => scroll("left")} aria-label="Scroll left">
            <ChevronLeft size={20} />
          </button>
          <button className="row-control-btn" onClick={() => scroll("right")} aria-label="Scroll right">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
      
      <div className="media-row-scroll-area" ref={rowRef}>
        <div className="media-row-content">
          {children}
        </div>
      </div>
    </div>
  );
}
