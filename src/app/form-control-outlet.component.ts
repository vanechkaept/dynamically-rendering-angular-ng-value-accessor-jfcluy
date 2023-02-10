import {
  Component,
  ComponentFactoryResolver,
  forwardRef,
  Host,
  Injector,
  SkipSelf,
  ViewContainerRef,
} from '@angular/core';
import { ControlContainer, NgControl, NG_VALUE_ACCESSOR } from '@angular/forms';

import { CustomInputComponent } from './custom-input.component';

@Component({
  selector: 'app-form-control-outlet',
  template: ``,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormControlOutletComponent),
      multi: true,
    },
  ],
})
export class FormControlOutletComponent {
  constructor(
    public injector: Injector,
    private componentFactoryResolver: ComponentFactoryResolver,
    private viewContainerRef: ViewContainerRef
  ) {}

  public ngOnInit(): void {
    const ngControl = this.injector.get(NgControl);
    const componentFactory =
      this.componentFactoryResolver.resolveComponentFactory(
        CustomInputComponent
      );

    const componentRef =
      this.viewContainerRef.createComponent(componentFactory);

    ngControl.valueAccessor = componentRef.instance;
  }
}

import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  ContentChildren,
  ElementRef,
  Injector,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  QueryList,
  ReflectiveInjector,
  SimpleChange,
  SimpleChanges,
  TemplateRef,
  Type,
  ViewChild,
  ViewContainerRef,
  forwardRef,
} from '@angular/core';
import { FormGroup, NG_VALUE_ACCESSOR, NgControl } from '@angular/forms';

import {
  IPlaygroundApiTable,
  IPlaygroundMetadata,
} from '../playground-api-table/playground-api-table.interface';
import { QDSDynamicalComponent } from './components-config';
import { UntilDestroy } from '@ngneat/until-destroy';
import { debounceTime, filter } from 'rxjs/operators';
import { FormInputComponent } from 'libs/quik/ui/form/src/lib/components/form-input/form-input.component';

/**
 * Main functionality:
 * - creating a dynamic component
 * - binding his parameters, including reactiveform
 */
@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'qds-playground-page-outlet',
  template: `
    <ng-container #container></ng-container>
    <span #ngcontent>
      <!-- <div>
       asdasd
      </div> -->
      <ng-content></ng-content>
    </span>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PlaygroundPageOutletComponent),
      multi: true,
    },
  ],
})
export class PlaygroundPageOutletComponent
  implements OnDestroy, OnChanges, AfterViewInit, OnInit
{
  @ViewChild('container', { read: ViewContainerRef })
  componentContainer!: ViewContainerRef;
  @ViewChild('ngcontent')
  ngcontent!: ElementRef;

  @Input() metadata: IPlaygroundMetadata[] = [];
  @Input() form!: FormGroup;
  /**
   * Deprecated
   * Fields that are also sent to the dynamic component but not included in @form
   * */
  @Input() additionalFields: { [prop: string]: string | boolean | number } = {};
  // QDSDynamicalComponent
  @Input() renderComponent: Type<QDSDynamicalComponent> | null = null;

  private _componentRef: ComponentRef<QDSDynamicalComponent> | null = null;

  constructor(
    private _ngControl: NgControl,
    private _injector: Injector,
    private _cdRef: ChangeDetectorRef,
    private _viewContainerRef: ViewContainerRef // @Optional() @Self() public ngControl: NgControl,
  ) {
    // _ngControl.valueAccessor = this;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['renderComponent']) {
      // this._createDynamicComponent().then();
      // const ngControl: NgControl | null  = this._injector?.get(NgControl) || null;
    }
  }

  ngOnInit(): void {
    const ngControl: NgControl | null = this._injector?.get(NgControl) || null;
    ngControl.valueAccessor = null;
    // console.log(this.ngcontent?.nativeElement?.firstChild);
    if (this.renderComponent !== null) {
      this._componentRef = this.componentContainer.createComponent(
        this.renderComponent,
        {
          // injector: this._injector,
          // projectableNodes: [[this.ngcontent?.nativeElement?.firstChild || undefined]],
        }
      );
    }
    if (ngControl && this._componentRef) {
      // todo: remove eslint-disable
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      ngControl.valueAccessor = this._componentRef.instance;
    }
  }

  ngAfterViewInit(): void {
    // this._createDynamicComponent();
  }

  ngOnDestroy() {
    this._componentRef?.destroy();
  }

  /**
   * - Get NgControl reference (defined by `NG_VALUE_ACCESSOR` provider)
   * - Create a component instance
   * - Delegate all value-accessor-related work to the instance of the dynamic component
   * - Set @Input by metadata
   * - Subscribe to the form to update @Input when the form changes
   *
   * https://stackblitz.com/edit/dynamically-rendering-angular-ng-value-accessor?file=src%2Fapp%2Fform-control-outlet.component.ts
   */
  private _createDynamicComponent() {
    console.log('2');
    this.componentContainer.clear();
    this._componentRef?.destroy();
    // Not all components need a reactive form
    const ngControl: NgControl | null = this._injector?.get(NgControl) || null;

    // console.dir(this.contentProjection?.elementRef);
    // console.log(this.contentProjection);
    // console.log('contentProjectionView', this.contentProjectionView.elementRef.nativeElement);

    /**
     *  todo: realize content projection to dynamic component
     *  in .createComponent we have projectableNodes arg - use it
     *  https://github.com/angular/angular/blob/main/packages/elements/src/extract-projectable-nodes.ts
     *  https://stackoverflow.com/questions/40106480/what-are-projectable-nodes-in-angular2/40323785#40323785
     *  https://github.com/arav850/headstart/blob/a3c4ad70719ee08c9239f2661891e718b3a74367/src/UI/Buyer/src/lib/component-factory-strategy.ts#L54
     *  https://netbasal.com/getting-to-know-the-createcomponent-api-in-angular-22fb115f08e2
     */
    // const myNode = document.createElement('div');
    // const text = document.createTextNode('this is my text');
    // myNode.appendChild(text);
    // const demoCompEl = this._viewContainerRef.element.nativeElement;
    // console.log('demoCompEl', demoCompEl);
    // console.log('demoCompEl', myNode);
    // console.log('!!!!', this.ngcontent);

    // bodyRef.location.nativeElement
    // const bodyFactory = this._componentFactoryResolver.resolveComponentFactory(this.contentProjection?.createEmbeddedView);

    console.dir(this.ngcontent.nativeElement);
    // console.dir(this.contentProjection);

    // console.dir(this.ngcontent.nativeElement.firstChild);
    // const projectableNodes: Node[][] | undefined = this.ngcontent.nativeElement?.firstChild
    // ? [[this.ngcontent.nativeElement?.firstChild]]
    // : undefined;

    const projectableNodes: Node[][] = [
      [this.ngcontent?.nativeElement?.firstChild || undefined],
    ];

    if (this.renderComponent !== null) {
      this._componentRef = this.componentContainer.createComponent(
        this.renderComponent,
        {
          projectableNodes,
          // projectableNodes: [[this.contentProjection?.firstChild]]
          // projectableNodes: [[text]]
        }
      );
      this._componentRef.injector;
      // this.renderComponent.
    }

    if (ngControl && this._componentRef) {
      // todo: remove eslint-disable
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore

      ngControl.valueAccessor = this._componentRef.instance;
    }

    this.metadata
      .reduce<IPlaygroundApiTable[]>((arr, curr) => [...arr, ...curr.rules], [])
      .forEach((value) => {
        if (value.controlName && this._componentRef) {
          this._componentRef.setInput(
            value.controlName,
            this.form?.get(value.controlName)?.value
          );
        }
      });

    Object.entries(this.additionalFields).forEach(([key, value]) => {
      this._componentRef?.setInput(key, value);
    });

    this._subToForm();
  }

  /** When form is updated, update the input values of the dynamic component */
  // todo change to control subscribe
  private _subToForm(): void {
    this.form.valueChanges
      .pipe(filter(() => !!this._componentRef))
      .subscribe((d) => {
        Object.entries(d).forEach(([key, value]) => {
          if (this._componentRef) {
            this._componentRef?.setInput(key, value);
          }
        });
      });
  }
}
