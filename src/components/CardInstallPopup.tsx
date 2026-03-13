import { useEffect, useMemo, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

type Props = {
  userId: string;
};

const CardInstallPopup = ({ userId }: Props) => {
  const [open, setOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  const isIOS = useMemo(
    () => /iphone|ipad|ipod/i.test(window.navigator.userAgent),
    []
  );

  const isAndroid = useMemo(
    () => /android/i.test(window.navigator.userAgent),
    []
  );

  useEffect(() => {
    const dismissedKey = `card-install-dismissed-${userId}`;
    const installedKey = `card-install-installed-${userId}`;

    const alreadyDismissed = localStorage.getItem(dismissedKey) === "1";
    const alreadyInstalled = localStorage.getItem(installedKey) === "1";

    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      // @ts-ignore
      window.navigator.standalone === true;

    if (alreadyDismissed || alreadyInstalled || isStandalone) return;

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setOpen(true);
    };

    const handleInstalled = () => {
      localStorage.setItem(installedKey, "1");
      setOpen(false);
      setHelpOpen(false);
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleInstalled);

    const timer = setTimeout(() => {
      setOpen(true);
    }, 1200);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleInstalled);
    };
  }, [userId]);

  const handleClose = () => {
    localStorage.setItem(`card-install-dismissed-${userId}`, "1");
    setOpen(false);
    setHelpOpen(false);
  };

  const handleInstall = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;

      if (choice.outcome === "accepted") {
        localStorage.setItem(`card-install-installed-${userId}`, "1");
      } else {
        localStorage.setItem(`card-install-dismissed-${userId}`, "1");
      }

      setOpen(false);
      setDeferredPrompt(null);
      return;
    }

    setHelpOpen(true);
  };

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-[9999] flex items-end justify-center bg-black/50 p-4 sm:items-center">
        <div className="w-full max-w-md rounded-2xl border border-border bg-background p-5 shadow-2xl">
          <h3 className="mb-2 text-lg font-bold text-foreground">
            إضافة الديجيتال كارد للشاشة الرئيسية
          </h3>

          <p className="mb-4 text-sm text-muted-foreground">
            احفظ الكارت على موبايلك للوصول السريع إليه في أي وقت.
          </p>

          <div className="flex justify-end gap-2">
            <button
              onClick={handleClose}
              className="rounded-xl border border-border px-4 py-2 text-sm text-foreground"
            >
              لاحقًا
            </button>

            <button
              onClick={handleInstall}
              className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
            >
              إضافة الآن
            </button>
          </div>
        </div>
      </div>

      {helpOpen && (
        <div className="fixed inset-0 z-[10000] flex items-end justify-center bg-black/60 p-4 sm:items-center">
          <div className="w-full max-w-md rounded-2xl border border-border bg-background p-5 shadow-2xl">
            <h3 className="mb-3 text-lg font-bold text-foreground">
              طريقة الإضافة
            </h3>

            {isIOS ? (
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>1. افتح الصفحة في Safari</p>
                <p>2. اضغط زر المشاركة Share</p>
                <p>3. اختر Add to Home Screen</p>
                <p>4. فعّل Open as Web App ثم اضغط Add</p>
              </div>
            ) : isAndroid ? (
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>1. افتح الصفحة في Chrome</p>
                <p>2. اضغط القائمة ⋮</p>
                <p>3. اختر Add to home screen أو Install app</p>
                <p>4. اضغط Add أو Install</p>
              </div>
            ) : (
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>استخدم قائمة المتصفح ثم اختر Add to Home Screen أو Install App إذا كانت متاحة.</p>
              </div>
            )}

            <div className="mt-4 flex justify-end">
              <button
                onClick={handleClose}
                className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
              >
                فهمت
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CardInstallPopup;