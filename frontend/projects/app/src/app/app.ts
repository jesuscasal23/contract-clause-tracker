import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HlmToasterImports } from '@spartan-ng/helm/sonner';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ...HlmToasterImports],
  template: `
    <hlm-toaster position="bottom-right" />
    <router-outlet />
  `,
})
export class App {}
