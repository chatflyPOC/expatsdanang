"use client";

import { useState, useEffect, useRef } from "react";
import { Send, Users, CheckCircle, ArrowRight, ChevronRight } from "lucide-react";
import Link from "next/link";

const steps = [
  {
    number: "01",
    icon: Send,
    title: "Tell us what you need",
    subtitle: "Takes 2 minutes",
    description:
      "Send a quick WhatsApp message or fill in our short form. Tell us what you need — airport pickup, housing, bank account, visa help, or anything else.",
    detail:
      "No commitment, no spam. We read every message personally and respond in plain English.",
    channels: ["WhatsApp", "Online form", "Email"],
    timeLabel: "You spend",
    timeValue: "2 min",
  },
  {
    number: "02",
    icon: Users,
    title: "We find the right match",
    subtitle: "Within 2 hours",
    description:
      "We connect you with a verified local partner — a driver, housing agent, bank liaison, or translator, depending on what you need.",
    detail:
      "We handle the Vietnamese side: the calls, the paperwork, the navigation. You don't need to figure any of it out.",
    channels: ["Verified partners", "Vietnamese handled", "No language barrier"],
    timeLabel: "We respond in",
    timeValue: "< 2 hrs",
  },
  {
    number: "03",
    icon: CheckCircle,
    title: "Done. Settle in.",
    subtitle: "Same day",
    description:
      "You deal directly with the partner. We stay in the loop and follow up to make sure everything went smoothly.",
    detail:
      "If something isn't right, we fix it. Your satisfaction is what keeps expats recommending us to other expats.",
    channels: ["Follow-up check", "We fix issues", "Real accountability"],
    timeLabel: "Resolution time",
    timeValue: "Same day",
  },
];

export function HowItWorks() {
  const [active, setActive] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const DURATION = 5000;
  const TICK = 50;

  const goTo = (index: number) => {
    if (index === active) return;
    setAnimating(true);
    setTimeout(() => {
      setActive(index);
      setAnimating(false);
      setProgress(0);
    }, 200);
    resetTimers(index);
  };

  const resetTimers = (_startFrom?: number) => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (progressRef.current) clearInterval(progressRef.current);
    setProgress(0);
    let p = 0;
    progressRef.current = setInterval(() => {
      p += (TICK / DURATION) * 100;
      if (p >= 100) p = 100;
      setProgress(p);
    }, TICK);
    intervalRef.current = setInterval(() => {
      setAnimating(true);
      setTimeout(() => {
        setActive((prev) => (prev + 1) % steps.length);
        setAnimating(false);
        setProgress(0);
        p = 0;
      }, 200);
    }, DURATION);
  };

  useEffect(() => {
    resetTimers();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (progressRef.current) clearInterval(progressRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const step = steps[active];
  const Icon = step.icon;

  return (
    <section className="py-24 px-4 bg-[#f0fdf9]">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-14 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <p className="text-xs font-medium tracking-widest text-[#1D9E75] uppercase mb-3">
              How it works
            </p>
            <h2 className="text-3xl font-medium text-gray-900 leading-snug">
              From first message<br />to sorted — fast.
            </h2>
          </div>
          <Link
            href="/get-help"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#1D9E75] hover:text-[#0F6E56] transition-colors"
          >
            Get started now <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Main layout */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">

          {/* Step selector — left col */}
          <div className="lg:col-span-2 flex flex-row lg:flex-col gap-3">
            {steps.map((s, i) => {
              const SIcon = s.icon;
              const isActive = i === active;
              return (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className={`group relative flex-1 lg:flex-none text-left rounded-xl border transition-all duration-200 overflow-hidden
                    ${isActive
                      ? "border-[#1D9E75] bg-white"
                      : "border-[#D1FAE5] bg-white hover:border-[#1D9E75]/40 hover:bg-white"
                    }`}
                >
                  {/* Progress bar on active */}
                  {isActive && (
                    <div
                      className="absolute bottom-0 left-0 h-0.5 bg-[#1D9E75] transition-none"
                      style={{ width: `${progress}%` }}
                    />
                  )}
                  <div className="p-4 flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-colors
                        ${isActive ? "bg-[#1D9E75]" : "bg-gray-100 group-hover:bg-gray-200"}`}
                    >
                      <SIcon
                        className={`w-4 h-4 ${isActive ? "text-white" : "text-gray-400"}`}
                      />
                    </div>
                    <div className="min-w-0">
                      <p className={`text-[11px] font-medium mb-0.5 ${isActive ? "text-[#1D9E75]" : "text-gray-400"}`}>
                        {s.number}
                      </p>
                      <p className={`text-[13px] font-medium leading-tight truncate ${isActive ? "text-gray-900" : "text-gray-500"}`}>
                        {s.title}
                      </p>
                    </div>
                    {isActive && (
                      <ChevronRight className="w-4 h-4 text-[#1D9E75] ml-auto flex-shrink-0 hidden lg:block" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Detail panel — right col */}
          <div
            className={`lg:col-span-3 rounded-2xl border border-[#5DCAA5]/30 bg-white overflow-hidden transition-opacity duration-200 ${animating ? "opacity-0" : "opacity-100"}`}
          >
            {/* Top accent bar */}
            <div className="h-1 bg-[#1D9E75]" />

            <div className="p-8">
              {/* Step label + time badge */}
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs font-medium tracking-widest text-[#1D9E75] uppercase">
                  Step {step.number}
                </span>
                <div className="flex items-center gap-1.5 bg-white border border-gray-100 rounded-full px-3 py-1">
                  <span className="text-[11px] text-gray-400">{step.timeLabel}</span>
                  <span className="text-[11px] font-medium text-gray-700">{step.timeValue}</span>
                </div>
              </div>

              {/* Icon + title */}
              <div className="flex items-start gap-4 mb-5">
                <div className="w-12 h-12 rounded-full bg-[#1D9E75] flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-medium text-gray-900 mb-1">{step.title}</h3>
                  <p className="text-sm text-[#1D9E75]">{step.subtitle}</p>
                </div>
              </div>

              {/* Description */}
              <p className="text-[15px] text-gray-600 leading-relaxed mb-3">
                {step.description}
              </p>
              <p className="text-sm text-gray-400 leading-relaxed mb-7">
                {step.detail}
              </p>

              {/* Chips */}
              <div className="flex flex-wrap gap-2 mb-8">
                {step.channels.map((c) => (
                  <span
                    key={c}
                    className="text-xs px-3 py-1.5 rounded-full bg-white border border-gray-200 text-gray-500"
                  >
                    {c}
                  </span>
                ))}
              </div>

              {/* CTA */}
              {active === steps.length - 1 ? (
                <Link
                  href="/get-help"
                  className="inline-flex items-center gap-2 bg-[#1D9E75] hover:bg-[#0F6E56] text-white text-sm font-medium px-5 py-2.5 rounded-full transition-colors"
                >
                  Get started now <ArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <button
                  onClick={() => goTo(active + 1)}
                  className="inline-flex items-center gap-2 text-sm font-medium text-[#1D9E75] hover:text-[#0F6E56] transition-colors"
                >
                  Next: {steps[active + 1].title} <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Step dots */}
            <div className="px-8 pb-6 flex gap-2">
              {steps.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className={`h-1 rounded-full transition-all duration-300 ${i === active ? "w-8 bg-[#1D9E75]" : "w-3 bg-gray-200 hover:bg-gray-300"}`}
                  aria-label={`Go to step ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
