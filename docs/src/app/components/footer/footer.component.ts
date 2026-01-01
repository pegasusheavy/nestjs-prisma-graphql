import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  template: `
    <footer class="border-t border-white/5 bg-steel-950/50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
          <!-- Brand -->
          <div class="col-span-2 md:col-span-1">
            <a routerLink="/" class="flex items-center gap-3 mb-4">
              <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-pegasus-500 to-forge-500 flex items-center justify-center">
                <svg class="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M6 18 L12 6 L18 18 Z" stroke-linejoin="round"/>
                  <circle cx="12" cy="14" r="2" fill="currentColor"/>
                </svg>
              </div>
              <span class="font-bold text-white">Pegasus Heavy</span>
            </a>
            <p class="text-steel-400 text-sm">
              ESM-first code generation for modern NestJS applications.
            </p>
          </div>

          <!-- Docs -->
          <div>
            <h4 class="font-semibold text-white mb-4">Documentation</h4>
            <ul class="space-y-2">
              <li><a routerLink="/getting-started" class="text-steel-400 hover:text-pegasus-400 transition-colors text-sm">Getting Started</a></li>
              <li><a routerLink="/configuration" class="text-steel-400 hover:text-pegasus-400 transition-colors text-sm">Configuration</a></li>
              <li><a routerLink="/decorators" class="text-steel-400 hover:text-pegasus-400 transition-colors text-sm">Decorators</a></li>
              <li><a routerLink="/validators" class="text-steel-400 hover:text-pegasus-400 transition-colors text-sm">Validators</a></li>
            </ul>
          </div>

          <!-- Resources -->
          <div>
            <h4 class="font-semibold text-white mb-4">Resources</h4>
            <ul class="space-y-2">
              <li><a routerLink="/esm" class="text-steel-400 hover:text-pegasus-400 transition-colors text-sm">ESM Guide</a></li>
              <li><a routerLink="/examples" class="text-steel-400 hover:text-pegasus-400 transition-colors text-sm">Examples</a></li>
              <li><a routerLink="/api" class="text-steel-400 hover:text-pegasus-400 transition-colors text-sm">API Reference</a></li>
            </ul>
          </div>

          <!-- Community -->
          <div>
            <h4 class="font-semibold text-white mb-4">Community</h4>
            <ul class="space-y-2">
              <li>
                <a href="https://github.com/pegasusheavy/nestjs-prisma-graphql" target="_blank" rel="noopener" class="text-steel-400 hover:text-pegasus-400 transition-colors text-sm flex items-center gap-2">
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"/></svg>
                  GitHub
                </a>
              </li>
              <li>
                <a href="https://github.com/pegasusheavy/nestjs-prisma-graphql/issues" target="_blank" rel="noopener" class="text-steel-400 hover:text-pegasus-400 transition-colors text-sm">
                  Report Issue
                </a>
              </li>
              <li>
                <a href="https://github.com/pegasusheavy/nestjs-prisma-graphql/discussions" target="_blank" rel="noopener" class="text-steel-400 hover:text-pegasus-400 transition-colors text-sm">
                  Discussions
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div class="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p class="text-steel-500 text-sm">
            © {{ currentYear }} Pegasus Heavy Industries LLC. Apache-2.0 License.
          </p>
          <p class="text-steel-500 text-sm">
            Built with <span class="text-forge-400">♥</span> using Angular & Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  `,
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}
