import {
    Component,
    ViewChild,
    TemplateRef,
    ViewContainerRef
} from '@angular/core';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { CdkDrag } from '@angular/cdk/drag-drop';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-dd-open-draggable-dialog',
    imports: [CdkDrag, MatButtonModule],
    templateUrl: './dd-open-draggable-dialog.component.html',
    styleUrl: './dd-open-draggable-dialog.component.scss'
})
export class DdOpenDraggableDialogComponent {

    @ViewChild(TemplateRef) _dialogTemplate!: TemplateRef<any>;
    private _overlayRef!: OverlayRef;
    private _portal!: TemplatePortal;

    constructor(private _overlay: Overlay, private _viewContainerRef: ViewContainerRef) {}

    ngAfterViewInit() {
        this._portal = new TemplatePortal(this._dialogTemplate, this._viewContainerRef);
        this._overlayRef = this._overlay.create({
            positionStrategy: this._overlay.position().global().centerHorizontally().centerVertically(),
            hasBackdrop: true,
        });
        this._overlayRef.backdropClick().subscribe(() => this._overlayRef.detach());
    }

    ngOnDestroy() {
        this._overlayRef.dispose();
    }

    openDialog() {
        this._overlayRef.attach(this._portal);
    }

}