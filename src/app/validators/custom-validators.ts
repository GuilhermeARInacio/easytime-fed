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