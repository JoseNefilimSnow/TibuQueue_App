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

  private addQuestion = true;
  private icontype = "add";
  private colorS = "success";
  private arrayQuestion;
  private ip;

  constructor(private utils: UtilsService, private apilink: ApilinkService, private formBuilder: FormBuilder) {}

  //Al iniciar la app se nos muestra para inicializar la variable ip de la app que sera la que se comunicará con el servidor
  ngOnInit() {
    this.utils.presentAlert('Introduce la ip de esta sesión', "Introduce la ip del dia de hoy en clase", [{
      text: 'Aceptar',
      handler: data => {
        console.log(data.ip);
        if (data.ip === "" || data.ip === null) {
          this.utils.presentAlert('Error', "No puedes dejar el campo vacio", [{
            text: 'Entendido',
            handler: data => {
              this.ngOnInit();
            }
          }])
        } else {
          this.ip = data.ip;
          this.loadList();
        }
      }
    }], "", [{
      name: 'ip',
      placeholder: 'Dirección IP'
    }], false);


    this.questionForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      question: ['', [Validators.required]]
    });

  }
  //Esta función será la encargada de recargar la lista con las preguntas de los alumnos
  loadList() {
    this.apilink.getQuestions(this.ip).then((res: any) => {
      console.log(res);
      this.arrayQuestion = res;

    }).catch(err => this.utils.presentAlert('Error', JSON.stringify(err), [{
      text: 'Entendido'
    }]));
  }
  //Esta funcion se encarga de creas una instancia nueva de pregunta para el servidor a partir de un formulario
  onSubmit() {
    this.apilink.postQuestion(this.questionForm.value, this.ip).then((res: any) => {
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
  delete(question) {
    this.utils.presentAlert('Introduce la contraseña de Amdin', "Introduce la contraseña del profesor", [{
      text: 'Aceptar',
      handler: data => {
        this.apilink.deleteQuestion({
          title: question.name + "_" + question.question,
          pass: data.password
        }, this.ip).then((res: any) => {
          if (res.error) {
            this.utils.presentAlert('Error', res.error, [{
              text: 'Entendido',
              handler: data => {
                this.loadList();
              }
            }]);
          } else if (res.status) {
            this.utils.presentAlert('¡Borrado Exitoso!', "Se ha borrado la pregunta correctamente", [{
              text: 'Chuspi!'
            }]);
            this.loadList();
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
    this.apilink.getQuestions(this.ip).then((res: any) => {
      console.log(res);
      this.arrayQuestion = res;

    }).catch(err => this.utils.presentAlert('Error', JSON.stringify(err), [{
      text: 'Entendido'
    }]));
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