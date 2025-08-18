import { FormControl, FormGroup } from '@angular/forms';
import { dataFinalAntesDeInicio, dataFinalRequired, datasDepoisDeDataAtual, horarioForaComercial, horarioSaidaAnteriorEntrada, senhaValidacao, temEspecialValidacao, temLetraValidacao, temNumeroValidacao } from './custom-validators';
import { senhasIguaisValidacao } from './custom-validators';

describe('temLetraValidacao', () => {
  it('deve retornar null se houver letra', () => {
    const control = new FormControl('abc123');
    expect(temLetraValidacao(control)).toBeNull();
  });

  it('deve retornar null se o campo estiver vazio', () => {
    const control = new FormControl('');
    expect(temLetraValidacao(control)).toBeNull();
  });

  it('deve retornar erro se não houver letra', () => {
    const control = new FormControl('123456');
    expect(temLetraValidacao(control)).toEqual({ temLetraValidacao: true });
  });
});

describe('temNumeroValidacao', () => {
  it('deve retornar null se houver número', () => {
    const control = new FormControl('abc1');
    expect(temNumeroValidacao(control)).toBeNull();
  });

  it('deve retornar erro se não houver número', () => {
    const control = new FormControl('abcdef');
    expect(temNumeroValidacao(control)).toEqual({ temNumeroValidacao: true });
  });
});

describe('temEspecialValidacao', () => {
  it('deve retornar null se houver caractere especial', () => {
    const control = new FormControl('abc@123');
    expect(temEspecialValidacao(control)).toBeNull();
  });

  it('deve retornar erro se não houver caractere especial', () => {
    const control = new FormControl('abc123');
    expect(temEspecialValidacao(control)).toEqual({ temEspecialValidacao: true });
  });
});

describe('senhaValidacao', () => {
  it('deve retornar null se senha for forte', () => {
    const control = new FormControl('Abc@123');
    expect(senhaValidacao(control)).toBeNull();
  });

  it('deve retornar erro se faltar letra', () => {
    const control = new FormControl('123@456');
    expect(senhaValidacao(control)).toEqual({ senhaValidacao: true });
  });

  it('deve retornar erro se faltar número', () => {
    const control = new FormControl('Abc@def');
    expect(senhaValidacao(control)).toEqual({ senhaValidacao: true });
  });

  it('deve retornar erro se faltar especial', () => {
    const control = new FormControl('Abc123');
    expect(senhaValidacao(control)).toEqual({ senhaValidacao: true });
  });

  it('deve retornar null se senha for vazia', () => {
    const control = new FormControl('');
    expect(senhaValidacao(control)).toBeNull();
  });
});

describe('senhasIguaisValidacao', () => {
  it('deve retornar null se as senhas forem iguais', () => {
    const group = new FormGroup({
      novaSenha: new FormControl('abc123'),
      repetirSenha: new FormControl('abc123')
    }, [senhasIguaisValidacao('novaSenha', 'repetirSenha')]);
    expect(group.errors).toBeNull();
  });

  it('deve retornar erro se as senhas forem diferentes', () => {
    const group = new FormGroup({
      novaSenha: new FormControl('abc123'),
      repetirSenha: new FormControl('def456')
    }, [senhasIguaisValidacao('novaSenha', 'repetirSenha')]);
    expect(group.errors).toEqual({ senhasIguaisValidacao: true });
  });
});

describe('dataFinalAntesDeInicio', () => {
  it('deve retornar erro se final for antes de início', () => {
    const group = new FormGroup({
      inicio: new FormControl('2023-01-02'),
      final: new FormControl('2023-01-01')
    }, [dataFinalAntesDeInicio('inicio', 'final')]);
    expect(group.errors).toEqual({ dataFinalAntesDeInicio: true });
  });

  it('deve retornar null se final for depois de início', () => {
    const group = new FormGroup({
      inicio: new FormControl('2023-01-01'),
      final: new FormControl('2023-01-02')
    }, [dataFinalAntesDeInicio('inicio', 'final')]);
    expect(group.errors).toBeNull();
  });
});

describe('datasDepoisDeDataAtual', () => {
  it('deve retornar erro se início ou final for depois de hoje', () => {
    const hoje = new Date();
    const amanha = new Date(hoje.getTime() + 24 * 60 * 60 * 1000);
    const group = new FormGroup({
      inicio: new FormControl(amanha.toISOString().substring(0, 10)),
      final: new FormControl(amanha.toISOString().substring(0, 10))
    }, [datasDepoisDeDataAtual('inicio', 'final')]);
    expect(group.errors).toEqual({ datasDepoisDeDataAtual: true });
  });

  it('deve retornar null se datas forem hoje ou antes', () => {
    const hoje = new Date();
    const ontem = new Date(hoje.getTime() - 24 * 60 * 60 * 1000);
    const group = new FormGroup({
      inicio: new FormControl(ontem.toISOString().substring(0, 10)),
      final: new FormControl(hoje.toISOString().substring(0, 10))
    }, [datasDepoisDeDataAtual('inicio', 'final')]);
    expect(group.errors).toBeNull();
  });

  it('deve retornar null se umas das datas estiver em branco', () => {
    const group = new FormGroup({
      inicio: new FormControl(''),
      final: new FormControl('22/06/2025')
    }, [datasDepoisDeDataAtual('inicio', 'final')]);
    expect(group.errors).toBeNull();
  });
});

describe('horarioSaidaAnteriorEntrada', () => {
  it('deve retornar erro se saída1 for antes ou igual à entrada1', () => {
    const group = new FormGroup({
      entrada1: new FormControl('10:00'),
      saida1: new FormControl('09:00'),
      entrada2: new FormControl(''),
      saida2: new FormControl(''),
      entrada3: new FormControl(''),
      saida3: new FormControl('')
    }, [horarioSaidaAnteriorEntrada()]);
    expect(group.errors).toEqual({ horarioSaidaAnteriorEntrada: true });
  });

  it('deve retornar erro se saída2 for antes ou igual à entrada2', () => {
    const group = new FormGroup({
      entrada1: new FormControl('08:00'),
      saida1: new FormControl('12:00'),
      entrada2: new FormControl('14:00'),
      saida2: new FormControl('13:00'),
      entrada3: new FormControl(''),
      saida3: new FormControl('')
    }, [horarioSaidaAnteriorEntrada()]);
    expect(group.errors).toEqual({ horarioSaidaAnteriorEntrada: true });
  });

  it('deve retornar erro se saída3 for antes ou igual à entrada3', () => {
    const group = new FormGroup({
      entrada1: new FormControl('08:00'),
      saida1: new FormControl('12:00'),
      entrada2: new FormControl('13:00'),
      saida2: new FormControl('14:00'),
      entrada3: new FormControl('15:00'),
      saida3: new FormControl('15:00')
    }, [horarioSaidaAnteriorEntrada()]);
    expect(group.errors).toEqual({ horarioSaidaAnteriorEntrada: true });
  });

  it('deve retornar null se todos horários estiverem corretos', () => {
    const group = new FormGroup({
      entrada1: new FormControl('08:00'),
      saida1: new FormControl('12:00'),
      entrada2: new FormControl('13:00'),
      saida2: new FormControl('14:00'),
      entrada3: new FormControl('15:00'),
      saida3: new FormControl('16:00')
    }, [horarioSaidaAnteriorEntrada()]);
    expect(group.errors).toBeNull();
  });
});

describe('horarioForaComercial', () => {
  it('deve retornar erro se horário for antes de 06:00', () => {
    const control = new FormControl('05:59');
    expect(horarioForaComercial(control)).toEqual({ horarioForaComercial: true });
  });

  it('deve retornar erro se horário for depois de 23:00', () => {
    const control = new FormControl('23:01');
    expect(horarioForaComercial(control)).toEqual({ horarioForaComercial: true });
  });

  it('deve retornar null se horário estiver entre 06:00 e 23:00', () => {
    const control = new FormControl('08:00');
    expect(horarioForaComercial(control)).toBeNull();
  });

  it('deve retornar null se campo estiver vazio', () => {
    const control = new FormControl('');
    expect(horarioForaComercial(control)).toBeNull();
  });
});

describe('dataFinalRequired', () => {
  it('deve retornar erro se final estiver vazio e início preenchido', () => {
    const group = new FormGroup({
      inicio: new FormControl('2023-01-01'),
      final: new FormControl('')
    }, [dataFinalRequired('inicio', 'final')]);
    expect(group.errors).toEqual({ dataFinalRequired: true });
  });

  it('deve retornar null se final e início estiverem preenchidos', () => {
    const group = new FormGroup({
      inicio: new FormControl('2023-01-01'),
      final: new FormControl('2023-01-02')
    }, [dataFinalRequired('inicio', 'final')]);
    expect(group.errors).toBeNull();
  });

  it('deve retornar null se início estiver vazio', () => {
    const group = new FormGroup({
      inicio: new FormControl(''),
      final: new FormControl('')
    }, [dataFinalRequired('inicio', 'final')]);
    expect(group.errors).toBeNull();
  });

  it('deve retornar null se ambos estiverem preenchidos', () => {
    const group = new FormGroup({
      inicio: new FormControl('2023-01-01'),
      final: new FormControl('2023-01-01')
    }, [dataFinalRequired('inicio', 'final')]);
    expect(group.errors).toBeNull();
  });
});

