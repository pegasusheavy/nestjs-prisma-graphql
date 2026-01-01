import { Component, Input, OnInit, signal, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { NgClass } from '@angular/common';
import Prism from 'prismjs';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-graphql';

@Component({
  selector: 'app-code-block',
  standalone: true,
  imports: [NgClass],
  template: `
    <div class="relative group rounded-xl overflow-hidden border border-white/10 bg-steel-950/80">
      <!-- Header -->
      @if (filename) {
        <div class="flex items-center justify-between px-4 py-2 border-b border-white/5 bg-white/[0.02]">
          <div class="flex items-center gap-2">
            <div class="flex gap-1.5">
              <span class="w-3 h-3 rounded-full bg-red-500/80"></span>
              <span class="w-3 h-3 rounded-full bg-yellow-500/80"></span>
              <span class="w-3 h-3 rounded-full bg-green-500/80"></span>
            </div>
            <span class="text-steel-400 text-sm font-mono ml-2">{{ filename }}</span>
          </div>
          <button
            (click)="copyCode()"
            class="p-1.5 rounded-md text-steel-400 hover:text-white hover:bg-white/10 transition-all opacity-0 group-hover:opacity-100"
          >
            @if (copied()) {
              <svg class="w-4 h-4 text-pegasus-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
            } @else {
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
              </svg>
            }
          </button>
        </div>
      }

      <!-- Code -->
      <div class="overflow-x-auto">
        <pre class="!m-0 !rounded-none !bg-transparent !border-0 p-4"><code #codeEl [ngClass]="'language-' + language" class="text-sm"></code></pre>
      </div>

      <!-- Copy button (no filename) -->
      @if (!filename) {
        <button
          (click)="copyCode()"
          class="absolute top-3 right-3 p-2 rounded-lg text-steel-400 hover:text-white hover:bg-white/10 transition-all opacity-0 group-hover:opacity-100"
        >
          @if (copied()) {
            <svg class="w-4 h-4 text-pegasus-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
          } @else {
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
            </svg>
          }
        </button>
      }
    </div>
  `,
})
export class CodeBlockComponent implements OnInit, AfterViewInit {
  @Input() code = '';
  @Input() language = 'typescript';
  @Input() filename?: string;

  @ViewChild('codeEl') codeEl!: ElementRef<HTMLElement>;

  copied = signal(false);

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    if (this.codeEl) {
      this.codeEl.nativeElement.textContent = this.code.trim();
      Prism.highlightElement(this.codeEl.nativeElement);
    }
  }

  copyCode(): void {
    navigator.clipboard.writeText(this.code.trim()).then(() => {
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2000);
    });
  }
}
