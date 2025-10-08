const swiper = new Swiper('.swiper', {
  // Optional parameters
  //direction: 'vertical',
  loop: true,
  speed: 500,
  autoplay: {
    delay: 5000,
    disableOnInteraction: false,
  },
  // If we need pagination
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },

  // Navigation arrows
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },

  // And if we need scrollbar
  scrollbar: {
    el: '.swiper-scrollbar',
  },
  
});

function options(){
  document.getElementById("optionmenue").style.display = "flex";
}
function optionend(){
  document.getElementById("optionmenue").style.display = "none";
}

function showNumber1() {
    const val = document.getElementById("number1").value;
    document.getElementById('output1').textContent = val;
    if(val > 10){
        document.getElementById('output1').style.backgroundColor = "rgba(222, 34, 1, 0.76)";
    }else if(val > 5){
        document.getElementById('output1').style.backgroundColor = "rgba(222, 134, 1, 0.76)";
    }else{
        document.getElementById('output1').style.backgroundColor = "rgba(126, 222, 1, 0.76)";
    }
}
function showNumber2() {
    const val = document.getElementById("number2").value;
    document.getElementById('output2').textContent = val;
    if(val > 10){
        document.getElementById('output2').style.backgroundColor = "rgba(222, 34, 1, 0.76)";
    }else if(val > 5){
        document.getElementById('output2').style.backgroundColor = "rgba(222, 134, 1, 0.76)";
    }else{
        document.getElementById('output2').style.backgroundColor = "rgba(126, 222, 1, 0.76)";
    }
}
