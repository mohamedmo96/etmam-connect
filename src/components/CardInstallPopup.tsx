import { useEffect, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

type Props = {
  userId: string;
};

const CardInstallPopup = ({ userId }: Props) => {
  const [open, setOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

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
  };

  const handleInstall = async () => {
    if (!deferredPrompt) {
      handleClose();
      return;
    }

    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;

    if (choice.outcome === "accepted") {
      localStorage.setItem(`card-install-installed-${userId}`, "1");
    } else {
      localStorage.setItem(`card-install-dismissed-${userId}`, "1");
    }

    setOpen(false);
    setDeferredPrompt(null);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-end justify-center bg-black/50 p-4 sm:items-center">
      <div className="w-full max-w-md rounded-2xl border border-border bg-background p-5 shadow-2xl">
        <h3 className="mb-2 text-lg font-bold text-foreground">
          تحميل الديجيتال كارد
        </h3>

        <p className="mb-4 text-sm text-muted-foreground">
          ثبّت الكارت على جهازك للوصول السريع إليه في أي وقت.
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
            تحميل
          </button>
        </div>
      </div>
    </div>
  );
};

export default CardInstallPopup;