import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from '../../../environments/environment'
@Injectable({
  providedIn: 'root'
})
export class ApilinkService {
  private url = environment.url;

  
  constructor(private http:HttpClient) { }
  
  // La funcion recibe de la app un array de json con las preguntas de una carpeta.
  getQuestions(){
    return this.http.get(this.url+"/getQuestion").toPromise();
  }
  // La funcion crea una nueva instancia de pregunta
  postQuestion(form){
    console.log(form);
    return this.http.post(this.url+"/addQuestion",{name:form.name,question:form.question}).toPromise();
  }
  //La funcion borra una instancia existente de pregunta
  deleteQuestion(toDelete){
    return this.http.post(this.url+"/deleteQuestion",toDelete).toPromise();
  }


}
