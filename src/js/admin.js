// Global

// import "./modules/bootstrap";
// import "./modules/theme";
// import "./modules/dragula";
import "./modules/feather";
// import "./modules/moment";
import "./modules/sidebar";
// import "./modules/toastr";
import "./modules/user-agent";


// Charts

// import "./modules/chartjs";
// import "./modules/apexcharts";


// Forms

// import "./modules/daterangepicker";
// import "./modules/datetimepicker";
// import "./modules/fullcalendar";
// import "./modules/markdown";
// import "./modules/mask";
// import "./modules/quill";
// import "./modules/select2";
// import "./modules/validation";
// import "./modules/wizard";


// Maps

// import "./modules/vector-maps";


// Tables

// import "./modules/datatables";


// Main

import 'svgxuse';
import autosize from 'autosize';

import 'bootstrap/js/dist/dropdown';
import 'bootstrap/js/dist/collapse';
import 'bootstrap/js/dist/tab';

$(() => {
  // 60fps scrolling using pointer-events: none
  // https://habrahabr.ru/post/204238/

  const { body } = document;
  let timer;

  window.addEventListener('scroll', () => {
    clearTimeout(timer);
    if (!body.classList.contains('disable-hover')) {
      body.classList.add('disable-hover');
    }
    timer = setTimeout(() => {
      body.classList.remove('disable-hover');
    }, 500);
  }, false);


  // autosize textarea

  autosize($('textarea.js-autosize'));

  // First we get the viewport height and we multiple it by 1% to get a value for a vh unit
  let vh = window.innerHeight * 0.01;
  // Then we set the value in the --vh custom property to the root of the document
  document.documentElement.style.setProperty('--vh', `${vh}px`);
});
