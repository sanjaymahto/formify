'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Linkedin, Github, Twitter, Globe } from 'lucide-react';
import { SettingsButton } from '@/components/settings-button';
import { useSettingsStore } from '@/lib/settings-store';

const words = ['simplest', 'coolest', 'easiest'];
const typingSpeed = 150;
const pauseTime = 3000;

function TypingHeadline() {
  const [wordIndex, setWordIndex] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [typing, setTyping] = useState(true);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const currentWord = words[wordIndex];
    if (typing) {
      if (displayed.length < currentWord.length) {
        timeout = setTimeout(() => {
          setDisplayed(currentWord.slice(0, displayed.length + 1));
        }, typingSpeed);
      } else {
        timeout = setTimeout(() => setTyping(false), pauseTime);
      }
    } else {
      if (displayed.length > 0) {
        timeout = setTimeout(() => {
          setDisplayed(currentWord.slice(0, displayed.length - 1));
        }, typingSpeed / 2);
      } else {
        setTyping(true);
        setWordIndex(prev => (prev + 1) % words.length);
      }
    }
    return () => clearTimeout(timeout);
  }, [displayed, typing, wordIndex]);

  return (
    <span className="relative inline-block">
      <span className="text-neutral-900">{displayed}</span>
      <span
        className="ml-0.5 inline-block h-14 w-1 animate-pulse bg-black align-bottom"
        style={{ visibility: typing ? 'visible' : 'hidden' }}
      ></span>
    </span>
  );
}

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [year, setYear] = useState(2025);
  const { colorPalette, fontSize } = useSettingsStore();

  useEffect(() => {
    setMounted(true);
    setYear(new Date().getFullYear());
  }, []);

  // Generate button variant based on settings
  const getButtonVariant = () => {
    const variants = {
      default: 'default',
      blue: 'default',
      green: 'default',
      purple: 'default',
      orange: 'default',
      pink: 'default',
      red: 'default',
      teal: 'default',
      indigo: 'default',
      yellow: 'default',
    };
    return variants[colorPalette] as 'default' | 'gradient' | 'glass';
  };

  // Generate button size based on settings
  const getButtonSize = () => {
    const sizes = {
      small: 'sm',
      medium: 'default',
      large: 'lg',
    };
    return sizes[fontSize] as 'sm' | 'default' | 'lg' | 'xl';
  };

  // Don't render settings-dependent content until mounted
  if (!mounted) {
    return (
      <div
        className="relative flex min-h-screen flex-col overflow-hidden bg-white"
        style={{
          background: 'linear-gradient(135deg, #f8fafc 0%, #f3f4f6 100%)',
          position: 'relative',
        }}
      >
        {/* Header */}
        <header className="flex w-full items-center justify-between px-8 py-6">
          <span className="text-2xl font-bold tracking-tight text-neutral-700 md:text-3xl">
            formify*
          </span>
          <SettingsButton
            className="text-neutral-600 transition-colors hover:text-neutral-900"
            tooltipText="Customize theme, colors, and accessibility settings"
          />
        </header>

        {/* Hero Section - centered */}
        <main className="flex flex-1 flex-col items-center justify-center px-4">
          <h1 className="mb-4 text-center text-4xl font-extrabold leading-tight text-neutral-700 md:text-5xl">
            The <span className="text-neutral-900">simplest</span> way to create
            forms
          </h1>
          <p className="mb-8 max-w-xl text-center text-lg text-neutral-900">
            Say goodbye to boring forms. Meet formify — the free, intuitive form
            builder you've been looking for.
          </p>
          <Link href="/builder" className="cursor-pointer">
            <Button
              variant="default"
              size="default"
              className="mb-2 cursor-pointer"
            >
              Create a form
              {/* Hand-drawn style arrow */}
              <svg
                width="28"
                height="18"
                viewBox="0 0 28 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2 9C8 9 18 9 22 9"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                <path
                  d="M18 4L24 9L18 14"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Button>
          </Link>
        </main>

        {/* Footer - bottom left */}
        <footer className="w-full px-8 pb-8 pt-12">
          <div className="mx-auto flex max-w-screen-xl flex-col items-start gap-4">
            <span className="mb-1 text-2xl font-bold tracking-tight text-neutral-700">
              formify*
            </span>
            <span className="text-xs text-neutral-400">© 2025 Formify</span>
            <div className="mt-2 flex items-center gap-4">
              <a
                href="#"
                aria-label="Twitter"
                className="text-neutral-500 hover:text-neutral-900"
              >
                <Twitter size={20} />
              </a>
              <a
                href="#"
                aria-label="Reddit"
                className="text-neutral-500 hover:text-neutral-900"
              >
                <Globe size={20} />
              </a>
              <a
                href="#"
                aria-label="LinkedIn"
                className="text-neutral-500 hover:text-neutral-900"
              >
                <Linkedin size={20} />
              </a>
              <a
                href="#"
                aria-label="GitHub"
                className="text-neutral-500 hover:text-neutral-900"
              >
                <Github size={20} />
              </a>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div
      className="relative flex min-h-screen flex-col overflow-hidden bg-white"
      style={{
        background: 'linear-gradient(135deg, #f8fafc 0%, #f3f4f6 100%)',
        position: 'relative',
      }}
    >
      {/* Header */}
      <header className="flex w-full items-center justify-between px-8 py-6">
        <span className="text-2xl font-bold tracking-tight text-neutral-700 md:text-3xl">
          formify*
        </span>
        <SettingsButton
          className="text-neutral-600 transition-colors hover:text-neutral-900"
          tooltipText="Customize theme, colors, and accessibility settings"
        />
      </header>

      {/* Hero Section - centered */}
      <main className="flex flex-1 flex-col items-center justify-center px-4">
        <h1 className="mb-4 text-center text-4xl font-extrabold leading-tight text-neutral-700 md:text-5xl">
          The <TypingHeadline /> way to create forms
        </h1>
        <p className="mb-8 max-w-xl text-center text-lg text-neutral-900">
          Say goodbye to boring forms. Meet formify — the free, intuitive form
          builder you've been looking for.
        </p>
        <Link href="/builder" className="cursor-pointer">
          <Button
            variant={getButtonVariant()}
            size={getButtonSize()}
            className="mb-2 cursor-pointer"
          >
            Create a form
            {/* Hand-drawn style arrow */}
            <svg
              width="28"
              height="18"
              viewBox="0 0 28 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2 9C8 9 18 9 22 9"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
              />
              <path
                d="M18 4L24 9L18 14"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Button>
        </Link>
      </main>

      {/* Footer - bottom left */}
      <footer className="w-full px-8 pb-8 pt-12">
        <div className="mx-auto flex max-w-screen-xl flex-col items-start gap-4">
          <span className="text-xs text-neutral-400">© {year} formify*</span>
          <div className="mt-2 flex items-center gap-4">
            <a
              href="#"
              aria-label="Twitter"
              className="text-neutral-500 hover:text-neutral-900"
            >
              <Twitter size={20} />
            </a>
            <a
              href="#"
              aria-label="Reddit"
              className="text-neutral-500 hover:text-neutral-900"
            >
              <Globe size={20} />
            </a>
            <a
              href="#"
              aria-label="LinkedIn"
              className="text-neutral-500 hover:text-neutral-900"
            >
              <Linkedin size={20} />
            </a>
            <a
              href="#"
              aria-label="GitHub"
              className="text-neutral-500 hover:text-neutral-900"
            >
              <Github size={20} />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
