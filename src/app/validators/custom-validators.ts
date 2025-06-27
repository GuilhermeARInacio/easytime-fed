import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function temLetraValidacao(control: AbstractControl): ValidationErrors | null {
  const senha = control.value;
  const temLetra = /[A-Za-z]/.test(senha);

  if (temLetra) {
    return null;
  }
  return { temLetraValidacao: true };
}

export function temNumeroValidacao(control: AbstractControl): ValidationErrors | null {
  const senha = control.value;
  const temNumero = /\d/.test(senha);

  if (temNumero) {
    return null;
  }
  return { temNumeroValidacao: true };
}

export function temEspecialValidacao(control: AbstractControl): ValidationErrors | null {
  const senha = control.value;
  const temEspecial = /[^A-Za-z0-9]/.test(senha);

  if (temEspecial) {
    return null;
  }
  return { temEspecialValidacao: true };
}

export function senhasIguaisValidacao(senhaNova: string, senhaRepetida: string): ValidatorFn {
  return (formulario: AbstractControl): ValidationErrors | null => {
    senhaNova = formulario.get('novaSenha')?.value;
    senhaRepetida = formulario.get('repetirSenha')?.value;

    if( !senhaNova || !senhaRepetida) {
      return { senhasIguaisValidacao: true };
    }

    if (senhaNova == senhaRepetida) {
      return null;
    } else {
      return { senhasIguaisValidacao: true };
    }
  };
}

export function senhaValidacao(control: AbstractControl): ValidationErrors | null {
  const senha = control.value;
  if (!senha) {
    return null; // Se não houver valor, não há erro
  }

  const temLetra = /[A-Za-z]/.test(senha);
  const temNumero = /\d/.test(senha);
  const temEspecial = /[^A-Za-z0-9]/.test(senha);

  if (temLetra && temNumero && temEspecial) {
    return null;
  }
  return { senhaValidacao: true };
}

export function dataFinalAntesDeInicio(inicio: string, final: string): ValidatorFn {
  return (formulario: AbstractControl): ValidationErrors | null => {
    const dtFinal = new Date(formulario.get('final')?.value);
    const dtInicio = new Date(formulario.get('inicio')?.value);

    if (!dtFinal || !dtInicio || isNaN(dtFinal.getTime()) || isNaN(dtInicio.getTime())) {
      return null;
    }

    if (dtFinal < dtInicio) {
      return { dataFinalAntesDeInicio: true };
    }

    return null;
  };
}

export function datasDepoisDeDataAtual(inicio: string, final: string): ValidatorFn {
  return (formulario: AbstractControl): ValidationErrors | null => {
    const dtFinal = new Date(formulario.get('final')?.value);
    const dtInicio = new Date(formulario.get('inicio')?.value);

    if (!dtFinal || !dtInicio) {
      return null;
    }

    const dataAtual = new Date();
    if (dtInicio > dataAtual || dtFinal > dataAtual) {
      return { datasDepoisDeDataAtual: true };
    }

    return null;
  };
}

export function horarioSaidaAnteriorEntrada(){
  return (formulario: AbstractControl): ValidationErrors | null => {
    const entrada1 = formulario.get('entrada1')?.value;
    const saida1 = formulario.get('saida1')?.value;
    const entrada2 = formulario.get('entrada2')?.value;
    const saida2 = formulario.get('saida2')?.value;
    const entrada3 = formulario.get('entrada3')?.value;
    const saida3 = formulario.get('saida3')?.value;

    if (entrada1 && saida1 && entrada1 >= saida1) {
      return { horarioSaidaAnteriorEntrada: true };
    }

    if (entrada2 && saida2 && entrada2 >= saida2) {
      return { horarioSaidaAnteriorEntrada: true };
    }

    if (entrada3 && saida3 && entrada3 >= saida3) {
      return { horarioSaidaAnteriorEntrada: true };
    }

    return null;
  };
}

export function horarioForaComercial(control: AbstractControl): ValidationErrors | null {
    const campo = control.value;
    if (!campo) {
      return null;
    }
    if (campo < '06:00' || campo > '23:00') {
      return { horarioForaComercial: true };
    }

    return null;
}