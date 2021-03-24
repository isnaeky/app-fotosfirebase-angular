import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
//Se actualiza como deberia de actualizarse
import firebase from "firebase/app";
//import * as firebase from "firebase/app"
//import * as firebase from 'firebase/app';


import { FileItem } from '../models/file-item';

@Injectable({
  providedIn: 'root',
})
export class CargaImagenesService {
  private CARPETA_IMAGENES = 'img';

  constructor(private db: AngularFirestore) {}

  private guardarImage(imagen: { nombre: string; url: string }) {
    this.db.collection(`/${this.CARPETA_IMAGENES}`).add(imagen);
  }

  cargarImagenes(imagenes: FileItem[]) {

    //Not working
    const storageRef = firebase.storage().ref();
    for( const item of imagenes){
      item.estaSubiendo=true;
      if (item.progreso>=100) {
        continue;
      }
      const uploadTask:firebase.storage.UploadTask=storageRef.child(`${this.CARPETA_IMAGENES}/${item.nombreArchivo}`).put(item.archivo);
      uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
      (snapshot:firebase.storage.UploadTaskSnapshot)=>item.progreso=(snapshot.bytesTransferred/snapshot.totalBytes)*100,
      (error)=> console.log('Error al subir ',error),
      ()=>{
        console.log('Imagen Cargada Correctamente');
        item.url=uploadTask.snapshot.downloadURL;
        item.estaSubiendo=false;
        this.guardarImage({
          nombre:item.nombreArchivo,
          url:item.url
        })
      }
      
      )
    }
  }
}
