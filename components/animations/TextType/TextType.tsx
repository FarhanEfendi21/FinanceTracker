import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import './TextType.css';

interface TextTypeProps {
  text: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseDuration?: number;
  showCursor?: boolean;
  cursorCharacter?: string;
  startOnVisible?: boolean;
  variableSpeed?: { min: number; max: number };
  loop?: boolean;
  className?: string;
}

export function TextType({
  text,
  typingSpeed = 75,
  deletingSpeed = 40,
  pauseDuration = 1500,
  showCursor = true,
  cursorCharacter = '|',
  startOnVisible = true,
  variableSpeed = { min: 40, max: 90 },
  loop = true,
  className = '',
}: TextTypeProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [textIndex, setTextIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(!startOnVisible);
  const cursorRef = useRef<HTMLSpanElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Intersection Observer to start animation when visible
  useEffect(() => {
    if (!startOnVisible) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [startOnVisible]);

  // Smooth GSAP Cursor Animation
  useEffect(() => {
    if (!showCursor || !cursorRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        cursorRef.current,
        { opacity: 1 },
        { opacity: 0, duration: 0.5, ease: 'steps(1)', repeat: -1, yoyo: true }
      );
    });

    return () => ctx.revert(); // Cleanup
  }, [showCursor]);

  // Typing Logic
  useEffect(() => {
    if (!isVisible || !text || text.length === 0) return;

    let timeout: NodeJS.Timeout;
    const currentFullText = text[textIndex];

    const getVariedSpeed = (baseSpeed: number) => {
      if (variableSpeed) {
        return Math.floor(Math.random() * (variableSpeed.max - variableSpeed.min + 1)) + variableSpeed.min;
      }
      return baseSpeed;
    };

    if (isTyping) {
      if (displayedText.length < currentFullText.length) {
        // Continue typing
        timeout = setTimeout(() => {
          setDisplayedText(currentFullText.slice(0, displayedText.length + 1));
        }, getVariedSpeed(typingSpeed));
      } else {
        // Finished typing
        if (!loop && textIndex === text.length - 1) {
          return; // Stop animation completely
        }
        // Pause then delete
        timeout = setTimeout(() => {
          setIsTyping(false);
        }, pauseDuration);
      }
    } else {
      if (displayedText.length > 0) {
        // Continue deleting
        timeout = setTimeout(() => {
          setDisplayedText(currentFullText.slice(0, displayedText.length - 1));
        }, deletingSpeed);
      } else {
        // Finished deleting, move to next text
        setIsTyping(true);
        setTextIndex((prev) => (prev + 1) % text.length);
      }
    }

    return () => clearTimeout(timeout);
  }, [
    displayedText,
    isTyping,
    textIndex,
    isVisible,
    text,
    typingSpeed,
    deletingSpeed,
    pauseDuration,
    variableSpeed,
    loop,
  ]);

  return (
    <div className={`text-type-container ${className}`} ref={containerRef}>
      <span className="text-type-content" aria-live="polite">
        {displayedText}
      </span>
      {showCursor && (
        <span
          ref={cursorRef}
          className="text-type-cursor"
          aria-hidden="true"
        >
          {cursorCharacter}
        </span>
      )}
    </div>
  );
}
