import {
  CommonModule,
  NgClass
} from "./chunk-WAPM7CD3.js";
import {
  SharedModule
} from "./chunk-GRWH6NXW.js";
import "./chunk-Q53QHQGR.js";
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  NgModule,
  ViewEncapsulation$1,
  setClassMetadata,
  ɵɵdefineComponent,
  ɵɵdefineInjector,
  ɵɵdefineNgModule,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵprojection,
  ɵɵprojectionDef,
  ɵɵproperty
} from "./chunk-LQG5ILMP.js";
import "./chunk-2IFV45OO.js";
import "./chunk-B6YOWU4R.js";
import "./chunk-KIIQQY66.js";
import "./chunk-QXRGOHRF.js";
import "./chunk-ME34T2OJ.js";
import "./chunk-WDMUDEB6.js";

// node_modules/primeng/fesm2022/primeng-inputicon.mjs
var _c0 = ["*"];
var InputIcon = class _InputIcon {
  /**
   * Style class of the element.
   * @group Props
   */
  styleClass;
  static ɵfac = function InputIcon_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _InputIcon)();
  };
  static ɵcmp = ɵɵdefineComponent({
    type: _InputIcon,
    selectors: [["p-inputIcon"]],
    inputs: {
      styleClass: "styleClass"
    },
    ngContentSelectors: _c0,
    decls: 2,
    vars: 1,
    consts: [[1, "p-input-icon", 3, "ngClass"]],
    template: function InputIcon_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵprojectionDef();
        ɵɵelementStart(0, "span", 0);
        ɵɵprojection(1);
        ɵɵelementEnd();
      }
      if (rf & 2) {
        ɵɵproperty("ngClass", ctx.styleClass);
      }
    },
    dependencies: [NgClass],
    styles: ["@layer primeng{.p-fluid .p-icon-field-left,.p-fluid .p-icon-field-right{width:100%}}\n"],
    encapsulation: 2,
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(InputIcon, [{
    type: Component,
    args: [{
      selector: "p-inputIcon",
      template: `<span class="p-input-icon" [ngClass]="styleClass"><ng-content></ng-content></span>`,
      encapsulation: ViewEncapsulation$1.None,
      changeDetection: ChangeDetectionStrategy.OnPush,
      styles: ["@layer primeng{.p-fluid .p-icon-field-left,.p-fluid .p-icon-field-right{width:100%}}\n"]
    }]
  }], null, {
    styleClass: [{
      type: Input
    }]
  });
})();
var InputIconModule = class _InputIconModule {
  static ɵfac = function InputIconModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _InputIconModule)();
  };
  static ɵmod = ɵɵdefineNgModule({
    type: _InputIconModule,
    declarations: [InputIcon],
    imports: [CommonModule],
    exports: [InputIcon, SharedModule]
  });
  static ɵinj = ɵɵdefineInjector({
    imports: [CommonModule, SharedModule]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(InputIconModule, [{
    type: NgModule,
    args: [{
      imports: [CommonModule],
      exports: [InputIcon, SharedModule],
      declarations: [InputIcon]
    }]
  }], null, null);
})();
export {
  InputIcon,
  InputIconModule
};
//# sourceMappingURL=primeng_inputicon.js.map
