import {
  Directive,
  EventEmitter,
  ElementRef,
  HostListener,
  Input,
  Output,
} from '@angular/core';
import { FileItem } from '../models/file-item';

@Directive({
  selector: '[appNgDropFiles]',
})
export class NgDropFilesDirective {
  @Input() archivos: FileItem[] = [];
  @Output() mouseSobre: EventEmitter<boolean> = new EventEmitter();
  constructor() { }


  @HostListener('dragover', ['$event'])
  public onDragEnter(event: any) {
    this.mouseSobre.emit(true);
    this._prevenirDete(event);
  }


  @HostListener('dragleave', ['$event'])
  public onDragLeave(event: any) {
   // this._prevenirDete(event);
    this.mouseSobre.emit(false);
  }


  @HostListener('drop', ['$event'])
  public onDrop(event: any) {
    this._prevenirDete(event);
    const transferencia = this._getTransfer(event);
    if (!transferencia) { return; }
    this._extraerArchivos(transferencia.files);
    this.mouseSobre.emit(false);
  }


  private _getTransfer(event: any) {
    return event.dataTransfer
      ? event.dataTransfer
      : event.originalvent.dataTransfer;
  }

  private _extraerArchivos(archivosLista: FileList) {
    for(const propiedad in Object.getOwnPropertyNames(archivosLista)){
      const archivoTem = archivosLista[propiedad];
      if (this._archivoPuedeSerCargado(archivoTem)) {
        const nuevoArchivo= new FileItem(archivoTem);
        this.archivos.push(nuevoArchivo);
      }
    }
    console.log(this.archivos);
    
  }

  //Validaciones
  private _archivoPuedeSerCargado(archivo: File): boolean {
    if (
      !this._archivoYaDropeado(archivo.name) &&
      this._esImagen(archivo.type)
    ) {
      return true;
    } else {
      return false;
    }
  }

  private _prevenirDete(event) {
    event.preventDefault();
    event.stopPropagation();
  }

  private _archivoYaDropeado(nombreArchivo: string): boolean {
    for (const archivo of this.archivos) {
      if (archivo.nombreArchivo == nombreArchivo) {
        console.log('Archivo ya existe: ' + nombreArchivo);
        return true;
      }
      return false;
    }
  }


  private _esImagen(tipoArchivo: string): boolean {
    return tipoArchivo === '' || tipoArchivo === undefined
      ? false
      : tipoArchivo.startsWith('image');
  }
}
