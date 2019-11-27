import {
  Component,
  OnInit
} from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators
} from '@angular/forms';
import {
  ApilinkService
} from '../services/apilink/apilink.service';
import {
  UtilsService
} from '../services/utils/utils.service';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  questionForm: FormGroup;
  listForm: FormGroup;

  public addQuestion = true;
  public icontype = "add";
  public colorS = "success";
  public arrayQuestion;
  public arrayId;
  public ip;

  constructor(private utils: UtilsService, private apilink: ApilinkService, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.questionForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      question: ['', [Validators.required]]
    });

  }
  //Reload cada vez que se acceda a la vista
  //Esta función será la encargada de recargar la lista con las preguntas de los alumnos
  ionViewDidEnter() {
    this.arrayQuestion = [];
    this.apilink.getQuestions().then((res: any) => {
      for (let item of res) {
        this.arrayId.push(item.id);
        this.arrayQuestion.push(item.content);
      }

    }).catch(err => this.utils.presentAlert('Error', JSON.stringify(err), [{
      text: 'Entendido'
    }]));
  }

  //Plug
  info() {
    this.utils.presentAlert('Información General', "Autor: Jose Juan Díaz Vega \n Tecnologías: Ionic 5 & Node.js \n Api Host: Heroku", [{
      text: 'Entendido'
    }])
  }

  //Esta funcion se encarga de creas una instancia nueva de pregunta para el servidor a partir de un formulario
  onSubmit() {
    this.apilink.postQuestion(this.questionForm.value).then((res: any) => {
      console.log(res);
      this.utils.presentAlert('¡Creación Exitosa!', "Se ha añadido tu pregunta a la lista", [{
        text: 'Gracias',
        handler: data => {
          this.addQ();
        }
      }])

    }).catch(err => this.utils.presentAlert('Error', JSON.stringify(err), [{
      text: 'Entendido'
    }]));
  }

  // Esta funcion se encarga de borrar la pregunta seleccionada en la lista
  delete(question, index) {
    let id = this.arrayId[index]
    this.utils.presentAlert('Introduce la contraseña de Amdin', "Introduce la contraseña del profesor", [{
      text: 'Aceptar',
      handler: data => {
        this.apilink.deleteQuestion({
          title: id + "_" + question.name + "_" + question.question,
          pass: data.password
        }).then((res: any) => {
          if (res.error) {
            this.utils.presentAlert('Error', res.error, [{
              text: 'Entendido',
              handler: data => {
                this.ionViewDidEnter();
              }
            }]);
          } else if (res.status) {
            this.utils.presentAlert('¡Borrado Exitoso!', "Se ha borrado la pregunta correctamente", [{
              text: 'Chuspi!'
            }]);
            this.ionViewDidEnter();
          }
        })
      }
    }], "", [{
      name: 'password',
      placeholder: 'Contraseña',
      type: 'password'
    }]);
  }
  // Esta funcion se encarga de alternar entre la lista y el formulario de addicion de pregunta ademas de controlar el fab button
  addQ() {
    this.ionViewDidEnter();
    this.questionForm.reset();
    this.addQuestion = !this.addQuestion;
    if (this.addQuestion) {
      this.icontype = "add";
      this.colorS = "success"
    } else {
      this.icontype = "remove";
      this.colorS = "danger";
    }
  }

}