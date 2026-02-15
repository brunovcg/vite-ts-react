import "./toast.css";
import { locales } from "@/locales";
import { toastLocale } from "./toast.locales";
/**
 * A custom toast notification dialog with variants, auto-close, and progress bar.
 *
 * @element toast-dialog
 * @extends HTMLDialogElement
 *
 * @attr {string} variant - The variant type: "info" | "error" | "warning" | "success"
 * @attr {number} duration - Auto-close duration in milliseconds (optional)
 *
 * @example
 * ```typescript
 * const toast = document.getElementById('my-toast');
 * toast.open({ text: 'Hello!', variant: 'success', duration: 3000 });
 * ```
 *
 * @example
 * ```html
 * <dialog is="toast-dialog" variant="success" duration="3000">Operation completed successfully!</dialog>
 * ```
 */

export interface ToastConfig {
  duration?: number;
  text?: string;
  variant?: "info" | "error" | "warning" | "success";
  id?: string;
}

export class CustomToastDialog extends HTMLDialogElement {
  private closeTimer: number | null = null;
  private progressInterval: number | null = null;
  private startTime: number = 0;
  private remainingTime: number = 0;
  private isPaused: boolean = false;
  private progressBar: HTMLDivElement | null = null;
  private isRendered: boolean = false;

  connectedCallback(): void {
    // Only render once, even if element is moved to different container
    if (!this.isRendered) {
      this.render();
      this.isRendered = true;
    }
  }

  private render(textOverride?: string, variantOverride?: string): void {
    const variant = variantOverride || this.getAttribute("variant") || "info";
    const message = textOverride || this.innerHTML;

    // Get variant-specific settings
    const variantConfig = this.getVariantConfig(variant);

    this.innerHTML = `
      <div class="toast-dialog" role="status" aria-live="polite" style="
        background: var(--background-white);
        border-radius: var(--border-radius-container);
        padding: 16px;
        min-width: 300px;
        max-width: 500px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        position: relative;
        overflow: hidden;
      ">
        <div class="toast-header" style="
          display: flex;
          align-items: flex-start;
          gap: 12px;
          margin-bottom: 8px;
        ">
          <div class="toast-icon" style="
            flex-shrink: 0;
            margin-top: 2px;
          ">
            <icon-svg name="${variantConfig.icon}" color="${variantConfig.color}"></icon-svg>
          </div>
          <div class="toast-message" style="
            flex: 1;
            color: var(--color-grey_dark);
            font-size: var(--font_size-sm);
            line-height: 1.5;
            word-wrap: break-word;
          ">
            ${message}
          </div>
          <button type="button" aria-label="${locales.getText({ key: "closeNotification", locale: toastLocale })}" class="toast-close button circle" style="
            flex-shrink: 0;
            margin-left: auto;
            margin-top: -4px;
            margin-right: -4px;
          ">
            <icon-svg name="close" color="currentColor"></icon-svg>
          </button>
        </div>
        <div class="toast-progress-container" style="
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: var(--background-grey);
        ">
          <div class="toast-progress-bar" style="
            height: 100%;
            width: 100%;
            background: ${variantConfig.color};
            transition: width 100ms linear;
          "></div>
        </div>
      </div>
    `;

    this.progressBar = this.querySelector(".toast-progress-bar");
    this.setupEventListeners();
  }

  private getVariantConfig(variant: string): { icon: string; color: string } {
    const configs = {
      info: { icon: "info", color: "var(--color-primary)" },
      error: { icon: "cancel", color: "var(--color-error)" },
      warning: { icon: "warning", color: "var(--color-warning)" },
      success: { icon: "done", color: "var(--color-success)" },
    };

    return configs[variant as keyof typeof configs] || configs.info;
  }

  private setupEventListeners(): void {
    // Close button
    const closeButton = this.querySelector(".toast-close");
    closeButton?.addEventListener("click", () => this.close());

    // Pause on hover
    const toastDialog = this.querySelector(".toast-dialog");
    toastDialog?.addEventListener("mouseenter", () => this.pauseTimer());
    toastDialog?.addEventListener("mouseleave", () => this.resumeTimer());

    // Close on backdrop click
    this.addEventListener("click", (e) => {
      if (e.target === this) {
        this.close();
      }
    });
  }

  // @ts-expect-error - Overriding HTMLDialogElement's 'open' property (boolean) with a method
  public open(config?: ToastConfig): void {
    // If config is provided, re-render with overrides
    if (config) {
      if (config.text !== undefined || config.variant !== undefined) {
        this.render(config.text, config.variant);
      }
      if (config.id) {
        this.id = config.id;
      }
    }

    // Use show() instead of showModal() to keep in normal document flow
    super.show();

    // Use config duration if provided, otherwise fall back to attribute
    const durationValue = config?.duration ?? this.getAttribute("duration");
    if (durationValue) {
      this.setAttribute("duration", String(durationValue));
      this.remainingTime = typeof durationValue === "number" ? durationValue : parseInt(durationValue, 10);
      this.startTimer();
    } else {
      // Hide progress bar if no duration
      const progressContainer = this.querySelector(".toast-progress-container");
      if (progressContainer) {
        (progressContainer as HTMLElement).style.display = "none";
      }
    }
  }

  private startTimer(): void {
    this.startTime = Date.now();
    this.updateProgressBar();

    this.closeTimer = window.setTimeout(() => {
      this.close();
    }, this.remainingTime);

    // Update progress bar every 100ms
    this.progressInterval = window.setInterval(() => {
      if (!this.isPaused) {
        this.updateProgressBar();
      }
    }, 100);
  }

  private pauseTimer(): void {
    if (this.isPaused || !this.closeTimer) return;

    this.isPaused = true;
    const elapsed = Date.now() - this.startTime;
    this.remainingTime -= elapsed;

    if (this.closeTimer) {
      window.clearTimeout(this.closeTimer);
      this.closeTimer = null;
    }
  }

  private resumeTimer(): void {
    if (!this.isPaused) return;

    this.isPaused = false;
    this.startTime = Date.now();

    this.closeTimer = window.setTimeout(() => {
      this.close();
    }, this.remainingTime);
  }

  private updateProgressBar(): void {
    if (!this.progressBar) return;

    const duration = parseInt(this.getAttribute("duration") || "0", 10);
    const elapsed = Date.now() - this.startTime;
    const totalElapsed = duration - this.remainingTime + elapsed;
    const progress = Math.max(0, Math.min(100, (1 - totalElapsed / duration) * 100));

    this.progressBar.style.width = `${progress}%`;
  }

  public close(): void {
    if (this.closeTimer) {
      window.clearTimeout(this.closeTimer);
      this.closeTimer = null;
    }

    if (this.progressInterval) {
      window.clearInterval(this.progressInterval);
      this.progressInterval = null;
    }

    super.close();
    this.remove();
  }
}

customElements.define("toast-dialog", CustomToastDialog, { extends: "dialog" });
