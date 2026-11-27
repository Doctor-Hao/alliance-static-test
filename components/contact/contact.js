(() => {
  const form = document.querySelector('#preview-form');
  const phone = form.querySelector('#contact-phone');
  const attachment = form.querySelector('#contact-file');
  const fileNote = form.querySelector('#contact-file-note');
  const status = form.querySelector('#contact-status');
  const defaultFileNote = fileNote.textContent;
  const maxFileSize = 20 * 1024 * 1024;

  function phoneDigits(value) {
    const digits = value.replace(/\D/g, '');
    if (digits.length === 10) return digits;
    return /^[78]\d{10}$/.test(digits) ? digits.slice(1) : '';
  }

  phone.addEventListener('input', () => phone.setCustomValidity(''));
  phone.addEventListener('blur', () => {
    const digits = phoneDigits(phone.value);
    if (digits) phone.value = `+7 (${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 8)}-${digits.slice(8)}`;
  });

  attachment.addEventListener('change', () => {
    const file = attachment.files[0];
    attachment.setCustomValidity('');
    fileNote.textContent = defaultFileNote;
    if (!file) return;
    const acceptedExtension = /\.(pdf|jpe?g|xlsx)$/i.test(file.name);
    if (!acceptedExtension || file.size > maxFileSize) {
      attachment.setCustomValidity('Выберите PDF, JPG или XLSX размером до 20 МБ.');
      attachment.reportValidity();
      return;
    }
    fileNote.textContent = file.name;
  });

  form.addEventListener('invalid', () => {
    status.dataset.state = 'error';
    status.textContent = 'Проверьте отмеченное поле.';
  }, true);

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!phoneDigits(phone.value)) {
      phone.setCustomValidity('Введите 10 цифр номера или 11 цифр с первой 7 либо 8.');
      phone.reportValidity();
      return;
    }
    status.dataset.state = 'success';
    status.textContent = 'Поля заполнены. Это демонстрация, данные остались в браузере.';
  });
})();
