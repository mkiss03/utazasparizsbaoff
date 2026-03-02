'use client'

import { CheckCircle2, Clock, User, Package, CreditCard, Send, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import type { OnboardingStep, VendorProfile } from '@/lib/types/database'

interface OnboardingWizardProps {
  profile: VendorProfile
  bundleCount: number
  cardCount: number
}

const steps = [
  {
    step: 0 as OnboardingStep,
    label: 'Jóváhagyás',
    description: 'Az eladói jelentkezésed elbírálásra vár. Értesítünk, amint jóváhagyjuk.',
    icon: Clock,
    pendingText: 'Várakozás jóváhagyásra...',
  },
  {
    step: 1 as OnboardingStep,
    label: 'Profil kitöltése',
    description: 'Töltsd ki az eladói profilodat — név, bemutatkozás, fotó.',
    icon: User,
    href: '/marketplace/vendor/profile',
    ctaText: 'Profil szerkesztése',
  },
  {
    step: 2 as OnboardingStep,
    label: 'Első csomag létrehozása',
    description: 'Hozd létre az első kártyacsomagodat — cím, város, leírás.',
    icon: Package,
    href: '/marketplace/vendor/bundles/new',
    ctaText: 'Csomag létrehozása',
  },
  {
    step: 3 as OnboardingStep,
    label: 'Kártyák hozzáadása',
    description: 'Adj hozzá legalább 5 kártyát a csomagodhoz.',
    icon: CreditCard,
    ctaText: 'Kártyák szerkesztése',
  },
  {
    step: 4 as OnboardingStep,
    label: 'Benyújtás ellenőrzésre',
    description: 'Ha minden kész, nyújtsd be a csomagodat jóváhagyásra.',
    icon: Send,
    ctaText: 'Benyújtás',
  },
]

export default function OnboardingWizard({ profile, bundleCount, cardCount }: OnboardingWizardProps) {
  const currentStep = profile.onboarding_step
  const isApproved = profile.is_approved

  // If not approved yet, force step 0
  const effectiveStep = !isApproved ? 0 : currentStep

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-slate-900">Kezdőlépések</h2>
        <p className="mt-1 text-sm text-slate-500">
          Kövesd az alábbi lépéseket, hogy elkezdhess kártyacsomagokat értékesíteni.
        </p>
      </div>

      {/* Rejection notice */}
      {profile.vendor_rejection_reason && !isApproved && (
        <div className="mb-6 rounded-lg bg-red-50 border border-red-200 p-4">
          <p className="text-sm font-medium text-red-800">Jelentkezésed elutasítva</p>
          <p className="mt-1 text-sm text-red-600">{profile.vendor_rejection_reason}</p>
        </div>
      )}

      {/* Vertical timeline */}
      <div className="relative space-y-0">
        {steps.map((step, index) => {
          const isCompleted = effectiveStep > step.step
          const isCurrent = effectiveStep === step.step
          const isPending = effectiveStep < step.step
          const StepIcon = step.icon

          return (
            <div key={step.step} className="relative flex gap-4">
              {/* Timeline line */}
              {index < steps.length - 1 && (
                <div
                  className={`absolute left-[17px] top-10 h-full w-0.5 ${
                    isCompleted ? 'bg-green-400' : 'bg-slate-200'
                  }`}
                />
              )}

              {/* Dot */}
              <div className="relative z-10 flex-shrink-0">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-full border-2 ${
                    isCompleted
                      ? 'border-green-400 bg-green-50 text-green-600'
                      : isCurrent
                      ? 'border-slate-800 bg-slate-800 text-white'
                      : 'border-slate-200 bg-white text-slate-300'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : (
                    <StepIcon className="h-4 w-4" />
                  )}
                </div>
              </div>

              {/* Content */}
              <div className={`flex-1 pb-8 ${isPending ? 'opacity-50' : ''}`}>
                <p className={`text-sm font-semibold ${isCurrent ? 'text-slate-900' : 'text-slate-600'}`}>
                  {step.label}
                </p>
                <p className="mt-0.5 text-sm text-slate-500">{step.description}</p>

                {isCurrent && step.step === 0 && !isApproved && (
                  <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-200 px-3 py-1 text-xs font-medium text-amber-700">
                    <Clock className="h-3 w-3" />
                    {step.pendingText}
                  </div>
                )}

                {isCurrent && step.step > 0 && step.href && (
                  <Link
                    href={step.href}
                    className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-slate-800 px-4 py-2 text-xs font-medium text-white hover:bg-slate-700 transition-colors"
                  >
                    {step.ctaText}
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                )}

                {isCurrent && step.step === 3 && bundleCount > 0 && (
                  <p className="mt-2 text-xs text-slate-400">
                    {cardCount} kártya hozzáadva (min. 5 szükséges)
                  </p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
