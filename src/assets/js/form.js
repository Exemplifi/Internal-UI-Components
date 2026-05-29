// Contact Form JS

document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    let valid = true;
    const inputs = form.querySelectorAll('.form__input[required]');
    inputs.forEach(input => {
      if (!input.value.trim()) {
        input.classList.add('is-invalid');
        valid = false;
      } else {
        input.classList.remove('is-invalid');
      }
    });
    if (valid) {
      form.reset();
      alert('Thank you for contacting us!');
    }
  });

  form.querySelectorAll('.form__input').forEach(input => {
    input.addEventListener('input', function () {
      if (input.value.trim()) {
        input.classList.remove('is-invalid');
      }
    });
  });
});