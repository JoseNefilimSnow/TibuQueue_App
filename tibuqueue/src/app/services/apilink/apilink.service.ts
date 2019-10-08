import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApilinkService {

  
  constructor(private http:HttpClient) { }
  
  // La funcion recibe de la app un array de json con las preguntas de una carpeta.
  getQuestions(url){
    console.log(url);
    return this.http.get("http://"+url+":3580/api/getQuestion").toPromise();
  }
  // La funcion crea una nueva instancia de pregunta
  postQuestion(form,ip){
    console.log(form);
    return this.http.post("http://"+ip+":3580/api/addQuestion",{name:form.name,question:form.question}).toPromise();
  }
  //La funcion borra una instancia existente de pregunta
  deleteQuestion(toDelete,ip){
    return this.http.post("http://"+ip+":3580/api/deleteQuestion",toDelete).toPromise();
  }


}
