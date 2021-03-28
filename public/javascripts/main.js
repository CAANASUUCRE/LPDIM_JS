document.addEventListener('DOMContentLoaded', function() {


})


document.addEventListener("mousemove",e => {
  let bg = document.querySelector('.background')
  const speed = bg.getAttribute('data-speed')

  const x = (window.innerWidth - e.pageX*speed)/30
  const y = (window.innerHeight - e.pageY*speed)/30

  bg.style.transform = `translateX(calc(-50% + ${x}px)) translateY(calc(-50% + ${y}px))`

})
