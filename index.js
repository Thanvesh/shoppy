function initializeTabs(categories) {
  const tabsContainer = document.querySelector('.tabs-container');

  categories.forEach(category => {
    const tabItemContainer = document.createElement('li');
    tabItemContainer.classList.add('tab-item-container');

    const tabBtn = document.createElement('button');
    tabBtn.type = 'button';
    tabBtn.classList.add('tab-btn');
    tabBtn.textContent = category.category_name;
    tabBtn.onclick = () => clickTabItem(category, tabItemContainer);

    tabItemContainer.appendChild(tabBtn);
    tabsContainer?.appendChild(tabItemContainer);
    if (category.category_name === "Men") {
      clickTabItem(category, tabItemContainer);
    }
  });
}

function createHTMLElement(tag, className, content) {
  const element = document.createElement(tag);
  if (className) element.classList.add(className);
  if (content) element.innerHTML = content;
  return element;
}

function createProjectCard(project) {
  const projectCard = createHTMLElement('li', 'project-card', `
  ${project.badge_text ? `<div class="ribbon">${project.badge_text}</div>` : ''}
  <div class="carousel-container">
    ${project.second_image !== "empty" ? '<button class="carousel-arrow prev"><i class="fa-solid fa-chevron-left"></i></button>' : ''}
    <div class="carousel-images">
      <img src="${project.image}" alt="${project.title}">
      ${project.second_image !== "empty" ? `<img src="${project.second_image}" alt="${project.title}">` : ''}
    </div>
    ${project.second_image !== "empty" ? '<button class="carousel-arrow next"><i class="fa-solid fa-chevron-right"></i></button>' : ''}
    </div>
    <div class="project-details">
      <div class="product-title-container">
        <h4 class="product-title" title="${project.title}">${project.title}</h4>
        <small class="product-vendor">${project.vendor}</small>
      </div>
      <div class="product-price-container">
        <p class="product-price"><b>Rs ${project.price}</b></p>
        <p class="product-compare-price">${project.compare_at_price}</p>
        <p class="product-percentage">${((project.compare_at_price - project.price) / project.compare_at_price * 100).toFixed(2)}% Off</p>
      </div>
    <button class="add-to-cart-btn">Add to Cart</button>
  </div>`);
  const container = projectCard.querySelector('.carousel-container');
  const images = projectCard.querySelector('.carousel-images');
  const prevArrow = projectCard.querySelector('.carousel-arrow.prev');
  const nextArrow = projectCard.querySelector('.carousel-arrow.next');
  let currentIndex = 0;

  function showPrevImage() {
    currentIndex = Math.max(currentIndex - 1, 0);
    updateCarousel();
  }

  function showNextImage() {
    currentIndex = (currentIndex + 1) % images.children.length;
    updateCarousel();
  }

  function updateCarousel() {
    const translateValue = -currentIndex * 100 + '%';
    images.style.transform = `translateX(${translateValue})`;
  }

  prevArrow?.addEventListener('click', showPrevImage);
  nextArrow?.addEventListener('click', showNextImage);

  // Optionally, you can set up an interval to automatically rotate the carousel
  setInterval(() => showNextImage(), 10000);
  return projectCard;
}

function clickTabItem(category, tabItemContainer) {
  document.querySelector('.tab-item-container.active')?.classList.remove('active');
  tabItemContainer.classList.add('active');
  const projectListContainer = document.getElementById('projectListContainer');
  projectListContainer.innerHTML = ''; // Clear existing projects
  category.category_products.forEach(project => {
    const projectCard = createProjectCard(project);
    projectListContainer.appendChild(projectCard);
  });
}


fetch('https://cdn.shopify.com/s/files/1/0564/3685/0790/files/multiProduct.json')
  .then(response => response.json())
  .then(data => {
    initializeTabs(data.categories);
  })
  .catch(error => {
    console.error('Error fetching categories:', error);
  });
