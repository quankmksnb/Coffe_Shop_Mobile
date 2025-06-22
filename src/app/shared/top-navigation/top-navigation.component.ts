import { CommonModule, Location } from '@angular/common';
import { Component, Input } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-top-navigation',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './top-navigation.component.html',
  styleUrl: './top-navigation.component.scss',
})
export class TopNavigationComponent {
  @Input() title: string = '';
  @Input() showRightIcon: boolean = true;
  @Input() rightIconType: 'heart' | 'bag' | 'notification' | 'custom' = 'heart';
  @Input() customRightIcon?: string;

  constructor(private readonly sanitizer: DomSanitizer, private location: Location) {}
  getRightIconSVG(): SafeHtml {
    let svgContent = '';
    switch (this.rightIconType) {
      case 'heart':
        svgContent = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <mask id="mask0_3_99" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="2" y="2" width="21" height="21">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M2 2.99988H22.4725V22.5009H2V2.99988Z" fill="white"/>
            </mask>
            <g mask="url(#mask0_3_99)">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M3.82371 12.123C5.22571 16.485 10.7647 20.012 12.2367 20.885C13.7137 20.003 19.2927 16.437 20.6497 12.127C21.5407 9.341 20.7137 5.812 17.4277 4.753C15.8357 4.242 13.9787 4.553 12.6967 5.545C12.4287 5.751 12.0567 5.755 11.7867 5.551C10.4287 4.53 8.65471 4.231 7.03771 4.753C3.75671 5.811 2.93271 9.34 3.82371 12.123M12.2377 22.501C12.1137 22.501 11.9907 22.471 11.8787 22.41C11.5657 22.239 4.19271 18.175 2.39571 12.581C2.39471 12.581 2.39471 12.58 2.39471 12.58C1.26671 9.058 2.52271 4.632 6.57771 3.325C8.48171 2.709 10.5567 2.98 12.2347 4.039C13.8607 3.011 16.0207 2.727 17.8867 3.325C21.9457 4.634 23.2057 9.059 22.0787 12.58C20.3397 18.11 12.9127 22.235 12.5977 22.408C12.4857 22.47 12.3617 22.501 12.2377 22.501" fill="black"/>
            </g>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M18.1537 10.6249C17.7667 10.6249 17.4387 10.3279 17.4067 9.9359C17.3407 9.1139 16.7907 8.4199 16.0077 8.1669C15.6127 8.0389 15.3967 7.6159 15.5237 7.2229C15.6527 6.8289 16.0717 6.6149 16.4677 6.7389C17.8307 7.1799 18.7857 8.3869 18.9027 9.8139C18.9357 10.2269 18.6287 10.5889 18.2157 10.6219C18.1947 10.6239 18.1747 10.6249 18.1537 10.6249" fill="black"/>
          </svg>
        `;
        break;
      case 'bag':
        svgContent = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <mask id="mask0_3_146" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="2" y="6" width="20" height="17">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M2 6.5401H21.5859V22.7217H2V6.5401Z" fill="white"/>
          </mask>
          <g mask="url(#mask0_3_146)">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M6.71553 8.0401C6.27453 8.0401 4.80053 8.2181 4.37753 10.5021L3.60553 16.5021C3.35453 18.1851 3.54853 19.4031 4.18353 20.1401C4.81053 20.8681 5.93253 21.2221 7.61253 21.2221H15.9605C17.0085 21.2221 18.4395 21.0131 19.3035 20.0151C19.9895 19.2241 20.2255 18.0461 20.0055 16.5131L19.2265 10.4611C18.8945 8.9701 18.0185 8.0401 16.8945 8.0401H6.71553ZM15.9605 22.7221H7.61253C5.46953 22.7221 3.97653 22.1971 3.04753 21.1181C2.11453 20.0361 1.80253 18.4131 2.12053 16.2951L2.89653 10.2691C3.40653 7.5061 5.27153 6.5401 6.71553 6.5401H16.8945C18.3445 6.5401 20.1075 7.5031 20.7025 10.2041L21.4915 16.3111C21.7745 18.2821 21.4205 19.8631 20.4375 20.9971C19.4595 22.1251 17.9115 22.7221 15.9605 22.7221V22.7221Z" fill="black"/>
          </g>
          <path fill-rule="evenodd" clip-rule="evenodd" d="M16.0978 7.82031C15.6838 7.82031 15.3478 7.48431 15.3478 7.07031C15.3478 5.10131 13.7458 3.50031 11.7778 3.50031H11.7628C10.8218 3.50031 9.90484 3.87931 9.23984 4.54031C8.57184 5.20531 8.18884 6.12831 8.18884 7.07031C8.18884 7.48431 7.85284 7.82031 7.43884 7.82031C7.02484 7.82031 6.68884 7.48431 6.68884 7.07031C6.68884 5.73131 7.23284 4.42231 8.18084 3.47731C9.12584 2.53831 10.4288 2.00031 11.7598 2.00031H11.7808C14.5738 2.00031 16.8478 4.27431 16.8478 7.07031C16.8478 7.48431 16.5118 7.82031 16.0978 7.82031" fill="black"/>
          <path fill-rule="evenodd" clip-rule="evenodd" d="M14.7433 12.3242H14.6973C14.2833 12.3242 13.9473 11.9882 13.9473 11.5742C13.9473 11.1602 14.2833 10.8242 14.6973 10.8242C15.1113 10.8242 15.4703 11.1602 15.4703 11.5742C15.4703 11.9882 15.1573 12.3242 14.7433 12.3242" fill="black"/>
          <path fill-rule="evenodd" clip-rule="evenodd" d="M8.91219 12.3242H8.86719C8.45319 12.3242 8.11719 11.9882 8.11719 11.5742C8.11719 11.1602 8.45319 10.8242 8.86719 10.8242C9.28119 10.8242 9.64019 11.1602 9.64019 11.5742C9.64019 11.9882 9.32619 12.3242 8.91219 12.3242" fill="black"/>
        </svg>

        `;
        break;
      case 'notification':
        svgContent = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <mask id="mask0_418_849" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="3" y="1" width="19" height="18">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M3.00009 1H21.497V18.348H3.00009V1Z" fill="white"/>
          </mask>
          <g mask="url(#mask0_418_849)">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M12.2471 2.5C8.75211 2.5 6.3161 5.238 6.3161 7.695C6.3161 9.774 5.7391 10.735 5.2291 11.583C4.8201 12.264 4.4971 12.802 4.4971 13.971C4.6641 15.857 5.90911 16.848 12.2471 16.848C18.5501 16.848 19.8341 15.813 20.0001 13.906C19.9971 12.802 19.6741 12.264 19.2651 11.583C18.7551 10.735 18.1781 9.774 18.1781 7.695C18.1781 5.238 15.7421 2.5 12.2471 2.5ZM12.2471 18.348C7.5711 18.348 3.3451 18.018 3.0001 14.035C2.9971 12.387 3.5001 11.549 3.9441 10.811C4.3931 10.063 4.8161 9.358 4.8161 7.695C4.8161 4.462 7.8021 1 12.2471 1C16.6921 1 19.6781 4.462 19.6781 7.695C19.6781 9.358 20.1011 10.063 20.5501 10.811C20.9941 11.549 21.4971 12.387 21.4971 13.971C21.1481 18.018 16.9231 18.348 12.2471 18.348Z" fill="black"/>
          </g>
          <path fill-rule="evenodd" clip-rule="evenodd" d="M12.1983 22.5H12.1963C11.0753 22.499 10.0143 22.005 9.2093 21.108C8.9323 20.801 8.9573 20.326 9.2653 20.05C9.5733 19.772 10.0473 19.797 10.3243 20.106C10.8423 20.683 11.5073 21 12.1973 21H12.1983C12.8913 21 13.5593 20.683 14.0783 20.105C14.3563 19.798 14.8303 19.773 15.1373 20.05C15.4453 20.327 15.4703 20.802 15.1933 21.109C14.3853 22.006 13.3223 22.5 12.1983 22.5Z" fill="black"/>
        </svg>
        `;
        break;
      default:
        svgContent = '';
    }
    return this.sanitizer.bypassSecurityTrustHtml(svgContent);
  }
  goBack(): void {
    this.location.back();
  }
}
