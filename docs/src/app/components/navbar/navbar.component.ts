import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgClass],
  template: `
    <nav class="fixed top-0 left-0 right-0 z-50 glass-strong">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <!-- Logo -->
          <a routerLink="/" class="flex items-center gap-3 group">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-pegasus-500 to-forge-500 flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg class="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M6 18 L12 6 L18 18 Z" stroke-linejoin="round"/>
                <circle cx="12" cy="14" r="2" fill="currentColor"/>
              </svg>
            </div>
            <span class="font-bold text-xl text-white hidden sm:block">
              nestjs-prisma-<span class="text-pegasus-400">graphql</span>
            </span>
          </a>

          <!-- Desktop Nav -->
          <div class="hidden md:flex items-center gap-1">
            @for (link of navLinks; track link.path) {
              <a
                [routerLink]="link.path"
                routerLinkActive="!text-pegasus-400 bg-pegasus-500/10"
                [routerLinkActiveOptions]="{ exact: link.path === '/' }"
                class="px-4 py-2 rounded-lg text-steel-300 hover:text-white hover:bg-white/5 transition-all text-sm font-medium"
              >
                {{ link.label }}
              </a>
            }
          </div>

          <!-- GitHub & Mobile Toggle -->
          <div class="flex items-center gap-3">
            <a
              href="https://github.com/pegasusheavy/nestjs-prisma-graphql"
              target="_blank"
              rel="noopener noreferrer"
              class="p-2 rounded-lg text-steel-400 hover:text-white hover:bg-white/5 transition-all"
            >
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
              </svg>
            </a>

            <!-- Mobile menu button -->
            <button
              (click)="toggleMobile()"
              class="md:hidden p-2 rounded-lg text-steel-400 hover:text-white hover:bg-white/5 transition-all"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                @if (mobileOpen()) {
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                } @else {
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
                }
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile Nav -->
      <div
        [ngClass]="mobileOpen() ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'"
        class="md:hidden overflow-hidden transition-all duration-300 border-t border-white/5"
      >
        <div class="px-4 py-4 space-y-1">
          @for (link of navLinks; track link.path) {
            <a
              [routerLink]="link.path"
              routerLinkActive="!text-pegasus-400 bg-pegasus-500/10"
              [routerLinkActiveOptions]="{ exact: link.path === '/' }"
              (click)="mobileOpen.set(false)"
              class="block px-4 py-3 rounded-lg text-steel-300 hover:text-white hover:bg-white/5 transition-all font-medium"
            >
              {{ link.label }}
            </a>
          }
        </div>
      </div>
    </nav>
  `,
})
export class NavbarComponent {
  mobileOpen = signal(false);

  navLinks = [
    { path: '/', label: 'Home' },
    { path: '/getting-started', label: 'Getting Started' },
    { path: '/configuration', label: 'Configuration' },
    { path: '/decorators', label: 'Decorators' },
    { path: '/validators', label: 'Validators' },
    { path: '/esm', label: 'ESM' },
    { path: '/examples', label: 'Examples' },
    { path: '/api', label: 'API' },
  ];

  toggleMobile(): void {
    this.mobileOpen.update((v) => !v);
  }
}
