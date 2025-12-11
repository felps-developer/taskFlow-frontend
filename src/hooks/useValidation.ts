export function useValidation() {
  const required = (val: string | null | undefined): string | true => {
    if (!val || val.trim() === '') {
      return 'Campo obrigatório';
    }
    return true;
  };

  const isValidEmail = (val: string | null | undefined): string | true => {
    if (!val || val.trim() === '') return true;

    const reg =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (!reg.test(val.toLowerCase())) {
      return 'E-mail inválido';
    }

    return true;
  };

  const minLength = (min: number) => (val: string | null | undefined): string | true => {
    if (!val) return true;
    if (val.length < min) {
      return `No mínimo ${min} caracteres`;
    }
    return true;
  };

  const min6 = minLength(6);

  return {
    required,
    isValidEmail,
    minLength,
    min6,
  };
}

