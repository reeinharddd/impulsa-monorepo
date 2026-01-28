import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'layout-print',
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="print-layout bg-white min-h-screen">
      <!-- Header -->
      @if (showHeader()) {
        <header class="print-header border-b-2 border-gray-800 pb-4 mb-6">
          <div class="flex items-start justify-between">
            <!-- Logo/Business info -->
            <div>
              @if (businessName()) {
                <h1 class="text-2xl font-bold text-gray-900">{{ businessName() }}</h1>
              }
              @if (businessAddress()) {
                <p class="text-sm text-gray-600 mt-1">{{ businessAddress() }}</p>
              }
              @if (businessPhone()) {
                <p class="text-sm text-gray-600">Tel: {{ businessPhone() }}</p>
              }
              @if (businessEmail()) {
                <p class="text-sm text-gray-600">{{ businessEmail() }}</p>
              }
            </div>

            <!-- Document info -->
            <div class="text-right">
              @if (documentType()) {
                <p class="text-lg font-semibold text-gray-900">{{ documentType() }}</p>
              }
              @if (documentNumber()) {
                <p class="text-sm text-gray-600">No: {{ documentNumber() }}</p>
              }
              @if (documentDate()) {
                <p class="text-sm text-gray-600">Fecha: {{ documentDate() }}</p>
              }
            </div>
          </div>
        </header>
      }

      <!-- Content -->
      <main class="print-content">
        <ng-content />
      </main>

      <!-- Footer -->
      @if (showFooter()) {
        <footer
          class="print-footer border-t-2 border-gray-800 pt-4 mt-6 text-center text-sm text-gray-600"
        >
          @if (footerText()) {
            <p>{{ footerText() }}</p>
          } @else {
            <p>Gracias por su preferencia</p>
            <p class="mt-1">{{ businessName() }} - {{ currentYear }}</p>
          }
        </footer>
      }
    </div>
  `,
  styles: [
    `
      @media print {
        .print-layout {
          padding: 0;
          margin: 0;
        }

        .print-header {
          page-break-after: avoid;
        }

        .print-footer {
          page-break-before: avoid;
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
        }

        .print-content {
          padding-bottom: 100px; /* Space for footer */
        }
      }

      @media screen {
        .print-layout {
          max-width: 800px;
          margin: 0 auto;
          padding: 2rem;
          box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
        }
      }
    `,
  ],
})
export class PrintLayoutComponent {
  // Business info
  businessName = input<string>('');
  businessAddress = input<string>('');
  businessPhone = input<string>('');
  businessEmail = input<string>('');

  // Document info
  documentType = input<string>('');
  documentNumber = input<string>('');
  documentDate = input<string>('');

  // Layout options
  showHeader = input(true);
  showFooter = input(true);
  footerText = input<string>('');

  currentYear = new Date().getFullYear();
}
