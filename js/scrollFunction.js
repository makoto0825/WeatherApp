//Scroll to the top of the page when a specific day of the week element is clicked
document.addEventListener('DOMContentLoaded', () =>{
    const rows = document.querySelectorAll('#js-dailyForcast-scroll');
  
    rows.forEach(row => {
      row.addEventListener('click', () =>{
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });
    });
  });