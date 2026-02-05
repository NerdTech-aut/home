const cardContainer = document.getElementById("card-container"); //get the card container
const cards = Array.from(cardContainer.querySelectorAll('section')); //get all cards in the card container
const navLinks = document.querySelectorAll('.navigation-link'); //get all navbar navigation buttons by class
const navBarLinks = document.querySelectorAll('.nav-link'); //get all navbar navigation buttons by class
const navbarCollapsable = document.getElementById('navbarNav'); //get the collapsable section of the nav bar which contains the navbar navigation buttons
const bootstrapNavbarCollapse = new bootstrap.Collapse(navbarCollapsable, { toggle: false }); //create a new bootstrap collapse element with the collapsable part of the navbar and set it to collapsed by default - collapsing is small screen only 
let activeIndex = 0; //card index set by default to 0
let isResizing = false;
let resizeStartIndex = activeIndex;
let resizeTimer = null;

function scrollToSection(targetId) {
  cardContainer.scrollTo({
    top: cardContainer.clientHeight * cards.indexOf(document.getElementById(targetId)), //get the top pixel value by multiplying the total card container height (incl. margin, padding and border) with the card index of the selected card
    behavior: 'smooth' //smooth scroll behavior to avoid jumping
  }); 

  if (window.innerWidth < 992 && navbarCollapsable.classList.contains('show')) {
    bootstrapNavbarCollapse.hide(); //hide the mobile nav bar
  }
}

function updateActiveState() {
  if (isResizing) {
    activeIndex = resizeStartIndex; //while resizing is active set the active card index to the card index before the size has started
  } else {
    const scrollPos = cardContainer.scrollTop; //get the pixels scrolled from the top
    const containerHeight = cardContainer.clientHeight; //get the total card container height (incl. margin, padding and border)
    const scrollHeight = cardContainer.scrollHeight; //get to total scrollable height

    activeIndex = Math.floor((scrollPos + (containerHeight * 0.5)) / containerHeight); //calculate active card index by adding the currently scrolled pixels from the top to half of the card container height and dividing the result through card container height  
  }

  cards.forEach((card, i) => {
    if (i === activeIndex) {
      card.classList.add('active'); //when the current card is the active card set the active class - this is to show the content on the card
    } else {
      card.classList.remove('active'); //when the current card is not the active card remove the active class
    }
  });

  navBarLinks.forEach(link => { //go over all the navigation bar links
    link.classList.remove('active'); //set each navigation bar link to inactive
    if(link.getAttribute('href') === cards[activeIndex].id) {
      link.classList.add('active'); //set the navigation bar link active when the href attribute value matches the active card index ID
    }
  });
}

navLinks.forEach(link => { //for each navigation link
  link.addEventListener('click', (e) => { //add click event listener
    e.preventDefault(); //override the default link clicking behavior
    scrollToSection(link.getAttribute('href')); //use the custom scroll to section function to scroll to the section by the id given in the href attribute of the navigation link element
  });
});

cardContainer.addEventListener('scroll', updateActiveState);

window.addEventListener('resize', () => {
  if (!isResizing) {
    isResizing = true; //when resizing isn't active set resizing status to active
    resizeStartIndex = activeIndex; //when resizing isn't active save the current card index

    cardContainer.classList.add("card" + resizeStartIndex + "bg")

    cards.forEach((card, i) => {
      card.classList.add('opacity-0')
    });
  }

  if (resizeTimer) clearTimeout(resizeTimer); //cancel a previously set resize timer

  resizeTimer = setTimeout(() => { //after resizing is done set 
    isResizing = false; //after resizing is done set resizing status to false
    cardContainer.scrollTo({
      top: cardContainer.clientHeight * resizeStartIndex,
      behavior: 'instant' //instant scroll to the desired position
    }); //scroll to the card before the scrolling began

    updateActiveState();

    cardContainer.classList.remove("card" + resizeStartIndex + "bg")

    cards.forEach((card, i) => {
      card.classList.remove('opacity-0')
    });
  }, 150); //resize debounce delay 150ms
});

document.addEventListener('DOMContentLoaded', () => {
    updateActiveState(); //
});