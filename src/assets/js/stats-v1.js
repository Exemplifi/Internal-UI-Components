document.addEventListener('DOMContentLoaded', () => {
     const counters = document.querySelectorAll('.stats__number');

     counters.forEach((counter) => {
       const number = counter.textContent.replace(/,/g, '').match(/\d+/);

       if (!number) return;

       const target = parseInt(number[0], 10);
       const duration = 2000;
       const startTime = performance.now();

       const updateCounter = (currentTime) => {
         const progress = Math.min((currentTime - startTime) / duration, 1);
         const currentValue = Math.floor(progress * target);

         counter.firstChild.textContent = currentValue.toLocaleString();

         if (progress < 1) {
           requestAnimationFrame(updateCounter);
         }
       };

       requestAnimationFrame(updateCounter);
     });
   });
